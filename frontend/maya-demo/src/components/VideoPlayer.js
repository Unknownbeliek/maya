// src/components/VideoPlayer.jsx
import React, { useRef, useEffect } from 'react';

export const VideoPlayer = ({ videoSrc, onTimeUpdate, playerRef }) => {
  const canvasRef = useRef(null);

  // Synchronize canvas dimensions with video player dimensions
  const handleLoadedMetadata = () => {
    if (playerRef.current && canvasRef.current) {
      canvasRef.current.width = playerRef.current.videoWidth;
      canvasRef.current.height = playerRef.current.videoHeight;
    }
  };

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
      {/* HTML5 Video Layer */}
      <video
        ref={playerRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        onTimeUpdate={() => onTimeUpdate(playerRef.current?.currentTime || 0)}
        onLoadedMetadata={handleLoadedMetadata}
        controls
      />

      {/* Transparent Canvas Layer for Face Mesh Dots */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};