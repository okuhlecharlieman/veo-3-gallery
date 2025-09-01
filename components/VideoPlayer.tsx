import React from 'react';
import { Video } from '../types';

type Props = {
  video: Video;
  onClose: () => void;
  onEdit: (video: Video) => void;
};

export const VideoPlayer: React.FC<Props> = ({ video, onClose, onEdit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full shadow-lg">
      <video src={video.videoUrl} controls autoPlay className="w-full rounded mb-4" />
      <h2 className="text-xl font-bold mb-2">{video.title}</h2>
      <p className="text-gray-400 mb-4">{video.description}</p>
      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => onEdit(video)}>
          Remix
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
