import { LiveController } from '../../models/live-control';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Subscription } from 'rxjs/Rx';
import { LiveSessionService } from '../live-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveSession } from '../../models/live-session';
import { TabControlService } from '../tab-control.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-control',
  templateUrl: './live-control.component.html',
  styleUrls: ['./live-control.component.css']
})
export class LiveControlComponent extends LiveController implements OnInit, OnDestroy {

  liveId;
  selectedItem = null;
  subscriptions: Subscription[] = [];
  errorMessage = 'Live session no longer exists. It is unlived by someone else already.';

  constructor(
    private tabService: TabControlService,
    private liveSessionService: LiveSessionService,
    private worshipService: WorshipsService,
    private route: ActivatedRoute,
    private router: Router) {
      super();
    }

  updateTab() {
    if (!this.worship || !this.liveSession)
      return;

    this.tabService.updateTab(this.liveSession.getControlTab(true));
  }

  onAttached() {
    this.updateTab();
  }

  onRowSelected(index, item) {
    if (item == this.selectedItem)
      return;

    this.selectedItem = item;
    this.liveSession.setIndices(index, 0, 0);
    this.liveSession.update();
  }

  navigateBack() {
    this.router.navigateByUrl('live');
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.liveSessionService.get(this.liveId).subscribe((live : LiveSession) => {
      this.liveSession = live;
      if (live.removed) {
        this.tabService.removeTabsWithId('live-control');
        this.router.navigateByUrl('live');
      }
      if (this.worship) {
        this.selectedItem = this.worship.items[live.itemIndex];
        return;
      }
      this.subscriptions.push(this.worshipService.get(live.worshipId).subscribe((worship : Worship) => {
        this.worship = worship;
        this.liveSession.worshipName = worship.name;
        if (worship.liveId == this.liveId) {
          this.updateTab();
        }
      }));
    }));
  }

  ngOnDestroy() {
    for (let s of this.subscriptions)
      s.unsubscribe();
  }

}
