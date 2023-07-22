import { Component } from '@angular/core';
import { apiKey, spotifyClientId, spotifyClientSecret } from 'src/api_keys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiKey = apiKey;
  spotifyClientSecret = spotifyClientSecret;
  spotifyClientId = spotifyClientId;
}
