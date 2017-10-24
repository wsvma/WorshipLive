import { TabDisplayService } from './tab-display.service';
import { WorshipComponent } from './worship/worship.component';
import { SongsComponent } from './songs/songs.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  tabSelected = 'worship';
  activeTab: any;

  constructor(private tabDisplayService: TabDisplayService) {}

  ngOnInit() {
    this.tabDisplayService.latestTabDisplay.subscribe(newDisplay => {
      if (this.activeTab)
        this.activeTab.text = newDisplay;
    })
  }

  onTabSelected(tab) {
    this.tabSelected = tab.id;
    this.activeTab = tab;
  }

  outletActivated($event) {
    this.tabSelected = $event.tabSelected;
    this.activeTab = document.querySelector('#' + this.tabSelected);
    this.activeTab.text = $event.defaultTabDisplay;
  }
}
