import { LiveSession, LiveSessionInDb } from '../../models/live-session';
import { Song } from '../../models/song';
import { SharedStateService } from '../shared-state.service';
import { ComponentWithDataTable } from '../component-with-dtable';
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
export class WorshipEditComponent extends ComponentWithDataTable<Song> implements OnInit {

  previewSession : LiveSession;
  tabSelected = 'worship';
  selectedItem = null;
  worshipId : string;
  worship : Worship;
  original : Worship;
  subscription : Subscription;
  errorMessage : string = "The worship is no longer in database. Someone removed it just now.";

  constructor(private tabService: TabControlService,
              private route: ActivatedRoute,
              private worshipService: WorshipsService,
              private router: Router,
              public  state: SharedStateService,
              vcr: ViewContainerRef,
              toastr: ToastsManager,
              dialogService: DialogService) {

    super(vcr, toastr, dialogService);
    this.worship = new Worship(new WorshipInDb());
    this.original = Object.assign({}, this.worship);
    this.previewSession = new LiveSession(new LiveSessionInDb());
  }

  updateTab() {
    this.tabService.updateTab({
      id: 'worship',
      isActive: true,
      display: 'Worship (' + this.worship.name + ')',
      link: 'worship/' + this.worshipId
    });
  }

  reloadWorshipFromDb() {
    let observer : Observer<Worship> = {
      next: (worship) => {
        if (this.worship && this.worship._id != '') {
          this.showSuccess('Worship updated.');
        }
        this.original = worship.getClone();
        this.state.activeWorship.update(worship.getClone());
      },
      error: (err) => {
        this.worship = null;
        this.errorMessage = err.message;
      },
      complete: () => {}
    }
    if (this.subscription)
      this.subscription.unsubscribe();

    this.worshipId = this.route.snapshot.paramMap.get('id');
    this.subscription = this.worshipService.get(this.worshipId).subscribe(observer);
  }

  ngOnInit() {
    this.state.activeWorship.getObservable().subscribe(worship => {
        this.worship = worship;
        if (worship) {
          this.updateTab();
        }
      });
    this.reloadWorshipFromDb();
  }

  isModified() {
    return !this.worship.isEqual(this.original);
  }

  onRowSelected(index, item) {
    if (item == this.selectedItem)
      this.selectedItem = null;
    else {
      this.selectedItem = item;
      this.previewSession.itemIndex = index;
    }
  }

  removeItem(index) {
    if (this.worship) {
      this.worship.items.splice(index, 1);
    }
  }

  saveChanges() {
    this.worshipService.update(this.worship);
  }

  onAttached() {
    if (!this.state.activeWorship.snapshot)
      this.reloadWorshipFromDb();
    else
      this.updateTab();
  }

  navigateBack() {
    if (this.isModified()) {
      this.dialogService.addDialog(ConfirmDialogComponent, {
        title: 'Discard Changes',
        message: 'Changes have been made. Discard?'})
          .subscribe(confirmed => {
            if (!confirmed) return;
            this.state.activeWorship.update(null);
            this.router.navigateByUrl('/worship');
          });
    } else {
      this.state.activeWorship.update(null);
      this.router.navigateByUrl('/worship');
    }
  }
}
