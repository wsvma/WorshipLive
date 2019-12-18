import { Worship, WorshipInDb } from '../models/worship';
import { WorshipsService } from './worships.service';
import { AngularFirestore } from '@angular/fire/firestore'

export function worshipsServiceFactory(firestore : AngularFirestore) {
    let service = new WorshipsService(firestore);
    service.serviceName = 'worships';
    service.tFactory = (service) => new Worship(new WorshipInDb(), service);
    return service;
}

export let WorshipsServiceProvider = {
    provide: WorshipsService,
    useFactory: worshipsServiceFactory,
    deps: [ AngularFirestore ]
}