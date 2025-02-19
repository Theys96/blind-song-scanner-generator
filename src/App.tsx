import React, { useState, useEffect } from 'react';
import { FileDown, ArrowLeft } from 'lucide-react';
import { SongTable } from './components/SongTable';
import { WarningPopUp } from './components/WarningPopUp.tsx';
import { PlaylistInput } from './pages/PlaylistInput';
import { generatePDF } from './utils/pdfGenerator';
import type { Song } from './types';
import { useDebouncedCallback } from 'use-debounce';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [showBackWarning, setShowBackWarning] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('songs') !== null) {
      setSongs(JSON.parse(localStorage.getItem('songs')));
    }
  }, []);

  const saveSongsDebounced = useDebouncedCallback((songs: Song[]) => {
    localStorage.setItem('songs', JSON.stringify(songs));
  }, 500);

  const handleEdit = (
    index: number,
    field: keyof Song,
    value: string | number,
  ) => {
    const newSongs = [...songs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    saveSongsDebounced(newSongs);
    setSongs(newSongs);
  };

  const handlePlaylistLoad = (newSongs: Song[]) => {
    saveSongsDebounced(newSongs);
    setSongs(newSongs);
    setHasPlaylist(true);
  };

  const handleBackWarning = () => {
    setShowBackWarning(true);
  };

  const handleBack = () => {
    setShowBackWarning(false);
    localStorage.removeItem('songs');
    setSongs([]);
  };

  if (songs.length === 0) {
    return <PlaylistInput onPlaylistLoad={handlePlaylistLoad} />;
  }

  const handleGeneratePDF = async () => {
    try {
      const pdf = await generatePDF(songs);
      pdf.save('blind-song-scanner-tiles.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  console.log(showBackWarning);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1DB954]/10 via-white to-[#1DB954]/5 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      {showBackWarning && (
        <WarningPopUp
          onCancel={() => setShowBackWarning(false)}
          onContinue={handleBack}
          message="Going back will lose your changes to the track data. Are you sure?"
        />
      )}
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1DB954] to-[#1ed760]">
            Blind Song Scanner
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Generator</p>
        </div>
        <div className="mb-4 text-xs sm:text-sm text-gray-500 bg-white rounded-lg shadow-lg p-3 sm:p-4">
          Edit the song information below if necessary.
          <span className="font-bold text-red-800">
            &nbsp;Check especially carefully that the year is correct!&nbsp;
          </span>
          Because the year is extracted from the song's album, mistakes easily
          happen. <br />
          Click "Generate PDF" to create printable song tiles. Each tile will be
          6x6cm with the song information on the front and a QR code on the
          back. Make sure to print double-sided.
        </div>
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackWarning}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Imported tracks
              </h1>
            </div>
            <button
              onClick={handleGeneratePDF}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1DB954] hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transition-colors"
            >
              <FileDown className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Generate PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>

          <SongTable songs={songs} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}

export default App;
