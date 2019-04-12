import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LastFmScrobblesModule } from 'projects/last-fm-scrobbles/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LastFmScrobblesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
