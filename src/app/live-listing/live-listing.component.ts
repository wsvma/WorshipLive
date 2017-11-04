import { Router } from '@angular/router';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { TabControlService } from '../tab-control.service';
import { Subscription } from 'rxjs/Rx';
import { LiveSession } from '../../models/live-session';
import { LiveSessionService } from '../live-session.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-listing',
  templateUrl: './live-listing.component.html',
  styleUrls: ['./live-listing.component.css']
})
export class LiveListingComponent implements OnInit {

  liveSessions: LiveSession[];
  subscription: Subscription;

  constructor(
    private tabService: TabControlService,
    private liveSessionService: LiveSessionService,
    private worshipService: WorshipsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.liveSessionService.find().subscribe((liveSessions: LiveSession[]) => {
      this.liveSessions = liveSessions;
    });
  }

  onAttached() {
    this.updateTab();
  }

  updateTab() {
    this.tabService.updateTab({
      id: 'live',
      display: 'Live Sessions',
      isActive: true,
      link: 'live',
      fullscreen: false,
    });
  }

  navigateWorship(live : LiveSession) {
    this.router.navigateByUrl('worship/' + live.worshipId);
  }

  navigateControl(live : LiveSession) {
    this.router.navigateByUrl('live-control/' + live._id);
  }

  navigateWatch(live) {

  }

  unlive(liveSession : LiveSession, index : number) {
    let sub = this.worshipService.get(liveSession.worshipId).subscribe((worship : Worship) => {
      worship.liveId = '';
      worship.update().then((w) => {
        this.liveSessionService.remove([this.liveSessions[index]]);
        sub.unsubscribe();
      });
    })

  }
}
