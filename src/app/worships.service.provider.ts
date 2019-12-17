import { Worship } from '../models/worship';
import { WorshipsService } from './worships.service';
import { AngularFirestore } from '@angular/fire/firestore'

export function worshipsServiceFactory(firestore : AngularFirestore) {
    let service = new WorshipsService(firestore);
    service.serviceName = 'worships';
    service.tConstructor = Worship;
    return service;
}

export let WorshipsServiceProvider = {
    provide: WorshipsService,
    useFactory: worshipsServiceFactory,
    deps: [ AngularFirestore ]
}