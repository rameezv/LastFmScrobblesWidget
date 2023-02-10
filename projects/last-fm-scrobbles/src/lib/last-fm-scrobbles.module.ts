import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { LastFmScrobblesComponent } from './last-fm-scrobbles.component';
import { LastFmScrobblesService } from './last-fm-scrobbles.service';
import { LastFmInternalEqComponent } from './equalizer.component';

@NgModule({
  declarations: [
    LastFmScrobblesComponent,
    LastFmInternalEqComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatRippleModule,
    MatIconModule,
    BrowserModule,
    HttpClientModule
  ],
  exports: [LastFmScrobblesComponent],
  providers: [LastFmScrobblesService],
})
export class LastFmScrobblesModule { }
