import { LiveSessionService } from './live-session.service';
import { LiveSession, LiveSessionInDb } from '../models/live-session';
import { AngularFirestore } from '@angular/fire/firestore'

export function liveSessionsServiceFactory(firestore : AngularFirestore) {
    let service = new LiveSessionService(firestore);
    service.serviceName = 'live';
    service.tFactory = (objInDb, service) => new LiveSession(objInDb, service);
    return service;
}

export let LiveSessionServiceProvider = {
    provide: LiveSessionService,
    useFactory: liveSessionsServiceFactory,
    deps: [ AngularFirestore ]
}