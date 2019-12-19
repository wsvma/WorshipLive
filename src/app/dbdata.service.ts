import { Inject, Injectable } from '@angular/core';
import { DbObj, DbObjBase } from '../models/dbobj';
import { toMyDateFormat } from '../utils/utils';
import { Observable, Observer } from 'rxjs';
import { AngularFirestore, QuerySnapshot, AngularFirestoreCollection } from '@angular/fire/firestore'
import { toBase64String } from '@angular/compiler/src/output/source_map';

export abstract class DbDataService<T> {

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

export class GenericService<T extends DbObj, TBase extends DbObjBase> extends DbDataService<T> {

    private find$: Observable<T[]>;
    private findObservers: Observer<T[]>[] = [];
    private getObservers: { [id:string]: Observer<T>[] } = {};

    public tFactory: (objBase, service) => T;
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
      this.collectionRef.stateChanges().forEach(changes => {
        changes.forEach(change => {
          let objDb = change.payload.doc.data();
          let id = change.payload.doc.id;
          if (change.type === 'added' || change.type === 'modified') {
            let objT : T = this.tFactory(objDb, this);
            objT['id'] = id;
            if (change.type === 'added') {
              this.dataStore.objArray.push(objT);
            } else {
              this.dataStore.objArray[this.getIndex(id)] = objT;
            }
            this.dataStore.objMap[id] = objT;
          } else if (change.type === 'removed') {
            this.dataStore.objMap[id].removed = true;
            const index = this.getIndex(id);
            if (-1 != index) {
              this.dataStore.objArray.splice(index, 1);
            }
          }
          this.updateGetObservers(id);
        });
        this.updateFindObservers();
      });
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
        if (id in this.getObservers) {
          this.getObservers[id].push(observer);
        } else {
          this.getObservers[id] = [observer];
        }
        if (id in this.dataStore.objMap) {
          observer.next(this.dataStore.objMap[id]);
        }
      });
      return observable;
    }

    public async create(obj: T) {
      const id = this.firestore.createId();
      obj['id'] = id;
      obj['date_created'] = obj['last_modified'] = toMyDateFormat(new Date());
      const objBase = obj.toBaseFormat;
      await this.collectionRef.doc(id).set(JSON.parse(JSON.stringify(objBase, objBase.replacer)));
      return obj;
    }

    public async update(obj: T) {
      obj['last_modified'] = toMyDateFormat(new Date());
      const objBase = obj.toBaseFormat;
      await this.collectionRef.doc(objBase.id).set(JSON.parse(JSON.stringify(objBase, objBase.replacer)));
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
      if (id in this.getObservers) {
        for (let observer of this.getObservers[id])
          observer.next(this.dataStore.objMap[id]);
      }
    }
  }