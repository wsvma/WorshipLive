import { FeatherService } from './feather.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { DataTable, DataTableResource } from 'angular5-data-table';

export class DataColumn {
    constructor(
      public property: string,
      public header: string,
      //public flexProp: string,
      public visible: boolean,
      public sortable: boolean = true,
      public resizable: boolean = true) {}
  }

export class ComponentWithDataTable<DataType> {

    dataService: FeatherService<DataType>;
    data: DataType[] = [];
    items: DataType[] = [];
    itemCount = 0;
    itemLimit = 10;
    itemLimitInited = false;
    dataTableResource : DataTableResource<DataType>;
    dataColumns : DataColumn[];

    @ViewChild(DataTable, {static: false}) dataTable;

    constructor(private vcr: ViewContainerRef, public toastr: ToastrManager, protected dialogService: DialogService) {
    }

    numRowsSelected() {
        if (!this.dataTable) return 0;
        return this.dataTable.selectedRows.length;
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

    showSuccess(message: string) {
        this.toastr.successToastr(message, 'Success!', {
            showCloseButton: true,
        });
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

    removeData() {
        this.dialogService.addDialog(ConfirmDialogComponent, {
            title: 'Confirm removal',
            message: this.numRowsSelected() + ' item(s) will be removed and it cannot be undone. Proceed?'})
                .subscribe(confirmed => {
                    if (!confirmed) return;
                    let items = this.dataTable.selectedRows.map(x => x.item);
                    this.dataTable.selectedRows = [];
                    this.dataService.remove(items)
                        .then(() => {
                            this.showSuccess('The selected item(s) are removed successfully!');
                        });
                    });
    }

    protected initializeItemLimit() {
        if (document.querySelector('data-table') && !this.itemLimitInited) {
            let availableHeight = document.querySelector('data-table').parentElement.clientHeight;
            let rowHeight = document.querySelector('tr').clientHeight;
            this.itemLimit = Math.floor(availableHeight / rowHeight) - 4;
            this.itemLimitInited = true;
        }
    }

    protected initializeDataTable(data: DataType[]) {
        //this.initializeItemLimit();
        this.dataTableResource = new DataTableResource(data);
        if (this.dataTable) this.dataTable.page = 1;
        this.reload({offset: 0, limit: this.dataTable ? this.dataTable.limit : this.itemLimit});
    }
}
