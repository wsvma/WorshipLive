import { SharedStateService } from '../shared-state.service';
import { TabControlService } from '../tab-control.service';
import { ComponentWithDataTable, DataColumn } from '../component-with-dtable';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogService } from 'ng2-bootstrap-modal/dist';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SongsService } from '../songs.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Song } from '../../models/song';
import { DataTableResource, DataTable } from 'angular-4-data-table';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
export class SongsComponent extends ComponentWithDataTable<Song> implements OnInit {

  filters: Filters = new Filters();
  dataColumns : DataColumn[] = [
    new DataColumn('title',         'Title',   true),
    new DataColumn('writer',        'Writer', false),
    new DataColumn('numwords',      '# Words', true),
    new DataColumn('category',      'Category', false),
    new DataColumn('key',           'Key', false),
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
    toastr: ToastsManager,
    dialogService: DialogService) {

      super(vcr, toastr, dialogService);
      this.dataService = songService;
    }

  onAttached() {
    this.updateTab();
  }

  updateTab() {
    this.tabService.updateTab({
      id: 'songs',
      isActive: true,
      display: 'Songs',
      link: 'songs'
    });
  }

  ngOnInit() {
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
    this.router.navigateByUrl('/songs/' + song._id);
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
    this.router.navigateByUrl('/songs/' + song._id);
  }

  routeToNewSong() {
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/songs/new');
  }
}
