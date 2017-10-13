import { Observable, Observer } from 'rxjs/Rx';
import { FeatherService } from './feather.service';
import { Injectable } from '@angular/core';
import { Song } from '../models/song'

@Injectable()
export class SongsService {

  public songs$: Observable<Song[]>;
  private songObserver: Observer<Song[]>;
  private service: any;
  private dataStore: {
    songs: Song[];
  }

  constructor(base : FeatherService) {
    this.service = base.getService('songs');

    this.service.on('created', (song) => this.onCreated(song));
    this.service.on('updated', (song) => this.onUpdated(song));
    this.service.on('removed', (song) => this.onRemoved(song));

    this.songs$ = new Observable(observer => this.songObserver = observer);

    this.dataStore = { songs: [] };
  }

  public find(query) {
    this.service.find(query, (err, songs: Song[]) => {
      if (err) return console.error(err);

      this.dataStore.songs = songs;
      this.songObserver.next(this.dataStore.songs);
    });
  }

  private getIndex(id: string): number {
    for (let i = 0; i < this.dataStore.songs.length; i++) {
      if (this.dataStore.songs[i]._id === id) {
        return i;
      }
    }
    return -1;
  }

  public update(song: Song) {
    this.service.update(song._id, song);
  }

  private onCreated(song: Song) {
    this.dataStore.songs.push(song);
  }

  private onUpdated(song: Song) {
    const index = this.getIndex(song._id);
    console.log('song', index, 'updated');
    this.dataStore.songs[index] = song;
    this.songObserver.next(this.dataStore.songs);
  }

  private onRemoved(song: Song) {
    const index = this.getIndex(song._id);
    this.dataStore.songs.splice(index, 1);
    this.songObserver.next(this.dataStore.songs);
  }
}
