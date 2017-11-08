import { Song } from '../models/song';
import { SongsService } from './songs.service';

export let songsServiceFactory = () => {
    return new SongsService(Song, 'api/songs');
}

export let SongsServiceProvider = {
    provide: SongsService,
    useFactory: songsServiceFactory
}