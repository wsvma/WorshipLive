import { WorshipComponent } from './worship/worship.component';
import { SongsComponent } from './songs/songs.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  tabSelected = 'worship';

  outletActivated($event) {
    this.tabSelected = $event.tab;
  }
}
