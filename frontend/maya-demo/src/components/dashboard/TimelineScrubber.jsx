import React, { useMemo } from 'react';
import { Clock, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

const statusStyles = {
  authentic: 'bg-emerald-400/80',
  suspicious: 'bg-amber-400/90',
  flagged: 'bg-red-500/90',
};

const badgeStyles = {
  watch: 'border-emerald-500/25 bg-emerald-500/8 text-emerald-200',
  suspicious: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  flagged: 'border-red-500/30 bg-red-500/10 text-red-200',
};

export default function TimelineScrubber({
  duration = 0,
  segments = [],
  anomalyBadges = [],
  onSeek,
  currentTime = 0,
  title = 'Anomaly Heatmap Timeline',
}) {
  const percent = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  const handleScrub = (event) => {
    if (!duration || typeof onSeek !== 'function') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const targetSeconds = Math.min(duration, Math.max(0, (x / rect.width) * duration));
    onSeek(targetSeconds);
  };

  const jumpTo = (seconds) => {
    if (typeof onSeek === 'function') onSeek(seconds);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[12px] font-medium text-slate-400">{title}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          {duration ? `0% → 100% · ${Math.floor(duration)}s` : 'Awaiting duration'}
        </div>
      </div>

      <button
        type="button"
        onClick={handleScrub}
        className="relative h-5 w-full rounded-full border border-slate-800 bg-slate-950 overflow-hidden cursor-pointer"
        aria-label="Scrub video timeline"
      >
        <div className="absolute inset-0 flex">
          {segments.length > 0 ? segments.map((segment) => (
            <div
              key={segment.id}
              className={`h-full ${statusStyles[segment.status] || statusStyles.authentic}`}
              style={{ width: `${segment.width}%` }}
              title={`${segment.startLabel} - ${segment.endLabel}`}
            />
          )) : (
            <div className="h-full w-full bg-emerald-400/70" />
          )}
        </div>

        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          style={{ left: `${percent}%`, transform: 'translateX(-1px)' }}
        />

        <div className="absolute left-0 top-0 h-full w-full opacity-25 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)]" />
      </button>

      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Authentic</span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>Green</span>
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span>Yellow</span>
          <ShieldAlert className="h-3 w-3 text-red-400" />
          <span>Red</span>
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {anomalyBadges.length === 0 ? (
          <p className="text-[11px] text-slate-600 font-mono">No hot zones surfaced by the macro scan yet.</p>
        ) : anomalyBadges.map((badge, index) => (
          <button
            key={`${badge.start}-${index}`}
            type="button"
            onClick={() => jumpTo(badge.start)}
            className={`w-full flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors cursor-pointer ${badgeStyles[badge.severity] || badgeStyles.watch}`}
          >
            <span className="shrink-0 text-[11px] font-mono font-semibold">{badge.label}</span>
            {badge.detail && <span className="ml-auto text-[11px] font-mono opacity-80">{badge.detail}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
