// src/components/TimelineBadges.jsx
import React from 'react';

export const TimelineBadges = ({ flaggedMoments, playerRef }) => {
  const jumpToTime = (seconds) => {
    if (playerRef.current) {
      playerRef.current.currentTime = seconds;
      playerRef.current.play();
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="text-[12px] text-slate-400 font-medium">Flagged moments:</span>
      <div className="flex gap-2">
        {flaggedMoments.map((item, idx) => (
          <button
            key={idx}
            onClick={() => jumpToTime(item.timestamp)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] font-mono text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <span className="font-semibold">{item.timeLabel}</span>
            <span className="text-slate-400">|</span>
            <span>{item.issue}</span>
          </button>
        ))}
      </div>
    </div>
  );
};