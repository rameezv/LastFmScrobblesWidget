import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LastFmScrobblerModule } from 'projects/last-fm-scrobbles/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LastFmScrobblerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
