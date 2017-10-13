import { CustomReuseStrategy } from './custom.reusestrategy';
import { SongsService } from './songs.service';
import { FeatherService } from './feather.service';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DataTableModule } from 'angular-4-data-table';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as io from 'socket.io-client';
import * as feathers from 'feathers-client';

import { AppComponent } from './app.component';
import { SongsComponent } from './songs/songs.component';
import { WorshipComponent } from './worship/worship.component';
import { SongEditComponent } from './song-edit/song-edit.component';

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
    path: 'songs/:id',
    component: SongEditComponent
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
    SongEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DataTableModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    FeatherService,
    SongsService,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
