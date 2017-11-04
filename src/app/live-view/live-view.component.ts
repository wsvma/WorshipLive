import { LiveController } from '../../models/live-control';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Subscription } from 'rxjs/Rx';
import { LiveSessionService } from '../live-session.service';
import { ActivatedRoute } from '@angular/router';
import { LiveSession } from '../../models/live-session';
import { Tab, TabControlService } from '../tab-control.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit, OnDestroy {

  tab: Tab;
  liveId;
  worship: Worship;
  liveSession: LiveSession;
  subscriptions: Subscription[] = [];

  constructor(private tabService: TabControlService,
              private liveSessionService: LiveSessionService,
              private worshipService: WorshipsService,
              private route: ActivatedRoute) {
    this.tab = this.tabService.getTab('live-view');
  }

  updateTab() {
    this.tab.isActive = true;
    this.tab.update();
  }

  onAttached() {
    this.updateTab();
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.liveSessionService.get(this.liveId).subscribe((live : LiveSession) => {
      this.liveSession = live;
      this.subscriptions.push(this.worshipService.get(live.worshipId).subscribe((worship : Worship) => {
        this.worship = worship;
        this.updateTab();
      }));
    }));
  }

  ngOnDestroy() {
    for (let s of this.subscriptions)
      s.unsubscribe();
  }
}
