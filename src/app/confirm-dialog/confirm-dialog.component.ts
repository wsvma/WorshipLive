import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface ConfirmModel {
  title: string;
  message: string;
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {

  title: string;
  message: string;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  confirm() {
    this.result = true;
    this.close();
  }
  cancel() {
    this.result = false;
    this.close();
  }
}