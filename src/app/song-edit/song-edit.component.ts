import { Subscription } from 'rxjs/Rx';
import { Song, SongInDb } from '../../models/song';
import { SongsService } from '../songs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { Component, OnDestroy, OnInit, PACKAGE_ROOT_URL } from '@angular/core';

interface EditField {
  name: string;
  label: string;
  style: { width: string };
}

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.css']
})
export class SongEditComponent implements OnInit, OnDestroy {

  songId : string;
  song : Song;
  original: Song;
  subscription: Subscription;

  editFields = [
    { name: 'title_1'       , label: 'Title 1'      , style: { width: '25%' } },
    { name: 'title_2'       , label: 'Title 2'      , style: { width: '25%' } },
    { name: 'writer'        , label: 'Writer'       , style: { width: '25%' } },
    { name: 'category'      , label: 'Category'     , style: { width: '25%' } },
    { name: 'key'           , label: 'Key'          , style: { width: '12%' } },
    { name: 'capo'          , label: 'Capo'         , style: { width: '12%' } },
    { name: 'timing'        , label: 'Timing'       , style: { width: '16%' } },
    { name: 'copyright'     , label: 'Copyright'    , style: { width: '30%' } },
    { name: 'license_admin1', label: 'License Admin', style: { width: '30%' } },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongsService) {
    this.songId = this.route.snapshot.paramMap.get('id');
    this.song = this.original = new Song(new SongInDb());
  }

  ngOnInit() {
    this.subscription = this.songService.get(this.songId).subscribe((song: Song) => {
      this.song = song;
      this.original = {...song};
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isModified() {
    let fieldsToCompare = this.editFields.map(f => f.name);
    fieldsToCompare.push('lyrics');
    for (let field of fieldsToCompare) {
      if (!(this.original[field] === this.song[field]))
        return true;
    }
    return false;
  }

  onScroll($event) {
    let otherId = ($event.target.id == 'lyrics1') ? 'lyrics2' : 'lyrics1';
    let otherTextArea = document.getElementById(otherId);
    otherTextArea.scrollTop = $event.target.scrollTop;
  }

  navigateBack() {
    this.router.navigateByUrl('/songs');
  }

  saveChanges() {
    this.songService.update(this.song);
  }
}
