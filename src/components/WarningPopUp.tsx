import React from 'react';

interface WarningPopUpProps {
  message: string;
  onContinue: () => void;
  onCancel: () => void;
}

export const WarningPopUp: React.FC<WarningPopUpProps> = ({
  message,
  onContinue,
  onCancel,
}) => {
  return (
    <div
      id="popup"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-sm mx-auto">
        <button
          id="close-popup"
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12l-4.89 4.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Warning</h2>
        <p className="mb-4">{message}</p>
        <button
          id="ok-button"
          onClick={onCancel}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          id="ok-button"
          onClick={onContinue}
          className="ml-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
