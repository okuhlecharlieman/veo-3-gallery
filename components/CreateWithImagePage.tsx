import React from 'react';

type Props = {
  onGenerate: (prompt: string, image: {data: string; mimeType: string}) => void;
  onCancel: () => void;
};

export const CreateWithImagePage: React.FC<Props> = ({ onGenerate, onCancel }) => {
  // Minimal stub UI
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Create With Image</h2>
      <button className="px-4 py-2 bg-gray-700 rounded" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};
