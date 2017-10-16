import { Subscription } from 'rxjs/Rx';
import { Song, SongInDb } from '../../models/song';
import { SongsService } from '../songs.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.css']
})
export class SongEditComponent implements OnInit, OnDestroy {

  songId : string;
  song : Song = new Song(new SongInDb());
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private songService: SongsService) {
    this.songId = this.route.snapshot.paramMap.get('id');
    console.log("constructor:", this.songId);
  }

  ngOnInit() {
    this.subscription = this.songService.song$.subscribe((song: Song) => {
      console.log("observer:", song);
      if (song._id == this.songId)
        this.song = song;
    });
    console.log("oninit");
    this.songService.get(this.songId);
  }

  ngOnDestroy() {
    console.log("destroy");
    this.subscription.unsubscribe();
  }
}
