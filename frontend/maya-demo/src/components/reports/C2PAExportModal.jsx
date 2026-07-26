// src/components/reports/C2PAExportModal.jsx
import React from 'react';
import { Download, XCircle, FileText, ShieldCheck, ShieldAlert, FileJson, FileSpreadsheet, FileCode, Printer, Loader2 } from 'lucide-react';

export default function C2PAExportModal({
  isOpen, onClose, onExport, onExportHtml, onPrint, onExportPdf, onExportJson, onExportCsv, isExportingPdf,
  score, statusText, sha, flags = [], verifications = [],
  fileDetails, inputUrl, mediaType,
  audioAiResult, nlpMetadataResult, facialAnomalies = [],
  mediaTypeLabel, samplingStrategy, primaryAnomaly,
  forensicReport,
  thumbnailUrl,
}) {
  if (!isOpen) return null;

  const handlePdfClick = onExportPdf || onExport;

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
            <h3 className="text-sm font-semibold text-white">MAYA C2PA Certificate & Forensic Export</h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {mediaTypeLabel || mediaType || 'Asset'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Master Score Banner */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              {score !== null && score > 75 ? (
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-amber-400" />
              )}
              <div>
                <div className={`text-2xl font-bold font-mono ${riskColor}`}>{scoreVal}</div>
                <div className="text-xs text-slate-400 font-mono">
                  {riskLabel} · {statusText}
                </div>
              </div>
            </div>
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="Thumbnail" className="w-20 h-14 object-cover rounded border border-slate-700" />
            )}
          </div>

          {/* Media Information */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Media Information</div>
            <div className="bg-slate-900/60 rounded border border-slate-800 divide-y divide-slate-800 font-mono text-xs">
              <div className="flex justify-between p-2.5"><span className="text-slate-500">File / Title</span><span className="text-slate-200 truncate max-w-[280px]">{fileName}</span></div>
              <div className="flex justify-between p-2.5"><span className="text-slate-500">SHA-256</span><span className="text-slate-300">{sha ? `${sha.slice(0, 16)}...` : 'N/A'}</span></div>
              <div className="flex justify-between p-2.5"><span className="text-slate-500">Format</span><span className="text-slate-300 uppercase">{fileDetails?.type || mediaType || 'N/A'}</span></div>
              <div className="flex justify-between p-2.5"><span className="text-slate-500">Sampling Strategy</span><span className="text-slate-300">{samplingStrategy || 'Standard'}</span></div>
              <div className="flex justify-between p-2.5"><span className="text-slate-500">Primary Anomaly</span><span className="text-slate-300">{primaryAnomaly || 'None'}</span></div>
            </div>
          </div>

          {/* Multi-Layer Results */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Multi-Layer Results</div>
            <div className="bg-slate-900/60 rounded border border-slate-800 divide-y divide-slate-800 font-mono text-xs">
              {(verifications || []).map((v, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-slate-300">{v.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{v.value}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      v.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      v.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Anomalies */}
          {flags.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Flagged Anomalies ({flags.length})
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {flags.map((f, i) => (
                  <div key={i} className="flex items-start justify-between bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs font-mono">
                    <div>
                      <span className="text-amber-400 font-bold mr-2">[{f.time || '00:00'}]</span>
                      <span className="text-slate-200">{f.label}</span>
                    </div>
                    {f.detail && <span className="text-slate-400 text-[11px] ml-2">{f.detail}</span>}
                  </div>
                ))}
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
              <div className="space-y-2 rounded border border-slate-800 bg-slate-900/40 p-3 font-mono text-xs text-slate-300 leading-relaxed">
                {forensicReport.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-800 bg-slate-900/40 shrink-0">
          <div className="text-[10px] font-mono text-slate-500">
            Generated: {new Date().toLocaleString()} · MAYA Forensics Engine
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onPrint || (() => window.print())} className="flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900 px-3 py-1.5 rounded border border-purple-800/60 transition-colors cursor-pointer" title="Print or preview in browser">
              <Printer className="h-3.5 w-3.5 text-purple-400" /> Print / Preview
            </button>
            <button onClick={onExportHtml} className="flex items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900 px-3 py-1.5 rounded border border-cyan-800/60 transition-colors cursor-pointer" title="Download standalone HTML report file">
              <FileCode className="h-3.5 w-3.5 text-cyan-400" /> Export HTML
            </button>
            {onExportCsv && (
              <button onClick={onExportCsv} className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition-colors cursor-pointer">
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" /> Export CSV
              </button>
            )}
            {onExportJson && (
              <button onClick={onExportJson} className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition-colors cursor-pointer">
                <FileJson className="h-3.5 w-3.5 text-amber-400" /> Export JSON
              </button>
            )}
            <button onClick={handlePdfClick} disabled={isExportingPdf} className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1.5 rounded transition-colors cursor-pointer disabled:opacity-50">
              {isExportingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-200" /> : <Download className="h-3.5 w-3.5" />}
              {isExportingPdf ? 'Generating PDF...' : 'Export PDF'}
            </button>
            <button onClick={onClose} className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
