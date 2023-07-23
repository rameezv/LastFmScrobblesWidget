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

function blendColours(baseColor: string, colorToMix: string, opacity: number) {
  const baseNum = parseInt(baseColor.replace("#",""),16);
  let rBase = (baseNum >> 16);
  let gBase = (baseNum >> 8 & 0x00FF);
  let bBase = (baseNum & 0x0000FF);
  const mixNum = parseInt(colorToMix.replace("#",""),16);
  let rMix = (mixNum >> 16);
  let gMix = (mixNum >> 8 & 0x00FF);
  let bMix = (mixNum & 0x0000FF);

  const rDiff = Math.abs(rBase - rMix);
  const gDiff = Math.abs(gBase - gMix);
  const bDiff = Math.abs(bBase - bMix);

  const rNew = rBase + Math.floor(rDiff*(opacity*2.55/100));
  const gNew = gBase + Math.floor(gDiff*(opacity*2.55/100));
  const bNew = bBase + Math.floor(bDiff*(opacity*2.55/100));

  return "#" + (0x1000000 + (rNew<255?rNew<1?0:rNew:255)*0x10000 + (gNew<255?gNew<1?0:gNew:255)*0x100 + (bNew<255?bNew<1?0:bNew:255)).toString(16).slice(1);
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
  @Input() backgroundColor?: string;
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


  get bgColor() {
    if (this.backgroundColor) {
      return this.backgroundColor;
    }
    if (this.theme === 'white') {
      return '#ffffff'
    }
    return '#000000';
  }

  get accentBackground() {
    return blendColours(this.bgColor, this.accentColor, 15);
  }

  get bgGradient() {
    return `linear-gradient(0deg, ${hexToRgba(this.bgColor, 100)} 0%,  ${hexToRgba(this.bgColor, 70)} 25%, ${hexToRgba(this.bgColor, 0)} 100%)`
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
