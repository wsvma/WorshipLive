import { Router } from '@angular/router';
import { Tab, TabControlService } from '../tab-control.service';
import { DialogService } from 'ng2-bootstrap-modal/dist';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ComponentWithDataTable, DataColumn } from '../component-with-dtable';
import { DataTable, DataTableResource } from 'angular5-data-table';
import { Worship, WorshipInDb } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-worship',
  templateUrl: './worship.component.html',
  styleUrls: ['./worship.component.css']
})
export class WorshipComponent extends ComponentWithDataTable<Worship> implements OnInit {

  tabSelf: Tab;
  tabEdit: Tab;
  dataColumns : DataColumn[] = [
    new DataColumn('name',         'Name',   true),
    new DataColumn('date_created',  'Date Created', true),

  ];

  constructor(private worshipService: WorshipsService,
              private tabService: TabControlService,
              private router: Router,
              vcr: ViewContainerRef,
              toastr: ToastrManager,
              dialogService: DialogService) {

    super(vcr, toastr, dialogService);
    this.dataService = worshipService;
    this.tabSelf = this.tabService.getTab('worship');
    this.tabEdit = this.tabService.getTab('worship-edit');
  }

  ngOnInit() {
    this.dataService.find().subscribe((worships: Worship[]) => {
      this.data = worships;
      this.initializeDataTable(worships);
    })
  }

  onAttached() {
    this.tabSelf.isActive = true;
    this.tabSelf.isHidden = false;
    this.tabSelf.update();
    this.tabEdit.isActive = false;
    this.tabEdit.isHidden = true;
    this.tabEdit.update();
  }

  worshipDoubleClicked(event) {
    let worship = event.row.item;
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/worship/' + worship.id);
  }

  create() {
    let w = new Worship();
    w.name = 'New';
    this.worshipService.create(w)
      .then((newWorship) => {
        this.router.navigateByUrl('/worship/' + newWorship.id);
      });
  }

  routeToEdit() {
    let worship = this.dataTable.selectedRows[0].item;
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/worship/' + worship.id);
  }
}
