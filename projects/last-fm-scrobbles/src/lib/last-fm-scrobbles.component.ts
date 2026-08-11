import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LastFmScrobblesService } from './last-fm-scrobbles.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LastFmTrack } from './interfaces';
import { ENCODED_SPOTIFY_LOGO } from './spotify-logo';

const HEX_COLOR_RE = /^#([A-Fa-f0-9]{3}){1,2}$/;

// Expands #rgb → #rrggbb; returns null if the input isn't a valid hex colour.
function normaliseHex(hex: string): string | null {
  if (!hex || !HEX_COLOR_RE.test(hex)) {
    return null;
  }
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

function hexToRgba(hexCode: string, opacity: number): string {
  const normalised = normaliseHex(hexCode);
  const alpha = (opacity / 100).toString();
  if (!normalised) {
    return `rgba(0,0,0,${alpha})`;
  }
  const c = parseInt(normalised.substring(1), 16);
  return `rgba(${(c >> 16) & 255},${(c >> 8) & 255},${c & 255},${alpha})`;
}

function blendColours(baseColor: string, colorToMix: string, opacity: number): string {
  const base = normaliseHex(baseColor);
  const mix = normaliseHex(colorToMix);
  if (!base || !mix) {
    return base || '#000000';
  }
  const baseNum = parseInt(base.substring(1), 16);
  const mixNum = parseInt(mix.substring(1), 16);
  const rBase = (baseNum >> 16) & 0xFF;
  const gBase = (baseNum >> 8) & 0xFF;
  const bBase = baseNum & 0xFF;
  const rMix = (mixNum >> 16) & 0xFF;
  const gMix = (mixNum >> 8) & 0xFF;
  const bMix = mixNum & 0xFF;
  const factor = opacity * 2.55 / 100;
  const clamp = (n: number) => Math.min(255, Math.max(0, n));
  const rNew = clamp(rBase - Math.floor((rBase - rMix) * factor));
  const gNew = clamp(gBase - Math.floor((gBase - gMix) * factor));
  const bNew = clamp(bBase - Math.floor((bBase - bMix) * factor));
  return `#${((1 << 24) | (rNew << 16) | (gNew << 8) | bNew).toString(16).slice(1)}`;
}

@Component({
  selector: 'last-fm-scrobbles',
  templateUrl: './last-fm-scrobbles.component.html',
  styleUrls: ['./last-fm-scrobbles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastFmScrobblesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() apiKey: string;
  @Input() username: string;
  @Input() spotifyClientId: string;
  @Input() spotifyClientSecret: string;
  @Input() theme: 'black'|'white' = 'black';
  @Input() accentColor: string = '#FF6E6E';
  @Input() backgroundColor?: string;

  recentTracks$: Observable<LastFmTrack[]>;
  recentlyPlayedTracks$: Observable<LastFmTrack[]>;
  latestTrack$: Observable<LastFmTrack | null>;
  isNowPlaying$: Observable<boolean>;

  expandRecent = false;
  audioPlayer = new Audio();
  spotifyLogo = ENCODED_SPOTIFY_LOGO;

  // Precomputed derived colours. These only need to change when `theme`,
  // `accentColor`, or `backgroundColor` changes, so we compute them once
  // in ngOnChanges instead of on every change-detection tick.
  darkAccentColor = '';
  medAccentColor = '';
  brightAccentColor = '';
  bgColor = '#000000';
  accentBackground = '';
  bgGradient = '';

  private readonly onAudioStateChange = () => this.cdr.markForCheck();
  private readonly onAudioEnded = () => {
    this.audioPlayer.src = '';
    this.cdr.markForCheck();
  };

  constructor(
    private lastFmScrobblesService: LastFmScrobblesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refreshColors();

    this.recentTracks$ = this.lastFmScrobblesService.recentTracks$.pipe(
      shareReplay(1),
    );
    this.latestTrack$ = this.recentTracks$.pipe(
      map(tracks => (tracks && tracks.length > 0) ? tracks[0] : null),
      shareReplay(1),
    );
    this.recentlyPlayedTracks$ = this.recentTracks$.pipe(
      map(tracks => tracks ? tracks.slice(1) : []),
      shareReplay(1),
    );
    this.isNowPlaying$ = this.latestTrack$.pipe(
      map(track => !!(track && track['@attr'] && track['@attr'].nowplaying === 'true')),
    );

    this.lastFmScrobblesService.init(this.username, this.apiKey, this.spotifyClientId, this.spotifyClientSecret);

    this.audioPlayer.addEventListener('play', this.onAudioStateChange);
    this.audioPlayer.addEventListener('pause', this.onAudioStateChange);
    this.audioPlayer.addEventListener('error', this.onAudioStateChange);
    this.audioPlayer.addEventListener('ended', this.onAudioEnded);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['theme'] || changes['accentColor'] || changes['backgroundColor']) {
      this.refreshColors();
    }
  }

  ngOnDestroy(): void {
    this.audioPlayer.pause();
    this.audioPlayer.src = '';
    this.audioPlayer.removeEventListener('play', this.onAudioStateChange);
    this.audioPlayer.removeEventListener('pause', this.onAudioStateChange);
    this.audioPlayer.removeEventListener('error', this.onAudioStateChange);
    this.audioPlayer.removeEventListener('ended', this.onAudioEnded);
  }

  private refreshColors(): void {
    this.bgColor = this.backgroundColor
      ? this.backgroundColor
      : (this.theme === 'white' ? '#ffffff' : '#000000');
    this.darkAccentColor = hexToRgba(this.accentColor, 15);
    this.medAccentColor = hexToRgba(this.accentColor, 25);
    this.brightAccentColor = hexToRgba(this.accentColor, 35);
    this.accentBackground = blendColours(this.bgColor, this.accentColor, 15);
    this.bgGradient =
      `linear-gradient(0deg, ${hexToRgba(this.bgColor, 100)} 0%, `
      + `${hexToRgba(this.bgColor, 70)} 25%, `
      + `${hexToRgba(this.bgColor, 0)} 100%)`;
  }

  getSpotifyInfoForTrack(track: LastFmTrack) {
    return this.lastFmScrobblesService.getSpotifyInfo(track);
  }

  trackByTrackUrl(index: number, track: LastFmTrack): string {
    return track && track.url ? track.url : String(index);
  }

  playAudio(audioUrl: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!audioUrl) {
      return;
    }
    if (audioUrl !== this.audioPlayer.src) {
      this.audioPlayer.pause();
      this.audioPlayer.src = audioUrl;
      this.audioPlayer.load();
      this.startPlayback();
    } else if (this.audioPlayer.paused) {
      this.startPlayback();
    } else {
      this.audioPlayer.pause();
    }
  }

  private startPlayback(): void {
    const result = this.audioPlayer.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.cdr.markForCheck());
    }
  }

  get currentAudio() {
    return this.audioPlayer.src;
  }

  get audioPlaying() {
    return !this.audioPlayer.paused;
  }
}
