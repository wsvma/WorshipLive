import { Worship } from '../models/worship';
import { WorshipsService } from './worships.service';

export function worshipsServiceFactory() {
    let service = new WorshipsService();
    service.serviceName = 'api/worships';
    service.tConstructor = Worship;
    return service;
}

export let WorshipsServiceProvider = {
    provide: WorshipsService,
    useFactory: worshipsServiceFactory
}