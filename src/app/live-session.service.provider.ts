import { LiveSessionService } from './live-session.service';
import { LiveSession } from '../models/live-session';
import { AngularFirestore } from '@angular/fire/firestore'

export function liveSessionsServiceFactory(firestore : AngularFirestore) {
    let service = new LiveSessionService(firestore);
    service.serviceName = 'live';
    service.tConstructor = LiveSession;
    return service;
}

export let LiveSessionServiceProvider = {
    provide: LiveSessionService,
    useFactory: liveSessionsServiceFactory,
    deps: [ AngularFirestore ]
}