// src/components/charts/TimeSeriesChart.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function TimeSeriesChart({ data = [], title = 'REAL-TIME TIME SERIES' }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.mar || 0, d.audio || 0)), 1);

  return (
    <div className="bg-[#0B132B]/80 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{title}</span>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[11px] text-slate-600 font-mono py-6">
          Awaiting live data...
        </div>
      ) : (
        <div className="flex items-end gap-[2px] h-24 w-full">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-[1px] h-full justify-end">
              {/* MAR bar (cyan) */}
              <div
                className="w-full bg-cyan-500/70 rounded-sm min-h-[1px]"
                style={{ height: `${((d.mar || 0) / maxVal) * 100}%` }}
                title={`MAR: ${(d.mar || 0).toFixed(3)}`}
              />
              {/* Audio bar (indigo) */}
              <div
                className="w-full bg-indigo-400/50 rounded-sm min-h-[1px]"
                style={{ height: `${((d.audio || 0) / maxVal) * 100}%` }}
                title={`Audio: ${((d.audio || 0) * 100).toFixed(0)}%`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-500/70 inline-block" /> MAR</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-400/50 inline-block" /> Audio Level</span>
      </div>
    </div>
  );
}
