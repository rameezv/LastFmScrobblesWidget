# Last.fm Scrobbles Widget

A widget to display a Last.fm user's recently scrobbled tracks, as well as the currently playing track if there is one.

## Demo

![Screenshot](https://i.imgur.com/UoZhZRg.png)

A live demo can be seen on my [personal website](https://rameez.me).

## Usage

### Setup

- If you don't already have it in your project, install @angular/material as per the instructions in [Step 1 of Angular Material Getting Started guide](https://material.angular.io/guide/getting-started#step-1-install-angular-material-angular-cdk-and-angular-animations).
- Make sure you have included a material theme (the default indigo-pink one is fine), as well as the material icons webfont, as per the instructions in [Steps 4 and 6 of the Angular Material Getting Started guide](https://material.angular.io/guide/getting-started#step-4-include-a-theme)

### Using the component

- In your Angular module, import the `LastFmScrobblesModule`:

  `import { LastFmScrobblesModule } from 'angular-last-fm-scrobbles';`

- Add the `last-fm-scrobbles` component to your template:

  `<last-fm-scrobbles username="bigtreeworld" [apiKey]="lastFmApiKey" theme="white" accentColor="BF40BFBF40BF"></last-fm-scrobbles>`

  - The component has 2 required inputs:
    - `username`: a `string` containing the user's last.fm username
    - `apiKey`: a `string` containing your Last.fm API Key. If you don't have one yet, visit the [Last.fm API account creation page](https://www.last.fm/api/account/create) and get one. It's really fast and simple.
  - Spotify integration can be enabled by passing values into the following inputs:
    - `spotifyClientId`: a `string` with your client ID
    - `spotifyClientSecret`: `string` with your client secret
    - Visit https://developer.spotify.com/dashboard to get your own client id and secret
    - This will enable preview clips and Spotify links
  - Theming: the following optional inputs allow for theming the widget:
    - `accentColor` takes a color in _hex_ form. This is used for backgrounds/highlights and the equalizer. Defaults to `'#FF6E6E'`.
    - `theme` can be set to either `'black'` (default) or `'white'` which will change the widget colour scheme.
    - `backgroundColor` takes a color in _hex_ form. Set this to a custom colour if this widget is beign used on a background that is not #000000 for the `black` theme and #ffffff for the `white` theme.

- A sans-serif font style is recommended

## Upcoming additions:

- Tests
- Music streaming links for tracks
- Configurable number of tracks
- Configurable refresh rate
- Deduping tracks (especially the most recent track)
- _Your feature here_ - if you have any ideas, please feel free to contribute or make a feature request by opening an issue on GitHub

## Build

Run `ng build last-fm-scrobbles --configuration production` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build last-fm-scrobbles`, go to the dist folder `cd dist/last-fm-scrobbles` and run `npm publish`.
