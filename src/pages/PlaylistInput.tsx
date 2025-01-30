import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { extractPlaylistId, fetchPlaylistTracks } from '../utils/spotify';
import type { Song } from '../types';
import cards from '../assets/cards.jpeg'

interface PlaylistInputProps {
  onPlaylistLoad: (songs: Song[]) => void;
  onBack?: () => void;
}

export function PlaylistInput({ onPlaylistLoad, onBack }: PlaylistInputProps) {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const playlistId = extractPlaylistId(playlistUrl);
      const songs = await fetchPlaylistTracks(playlistId);
      onPlaylistLoad(songs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1DB954]/10 via-white to-[#1DB954]/5 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1ed760]">
            Blind Song Scanner
          </h1>
          <h2 className="mt-2 text-2xl sm:text-2xl font-bold text-gray-600">
            Generator
          </h2>
        </div>

        <div className="mt-8">
          <div className="rounded-lg bg-white shadow-lg px-4 sm:px-6 py-3 sm:py-4">
            <p className="mb-4 text-sm text-gray-600 text-justify">
              Enter a Spotify playlist URL to generate printable song tiles.
              The tiles will have the artist, title and year on one side.
              On the other side, a QR code referring to the Spotify track.
            </p>
            <p className="mb-4 text-sm text-gray-600">
              Got here by accident? <a className="text-[#1DB954] font-bold hover:text-[#1ed760]" href="https://www.blindsongscanner.com">Read more here</a>.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="playlist"
                  className="block text-sm font-medium text-gray-700"
                >
                  Playlist URL
                </label>
                <div className="mt-1">
                  <input
                    id="playlist"
                    type="text"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="spotify:playlist:... or URL"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1DB954] focus:border-[#1DB954] text-xs sm:text-sm"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !playlistUrl.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#1DB954] hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Loading...' : 'Import Playlist'}
              </button>
            </form>

            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-xs sm:text-sm text-gray-500">
                    Supported formats
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <ul className="text-xs text-gray-500 space-y-1 sm:space-y-2">
                  <li>• Spotify URL (https://open.spotify.com/playlist/...)</li>
                  <li>• Spotify URI (spotify:playlist:...)</li>
                  <li>• Playlist ID</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <img
              src={cards}
              alt="Example of printed song tiles with QR codes"
              className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
            />
            <p className="text-center text-xs text-gray-500 mt-2">
              Examples of printed song tiles with QR codes on the back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}