export interface LastFmTrack {
  '@attr'?: {
    nowplaying?: string
  };
  album: {
    mbid: string;
    '#text': string;
  };
  artist: {
    mbid: string;
    '#text': string;
  };
  image?: {
    size: string;
    '#text': string;
  }[];
  mbid: string;
  name: string;
  streamable?: string;
  url: string;
}
