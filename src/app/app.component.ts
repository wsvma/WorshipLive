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

  constructor(private tabControlService: TabControlService) {
    this.tabs = this.tabControlService.latest;
  }

  ngOnInit() {
    this.tabControlService.tabs.subscribe(tabs => {
      this.tabs = tabs;
    });
  }

  onComponentAttached($event) {
    $event.component.updateTab();
  }

  onComponentActivated($event) {
    $event.updateTab();
  }
}
