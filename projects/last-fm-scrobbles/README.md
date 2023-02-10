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

  `<last-fm-scrobbles username="bigtreeworld" [apiKey]="lastFmApiKey"></last-fm-scrobbles>`

  - The component takes 2 inputs:
    - `username`: a `string` containing the user's last.fm username
    - `apiKey`: a `string` containing your Last.fm API Key. If you don't have one yet, visit the [Last.fm API account creation page](https://www.last.fm/api/account/create) and get one. It's really fast and simple.
  - Both of these inputs are required for the widget to work correctly.

- A sans-serif font style is recommended

## Upcoming additions:
- Tests
- Change accent color
- Light mode
- Music sample streaming from Spotify API
- Music streaming links for tracks
- Configurable number of tracks
- Configurable refresh rate
- Custom background color
- Deduping tracks (especially the most recent track)
- _Your feature here_ - if you have any ideas, please feel free to contribute or make a feature request by opening an issue on GitHub

## Build

Run `ng build last-fm-scrobbles --configuration production` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build last-fm-scrobbles`, go to the dist folder `cd dist/last-fm-scrobbles` and run `npm publish`.
