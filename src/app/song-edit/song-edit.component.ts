import { SharedStateService } from '../shared-state.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { Tab, TabControlService } from '../tab-control.service';
import { Observer, Subscription } from 'rxjs';
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

  tabSelf: Tab;
  tabList: Tab;
  selectedTag : string = '';
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
              private tabService: TabControlService,
              private dialogService: DialogService) {

    this.songId = this.route.snapshot.paramMap.get('id');
    this.song = new Song();
    this.original = Object.assign({}, this.song);
    this.addNew = (this.songId === 'new');
    this.tabSelf = this.tabService.getTab('song-edit');
    this.tabList = this.tabService.getTab('songs');
  }

  onAttached() {
    this.updateTab();
  }

  get tabDisplay() {
    return 'Song (' + this.song.title + ')';
  }

  updateTab() {
    this.tabSelf.isActive = true;
    this.tabSelf.isHidden = false;
    this.tabSelf.update();
    this.tabList.isActive = false;
    this.tabList.isHidden = true;
    this.tabList.update();
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.srcElement.id.includes('title'))
      this.updateTab();
  }

  ngOnInit() {
    if (!this.addNew) {
      let observer : Observer<Song> = {
        next: (song) => {
          this.song = song.getClone();
          this.original = song.getClone();
          this.tabSelf.display = 'Song (' + this.song.title + ')';
          this.tabSelf.link = 'songs/' + this.songId;
          this.tabSelf.update();
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
    return !this.song.isEqual(this.original);
  }

  onTagSelected(tag) {
    if (this.selectedTag == tag) {
      this.selectedTag = '';
    } else {
      this.selectedTag = tag;
    }
    console.log(tag, this.selectedTag);
  }

  removeSequence(index) {
    this.song.order.splice(index, 1);
  }

  addTagToSequences(tag) {
    this.song.order.push(tag);
  }

  onScroll($event) {
    let otherId = ($event.target.id == 'lyrics1') ? 'lyrics2' : 'lyrics1';
    let otherTextArea = document.getElementById(otherId);
    otherTextArea.scrollTop = $event.target.scrollTop;
  }

  navigateBack() {
    if (this.isModified()) {
      this.dialogService.addDialog(ConfirmDialogComponent, {
        title: 'Discard Changes',
        message: 'Changes have been made. Discard?'})
          .subscribe(confirmed => {
            if (!confirmed) return;
            this.song = this.original.getClone();
            this.router.navigateByUrl('/songs');
          });
    } else {
      this.router.navigateByUrl('/songs');
    }
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
