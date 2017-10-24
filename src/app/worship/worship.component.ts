import { DataTable } from 'angular-4-data-table/dist/components/table.component';
import { DataTableResource } from 'angular-4-data-table/dist';
import { Worship, WorshipInDb } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Component, OnInit, ViewChild } from '@angular/core';

class DataColumn {
  constructor(
    public property: string,
    public header: string,
    //public flexProp: string,
    public visible: boolean,
    public sortable: boolean = true,
    public resizable: boolean = true) {}
}

@Component({
  selector: 'app-worship',
  templateUrl: './worship.component.html',
  styleUrls: ['./worship.component.css']
})
export class WorshipComponent implements OnInit {

  tab = 'worship';

  worships: Worship[] = [];
  items: Worship[] = [];
  itemCount = 0;
  itemLimit = Math.floor((window.parent.innerHeight - 200) / 55);
  dataTableResource : DataTableResource<Worship>;
  dataColumns : DataColumn[] = [
    new DataColumn('name',         'Name',   true),
    new DataColumn('date_created',  'Date Created', true),

  ];

  @ViewChild(DataTable) dataTable;
  constructor(private worshipService: WorshipsService) { }

  ngOnInit() {
    this.worshipService.find().subscribe((worships: Worship[]) => {
      this.worships = worships;
      this.initializeDataTable(worships);
    })
  }

  create() {
    let w = new Worship(new WorshipInDb());
    w.name = new Date().toTimeString();
    this.worshipService.create(w);
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

  private initializeDataTable(worships: Worship[]) {
    this.dataTableResource = new DataTableResource(worships);
    if (this.dataTable) this.dataTable.page = 1;
    this.reload({offset: 0, limit: this.dataTable ? this.dataTable.limit : this.itemLimit});
  }
}
