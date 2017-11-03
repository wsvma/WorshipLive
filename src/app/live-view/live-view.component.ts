import { LiveController } from '../../models/live-control';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Subscription } from 'rxjs/Rx';
import { LiveSessionService } from '../live-session.service';
import { ActivatedRoute } from '@angular/router';
import { LiveSession } from '../../models/live-session';
import { TabControlService } from '../tab-control.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit, OnDestroy {

  liveId;
  worship: Worship;
  liveSession: LiveSession;
  subscriptions: Subscription[] = [];

  constructor(
    private tabService: TabControlService,
    private liveSessionService: LiveSessionService,
    private worshipService: WorshipsService,
    private route: ActivatedRoute) {}

  updateTab() {
    if (!this.worship || !this.liveSession)
      return;

    this.tabService.updateTab({
      id: 'live-view-' + this.liveId,
      display: 'Live (' + this.worship.name + ')',
      isActive: true,
      link: 'live/' + this.liveId,
      fullscreen: true,
    });
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
