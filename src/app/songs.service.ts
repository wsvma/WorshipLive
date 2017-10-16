import { Observable, Observer } from 'rxjs/Rx';
import { FeatherService } from './feather.service';
import { Injectable } from '@angular/core';
import { Song, SongInDb } from '../models/song'

@Injectable()
export class SongsService {

  public songs$: Observable<Song[]>;
  private songsObserver: Observer<Song[]>;

  public song$: Observable<Song>;
  private songObserver: Observer<Song>;

  private service: any;
  private dataStore: {
    songs: Song[];
  }

  constructor(base : FeatherService) {
    this.service = base.getService('songs');

    this.service.on('created', (song) => this.onCreated(song));
    this.service.on('updated', (song) => this.onUpdated(song));
    this.service.on('removed', (song) => this.onRemoved(song));

    this.songs$ = new Observable(observer => this.songsObserver = observer);
    this.song$  = new Observable(observer => this.songObserver = observer);

    this.dataStore = { songs: [] };
  }

  public find(query) {
    this.service.find(query, (err, songs: SongInDb[]) => {
      if (err) return console.error(err);

      this.dataStore.songs = [];
      for (let s of songs) {
        let newSong: Song = new Song(s);
        this.dataStore.songs.push(newSong);
      }
      this.songsObserver.next(this.dataStore.songs);
    });
  }

  public get(id: string) {
    this.service.get(id, (err, song: SongInDb) => {
      if (err) return console.error(err);

      this.songObserver.next(new Song(song));
    });
  }

  public update(song: Song) {
    this.service.update(song._id, song.songInDbFormat);
  }

  public remove(songs: Song[]) {
    for (let song of songs)
      this.service.remove(song._id);
  }

  private getIndex(id: string): number {
    for (let i = 0; i < this.dataStore.songs.length; i++) {
      if (this.dataStore.songs[i]._id === id) {
        return i;
      }
    }
    return -1;
  }

  private onCreated(song: SongInDb) {
    this.dataStore.songs.push(new Song(song));
    this.songsObserver.next(this.dataStore.songs);
  }

  private onUpdated(song: SongInDb) {
    const index = this.getIndex(song._id);
    this.dataStore.songs[index] = new Song(song);
    this.songsObserver.next(this.dataStore.songs);
    this.songObserver.next(new Song(song));
  }

  private onRemoved(song: Song) {
    const index = this.getIndex(song._id);
    this.dataStore.songs.splice(index, 1);
    this.songsObserver.next(this.dataStore.songs);
  }
}
