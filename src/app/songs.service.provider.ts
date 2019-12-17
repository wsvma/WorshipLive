import { Song } from '../models/song';
import { SongsService } from './songs.service';
import { AngularFirestore } from '@angular/fire/firestore'

export function songsServiceFactory(firestore : AngularFirestore) {
    let service = new SongsService(firestore);
    service.serviceName = 'songs';
    service.tConstructor = Song;
    return service;
}

export let SongsServiceProvider = {
    provide: SongsService,
    useFactory: songsServiceFactory,
    deps: [ AngularFirestore ]
}