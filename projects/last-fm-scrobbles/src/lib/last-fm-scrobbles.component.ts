import { Component, OnInit, Input } from '@angular/core';
import { LastFmScrobblesService } from './last-fm-scrobbles.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LastFmTrack } from './interfaces';
import { ENCODED_SPOTIFY_LOGO } from './spotify-logo';

@Component({
  selector: 'last-fm-scrobbles',
  templateUrl: './last-fm-scrobbles.component.html',
  styleUrls: ['./last-fm-scrobbles.component.scss']
})
export class LastFmScrobblesComponent implements OnInit {
  @Input() apiKey: string;
  @Input() username: string;
  @Input() spotifyClientId: string;
  @Input() spotifyClientSecret: string;
  @Input() theme: 'black'|'white' = 'black';
  accentColor = 'rgba(255, 110, 110, 0.15)'; // TODO: turn this into an input
  recentTracks$: Observable<LastFmTrack[]>;
  recentlyPlayedTracks$: Observable<LastFmTrack[]>;
  latestTrack$: Observable<LastFmTrack>;
  isNowPlaying$: Observable<boolean>;
  expandRecent = false;
  audioPlayer = new Audio();
  spotifyLogo = ENCODED_SPOTIFY_LOGO;

  get isLightTheme() {
    return this.theme === 'white';
  }

  constructor(private lastFmScrobblesService: LastFmScrobblesService) {}
  ngOnInit(): void {
    this.recentTracks$ = this.lastFmScrobblesService.recentTracks$;
    this.recentlyPlayedTracks$ = this.recentTracks$.pipe(
      map(tracks => tracks.filter((_, i) => i > 0)),
    );
    this.latestTrack$ = this.recentTracks$.pipe(
      map(tracks => tracks ? tracks[0] : null)
    );
    this.isNowPlaying$ = this.latestTrack$.pipe(
      map(track => track['@attr'] ? track['@attr'].nowplaying === 'true' : false)
    );
    this.lastFmScrobblesService.init(this.username, this.apiKey, this.spotifyClientId, this.spotifyClientSecret);
    this.audioPlayer.onended = () => {
      this.audioPlayer.src = '';
    }
  }

  getSpotifyInfoForTrack(track: LastFmTrack) {
    return this.lastFmScrobblesService.getSpotifyInfo(track);
  }

  playAudio(audioUrl: string, event) {
    if (audioUrl !== this.audioPlayer.src) {
      this.audioPlayer.pause();
      this.audioPlayer.src = audioUrl;
      this.audioPlayer.load();
      this.audioPlayer.play();
    } else {
      if(this.audioPlayer.paused) {
        this.audioPlayer.play();
      } else {
        this.audioPlayer.pause();
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  get currentAudio() {
    return this.audioPlayer.src;
  }

  get audioPlaying() {
    return !this.audioPlayer.paused;
  }
}
