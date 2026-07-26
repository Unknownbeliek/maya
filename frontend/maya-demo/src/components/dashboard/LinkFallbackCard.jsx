import React from 'react';
import { AlertTriangle, Upload, RefreshCw } from 'lucide-react';

export default function LinkFallbackCard({ message, onUpload, onRetry }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <div className="text-sm font-semibold">Direct Media Stream Restricted</div>
          <p className="text-xs leading-relaxed text-amber-100/90 font-mono">{message}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onUpload}
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-50 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload local file
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 bg-slate-900/70 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try another link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
