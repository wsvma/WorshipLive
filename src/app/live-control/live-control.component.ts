import { LiveController } from '../../models/live-control';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Subscription } from 'rxjs/Rx';
import { LiveSessionService } from '../live-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveSession } from '../../models/live-session';
import { Tab, TabControlService } from '../tab-control.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-control',
  templateUrl: './live-control.component.html',
  styleUrls: ['./live-control.component.css']
})
export class LiveControlComponent extends LiveController implements OnInit, OnDestroy {

  tabSelf: Tab;
  tabList: Tab;
  liveId: string;
  selectedItem = null;
  subscriptions: Subscription[] = [];
  errorMessage = 'Live session no longer exists. It is unlived by someone else already.';

  constructor(private tabService: TabControlService,
              private liveSessionService: LiveSessionService,
              private worshipService: WorshipsService,
              private route: ActivatedRoute,
              private router: Router) {
    super();
    this.tabSelf = this.tabService.getTab('live-control');
    this.tabList = this.tabService.getTab('live');
  }

  updateTab() {
    this.tabSelf.isActive = true;
    this.tabSelf.isHidden = false;
    this.tabSelf.update();
    this.tabList.isActive = false;
    this.tabList.isHidden = true;
    this.tabList.update();
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

  navigateWorship() {
    this.router.navigateByUrl('worship/' + this.worship._id);
  }

  goWatch() {
    window.open('live/' + this.liveId);
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.liveSessionService.get(this.liveId).subscribe((live : LiveSession) => {
      this.liveSession = live;
      if (live.removed) {
        this.router.navigateByUrl('live');
      }
      if (this.worship) {
        this.selectedItem = this.worship.items[live.itemIndex];
        return;
      }
      this.subscriptions.push(this.worshipService.get(live.worshipId).subscribe((worship : Worship) => {
        this.worship = worship;
        this.liveSession.worshipName = worship.name;
        this.tabSelf.display = 'Live (' + this.worship.name + ')';
        this.tabSelf.link = 'live-control/' + this.liveId;
        this.tabSelf.update();
      }));
    }));
  }

  ngOnDestroy() {
    for (let s of this.subscriptions)
      s.unsubscribe();
  }

}
