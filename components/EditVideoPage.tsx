import React from 'react';
import { Video } from '../types';

type Props = {
  video: Video;
  onSave: (video: Video) => void;
  onCancel: () => void;
};

export const EditVideoPage: React.FC<Props> = ({ video, onSave, onCancel }) => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Edit Video</h2>
    <p className="mb-4">{video.title}</p>
    <button
      className="px-4 py-2 bg-purple-600 text-white rounded mr-2"
      onClick={() => onSave(video)}
    >
      Save Remix
    </button>
    <button
      className="px-4 py-2 bg-gray-700 text-white rounded"
      onClick={onCancel}
    >
      Cancel
    </button>
  </div>
);
