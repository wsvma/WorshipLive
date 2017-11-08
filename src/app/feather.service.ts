import { DbObj, DbObjBase } from '../models/dbobj';
import { toMyDateFormat } from '../utils/utils';
import { Observable, Observer } from 'rxjs/Rx';
import * as io from 'socket.io-client';
import feathers from 'feathers-client';

export abstract class FeatherService<T> {

  private _url = 'http://localhost:3030';
  private feathersApp : any;

  constructor() {
    this.feathersApp = feathers().configure(feathers.socketio(io()));
  }

  getService(name: string) {
    return this.feathersApp.service(name);
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

    private service: any;
    private dataStore: {
      objMap : { [id:string] : T },
      objArray: T[];
    }

    constructor(private tConstructor: new(tb:TBase, service) => T, serviceName: string) {

      super();

      this.service = this.getService(serviceName);

      this.service.on('created', (obj) => this.onCreated(obj));
      this.service.on('updated', (obj) => this.onUpdated(obj));
      this.service.on('removed', (obj) => this.onRemoved(obj));

      this.dataStore = {
        objMap: {},
        objArray: []
      };
    }

    public find() : Observable<T[]> {

      if (!this.find$) {
        this.find$ = new Observable(observer => {
          this.findObservers.push(observer);
          this.service.find((err, objects: TBase[]) => {
            if (err) {
              observer.error(err);
            }
            this.dataStore.objArray = [];
            for (let o of objects) {
              let newObj: T = new this.tConstructor(o, this);
              this.dataStore.objArray.push(newObj);
            }
            observer.next(this.dataStore.objArray);
          });
        });
      }
      return this.find$;
    }

    public get(id: string) {

      let observable = new Observable(observer => {
        if (id in this.dataStore.objMap) {
          this.getObservers[id].push(observer);
          observer.next(this.dataStore.objMap[id]);
        } else {
          this.getObservers[id] = [observer];
          this.service.get(id, (err, obj: TBase) => {
            if (err) {
              observer.error(err);
              return;
            }
            this.dataStore.objMap[id] = new this.tConstructor(obj, this);
            observer.next(this.dataStore.objMap[id]);
          });
        }
      });
      return observable;
    }

    public async create(obj: T) {
      delete obj['_id'];
      obj['date_created'] = obj['last_modified'] = toMyDateFormat(new Date());
      return await this.service.create(obj.toBaseFormat);
    }

    public async update(obj: T) {
      obj['last_modified'] = toMyDateFormat(new Date());
      return await this.service.update(obj['_id'], obj.toBaseFormat);
    }

    public async remove(objects: T[]) {
      return await Promise.all(objects.map(obj => this.service.remove(obj['_id'])));
    }

    public async removeWithId(ids: string[]) {
      return await Promise.all(ids.map(id => this.service.remove(id)));
    }

    public lookup(id: string) {
      let index = this.getIndex(id);
      if (index == -1)
        return null;
      return this.dataStore.objArray[index];
    }

    private getIndex(id: string): number {
      for (let i = 0; i < this.dataStore.objArray.length; i++) {
        if (this.dataStore.objArray[i]['_id'] === id) {
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

      const index = this.getIndex(obj._id);
      this.dataStore.objArray[index] = new this.tConstructor(obj, this);
      this.updateFindObservers();

      if (obj._id in this.dataStore.objMap) {
        this.dataStore.objMap[obj._id] = new this.tConstructor(obj, this);
        this.updateGetObservers(obj._id);
      }
    }

    private onRemoved(obj: TBase) {

      const index = this.getIndex(obj._id);
      this.dataStore.objArray.splice(index, 1);
      this.updateFindObservers();

      if (obj._id in this.dataStore.objMap) {
        this.dataStore.objMap[obj._id].removed = true;
        this.updateGetObservers(obj._id);
      }
    }
  }