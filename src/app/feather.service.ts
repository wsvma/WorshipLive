import { Inject, Injectable } from '@angular/core';
import { DbObj, DbObjBase } from '../models/dbobj';
import { toMyDateFormat } from '../utils/utils';
import { Observable, Observer } from 'rxjs';
import * as io from 'socket.io-client';
import feathers from 'feathers-client';
import { AngularFirestore, QuerySnapshot, AngularFirestoreCollection } from '@angular/fire/firestore'

export abstract class FeatherService<T> {

  constructor() {
  }

  public abstract find() : Observable<T[]>;
  public abstract get(id: string);
  public abstract async create(obj: T);
  public abstract async update(obj: T);
  public abstract async remove(objects: T[]);
  public abstract async removeWithId(ids: string[]);
  public abstract lookup(id: string);
}

export class GenericService<T extends DbObj, TBase extends DbObjBase> extends FeatherService<T> {

    private find$: Observable<T[]>;
    private findObservers: Observer<T[]>[] = [];
    private getObservers: { [id:string]: Observer<T>[] } = {};

    public tConstructor: new(tb:TBase, service) => T;
    private collectionRef: AngularFirestoreCollection<any>;
    private dataStore: {
      objMap : { [id:string] : T },
      objArray: T[];
    }

    constructor(private firestore : AngularFirestore) {

      super();

      this.dataStore = {
        objMap: {},
        objArray: []
      };
    }

    set serviceName(name) {
      this.collectionRef = this.firestore.collection(name);
      this.collectionRef.get().subscribe(this.onSnapshot);
    }

    private onSnapshot(querySnapshot : QuerySnapshot<TBase>) {
      if (querySnapshot.empty)
        return;
      querySnapshot.docChanges().forEach(change => {
        let objDb = change.doc.data();
        let id = change.doc.id;
        if (change.type === 'added' || change.type === 'modified') {
          let objBase : TBase;
          let objT    : T;
          Object.assign(objBase, objDb);
          objBase.id = id;
          objT = new this.tConstructor(objBase, this);

          if (change.type === 'added') {
            this.dataStore.objArray.push(objT);
            this.dataStore.objMap[id] = objT;
          } else {
            this.dataStore.objArray[this.getIndex(id)] = objT;
            this.dataStore.objMap[id] = objT;
            this.updateGetObservers(id);
          }
        } else if (change.type === 'removed') {
          this.dataStore.objMap[id].removed = true;
          this.updateGetObservers(id);
        }
        this.updateFindObservers();
      })
    }

    public find() : Observable<T[]> {

      if (!this.find$) {
        this.find$ = new Observable<T[]>(observer => {
          this.findObservers.push(observer);
          observer.next(this.dataStore.objArray);
        });
      }
      return this.find$;
    }

    public get(id: string) : Observable<T> {

      let observable = new Observable<T>(observer => {
        this.getObservers[id].push(observer);
        if (id in this.dataStore.objMap) {
          observer.next(this.dataStore.objMap[id]);
        }
      });
      return observable;
    }

    public async create(obj: T) {
      delete obj['id'];
      obj['date_created'] = obj['last_modified'] = toMyDateFormat(new Date());
      await this.collectionRef.add(obj.toBaseFormat);
      return obj;
    }

    public async update(obj: T) {
      obj['last_modified'] = toMyDateFormat(new Date());
      const objBase = obj.toBaseFormat;
      await this.collectionRef.doc(objBase.id).set(objBase);
      return obj;
    }

    public async remove(objects: T[]) {
      await Promise.all(objects.map(obj => this.collectionRef.doc(obj.toBaseFormat.id).delete()));
      return;
    }

    public async removeWithId(ids: string[]) {
      await Promise.all(ids.map(id => this.collectionRef.doc(id).delete()));
      return;
    }

    public lookup(id: string) {
      let index = this.getIndex(id);
      if (index == -1)
        return null;
      return this.dataStore.objArray[index];
    }

    private getIndex(id: string): number {
      for (let i = 0; i < this.dataStore.objArray.length; i++) {
        if (this.dataStore.objArray[i]['id'] === id) {
          return i;
        }
      }
      return -1;
    }

    private updateFindObservers() {
      for (let observer of this.findObservers)
        observer.next(this.dataStore.objArray);
    }

    private updateGetObservers(id: string) {
      for (let observer of this.getObservers[id])
        observer.next(this.dataStore.objMap[id]);
    }

    private onCreated(obj: TBase) {
      this.dataStore.objArray.push(new this.tConstructor(obj, this));
      this.updateFindObservers();
    }

    private onUpdated(obj: TBase) {

      const index = this.getIndex(obj.id);
      this.dataStore.objArray[index] = new this.tConstructor(obj, this);
      this.updateFindObservers();

      if (obj.id in this.dataStore.objMap) {
        this.dataStore.objMap[obj.id] = new this.tConstructor(obj, this);
        this.updateGetObservers(obj.id);
      }
    }

    private onRemoved(obj: TBase) {

      const index = this.getIndex(obj.id);
      this.dataStore.objArray.splice(index, 1);
      this.updateFindObservers();

      if (obj.id in this.dataStore.objMap) {
        this.dataStore.objMap[obj.id].removed = true;
        this.updateGetObservers(obj.id);
      }
    }
  }