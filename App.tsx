/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {CreateWithImagePage} from './components/CreateWithImagePage';
import {EditVideoPage} from './components/EditVideoPage';
import {ErrorModal} from './components/ErrorModal';
import {VideoCameraIcon} from './components/icons';
import {SavingProgressPage} from './components/SavingProgressPage';
import {VideoGrid} from './components/VideoGrid';
import {VideoPlayer} from './components/VideoPlayer';
import {MOCK_VIDEOS} from './constants';
import {Video} from './types';

import {GeneratedVideo, GoogleGenAI} from '@google/genai';

const VEO_MODEL_NAME = 'veo-2.0-generate-001';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// ---

function bloblToBase64(blob: Blob) {
  return new Promise<string>(async (resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

// ---

async function generateVideoFromText(
  prompt: string,
  numberOfVideos = 1,
): Promise<string[]> {
  let operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    config: {
      numberOfVideos,
      aspectRatio: '16:9',
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log('...Generating...');
    operation = await ai.operations.getVideosOperation({operation});
  }

  if (operation?.response) {
    const videos = operation.response?.generatedVideos;
    if (videos === undefined || videos.length === 0) {
      throw new Error('No videos generated');
    }

    return await Promise.all(
      videos.map(async (generatedVideo: GeneratedVideo) => {
        const url = decodeURIComponent(generatedVideo.video.uri);
        const res = await fetch(`${url}&key=${process.env.API_KEY}`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch video: ${res.status} ${res.statusText}`,
          );
        }
        const blob = await res.blob();
        return bloblToBase64(blob);
      }),
    );
  } else {
    throw new Error('No videos generated');
  }
}

async function generateVideoFromImageAndText(
  prompt: string,
  image: {data: string; mimeType: string},
  numberOfVideos = 1,
): Promise<string[]> {
  let operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    image: {
      imageBytes: image.data,
      mimeType: image.mimeType,
    },
    config: {
      numberOfVideos,
      aspectRatio: '16:9',
    },
  });
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log('...Generating...');
    operation = await ai.operations.getVideosOperation({operation});
  }

  if (operation?.response) {
    const videos = operation.response?.generatedVideos;
    if (videos === undefined || videos.length === 0) {
      throw new Error('No videos generated');
    }

    return await Promise.all(
      videos.map(async (generatedVideo: GeneratedVideo) => {
        const url = decodeURIComponent(generatedVideo.video.uri);
        const res = await fetch(`${url}&key=${process.env.API_KEY}`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch video: ${res.status} ${res.statusText}`,
          );
        }
        const blob = await res.blob();
        return bloblToBase64(blob);
      }),
    );
  } else {
    throw new Error('No videos generated');
  }
}

/**
 * Main component for the Veo3 Gallery app.
 * It manages the state of videos, playing videos, editing videos and error handling.
 */
export const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [generationError, setGenerationError] = useState<string[] | null>(
    null,
  );
  const [isCreatingWithImage, setIsCreatingWithImage] = useState(false);

  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  const handleClosePlayer = () => {
    setPlayingVideo(null);
  };

  const handleStartEdit = (video: Video) => {
    setPlayingVideo(null); // Close player
    setEditingVideo(video); // Open edit page
  };

  const handleCancelEdit = () => {
    setEditingVideo(null); // Close edit page, return to grid
  };

  const handleGenerateWithImage = async (
    prompt: string,
    image: {data: string; mimeType: string},
  ) => {
    setIsCreatingWithImage(false);
    setIsSaving(true);
    setGenerationError(null);

    try {
      console.log('Generating video from image and text...', prompt);
      const videoObjects = await generateVideoFromImageAndText(prompt, image);

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');

      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: `Video from image: ${prompt.substring(0, 30)}${
          prompt.length > 30 ? '...' : ''
        }`,
        description: prompt,
        videoUrl: src,
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo);
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Video generation from image failed.',
        'Please try again or check your API key setup.',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (originalVideo: Video) => {
    setEditingVideo(null);
    setIsSaving(true);
    setGenerationError(null);

    try {
      const promptText = originalVideo.description;
      console.log('Generating video...', promptText);
      const videoObjects = await generateVideoFromText(promptText);

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');

      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: `Remix of "${originalVideo.title}"`,
        description: originalVideo.description,
        videoUrl: src,
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo); // Go to the new video
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Video generation failed.',
        'Please ensure your Cloud Project is configured correctly.',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return <SavingProgressPage />;
  }

  if (isCreatingWithImage) {
    return (
      <CreateWithImagePage
        onGenerate={handleGenerateWithImage}
        onCancel={() => setIsCreatingWithImage(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {editingVideo ? (
        <EditVideoPage
          video={editingVideo}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className="mx-auto max-w-[1080px]">
          <header className="p-6 md:p-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text inline-flex items-center gap-4">
              <VideoCameraIcon className="w-10 h-10 md:w-12 md:h-12" />
              <span>Veo Gallery</span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Select a video to remix or create a new one from an image.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreatingWithImage(true)}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 duration-300 ease-in-out">
                Create with Image
              </button>
            </div>
          </header>
          <main className="px-4 md:px-8 pb-8">
            <VideoGrid videos={videos} onPlayVideo={handlePlayVideo} />
          </main>
        </div>
      )}

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={handleClosePlayer}
          onEdit={handleStartEdit}
        />
      )}

      {generationError && (
        <ErrorModal
          message={generationError}
          onClose={() => setGenerationError(null)}
          onSelectKey={async () => await window.aistudio?.openSelectKey()}
        />
      )}
    </div>
  );
};
