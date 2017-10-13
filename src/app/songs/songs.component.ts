import { Router } from '@angular/router';
import { SongsService } from '../songs.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Song } from '../../models/song';
import { DataTableResource, DataTable } from 'angular-4-data-table';

import * as wordcount from 'wordcount';
import * as hasChinese from 'has-chinese';

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

  @ViewChild(DataTable) dataTable;

  constructor(private songService: SongsService, private router: Router) { }

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

    console.log(params);
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
      return this.containsSearchString([s.title_1, s.lyrics]);
    }) : this.songs;
    this.initializeDataTable(filteredSongs);
  }

  routeToEdit() {
    let song = this.dataTable.selectedRows[0].item;
    this.router.navigateByUrl('/songs/' + song._id);
  }
   
  private containsSearchString(strings: string[]) {

    for (var i = 0; i < strings.length; i++) {
      if (!strings[i]) continue;
      if (strings[i].toLowerCase().includes(this.searchString.toLowerCase()))
        return true;
    }

    return false;
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
