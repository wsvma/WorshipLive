import { Worship } from '../models/worship';
import { WorshipsService } from './worships.service';

export let worshipsServiceFactory = () => {
    return new WorshipsService(Worship, 'api/worships');
}

export let WorshipsServiceProvider = {
    provide: WorshipsService,
    useFactory: worshipsServiceFactory
}