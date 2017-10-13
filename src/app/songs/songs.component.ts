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

  songs: Song[] = [];
  items: Song[] = [];
  itemCount = 0;
  itemLimit = 12;
  subscription: Subscription;
  searchString: string = '';
  dataTableResource : DataTableResource<Song>;
  dataColumns : DataColumn[] = [
    new DataColumn('title_1', 'Title'),
    new DataColumn('numwords', '# Words')
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
    this.subscription = this.songService.songs$.subscribe((songs: Song[]) => {
      this.songs = songs;
      this.initializeDataTable(songs);
    });
    this.songService.find({});
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
    let filteredSongs = (this.searchString) ? this.songs.filter(s => {
      return fuzzy.filter(this.searchString, [s.title_1, s.lyrics]).length > 0;
    }) : this.songs;
    this.initializeDataTable(filteredSongs);
  }

  routeToEdit() {
    let song = this.dataTable.selectedRows[0].item;
    this.router.navigateByUrl('/songs/' + song._id);
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
    this.reload({offset: 0, limit: this.dataTable ? this.dataTable.limit : this.itemLimit});
  }
}
