import { Observable, Subject } from 'rxjs';
import { Worship } from '../models/worship';
import { Injectable } from '@angular/core';

export class SharedState<T> {

  private _snapshot : T;
  private state : Subject<T>;
  private state$ : Observable<T>;

  constructor() {
    this.state = new Subject<T>();
    this.state$ = this.state.asObservable();
  }

  getObservable() {
    return this.state$;
  }

  get snapshot() {
    return this._snapshot;
  }

  update(newValue : T) {
    this._snapshot = newValue;
    this.state.next(this._snapshot);
  }
}

@Injectable()
export class SharedStateService {

  activeWorship : SharedState<Worship> = new SharedState<Worship>();

  constructor() {}
}
