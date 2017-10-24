import { WorshipsServiceProvider } from './worships.service.provider';
import { SongsServiceProvider } from './songs.service.provider';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { CustomReuseStrategy } from './custom.reusestrategy';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DataTableModule } from 'angular-4-data-table';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { SongsComponent } from './songs/songs.component';
import { WorshipComponent } from './worship/worship.component';
import { SongEditComponent } from './song-edit/song-edit.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    path: 'worship',
    component: WorshipComponent
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DataTableModule,
    BootstrapModalModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    SongsServiceProvider,
    WorshipsServiceProvider,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class AppModule { }
