import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LastFmTrack } from './interfaces';

@Injectable()
export class LastFmScrobblesService {
  RECENT_TRACKS_URL = '';

  recentTracks$$: BehaviorSubject<LastFmTrack[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  init(username: string, apiKey: string): void {
    this.RECENT_TRACKS_URL =
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=10`;
    this.getRecentTracks();
    // Check every 20 seconds
    window.setInterval(this.getRecentTracks.bind(this), 20000);
  }

  getRecentTracks(): void {
    this.http.get(this.RECENT_TRACKS_URL).subscribe((response: {recenttracks: {track: LastFmTrack[]}}) => {
      this.recentTracks$$.next(response.recenttracks.track);
    });
  }

  get recentTracks$(): Observable<LastFmTrack[]> {
    return this.recentTracks$$.asObservable();
  }
}
