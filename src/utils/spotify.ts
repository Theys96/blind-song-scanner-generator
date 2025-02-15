import { SPOTIFY_API_BASE, SPOTIFY_TOKEN_SOURCE } from '../data/config.ts';

export async function getSpotifyToken(): Promise<string> {
  const response = await fetch(`${SPOTIFY_TOKEN_SOURCE}`, {
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
  return data['token'];
}

export function extractPlaylistId(url: string): string {
  const patterns = [
    /spotify:playlist:([a-zA-Z0-9]+)/, // Spotify URI
    /playlist\/([a-zA-Z0-9]+)/, // Web URL
    /^([a-zA-Z0-9]+)$/, // Direct ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  throw new Error('Invalid Spotify playlist URL or ID');
}

export async function fetchPlaylistTracks(playlistId: string): Promise<Song[]> {
  const token = await getSpotifyToken();
  const response = await fetch(
    `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?fields=items(track(uri,name,artists(name),album(release_date)))`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch playlist data');
  }

  const data = await response.json();
  return data.items
    .filter((item: { track: SpotifyTrack | null }) => item.track)
    .map((item: { track: SpotifyTrack }) => ({
      title: item.track.name,
      artist: item.track.artists[0].name,
      year: parseInt(item.track.album.release_date.substring(0, 4), 10),
      spotifyUri: item.track.uri,
    }));
}
