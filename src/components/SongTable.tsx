import React from 'react';
import { Song } from '../types';
import { Pencil, AlertCircle } from 'lucide-react';

const TEXT_LENGTH_LIMIT = 65;

interface TextInputWithWarningProps extends YearInputProps {
  value: string;
  onChange: (value: string) => void;
  isLong: boolean;
}

const TextInputWithWarning: React.FC<TextInputWithWarningProps> = ({
  value,
  onChange,
  isLong,
}) => {
  return (
    <div className="flex items-center w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full px-2 py-1 text-xs sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
          isLong ? 'bg-amber-50 border-amber-200' : ''
        }`}
      />
      {isLong && (
        <div className="relative group ml-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-xs sm:text-sm text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            Text is too long and may not fit well in the tile
          </div>
        </div>
      )}
      <Pencil className="w-4 h-4 ml-2 text-gray-400" />
    </div>
  );
};

interface SongTableProps {
  songs: Song[];
  onEdit: (index: number, field: keyof Song, value: string | number) => void;
}

export const SongTable: React.FC<SongTableProps> = ({ songs, onEdit }) => {
  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <table className="min-w-full bg-white shadow-md rounded-lg table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-5/12 px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="w-5/12 px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artist
            </th>
            <th className="w-2/12 px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {songs.map((song, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-2 sm:px-6 py-2 sm:py-4">
                <TextInputWithWarning
                  value={song.title}
                  onChange={(value) => onEdit(index, 'title', value)}
                  isLong={song.title.length > TEXT_LENGTH_LIMIT}
                />
              </td>
              <td className="px-2 sm:px-6 py-2 sm:py-4">
                <TextInputWithWarning
                  value={song.artist}
                  onChange={(value) => onEdit(index, 'artist', value)}
                  isLong={song.artist.length > TEXT_LENGTH_LIMIT}
                />
              </td>
              <td className="px-2 sm:px-6 py-2 sm:py-4">
                <TextInputWithWarning
                  value={song.year}
                  onChange={(value) => onEdit(index, 'year', value)}
                  isLong={false}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
