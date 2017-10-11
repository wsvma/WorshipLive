import { SongsService } from './songs.service';
import { FeatherService } from './feather.service';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as io from 'socket.io-client';
import * as feathers from 'feathers-client';

import { AppComponent } from './app.component';
import { SongsComponent } from './songs/songs.component';
import { WorshipComponent } from './worship/worship.component';

const ROUTES = [
  {
    path: '',
    redirectTo: 'songs', 
    pathMatch: 'full'
  },
  {
    path: 'songs', 
    component: SongsComponent 
  },
  { 
    path: 'worship', 
    component: WorshipComponent 
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SongsComponent,
    WorshipComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [ FeatherService, SongsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
