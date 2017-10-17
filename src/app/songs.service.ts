import { Observable, Observer } from 'rxjs/Rx';
import { FeatherService } from './feather.service';
import { Injectable } from '@angular/core';
import { Song, SongInDb } from '../models/song'

@Injectable()
export class SongsService {

  private find$: Observable<Song[]>;
  private findObservers: Observer<Song[]>[] = [];
  private getObservers: { [id:string]: Observer<Song>[] } = {};

  private service: any;
  private dataStore: {
    song : { [id:string] : Song },
    songs: Song[];
  }

  constructor(base : FeatherService) {
    this.service = base.getService('songs');

    this.service.on('created', (song) => this.onCreated(song));
    this.service.on('updated', (song) => this.onUpdated(song));
    this.service.on('removed', (song) => this.onRemoved(song));

    this.dataStore = {
      song: {},
      songs: []
    };
  }

  public find() : Observable<Song[]> {

    if (!this.find$) {
      this.find$ = new Observable(observer => {
        this.findObservers.push(observer);
        this.service.find((err, songs: SongInDb[]) => {
          if (err) {
            observer.error(err);
          }
          this.dataStore.songs = [];
          for (let s of songs) {
            let newSong: Song = new Song(s);
            this.dataStore.songs.push(newSong);
          }
          observer.next(this.dataStore.songs);
        });
      });
    }
    return this.find$;
  }

  public get(id: string) {

    let observable = new Observable(observer => {
      if (id in this.dataStore.song) {
        this.getObservers[id].push(observer);
        observer.next(this.dataStore.song[id]);
      } else {
        this.getObservers[id] = [observer];
        this.service.get(id, (err, song: SongInDb) => {
          if (err) {
            observer.error(err);
            return;
          }
          this.dataStore.song[id] = new Song(song);
          observer.next(this.dataStore.song[id]);
        });
      }
    });
    return observable;
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

  private updateFindObservers() {
    for (let observer of this.findObservers)
      observer.next(this.dataStore.songs);
  }

  private updateGetObservers(id: string) {
    for (let observer of this.getObservers[id])
      observer.next(this.dataStore.song[id]);
  }

  private onCreated(song: SongInDb) {
    this.dataStore.songs.push(new Song(song));
    this.updateFindObservers();
  }

  private onUpdated(song: SongInDb) {

    const index = this.getIndex(song._id);
    this.dataStore.songs[index] = new Song(song);
    this.updateFindObservers();

    if (song._id in this.dataStore.song) {
      this.dataStore.song[song._id] = new Song(song);
      this.updateGetObservers(song._id);
    }
  }

  private onRemoved(song: Song) {

    const index = this.getIndex(song._id);
    this.dataStore.songs.splice(index, 1);
    this.updateFindObservers();

    if (song._id in this.dataStore.song) {
      this.dataStore.song[song._id].removed = true;
      this.updateGetObservers(song._id);
    }
  }
}
