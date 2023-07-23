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
  theme: 'white'|'black' = 'black';
  backgroundColor = '#000000';
  accentColor = '#BF40BF';
  customColor?: string;

  get bgColor() {
    if (this.customColor) return this.customColor;
    return this.theme === 'black' ? '#000000' : '#ffffff';
  }

  toggleTheme() {
    if (this.theme === 'white') {
      this.theme = 'black';
    } else {
      this.theme = 'white';
    }
  }
}
