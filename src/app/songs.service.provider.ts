import { Song } from '../models/song';
import { SongsService } from './songs.service';

export let songsServiceFactory = () => {
    let service = new SongsService();
    service.serviceName = 'api/songs';
    service.tConstructor = Song;
    return service;
}

export let SongsServiceProvider = {
    provide: SongsService,
    useFactory: songsServiceFactory
}