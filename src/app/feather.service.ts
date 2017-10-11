import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import feathers from 'feathers-client';

@Injectable()
export class FeatherService {

  private _url = 'http://localhost:3030';
  private feathersApp : any;

  constructor() { 
    this.feathersApp = feathers().configure(feathers.socketio(io(this._url)));
  }

  getService(name: string) {
    return this.feathersApp.service(name);
  }
}
