import React from 'react';

type Props = {
  message: string[];
  onClose: () => void;
  onSelectKey: () => void;
};

export const ErrorModal: React.FC<Props> = ({ message, onClose, onSelectKey }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white text-black rounded-lg p-6 max-w-md w-full shadow-lg">
      <h2 className="text-xl font-bold mb-2">Error</h2>
      <ul className="mb-4">
        {message.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={onSelectKey}>
          Select API Key
        </button>
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
