import { Component, OnInit, Input } from '@angular/core';
import { LastFmScrobblesService } from './last-fm-scrobbles.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LastFmTrack } from './interfaces';

@Component({
  selector: 'last-fm-scrobbles',
  templateUrl: './last-fm-scrobbles.component.html',
  styleUrls: ['./last-fm-scrobbles.component.scss']
})
export class LastFmScrobblesComponent implements OnInit {
  @Input() apiKey: string;
  @Input() username: string;
  accentColor = 'rgba(255, 110, 110, 0.15)'; // TODO: turn this into an input
  recentTracks$: Observable<LastFmTrack[]>;
  recentlyPlayedTracks$: Observable<LastFmTrack[]>;
  latestTrack$: Observable<LastFmTrack>;
  isNowPlaying$: Observable<boolean>;
  expandRecent = false;

  constructor(private lastFmScrobblesService: LastFmScrobblesService) {}
  ngOnInit(): void {
    this.recentTracks$ = this.lastFmScrobblesService.recentTracks$;
    this.recentlyPlayedTracks$ = this.recentTracks$.pipe(
      map(tracks => tracks.filter((_, i) => i > 0))
    );
    this.latestTrack$ = this.recentTracks$.pipe(
      map(tracks => tracks ? tracks[0] : null)
    );
    this.isNowPlaying$ = this.latestTrack$.pipe(
      map(track => track['@attr'] ? track['@attr'].nowplaying === 'true' : false)
    );
    this.lastFmScrobblesService.init(this.username, this.apiKey);
  }
}
