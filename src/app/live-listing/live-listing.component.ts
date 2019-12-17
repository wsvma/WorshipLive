import { Router } from '@angular/router';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { Tab, TabControlService } from '../tab-control.service';
import { Subscription } from 'rxjs';
import { LiveSession } from '../../models/live-session';
import { LiveSessionService } from '../live-session.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-listing',
  templateUrl: './live-listing.component.html',
  styleUrls: ['./live-listing.component.css']
})
export class LiveListingComponent implements OnInit {

  tabSelf: Tab;
  tabControl: Tab;
  liveSessions: LiveSession[];
  subscription: Subscription;

  constructor(
    private tabService: TabControlService,
    private liveSessionService: LiveSessionService,
    private worshipService: WorshipsService,
    private router: Router
  ) {
    this.tabSelf = this.tabService.getTab('live');
    this.tabControl = this.tabService.getTab('live-control');
  }

  ngOnInit() {
    this.subscription = this.liveSessionService.find().subscribe((liveSessions: LiveSession[]) => {
      this.liveSessions = liveSessions;
    });
  }

  onAttached() {
    this.updateTab();
  }

  updateTab() {
    this.tabSelf.isActive = true;
    this.tabSelf.isHidden = false;
    this.tabSelf.update();
    this.tabControl.isActive = false;
    this.tabControl.isHidden = true;
    this.tabControl.update();
  }

  navigateWorship(live : LiveSession) {
    this.router.navigateByUrl('worship/' + live.worshipId);
  }

  navigateControl(live : LiveSession) {
    this.router.navigateByUrl('live-control/' + live._id);
  }

  navigateWatch(live) {
    window.open('live/' + live._id);
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
