import { LiveSessionService } from '../live-session.service';
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
import { Tab, TabControlService } from '../tab-control.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-worship-edit',
  templateUrl: './worship-edit.component.html',
  styleUrls: ['./worship-edit.component.css']
})
export class WorshipEditComponent extends ComponentWithDataTable<Song> implements OnInit {

  tabSelf: Tab;
  tabList: Tab;
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
              private liveSessionService: LiveSessionService,
              private router: Router,
              public  state: SharedStateService,
              vcr: ViewContainerRef,
              toastr: ToastsManager,
              dialogService: DialogService) {

    super(vcr, toastr, dialogService);
    this.worship = new Worship();
    this.original = Object.assign({}, this.worship);
    this.previewSession = new LiveSession();
    this.tabSelf = this.tabService.getTab('worship-edit');
    this.tabList = this.tabService.getTab('worship');
  }

  updateTab() {
    this.tabSelf.isActive = true;
    this.tabSelf.isHidden = false;
    this.tabSelf.update();
    this.tabList.isActive = false;
    this.tabList.isHidden = true;
    this.tabList.update();
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
          this.tabSelf.display = 'Worship (' + this.worship.name + ')';
          this.tabSelf.link = 'worship/' + this.worshipId;
          this.tabSelf.update();
        }
      });
    this.reloadWorshipFromDb();
  }

  isModified() {
    return !this.worship.isEqual(this.original);
  }

  onRowSelected(index, item) {
    if (item == this.selectedItem)
      return;

    this.selectedItem = item;
    this.previewSession.setIndices(index, 0, 0);
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

    this.updateTab();
  }

  goLive() {
    if (this.worship.liveId) {
      this.liveSessionService.removeWithId([this.worship.liveId]);
      this.worship.liveId = '';
      this.worship.update();
      return;
    }

    let liveSession = new LiveSession();
    liveSession.worshipId = this.worshipId;
    liveSession.worshipName = this.worship.name;
    this.liveSessionService.create(liveSession)
      .then((newLive) => {
        this.worship.liveId = newLive._id;
        this.worship.update();
        this.router.navigateByUrl('/live-control/' + newLive._id);
      });
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
