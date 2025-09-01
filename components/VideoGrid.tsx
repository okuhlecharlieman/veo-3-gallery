import React from 'react';
import { Video } from '../types';

type Props = {
  videos: Video[];
  onPlayVideo: (video: Video) => void;
};

export const VideoGrid: React.FC<Props> = ({ videos, onPlayVideo }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {videos.map((video) => (
      <div key={video.id} className="bg-gray-800 rounded-lg p-4 shadow">
        <div className="aspect-w-16 aspect-h-9 mb-2">
          <video src={video.videoUrl} controls className="w-full h-full rounded" />
        </div>
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{video.description}</p>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded"
          onClick={() => onPlayVideo(video)}
        >
          Play
        </button>
      </div>
    ))}
  </div>
);
