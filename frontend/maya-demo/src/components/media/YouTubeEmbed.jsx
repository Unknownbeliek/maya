// src/components/media/YouTubeEmbed.jsx
import React from 'react';

export default function YouTubeEmbed({ videoId }) {
  if (!videoId) return null;
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video relative">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`}
        title="YouTube Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
