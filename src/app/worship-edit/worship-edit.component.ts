import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogService } from 'ng2-bootstrap-modal/dist';
import { ToastsManager } from 'ng2-toastr';
import { WorshipsService } from '../worships.service';
import { Observer, Subscription } from 'rxjs/Rx';
import { Worship, WorshipInDb } from '../../models/worship';
import { ActivatedRoute, Router } from '@angular/router';
import { TabControlService } from '../tab-control.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-worship-edit',
  templateUrl: './worship-edit.component.html',
  styleUrls: ['./worship-edit.component.css']
})
export class WorshipEditComponent implements OnInit {

  tabSelected = 'worship';
  worshipId : string;
  worship : Worship;
  original : Worship;
  addNew : boolean;
  subscription : Subscription;
  errorMessage : string = "The worship is no longer in database. Someone removed it just now.";

  constructor(private tabService: TabControlService,
              private route: ActivatedRoute,
              private worshipService: WorshipsService,
              private router: Router,
              private vcr: ViewContainerRef,
              private toastr: ToastsManager,
              private dialogService: DialogService) {

    this.toastr.setRootViewContainerRef(this.vcr);
    this.worshipId = this.route.snapshot.paramMap.get('id');
    this.worship = new Worship(new WorshipInDb());
    this.original = Object.assign({}, this.worship);
    this.addNew = (this.worshipId === 'new');
  }

  updateTab() {
    this.tabService.updateTab({
      id: 'worship',
      isActive: true,
      display: 'Worship (' + this.worship.name + ')',
      link: 'worship/' + this.worshipId
    });
  }

  ngOnInit() {
    if (!this.addNew) {
      let observer : Observer<Worship> = {
        next: (worship) => {
          this.worship = worship;
          this.original = Object.assign({}, worship);
          this.updateTab();
        },
        error: (err) => {
          this.worship = null;
          this.errorMessage = err.message;
        },
        complete: () => {}
      }
      this.subscription = this.worshipService.get(this.worshipId).subscribe(observer);
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Success!', {
        showCloseButton: true,
    });
  }

  isModified() {
    if (!(this.original.name === this.worship.name))
      return true;

    return false;
  }

  saveChanges() {
    this.worshipService.update(this.worship)
      .then(() => {
        this.showSuccess('Changes saved successfully.');
      });
  }

  navigateBack() {
    if (this.isModified()) {
      this.dialogService.addDialog(ConfirmDialogComponent, {
        title: 'Discard Changes',
        message: 'Changes have been made. Discard?'})
          .subscribe(confirmed => {
            if (!confirmed) return;
            this.worship = Object.assign({}, this.original);
            this.router.navigateByUrl('/worship');
          });
    } else {
      this.router.navigateByUrl('/worship');
    }
  }
}
