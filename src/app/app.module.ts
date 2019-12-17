import { LiveSessionServiceProvider } from './live-session.service.provider';
import { SharedStateService } from './shared-state.service';
import { MyRouterOutlet } from './my-router-outlet';
import { TabControlService } from './tab-control.service';
import { WorshipsServiceProvider } from './worships.service.provider';
import { SongsServiceProvider } from './songs.service.provider';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { CustomReuseStrategy } from './custom.reusestrategy';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DataTableModule } from 'angular5-data-table';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'angular-sortablejs';

import { AppComponent } from './app.component';
import { SongsComponent } from './songs/songs.component';
import { WorshipComponent } from './worship/worship.component';
import { SongEditComponent } from './song-edit/song-edit.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorshipEditComponent } from './worship-edit/worship-edit.component';
import { WorshipViewerComponent } from './worship-viewer/worship-viewer.component';
import { LiveControlComponent } from './live-control/live-control.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { LiveListingComponent } from './live-listing/live-listing.component';

const ROUTES = [
  {
    path: 'songs/:id',
    component: SongEditComponent
  },
  {
    path: 'songs',
    component: SongsComponent
  },
  {
    path: 'worship/:id',
    component: WorshipEditComponent
  },
  {
    path: 'worship',
    component: WorshipComponent
  },
  {
    path: 'live-control/:id',
    component: LiveControlComponent
  },
  {
    path: 'live/:id',
    component: LiveViewComponent
  },
  {
    path: 'live',
    component: LiveListingComponent
  },
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SongsComponent,
    WorshipComponent,
    SongEditComponent,
    ConfirmDialogComponent,
    WorshipEditComponent,
    MyRouterOutlet,
    WorshipViewerComponent,
    LiveControlComponent,
    LiveViewComponent,
    LiveListingComponent,
  ],
  imports: [
    SortablejsModule,
    BrowserModule,
    FormsModule,
    DataTableModule,
    BootstrapModalModule.forRoot({container:document.body}),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    SongsServiceProvider,
    WorshipsServiceProvider,
    LiveSessionServiceProvider,
    TabControlService,
    SharedStateService,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class AppModule { }
