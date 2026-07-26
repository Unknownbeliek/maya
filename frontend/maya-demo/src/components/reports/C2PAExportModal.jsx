// src/components/reports/C2PAExportModal.jsx
import React from 'react';
import { Download, XCircle, FileText, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function C2PAExportModal({
  isOpen, onClose, onExport,
  score, statusText, sha, flags = [], verifications = [],
  fileDetails, inputUrl, mediaType,
  audioAiResult, nlpMetadataResult, facialAnomalies = [],
  mediaTypeLabel, samplingStrategy, primaryAnomaly,
  forensicReport,
  thumbnailUrl,
}) {
  if (!isOpen) return null;

  const scoreVal = score !== null ? `${score}%` : 'Pending';
  const fileName = fileDetails?.name || inputUrl || 'Media';
  const riskLabel = score === null ? 'Pending' : (score > 75 ? 'Low Threat' : score >= 50 ? 'Medium Threat' : 'High Threat');
  const riskColor = score === null ? 'text-slate-400' : (score > 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400');

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B132B] border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">MAYA C2PA Certificate</h3>
            {mediaType && (
              <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded">
                {mediaType.toUpperCase()}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white cursor-pointer transition-colors">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Score */}
          <div className="flex items-center gap-4 bg-slate-900/60 rounded-lg p-4 border border-slate-800">
            {score !== null && score > 75
              ? <ShieldCheck className="h-10 w-10 text-emerald-400 shrink-0" />
              : <ShieldAlert className="h-10 w-10 text-amber-400 shrink-0" />
            }
            <div>
              <div className={`text-3xl font-black font-mono ${riskColor}`}>{scoreVal}</div>
              <div className="text-xs text-slate-400">{riskLabel} · {statusText}</div>
            </div>
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="Thumbnail" className="ml-auto w-24 h-16 object-cover rounded border border-slate-700" />
            )}
          </div>

          {/* Media Info */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Media Information</div>
            <div className="bg-slate-900/60 rounded border border-slate-800 divide-y divide-slate-800">
              {[
                ['File / Title', fileName],
                ['SHA-256', sha],
                ['Format', fileDetails?.type || mediaType],
                ['Media Type Identified', mediaTypeLabel],
                ['Sampling Strategy', samplingStrategy],
                ['Primary Anomaly', primaryAnomaly],
                ['Source', fileDetails?.size || inputUrl || 'N/A'],
              ].map(([k, v]) => v && v !== 'N/A' ? (
                <div key={k} className="flex items-start justify-between px-3 py-2 text-[11px] font-mono gap-3">
                  <span className="text-slate-500 shrink-0">{k}</span>
                  <span className="text-slate-300 text-right break-all">{v}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Verifications */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Multi-Layer Results</div>
            <div className="bg-slate-900/60 rounded border border-slate-800 divide-y divide-slate-800">
              {verifications.map((v, i) => {
                const Icon = v.icon;
                const statusColor = v.status === 'verified' ? 'text-emerald-400' : v.status === 'warning' ? 'text-amber-400' : 'text-slate-500';
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
                      <div>
                        <div className="text-[11px] text-slate-200">{v.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{v.value}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold ${statusColor}`}>{v.status?.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged Moments */}
          {flags.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Flagged Anomalies ({flags.length})
              </div>
              <div className="space-y-1.5">
                {flags.slice(0, 10).map((f, i) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded px-3 py-1.5 text-[11px] font-mono">
                    <span className="text-amber-400 font-bold shrink-0">{f.time}</span>
                    <span className="text-slate-300">{f.label}</span>
                    {f.detail && <span className="text-amber-400/70 ml-auto shrink-0">({f.detail})</span>}
                  </div>
                ))}
                {flags.length > 10 && (
                  <div className="text-[10px] text-slate-500 font-mono px-1">
                    +{flags.length - 10} more anomalies in full report.
                  </div>
                )}
              </div>
            </div>
          )}

          {flags.length === 0 && score !== null && (
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded p-3">
              ✓ Zero forensic anomalies detected across all analysis layers.
            </div>
          )}

          {forensicReport?.paragraphs?.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Forensic Narrative</div>
              <div className="space-y-3 rounded border border-slate-800 bg-slate-900/40 p-4">
                {forensicReport.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[12px] leading-relaxed text-slate-300 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800 bg-slate-900/40 shrink-0">
          <div className="text-[10px] font-mono text-slate-600">
            Generated: {new Date().toLocaleString()} · MAYA Forensics Engine
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
              Close
            </button>
            <button onClick={onExport} className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded transition-colors cursor-pointer">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
