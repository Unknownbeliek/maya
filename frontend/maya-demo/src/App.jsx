import React, { useState } from "react";
import { Play, Pause, Volume2, Maximize2, ChevronDown, Shield, FileCheck, AudioLines, ScanFace, Clock, ExternalLink } from "lucide-react";

// --- Mock data -------------------------------------------------------------

const verifications = [
  {
    label: "EXIF & Provenance",
    value: "C2PA Signature Valid",
    status: "verified",
    icon: FileCheck,
  },
  {
    label: "Audio-Visual Kinematics",
    value: "2 Sync Glitches Flagged",
    status: "warning",
    icon: AudioLines,
  },
  {
    label: "Facial Landmark Consistency",
    value: "No Warping Detected",
    status: "verified",
    icon: ScanFace,
  },
  {
    label: "Model Fingerprint",
    value: "No Known GAN Signature",
    status: "verified",
    icon: Shield,
  },
];

const flags = [
  { time: "00:04", label: "Lip Sync Offset", detail: "80ms" },
  { time: "00:11", label: "Blink Rate Anomaly", detail: "0.2s" },
  { time: "00:19", label: "Sync Glitch", detail: "60ms" },
];

const landmarks = [
  [46, 30], [50, 28], [54, 30], // brow-ish
  [44, 38], [50, 37], [56, 38], // eyes
  [50, 46], // nose
  [44, 54], [50, 56], [56, 54], // mouth
  [40, 44], [60, 44], // cheeks
];

// --- Small UI atoms ---------------------------------------------------------

function StatusBadge({ status }) {
  const styles = {
    verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const label = status === "verified" ? "Verified" : "Warning";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      {label}
    </span>
  );
}

function VerificationRow({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800/80 border border-slate-700/50">
          <Icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] text-slate-200 font-medium leading-tight">{item.label}</div>
          <div className="text-[12px] text-slate-500 leading-tight mt-0.5 truncate">{item.value}</div>
        </div>
      </div>
      <StatusBadge status={item.status} />
    </div>
  );
}

// --- Video player with restrained face-box overlay --------------------------

function VideoPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-black">
      {/* video canvas */}
      <div className="relative aspect-video bg-gradient-to-b from-slate-900 to-slate-950">
        {/* placeholder subject silhouette so the overlay has something to sit on */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-30">
          <ellipse cx="50" cy="42" rx="16" ry="19" fill="#334155" />
          <path d="M28 100 C28 72 38 62 50 62 C62 62 72 72 72 100 Z" fill="#334155" />
        </svg>

        {/* subtle face bounding box + landmark dots */}
        <div
          className="absolute border border-emerald-400/60 rounded-[3px]"
          style={{ left: "36%", top: "20%", width: "28%", height: "40%" }}
        >
          <span className="absolute -top-5 left-0 text-[10px] font-mono text-emerald-400/80 bg-black/40 px-1 rounded-sm">
            face_0 · 0.98
          </span>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {landmarks.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.1" fill="#34d399" fillOpacity="0.85" />
            ))}
          </svg>
        </div>

        {/* play button overlay */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 group-hover:bg-black/60 transition-colors">
            {playing ? (
              <Pause className="h-5 w-5 text-white" fill="white" />
            ) : (
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            )}
          </span>
        </button>
      </div>

      {/* transport controls */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-900 border-t border-slate-800">
        <button onClick={() => setPlaying((p) => !p)} className="text-slate-300 hover:text-white transition-colors">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <span className="text-[11px] font-mono text-slate-400 tabular-nums">00:07 / 00:24</span>
        <div className="flex-1 h-1 rounded-full bg-slate-800 relative">
          <div className="absolute left-0 top-0 h-full w-[29%] rounded-full bg-slate-500" />
          {flags.map((f, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-amber-400"
              style={{ left: `${(i + 1) * 24}%` }}
            />
          ))}
        </div>
        <Volume2 className="h-4 w-4 text-slate-400" />
        <Maximize2 className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

// --- Main dashboard ----------------------------------------------------------

export default function MayaDashboard() {
  return (
    <div
      className="min-h-screen w-full bg-[#0B1220] text-slate-200"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-1">
              <span>Investigations</span>
              <span>/</span>
              <span className="text-slate-400">interview_clip_047.mp4</span>
            </div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Media Inspection</h1>
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#0F172A] px-3 py-1.5 text-[13px] text-slate-300 hover:bg-slate-800/60 transition-colors">
            Export report
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          {/* left column: video + timeline */}
          <div className="space-y-4">
            <VideoPlayer />

            {/* flagged timestamps */}
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[12px] font-medium text-slate-400">Flagged moments</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {flags.map((f, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 transition-colors px-2.5 py-1.5"
                  >
                    <span className="text-[11px] font-mono text-amber-400 tabular-nums">{f.time}</span>
                    <span className="h-3 w-px bg-slate-700" />
                    <span className="text-[12px] text-slate-300">{f.label}</span>
                    <span className="text-[11px] font-mono text-slate-500">({f.detail})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* right column: inspection summary */}
          <div className="space-y-4">
            {/* master score */}
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-slate-400">Authenticity score</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[13px] font-semibold text-white tabular-nums">88%</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "88%" }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Likely authentic. 2 checks require review below.
              </p>
            </div>

            {/* verifications list */}
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <span className="text-[12px] font-medium text-slate-400">Verifications</span>
              </div>
              <div>
                {verifications.map((v, i) => (
                  <VerificationRow key={i} item={v} />
                ))}
              </div>
            </div>

            {/* metadata */}
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="text-[12px] font-medium text-slate-400 mb-2.5">File metadata</div>
              <dl className="space-y-1.5">
                {[
                  ["SHA-256", "9f2a1c...84be"],
                  ["Duration", "00:24.320"],
                  ["Resolution", "1920 × 1080"],
                  ["Analyzed", "2 min ago"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[12px]">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-slate-300 font-mono tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 transition-colors py-2 text-[12px] text-slate-400">
              View full provenance chain
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}