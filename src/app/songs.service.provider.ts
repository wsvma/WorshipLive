import { Song, SongInDb } from '../models/song';
import { SongsService } from './songs.service';
import { AngularFirestore } from '@angular/fire/firestore'

export function songsServiceFactory(firestore : AngularFirestore) {
    let service = new SongsService(firestore);
    service.tFactory = (objInDb, service) => new Song(objInDb, service);
    service.serviceName = 'songs';
    return service;
}

export let SongsServiceProvider = {
    provide: SongsService,
    useFactory: songsServiceFactory,
    deps: [ AngularFirestore ]
}