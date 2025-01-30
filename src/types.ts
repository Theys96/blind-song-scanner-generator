export interface Song {
  title: string;
  artist: string;
  year: number;
  spotifyUri: string;
}

export interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    release_date: string;
  };
  uri: string;
}