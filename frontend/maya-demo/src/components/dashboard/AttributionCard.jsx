// src/components/dashboard/AttributionCard.jsx
import React from 'react';
import { ExternalLink, Search } from 'lucide-react';

export default function AttributionCard({ score, sha }) {
  // Only show when analysis is done and score is suspicious
  if (score === null || score > 75) return null;

  const searchLinks = [
    { label: 'Google Reverse Image', url: 'https://images.google.com', icon: Search },
    { label: 'TinEye', url: 'https://tineye.com', icon: Search },
    { label: 'Sensity AI', url: 'https://sensity.ai', icon: ExternalLink },
    { label: 'Deepware Scanner', url: 'https://scanner.deepware.ai', icon: ExternalLink },
  ];

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">Reverse Attribution Tools</span>
      </div>
      <p className="text-[11px] text-slate-400 font-mono mb-3 leading-relaxed">
        Anomalies detected. Cross-reference with external attribution services for further verification.
      </p>
      <div className="flex flex-wrap gap-2">
        {searchLinks.map(({ label, url, icon: Icon }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2.5 py-1 rounded transition-colors"
          >
            <Icon className="h-3 w-3 text-amber-400" />
            {label}
          </a>
        ))}
      </div>
      {sha && sha !== 'N/A' && (
        <div className="mt-2 text-[10px] font-mono text-slate-600">Hash: {sha}</div>
      )}
    </div>
  );
}
