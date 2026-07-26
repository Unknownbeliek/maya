// src/components/media/AudioWaveform.jsx
import React, { useRef, useEffect } from 'react';

export default function AudioWaveform({ src, onAudioLoad }) {
  const audioRef = useRef(null);

  const handleLoadedMetadata = () => {
    if (onAudioLoad && audioRef.current) {
      onAudioLoad({
        duration: audioRef.current.duration,
        sampleRate: '44.1 kHz', // HTML audio element doesn't expose sample rate natively
      });
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#080D18] p-4 flex flex-col gap-3">
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Audio Waveform</div>
      {/* Visual placeholder bars */}
      <div className="flex items-end justify-center gap-[2px] h-20 w-full">
        {Array.from({ length: 60 }, (_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 0.45 + 1.2) * 55) + Math.abs(Math.cos(i * 0.3) * 15);
          return (
            <div
              key={i}
              className="bg-cyan-500/60 rounded-sm w-1"
              style={{ height: `${h}%`, opacity: 0.5 + Math.sin(i * 0.3) * 0.4 }}
            />
          );
        })}
      </div>
      <audio
        ref={audioRef}
        src={src}
        controls
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-8 accent-cyan-500"
        style={{ filter: 'invert(0.85) sepia(1) saturate(3) hue-rotate(170deg)' }}
      />
    </div>
  );
}
