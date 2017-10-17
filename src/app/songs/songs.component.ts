import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogService } from 'ng2-bootstrap-modal/dist';
import { Router } from '@angular/router';
import { SongsService } from '../songs.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../models/song';
import { DataTableResource, DataTable } from 'angular-4-data-table';

import * as wordcount from 'wordcount';
import * as hasChinese from 'has-chinese';
import * as fuzzy from 'fuzzy';
import * as rangeParser from 'parse-numeric-range';

class Filters {
  title: string = '';
  lyrics: string = '';
  wordcount: string = '';
}

class DataColumn {
  constructor(
    public property: string,
    public header: string,
    public sortable: boolean = true,
    public resizable: boolean = true) {}
}

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {

  filters: Filters = new Filters();
  songs: Song[] = [];
  items: Song[] = [];
  itemCount = 0;
  itemLimit = Math.floor((window.parent.innerHeight - 200) / 55);
  subscription: Subscription;
  dataTableResource : DataTableResource<Song>;
  dataColumns : DataColumn[] = [
    new DataColumn('title', 'Title'),
    new DataColumn('numwords', '# Words'),
    new DataColumn('last_modified', 'Last Modified'),
  ];

  @ViewChild(DataTable) dataTable;

  constructor(
    private songService: SongsService,
    private router: Router,
    private dialogService: DialogService) { }

  numRowsSelected() {
    if (!this.dataTable) return 0;
    return this.dataTable.selectedRows.length;
  }

  ngOnInit() {
    this.subscription = this.songService.find().subscribe((songs: Song[]) => {
      this.songs = songs;
      this.filterSongs();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  reload(params) {
    if (!this.dataTableResource) return;

    this.dataTableResource.query(params)
      .then(items => {
        this.items = items;
        return this.dataTableResource.count();
      })
      .then(count => this.itemCount = count);
  }

  songDoubleClicked(event) {
    let song = event.row.item;
    this.router.navigateByUrl('/songs/' + song._id);
  }

  filterSongs() {
    let filteredSongs = this.songs;

    if (this.filters.wordcount) {
      let counts = rangeParser.parse(this.filters.wordcount);
      console.log(counts);
      filteredSongs = filteredSongs.filter(s => {
        return counts.includes(s.numwords);
      });
    }

    if (this.filters.title)
      filteredSongs = filteredSongs.filter(s => {
        return fuzzy.filter(this.filters.title, [s.title_1, s.title_2]).length > 0;
      });

    if (this.filters.lyrics)
      filteredSongs = filteredSongs.filter(s => {
        return fuzzy.filter(this.filters.lyrics, [s.lyrics]).length > 0;
      });

    this.initializeDataTable(filteredSongs);
  }

  routeToEdit() {
    let song = this.dataTable.selectedRows[0].item;
    this.router.navigateByUrl('/songs/' + song._id);
  }

  routeToNewSong() {
    this.router.navigateByUrl('/songs/new');
  }

  onMouseWheel($event) {
    if (this.dataTable) {
      let increment = $event.deltaY > 0 ? 1 : -1;
      let newPage = this.dataTable.page + increment;
      newPage = Math.min(newPage, this.dataTable.lastPage);
      newPage = Math.max(newPage, 1);
      if (newPage != this.dataTable.page) {
        this.dataTable.selectedRows = [];
        this.dataTable.page = newPage;
      }
    }
  }

  removeSongs() {
    this.dialogService.addDialog(ConfirmDialogComponent, {
      title: 'Confirm removal',
      message: this.numRowsSelected() + ' song(s) will be removed and it cannot be undone. Proceed?'})
      .subscribe(confirmed => {
        if (!confirmed) return;
        let songs = this.dataTable.selectedRows.map(x => x.item);
        this.dataTable.selectedRows = [];
        this.songService.remove(songs);
      });
  }

  private countWords(str) {
    if (hasChinese(str))
      return str.length;

    return wordcount(str);
  }

  private initializeDataTable(songs: Song[]) {
    this.dataTableResource = new DataTableResource(songs);
    if (this.dataTable) this.dataTable.page = 1;
    this.reload({offset: 0, limit: this.dataTable ? this.dataTable.limit : this.itemLimit});
  }
}
