import { TabDisplayService } from '../tab-display.service';
import { Observer, Subscription } from 'rxjs/Rx';
import { Song, SongInDb } from '../../models/song';
import { SongsService } from '../songs.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  tabSelected = 'songs';
  defaultTabDisplay = 'Songs';
  addNew : boolean = false;
  songId : string;
  song : Song;
  original: Song;
  subscription: Subscription = null;
  errorMessage: string = "Song is no longer in database. Someone removed it just now.";

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private songService: SongsService,
              private tabService: TabDisplayService) {

    this.songId = this.route.snapshot.paramMap.get('id');
    this.song = new Song(new SongInDb());
    this.original = Object.assign({}, this.song);
    this.addNew = (this.songId === 'new');
  }

  get tabDisplay() {
    return 'Song (' + this.song.title + ')';
  }

  onKeyUp($event: KeyboardEvent) {
    //if ($event.srcElement.id.includes('title'))
      this.tabService.pushNewDisplay(this.tabDisplay);
  }

  ngOnInit() {
    if (!this.addNew) {
      let observer : Observer<Song> = {
        next: (song) => {
          this.song = song;
          this.original = Object.assign({}, song);
          this.tabService.pushNewDisplay(this.tabDisplay);
        },
        error: (err) => {
          this.song = null;
          this.errorMessage = err.message;
        },
        complete: () => {}
      }
      this.subscription = this.songService.get(this.songId).subscribe(observer);
    }
  }

  ngOnDestroy() {
    if (this.subscription)
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

  addNewSong() {
    this.songService.create(this.song)
      .then((song)=> {
        this.router.navigate(['/songs'], { queryParams: { newsong: song._id }});
      });
  }

  saveChanges() {
    this.songService.update(this.song)
      .then((song)=> {
        this.router.navigate(['/songs'], { queryParams: { songupdated: song._id }});
      })
  }
}
