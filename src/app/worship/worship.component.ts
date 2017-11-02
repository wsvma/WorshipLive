import { Router } from '@angular/router';
import { TabControlService } from '../tab-control.service';
import { DialogService } from 'ng2-bootstrap-modal/dist';
import { ToastsManager } from 'ng2-toastr';
import { ComponentWithDataTable, DataColumn } from '../component-with-dtable';
import { DataTable } from 'angular-4-data-table/dist/components/table.component';
import { DataTableResource } from 'angular-4-data-table/dist';
import { Worship, WorshipInDb } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-worship',
  templateUrl: './worship.component.html',
  styleUrls: ['./worship.component.css']
})
export class WorshipComponent extends ComponentWithDataTable<Worship> implements OnInit {

  dataColumns : DataColumn[] = [
    new DataColumn('name',         'Name',   true),
    new DataColumn('date_created',  'Date Created', true),

  ];

  constructor(private worshipService: WorshipsService,
              private tabService: TabControlService,
              private router: Router,
              vcr: ViewContainerRef,
              toastr: ToastsManager,
              dialogService: DialogService) {

    super(vcr, toastr, dialogService);
    this.dataService = worshipService;
  }

  ngOnInit() {
    this.dataService.find().subscribe((worships: Worship[]) => {
      this.data = worships;
      this.initializeDataTable(worships);
    })
  }

  onAttached() {
    this.updateTab();
  }

  updateTab() {
    this.tabService.updateTab({
      id: 'worship',
      display: 'Worship',
      isActive: true,
      link: 'worship'
    });
  }

  worshipDoubleClicked(event) {
    let worship = event.row.item;
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/worship/' + worship._id);
  }

  create() {
    let w = new Worship(new WorshipInDb());
    w.name = 'New';
    this.worshipService.create(w)
      .then((newWorship) => {
        this.router.navigateByUrl('/worship/' + newWorship._id);
      });
  }

  routeToEdit() {
    let worship = this.dataTable.selectedRows[0].item;
    this.dataTable.selectedRows = [];
    this.router.navigateByUrl('/worship/' + worship._id);
  }
}
