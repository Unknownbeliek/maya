// src/components/dashboard/Scorecard.jsx
import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, ShieldX } from 'lucide-react';

function getRiskLevel(score) {
  if (score === null || score === undefined) {
    return {
      label: 'Pending', icon: Shield,
      color: 'text-slate-400', bg: 'bg-slate-800/40', border: 'border-slate-700',
      barClass: '', shieldColor: 'text-slate-500',
    };
  }
  if (score >= 76) return {
    label: 'Low Threat', icon: ShieldCheck,
    color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',
    barClass: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    shieldColor: 'text-emerald-400',
  };
  if (score >= 50) return {
    label: 'Medium Threat', icon: ShieldAlert,
    color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30',
    barClass: 'bg-gradient-to-r from-amber-600 to-amber-400',
    shieldColor: 'text-amber-400',
  };
  if (score >= 25) return {
    label: 'High Threat', icon: ShieldX,
    color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/30',
    barClass: 'bg-gradient-to-r from-red-700 to-red-500',
    shieldColor: 'text-red-400',
  };
  return {
    label: 'Critical — Likely Synthetic', icon: ShieldX,
    color: 'text-red-200', bg: 'bg-red-900/30', border: 'border-red-500/60',
    barClass: 'bg-red-600',
    shieldColor: 'text-red-500',
  };
}

export default function Scorecard({ score, statusText, mediaType, checksSummary, scoreBreakdown }) {
  const risk = getRiskLevel(score);
  const Icon = risk.icon;
  const arcPct = score !== null ? score : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B132B]/80 p-5 flex flex-col gap-3 shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Authenticity Score
        </span>
        {mediaType && (
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
            {mediaType.toUpperCase()}
          </span>
        )}
      </div>

      {/* Score + Shield */}
      <div className="flex items-center gap-4">
        <Icon className={`h-10 w-10 shrink-0 ${risk.shieldColor}`} />
        <div>
          <div className="text-4xl font-black font-mono text-white tracking-tight">
            {score !== null ? `${score}%` : '—'}
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${risk.bg} ${risk.color} ${risk.border}`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${risk.barClass}`}
          style={{ width: `${arcPct}%` }}
        />
        {/* Threshold markers */}
        <div className="absolute top-0 left-[76%] h-full w-px bg-slate-600/60" title="Low / Medium threshold" />
        <div className="absolute top-0 left-[50%] h-full w-px bg-slate-600/40" title="Medium / High threshold" />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-slate-600 -mt-1 px-0.5">
        <span>Critical</span>
        <span className="ml-[48%]">Med</span>
        <span>Authentic</span>
      </div>

      {/* Status message */}
      <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
        {statusText || 'Awaiting analysis.'}
      </p>

      {/* Score breakdown — shows which layer deducted points */}
      {scoreBreakdown && scoreBreakdown !== 'No penalties — all layers clear' && (
        <div className="text-[10px] font-mono text-slate-500 bg-slate-900/60 border border-slate-800 rounded px-2.5 py-1.5 space-y-0.5">
          <div className="text-slate-600 uppercase tracking-wider text-[9px] mb-1">Score Deductions</div>
          {scoreBreakdown.split(' · ').map((part, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-red-400/70">▼</span>
              <span>{part}</span>
            </div>
          ))}
        </div>
      )}

      {/* Checks passed summary */}
      {checksSummary && (
        <div className="text-[10px] font-mono text-slate-500 bg-slate-900/60 border border-slate-800 rounded px-2.5 py-1.5 flex items-center gap-1.5">
          <span className="text-emerald-500">✓</span>
          <span>{checksSummary}</span>
        </div>
      )}
    </div>
  );
}
