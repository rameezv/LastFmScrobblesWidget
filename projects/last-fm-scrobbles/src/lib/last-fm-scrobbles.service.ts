import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LastFmTrack } from './interfaces';
import { switchMap, tap, map, take } from 'rxjs/operators';
import { zip, of } from 'rxjs';

@Injectable()
export class LastFmScrobblesService {
  RECENT_TRACKS_URL = '';

  recentTracks$$: BehaviorSubject<LastFmTrack[]> = new BehaviorSubject([]);
  authToken = '';
  cachedSpotifyInfo = {};

  constructor(private http: HttpClient) {}

  init(username: string, apiKey: string, spotifyClientId?: string, spotifyClientSecret?): void {
    this.RECENT_TRACKS_URL =
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=10`;
    this.getRecentTracks();
    // Check every 20 seconds
    window.setInterval(this.getRecentTracks.bind(this), 20000);
    if (spotifyClientId && spotifyClientSecret) {
      this.authSpotify(spotifyClientId, spotifyClientSecret).subscribe(
        (response: {access_token: string}) => {this.authToken = response.access_token},
      );
    }
  }

  getRecentTracks(): void {
    this.http.get(this.RECENT_TRACKS_URL).subscribe((response: {recenttracks: {track: LastFmTrack[]}}) => {
      this.recentTracks$$.next(response.recenttracks.track);
    });
  }

  getSpotifyInfo(track: LastFmTrack) {
    if (this.cachedSpotifyInfo[track.url]) {
      return of(this.cachedSpotifyInfo[track.url]);
    }
    const spotifyLookupUrl =`https://api.spotify.com/v1/search?q=${track.artist['#text']}%20-%20${track.name}&type=track`;
    const headers = {
      'Authorization': 'Bearer ' + this.authToken,
    }
    return this.http.get(spotifyLookupUrl, {headers}).pipe(
      take(1),
      map((response: {tracks: {items: {}[]}}) => response.tracks.items[0]),
      tap((response) => {
        this.cachedSpotifyInfo[track.url] = response;
      }),
    );
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
