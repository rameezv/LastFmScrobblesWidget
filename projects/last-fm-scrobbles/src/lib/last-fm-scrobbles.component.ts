import { Component, OnInit, Input } from '@angular/core';
import { LastFmScrobblesService } from './last-fm-scrobbles.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LastFmTrack } from './interfaces';
import { ENCODED_SPOTIFY_LOGO } from './spotify-logo';

function hexToRgba(hexCode: string, opacity: number){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexCode)){
      c = hexCode.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')},${(opacity / 100).toString()})`;
  }
  throw new Error('Bad Hex');
}

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
  @Input() accentColor: string = '#FF6E6E';
  recentTracks$: Observable<LastFmTrack[]>;
  recentlyPlayedTracks$: Observable<LastFmTrack[]>;
  latestTrack$: Observable<LastFmTrack>;
  isNowPlaying$: Observable<boolean>;
  expandRecent = false;
  audioPlayer = new Audio();
  spotifyLogo = ENCODED_SPOTIFY_LOGO;

  get darkAccentColor() {
    return hexToRgba(this.accentColor, 15);
  }

  get medAccentColor() {
    return hexToRgba(this.accentColor, 25);
  }

  get brightAccentColor() {
    return hexToRgba(this.accentColor, 35);
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
