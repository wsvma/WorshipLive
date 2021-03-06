import { SharedStateService } from '../shared-state.service';
import { Tab, TabControlService } from '../tab-control.service';
import { ComponentWithDataTable, DataColumn } from '../component-with-dtable';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogService } from 'ng2-bootstrap-modal/dist';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SongsService } from '../songs.service';
import { Subscription } from 'rxjs';
import { AfterViewInit, Component, ViewContainerRef } from '@angular/core';
import { Song } from '../../models/song';
import { DataTableResource, DataTable } from 'angular5-data-table';
import { ToastrManager } from 'ng6-toastr-notifications';

import FuzzySearch from 'fuzzy-search';
import * as rangeParser from 'parse-numeric-range';

class Filters {
  title: string = '';
  lyrics: string = '';
  wordcount: string = '';
}

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent extends ComponentWithDataTable<Song> implements AfterViewInit {

  tabSelf: Tab;
  tabEdit: Tab;
  filters: Filters = new Filters();
  dataColumns : DataColumn[] = [
    new DataColumn('title',         'Title',   true),
    new DataColumn('writer',        'Writer', false),
    new DataColumn('numwords',      '# Words', true),
    new DataColumn('category',      'Category', false),
    new DataColumn('key',           'Key', true),
    new DataColumn('last_modified', 'Last Modified', true),
    new DataColumn('date_created',  'Date Created', false),
  ];

  constructor(
    songService: SongsService,
    private router: Router,
    private route: ActivatedRoute,
    private tabService: TabControlService,
    private state: SharedStateService,
    vcr: ViewContainerRef,
    toastr: ToastrManager,
    dialogService: DialogService) {

      super(vcr, toastr, dialogService);
      this.dataService = songService;
      this.tabSelf = this.tabService.getTab('songs');
      this.tabEdit = this.tabService.getTab('song-edit');
    }

  onAttached() {
    this.updateTab();
  }

  updateTab() {
    this.tabSelf.isActive = true;
    this.tabSelf.isHidden = false;
    this.tabSelf.update();
    this.tabEdit.isActive = false;
    this.tabEdit.isHidden = true;
    this.tabEdit.update();
  }

  ngAfterViewInit() {
    this.dataService.find().subscribe((songs: Song[]) => {
      this.data = songs;
      let pMap = this.route.snapshot.queryParamMap;
      if (pMap.has('newsong')) {
        let song = this.dataService.lookup(pMap.get('newsong'));
        if (song)
          this.showSuccess(song.title + ' is added successsfully!');
      } else if (pMap.has('songupdated')) {
        let song = this.dataService.lookup(pMap.get('songupdated'));
        if (song)
          this.showSuccess(song.title + ' is updated successsfully!');
      }
      this.filterSongs();
    });
  }

  songDoubleClicked(event) {
    let song = event.row.item;
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/songs/' + song.id);
  }

  get worship() {
    return this.state.activeWorship.snapshot;
  }

  set worship(worship) {
    this.state.activeWorship.update(worship);
  }

  addToWorship() {
    if (this.worship) {
      for (let x of this.dataTable.selectedRows)
        this.worship.items.push(x.item);
      this.showSuccess('Added to worship (' + this.state.activeWorship.snapshot.name + ') successfully.');
    }
  }

  filterSongs() {
    let filteredSongs = this.data;

    if (this.filters.wordcount) {
      let counts = rangeParser.parse(this.filters.wordcount);
      filteredSongs = filteredSongs.filter(s => {
        return counts.includes(s.numwords);
      });
    }

    if (this.filters.title) {
      filteredSongs = new FuzzySearch(filteredSongs, ['title_1', 'title_2'], { sort: true} ).search(this.filters.title);
      this.dataTable.sortBy = '';
    }

    if (this.filters.lyrics) {
      filteredSongs = new FuzzySearch(filteredSongs, ['lyrics_1', 'lyrics_2'], {sort: true} ).search(this.filters.lyrics);
      this.dataTable.sortBy = '';
    }

    this.initializeDataTable(filteredSongs);
  }

  routeToEdit() {
    let song = this.dataTable.selectedRows[0].item;
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/songs/' + song.id);
  }

  routeToNewSong() {
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/songs/new');
  }
}
