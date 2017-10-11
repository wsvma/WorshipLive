import { SongsService } from '../songs.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Song } from '../../models/song';

@Component({
  selector: 'songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {

  public songs: Song[] = [];
  private subscription: Subscription;

  constructor(private songService: SongsService) { }

  ngOnInit() {
    this.subscription = this.songService.songs$.subscribe((songs: Song[]) => {
      this.songs = songs;
    });
    this.songService.find();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }
}
