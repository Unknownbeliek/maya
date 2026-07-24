import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Shield, FileCheck, AudioLines, ScanFace, Clock, Link, Upload, 
  Loader2, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import { useFaceMesh } from "./hooks/useFaceMesh";
import { calculateFileHash } from "./analysis/hashing";
import { extractFileMetadata } from "./analysis/metadata";
import { analyzeAudioKinematics } from "./analysis/kinematics";

const BACKEND_URL = "http://localhost:3001";

export default function App() {
  const [videoSrc, setVideoSrc] = useState("https://vjs.zencdn.net/v/oceans.mp4");
  const [inputUrl, setInputUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [error, setError] = useState(null);

  // State for forensic results
  const [facialAnomalies, setFacialAnomalies] = useState([]);
  const analysisData = useRef({ sha: "", meta: {}, audioFlags: [] });

  const [analysisResult, setAnalysisResult] = useState({
    score: 100,
    statusText: "Ready to analyze. Upload a file or paste a URL.",
    sha: "N/A",
    flags: [],
    verifications: [
      { label: "EXIF & Provenance", value: "Pending", status: "pending", icon: FileCheck },
      { label: "Audio-Visual Kinematics", value: "Pending", status: "pending", icon: AudioLines },
      { label: "Facial Landmark Consistency", value: "Pending", status: "pending", icon: ScanFace },
    ]
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFaceMeshResults = useCallback(({ facialAnomalies }) => {
    setFacialAnomalies(facialAnomalies);
  }, []);

  useFaceMesh(videoRef, canvasRef, handleFaceMeshResults, isAnalyzing);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSeek = (seconds) => {
    if (videoRef.current) videoRef.current.currentTime = seconds;
  };

  const finalizeAnalysis = () => {
    if (!isAnalyzing) return;
    
    setAnalysisStep("Finalizing score...");
    
    let score = 100;
    const { sha, meta, audioFlags } = analysisData.current;
    let facialStatus = "Consistent";

    // Deduct points for audio anomalies
    if (audioFlags.length > 0) score -= 40;

    // Deduct points for each type of facial anomaly
    facialAnomalies.forEach(anomaly => {
      if (anomaly.type === "Low Blink Rate") score -= 25;
      if (anomaly.type === "Rigid Head Pose") score -= 20;
      if (anomaly.type === "Face Disappeared") score -= 15;
    });
    
    if (facialAnomalies.length > 0) {
        const primaryAnomaly = facialAnomalies.find(a => a.type !== "Face Disappeared") || facialAnomalies[0];
        facialStatus = `${primaryAnomaly.type} Detected`;
    }

    score = Math.max(score, 0); // Ensure score doesn't go below 0

    const newFlags = [
      ...audioFlags.map(f => ({...f, label: "Audio Desync"})),
      ...facialAnomalies.map(f => ({...f, seconds: f.time, label: f.type, detail: f.detail || ''}))
    ];

    setAnalysisResult({
      score: score,
      statusText: score > 75 ? "Likely Authentic." : "Anomalies Detected.",
      sha: sha,
      flags: newFlags,
      verifications: [
        { label: "EXIF & Provenance", value: meta.software, status: score > 90 ? "verified" : "warning", icon: FileCheck },
        { label: "Audio-Visual Kinematics", value: audioFlags.length > 0 ? `${audioFlags.length} Desync Event(s)` : "Synchronized", status: audioFlags.length === 0 ? "verified" : "warning", icon: AudioLines },
        { label: "Facial Landmark Consistency", value: facialStatus, status: facialAnomalies.length === 0 ? "verified" : "warning", icon: ScanFace },
      ]
    });

    setIsAnalyzing(false);
  };

  const runAnalysis = async (source) => {
    // Reset state for new analysis
    setIsAnalyzing(true);
    setError(null);
    setFacialAnomalies([]);
    analysisData.current = { sha: "N/A (Streamed)", meta: { software: "Streamed Video" }, audioFlags: [] };

    setAnalysisResult({ ...analysisResult, statusText: "Analysis in progress..."});

    if (source.type === 'file' && source.file) {
      setAnalysisStep("1/2: Analyzing file metadata & audio...");
      analysisData.current.sha = await calculateFileHash(source.file);
      analysisData.current.meta = await extractFileMetadata(source.file);
      analysisData.current.audioFlags = await analyzeAudioKinematics(source.file);
    }

    setAnalysisStep("2/2: Performing live facial landmark analysis...");
    videoRef.current?.play().catch(() => {});
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      if (videoRef.current) videoRef.current.src = objectUrl;
      runAnalysis({ type: 'file', file });
    }
  };

  const handleUrlSubmit = async () => {
    if (!inputUrl) return;

    setIsAnalyzing(true);
    setAnalysisStep("Contacting backend...");
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/process-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Backend failed.');

      setVideoSrc(data.streamUrl);
      if (videoRef.current) videoRef.current.src = data.streamUrl;
      runAnalysis({ type: 'stream' });

    } catch (err) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1220] text-slate-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-1">
              <span>Investigations</span><span>/</span><span className="text-slate-400">media_verification</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${isAnalyzing ? 'bg-[#3a0ca3] animate-ping' : 'bg-slate-600'}`} />
              <h1 className="text-lg font-semibold text-white tracking-tight">MAYA Dynamic Forensics Engine</h1>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mb-6 bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="Paste YouTube or direct MP4 stream URL..." className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#3a0ca3]" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={handleUrlSubmit} disabled={isAnalyzing} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#3a0ca3] hover:bg-[#3a0ca3]/80 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-all disabled:opacity-50 cursor-pointer">
              {isAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Analyze Stream"}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-slate-400" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* --- NOTIFICATIONS --- */}
        {(isAnalyzing && analysisStep) && (
          <div className="mb-6 bg-[#3a0ca3]/20 border border-[#3a0ca3]/50 rounded-lg p-3 flex items-center gap-3 text-xs text-indigo-200 font-mono">
            <Loader2 className="h-4 w-4 animate-spin text-[#fff275]" /><span>{analysisStep}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-3 text-xs text-red-200 font-mono">
            <XCircle className="h-4 w-4 text-red-300" /><span><span className="font-bold mr-2">Error:</span>{error}</span>
          </div>
        )}

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-slate-800 bg-black shadow-2xl relative aspect-video">
              <video ref={videoRef} src={videoSrc} className="absolute inset-0 h-full w-full object-contain" crossOrigin="anonymous" controls loop={!isAnalyzing} onEnded={finalizeAnalysis} />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="flex items-center gap-1.5 mb-3"><Clock className="h-3.5 w-3.5 text-slate-500" /><span className="text-[12px] font-medium text-slate-400">Flagged Moments</span></div>
              {analysisResult.flags.length === 0 ? (
                <p className="text-xs text-indigo-300 font-mono flex items-center gap-2 py-1"><CheckCircle2 className="h-4 w-4 text-[#3a0ca3]" /> {isAnalyzing ? 'Analysis in progress...' : 'Zero anomalies detected.'}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysisResult.flags.map((f, i) => (
                    <button key={i} onClick={() => handleSeek(f.seconds)} className="flex items-center gap-2 rounded-md border border-[#fff275]/30 bg-[#fff275]/10 hover:bg-[#fff275]/20 transition-all px-2.5 py-1.5 cursor-pointer">
                      <span className="text-[11px] font-mono font-bold text-[#fff275]">{f.time}</span><span className="h-3 w-px bg-slate-700" />
                      <span className="text-[12px] text-slate-200">{f.label}</span>
                      {f.detail && <span className="text-[11px] font-mono text-[#fff275]/80">({f.detail})</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-[12px] font-medium text-slate-400">Authenticity Score</span><span className="text-base font-bold text-white font-mono">{analysisResult.score}%</span></div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden"><div className={`h-full transition-all duration-500 ${analysisResult.score > 75 ? 'bg-[#3a0ca3]' : 'bg-[#fff275]'}`} style={{ width: `${analysisResult.score}%` }} /></div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{analysisResult.statusText}</p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0F172A] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50"><span className="text-[12px] font-medium text-slate-400">Multi-Layer Forensic Status</span></div>
              <div>
                {analysisResult.verifications.map((v, i) => {
                  const Icon = v.icon;
                  const statusStyles = {
                    verified: 'bg-[#3a0ca3]/20 text-indigo-200 border-[#3a0ca3]/50',
                    warning: 'bg-[#fff275]/20 text-[#fff275] border-[#fff275]/40',
                    pending: 'bg-slate-700/20 text-slate-400 border-slate-700/50'
                  };
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-slate-800 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-3.5 w-3.5 ${v.status === 'pending' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <div>
                          <div className="text-[12px] text-slate-200 font-medium">{v.label}</div>
                          <div className="text-[11px] text-slate-500">{v.value}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${statusStyles[v.status]}`}>{v.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="text-[12px] font-medium text-slate-400 mb-2">Provenance & Metadata</div>
              <div className="flex justify-between text-[12px] font-mono"><span className="text-slate-500">SHA-256:</span><span className="text-slate-300">{analysisResult.sha}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}