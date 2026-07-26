// src/components/dashboard/MetadataPanel.jsx
import React from 'react';
import { FileCheck } from 'lucide-react';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-800/60 last:border-b-0">
      <span className="text-[11px] text-slate-500 font-mono shrink-0 min-w-[90px]">{label}</span>
      <span className="text-[11px] text-slate-300 font-mono text-right break-all">{value}</span>
    </div>
  );
}

export default function MetadataPanel({ fileDetails, mediaType, sha, exifData, ytMetadata, resolution, sampleRate }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0F172A] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
        <FileCheck className="h-3.5 w-3.5 text-slate-500" />
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Provenance & Metadata</span>
      </div>
      <div className="p-4 space-y-0">
        <Row label="File / Title" value={fileDetails?.name} />
        <Row label="Size / Source" value={fileDetails?.size} />
        <Row label="Format" value={fileDetails?.type} />
        <Row label="Media Type" value={mediaType?.toUpperCase()} />
        <Row label="SHA-256" value={sha !== 'N/A' ? sha : null} />
        {exifData && (
          <>
            <Row label="Software" value={exifData.software} />
            <Row label="Device" value={exifData.make} />
            <Row label="EXIF" value={exifData.hasExif ? 'Present' : 'Stripped / None'} />
          </>
        )}
        {ytMetadata && (
          <>
            <Row label="Channel" value={ytMetadata.channel} />
            <Row label="Duration" value={ytMetadata.duration ? `${Math.floor(ytMetadata.duration / 60)}m ${ytMetadata.duration % 60}s` : null} />
            <Row label="Views" value={ytMetadata.views?.toLocaleString()} />
          </>
        )}
        {resolution && <Row label="Resolution" value={resolution.label || `${resolution.width}×${resolution.height}`} />}
        {sampleRate && <Row label="Sample Rate" value={sampleRate} />}
        {!fileDetails && !exifData && !ytMetadata && (
          <p className="text-[11px] text-slate-600 font-mono py-2">No metadata available yet.</p>
        )}
      </div>
    </div>
  );
}
