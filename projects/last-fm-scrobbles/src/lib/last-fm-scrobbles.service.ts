import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { LastFmTrack } from './interfaces';
import { catchError, filter, map, shareReplay, switchMap, take } from 'rxjs/operators';

const POLL_INTERVAL_MS = 20000;

@Injectable()
export class LastFmScrobblesService implements OnDestroy {
  RECENT_TRACKS_URL = '';

  recentTracks$$: BehaviorSubject<LastFmTrack[]> = new BehaviorSubject([]);
  // Emits the current Spotify auth token once we have one. Empty string means "not yet authed".
  private authToken$$ = new BehaviorSubject<string>('');
  // Cache the Observable itself (not just the resolved value) so repeated calls
  // from templates return a stable reference and the async pipe doesn't
  // re-subscribe / re-fetch on every change-detection cycle.
  private spotifyInfoCache = new Map<string, Observable<any>>();

  private pollHandle: ReturnType<typeof setInterval> | null = null;
  private visibilityListener?: () => void;

  constructor(private http: HttpClient) {}

  init(username: string, apiKey: string, spotifyClientId?: string, spotifyClientSecret?: string): void {
    this.RECENT_TRACKS_URL =
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=10`;
    this.startPolling();

    if (spotifyClientId && spotifyClientSecret) {
      this.authSpotify(spotifyClientId, spotifyClientSecret).subscribe(
        (response: {access_token: string}) => { this.authToken$$.next(response.access_token); },
        () => { /* Ignore auth errors; Spotify features simply stay disabled. */ },
      );
    }
  }

  private startPolling(): void {
    this.stopPolling();
    this.getRecentTracks();
    this.pollHandle = setInterval(() => this.getRecentTracks(), POLL_INTERVAL_MS);
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      this.visibilityListener = () => {
        // When the tab returns to the foreground, refresh immediately so the
        // UI catches up without waiting for the next interval tick.
        if (!document.hidden) {
          this.getRecentTracks();
        }
      };
      document.addEventListener('visibilitychange', this.visibilityListener);
    }
  }

  private stopPolling(): void {
    if (this.pollHandle !== null) {
      clearInterval(this.pollHandle);
      this.pollHandle = null;
    }
    if (this.visibilityListener && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityListener);
      this.visibilityListener = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  getRecentTracks(): void {
    // Skip polling when the tab is backgrounded — it's wasted bandwidth
    // and the UI will refresh again on `visibilitychange`.
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }
    if (!this.RECENT_TRACKS_URL) {
      return;
    }
    this.http.get(this.RECENT_TRACKS_URL).subscribe(
      (response: {recenttracks: {track: LastFmTrack[]}}) => {
        const tracks = response && response.recenttracks && response.recenttracks.track;
        if (tracks) {
          this.recentTracks$$.next(tracks);
        }
      },
      () => { /* Swallow errors so a transient failure doesn't break the widget. */ },
    );
  }

  getSpotifyInfo(track: LastFmTrack): Observable<any> {
    if (!track || !track.url) {
      return EMPTY;
    }
    const cached = this.spotifyInfoCache.get(track.url);
    if (cached) {
      return cached;
    }
    const query = encodeURIComponent(`${track.artist['#text']} - ${track.name}`);
    const request$ = this.authToken$$.pipe(
      filter(token => !!token),
      take(1),
      switchMap(token => {
        const url = `https://api.spotify.com/v1/search?q=${query}&type=track`;
        const headers = { 'Authorization': 'Bearer ' + token };
        return this.http.get(url, { headers }).pipe(
          map((response: {tracks: {items: any[]}}) => response.tracks && response.tracks.items ? response.tracks.items[0] : null),
        );
      }),
      catchError(() => of(null)),
      shareReplay(1),
    );
    this.spotifyInfoCache.set(track.url, request$);
    return request$;
  }

  authSpotify(clientId: string, clientSecret: string) {
    const headers = {
      'Authorization': 'Basic ' + (btoa(clientId + ':' + clientSecret)),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    return this.http.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {headers});
  }

  get recentTracks$(): Observable<LastFmTrack[]> {
    return this.recentTracks$$.asObservable();
  }
}
