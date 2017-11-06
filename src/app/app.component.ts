import { LiveSession } from '../models/live-session';
import { LiveSessionService } from './live-session.service';
import { LiveViewComponent } from './live-view/live-view.component';
import { Tab, TabControlService } from './tab-control.service';
import { WorshipComponent } from './worship/worship.component';
import { SongsComponent } from './songs/songs.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  tabs: Tab[];
  hideTab: boolean = false;
  outletStyle = {};

  constructor(private tabControlService: TabControlService) {
    this.tabs = this.tabControlService.snapshot;
  }

  ngOnInit() {
    this.tabControlService.tabs.subscribe(tabs => {
      this.tabs = []
      for (let t of tabs) {
        this.tabs.push(t.clone());
        if (t.isActive)
          this.hideTab = t.fullscreen;
      }
      let padding = this.hideTab ? '0' : '10px 10px 18px 10px';
      this.outletStyle['margin'] = padding;
    });
  }

  onComponentAttached($event) {
    $event.onAttached();
  }
}
