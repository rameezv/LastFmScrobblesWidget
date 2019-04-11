import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule, MatIconModule } from '@angular/material';
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
    CommonModule,
    HttpClientModule
  ],
  exports: [LastFmScrobblesComponent],
  providers: [LastFmScrobblesService],
})
export class LastFmScrobblerModule { }
