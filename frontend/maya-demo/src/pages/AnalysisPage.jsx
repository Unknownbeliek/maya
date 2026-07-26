import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FileCheck, AudioLines, ScanFace, Clock, Link, Upload,
  Loader2, CheckCircle2, XCircle, Mic, Video,
  LayoutDashboard, BarChart3, FileText, Settings, History, Download,
  FolderPlus, RefreshCw, Play, Pause, Eye,
  ExternalLink, Image as ImageIcon, Info,
  ShieldAlert, ShieldCheck
} from "lucide-react";

// Hooks
import { useFaceMesh } from "../hooks/useFaceMesh";

// Utilities
import { classifyMediaType, extractYouTubeId, getFormatLabel } from "../utils/mediaHelpers";
import { calculateFileHash } from "../utils/forensics/sha256";
import { extractFileMetadata } from "../utils/forensics/exifParser";
import { analyzeMetadataFirewall } from "../utils/forensics/fileAnalyzer";
import { classifyMediaInput } from "../utils/forensics/classifier";
import { buildSamplingPlan } from "../utils/forensics/samplingEngine";
import { buildEnterpriseReportFields } from "../utils/forensics/reportBuilder";
import { scoreMediaConsensus } from "../utils/forensics/scoringEngine";
import { generateForensicReport } from "../utils/forensics/reportGenerator";
import { validateMediaUrl, getFallbackMessage } from "../utils/forensics/linkPolicy";
import { analyzeAudioKinematics } from "../analysis/kinematics";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Components
import YouTubeEmbed from "../components/media/YouTubeEmbed";
import ImageViewer from "../components/media/ImageViewer";
import AudioWaveform from "../components/media/AudioWaveform";
import Scorecard from "../components/dashboard/Scorecard";
import MetadataPanel from "../components/dashboard/MetadataPanel";
import AttributionCard from "../components/dashboard/AttributionCard";
import C2PAExportModal from "../components/reports/C2PAExportModal";
import TimelineScrubber from "../components/dashboard/TimelineScrubber";
import LinkFallbackCard from "../components/dashboard/LinkFallbackCard";

const BACKEND_URL = "http://localhost:3001";

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  // Media & File State
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'video' | 'image' | 'audio' | 'youtube'
  const [youtubeId, setYoutubeId] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  // Forensic Mode States
  const [isFacelessMode, setIsFacelessMode] = useState(false);
  const [isLongVideo, setIsLongVideo] = useState(false);
  const [smartSampleMode, setSmartSampleMode] = useState(true);
  const [audioAiResult, setAudioAiResult] = useState(null);
  const [ytMetadata, setYtMetadata] = useState(null);
  const [nlpMetadataResult, setNlpMetadataResult] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [mediaResolution, setMediaResolution] = useState(null);
  const [mediaSampleRate, setMediaSampleRate] = useState(null);
  const [mediaProfile, setMediaProfile] = useState(null);
  const [samplingPlan, setSamplingPlan] = useState(null);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [linkFailure, setLinkFailure] = useState(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [error, setError] = useState(null);
  const [facialAnomalies, setFacialAnomalies] = useState([]);
  const [liveLipSync, setLiveLipSync] = useState({ mar: 0, audioVolume: 0 });
  const [pythonAvSync, setPythonAvSync] = useState(null);

  // History & UI
  const [savedReports, setSavedReports] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const certificateRef = useRef(null);

  const analysisData = useRef({ sha: "N/A", meta: {}, audioFlags: [], meshMetrics: {}, audioKinematics: null, mediaProfile: null, samplingPlan: null, duration: 0 });
  const analysisTimeoutRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runLongVideoSmartSampling = async () => {
    const video = videoRef.current;
    if (!video) return;

    let duration = video.duration || 0;
    let attempts = 0;
    while ((!duration || Number.isNaN(duration)) && attempts < 10) {
      await sleep(200);
      duration = video.duration || 0;
      attempts += 1;
    }
    if (duration <= 0) return;

    const previewPlan = buildSamplingPlan({
      duration,
      flags: (analysisData.current.audioFlags || []).map((flag, index) => ({
        ...flag,
        seconds: flag.seconds ?? index * 10,
      })),
      mediaLabel: mediaProfile?.displayLabel || (mediaType || 'video'),
    });

    for (let index = 0; index < previewPlan.macroScanPoints.length; index += 1) {
      const time = previewPlan.macroScanPoints[index];
      setAnalysisStep(`1/3: Macro scan ${index + 1}/${previewPlan.macroScanPoints.length} @ ${Math.floor(time)}s across ${previewPlan.durationLabel}...`);
      try {
        video.currentTime = time;
        await video.play().catch(() => {});
      } catch (e) {
        console.warn('Macro scan seek/play failed:', e.message);
      }
      await sleep(1100);
      video.pause();
      await sleep(150);
    }

    if (previewPlan.hotZones.length > 0) {
      for (let zoneIndex = 0; zoneIndex < previewPlan.hotZones.length; zoneIndex += 1) {
        const zone = previewPlan.hotZones[zoneIndex];
        const scanStart = Math.max(0, zone.start);
        const scanEnd = Math.max(scanStart + 1, Math.min(duration, zone.end));
        setAnalysisStep(`2/3: Hot zone micro scan ${zoneIndex + 1}/${previewPlan.hotZones.length} @ ${previewPlan.anomalyBadges[zoneIndex]?.label || `${Math.floor(scanStart)}s`}...`);
        for (let time = scanStart; time <= scanEnd; time += 1 / previewPlan.microScanCadence) {
          video.currentTime = Math.min(duration, time);
          await sleep(16);
        }
        video.pause();
        await sleep(120);
      }
    }
  };

  const [analysisResult, setAnalysisResult] = useState({
    score: null,
    statusText: "Awaiting media upload. Drop a video, image, or audio file — or paste a URL to begin.",
    sha: "N/A",
    flags: [],
    verifications: [
      { label: "EXIF & Provenance", value: "Pending", status: "pending", icon: FileCheck },
      { label: "Spatial & Facial Mesh", value: "Pending", status: "pending", icon: ScanFace },
      { label: "Audio AI Spectrum", value: "Pending", status: "pending", icon: AudioLines },
    ]
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load saved history
  useEffect(() => {
    try {
      const stored = localStorage.getItem("deepsync_reports_history");
      if (stored) setSavedReports(JSON.parse(stored));
    } catch (e) { /* ignore */ }
  }, []);

  // Clipboard detection & URL persistence on load
  useEffect(() => {
    const savedUrl = localStorage.getItem("maya_last_url");
    if (savedUrl) setInputUrl(savedUrl);
    
    // Try to auto-detect clipboard URL (with graceful fallback)
    navigator.clipboard?.readText()
      .then(text => {
        if (!savedUrl && (text.includes('youtube') || text.includes('http'))) {
          setInputUrl(text);
          localStorage.setItem("maya_last_url", text);
        }
      })
      .catch(() => {}); // Silently fail if no clipboard permission
  }, []);

  // Persist URL to localStorage on change
  useEffect(() => {
    if (inputUrl) {
      localStorage.setItem("maya_last_url", inputUrl);
    }
  }, [inputUrl]);

  useEffect(() => {
    const updateMobileView = () => setIsMobileView(window.innerWidth <= 768);
    updateMobileView();
    window.addEventListener('resize', updateMobileView);
    return () => window.removeEventListener('resize', updateMobileView);
  }, []);

  // Thumbnail capture
  const captureVideoThumbnail = () => {
    if (!videoRef.current) return null;
    try {
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return null;
      const canvas = document.createElement("canvas");
      canvas.width = Math.min(video.videoWidth, 480);
      canvas.height = Math.min(video.videoHeight, 270);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (canvasRef.current) ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setThumbnailUrl(dataUrl);
      return dataUrl;
    } catch (e) { return null; }
  };

  useEffect(() => {
    if (mediaSrc && videoRef.current && mediaType === 'video') {
      const timer = setTimeout(() => captureVideoThumbnail(), 800);
      return () => clearTimeout(timer);
    }
  }, [mediaSrc, isAnalyzing, mediaType]);

  // FaceMesh callback (video only)
  const handleFaceMeshResults = useCallback(({ isFaceless, facialAnomalies: fa, liveLipSync: ls, meshMetrics: mm }) => {
    if (typeof isFaceless === 'boolean') setIsFacelessMode(isFaceless);
    if (fa) setFacialAnomalies(fa);
    if (ls) {
      setLiveLipSync(ls);
    }
    if (mm) analysisData.current.meshMetrics = mm;
  }, []);

  // Only activate FaceMesh for video media
  useFaceMesh(videoRef, canvasRef, handleFaceMeshResults, isAnalyzing && mediaType === 'video' && (mediaProfile?.shouldUseFaceMesh ?? true));

  useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 5000); return () => clearTimeout(t); } }, [error]);

  // ─── RESET ────────────────────────────────────────────────
  const handleAnalyzeNew = () => {
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.src = ""; }
    setMediaSrc(null); setMediaType(null); setYoutubeId(null);
    setFileDetails(null); setThumbnailUrl(null);
    setIsAnalyzing(false); setAnalysisStep(""); setEstimatedTime(null);
    setFacialAnomalies([]); setPythonAvSync(null);
    setIsFacelessMode(false); setIsLongVideo(false);
    setAudioAiResult(null); setYtMetadata(null); setNlpMetadataResult(null);
    setExifData(null); setMediaResolution(null); setMediaSampleRate(null);
    setMediaProfile(null); setSamplingPlan(null); setPlayheadTime(0); setLinkFailure(null);
    analysisData.current = { sha: "N/A", meta: {}, audioFlags: [], meshMetrics: {}, audioKinematics: null, mediaProfile: null, samplingPlan: null, duration: 0 };
    setAnalysisResult({
      score: null,
      statusText: "Awaiting media upload. Drop a video, image, or audio file — or paste a URL to begin.",
      sha: "N/A", flags: [],
      verifications: [
        { label: "EXIF & Provenance", value: "Pending", status: "pending", icon: FileCheck },
        { label: "Spatial & Facial Mesh", value: "Pending", status: "pending", icon: ScanFace },
        { label: "Audio AI Spectrum", value: "Pending", status: "pending", icon: AudioLines },
      ]
    });
  };

  // ─── FINALIZE ANALYSIS (Unified Master Formula) ───────────
  const finalizeAnalysis = useCallback(() => {
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    setAnalysisStep("Finalizing MAYA Scorecard...");
    captureVideoThumbnail();

    const { sha, meta, audioFlags, ytMetadata: refYtMeta } = analysisData.current;
    const activeYtMetadata = refYtMeta || ytMetadata;
    const metadataPayload = activeYtMetadata ? {
      title: activeYtMetadata.title || '',
      description: activeYtMetadata.description || '',
      channel: activeYtMetadata.channel || '',
      tags: activeYtMetadata.tags || [],
      url: inputUrl || activeYtMetadata.url || '',
      filename: '',
    } : {
      title: fileDetails?.name || '',
      description: inputUrl || '',
      channel: '',
      tags: [],
      url: inputUrl || '',
      filename: fileDetails?.name || '',
    };

    const metadataRes = analyzeMetadataFirewall(metadataPayload);
    const urlMetadataRes = nlpMetadataResult?.isSyntheticMetadata ? nlpMetadataResult : null;
    const effectiveMetadataRes = urlMetadataRes
      ? {
          ...metadataRes,
          isSyntheticMetadata: true,
          matchedKeywords: [...new Set([...(metadataRes.matchedKeywords || []), ...(urlMetadataRes.matchedKeywords || [])])],
          highRiskKeywords: [...new Set([...(metadataRes.highRiskKeywords || []), ...(urlMetadataRes.highRiskKeywords || [])])],
          hardCap: Math.min(metadataRes.hardCap ?? 100, urlMetadataRes.hardCap ?? 100),
          flags: [...(metadataRes.flags || []), ...(urlMetadataRes.flags || [])],
          provenanceValue: metadataRes.provenanceValue || urlMetadataRes.provenanceValue,
        }
      : metadataRes;
    const audioMetrics = {
      hasTtsAudioSignature: !!audioAiResult?.isSyntheticAudio,
      // Only penalize confirmed splice events, not general amplitude spikes
      hasAbruptDecibelSpikes: (analysisData.current.audioFlags || []).some(
        f => f.label === 'Abrupt Volume Splice'
      ),
    };
    const facialMetrics = {
      isFacelessMedia: mediaType === 'audio' || isFacelessMode,
      ...(analysisData.current.meshMetrics || {})
    };

    const avSyncMetrics = pythonAvSync || {};
    const provenanceLayer = {
      verifiedCount: exifData?.hasExif || exifData?.hasC2PA ? 3 : 1,
      suspiciousCount: effectiveMetadataRes.isSyntheticMetadata ? 1 : 0,
      flaggedCount: (effectiveMetadataRes.highRiskKeywords || []).length > 0 ? 1 : 0,
      text: [effectiveMetadataRes.matchedKeywords || [], metadataPayload.title, metadataPayload.url].flat().join(' '),
      sha: sha,
      c2pa: exifData?.hasC2PA ? 'Present' : 'Not detected',
      exif: exifData?.hasExif ? 'Present' : 'Metadata stripped',
      summary: effectiveMetadataRes.isSyntheticMetadata ? 'Synthetic metadata markers detected.' : 'Provenance looks consistent.',
    };
    const visionLayer = {
      facesDetected: mediaProfile?.shouldUseFaceMesh === false || mediaType === 'audio' || isFacelessMode ? 0 : 1,
      verifiedCount: (!facialMetrics.hasUnnaturalMeshSmoothing && !facialMetrics.hasTeleportationJitter && !facialMetrics.hasZeroBlinkRate) ? 3 : 0,
      suspiciousCount: (facialMetrics.hasUnnaturalMeshSmoothing || facialMetrics.hasTeleportationJitter) ? 1 : 0,
      flaggedCount: facialMetrics.hasZeroBlinkRate ? 1 : 0,
      summary: mediaProfile?.isStylized
        ? 'Stylized content routed away from face mesh.'
        : (facialMetrics.hasTeleportationJitter || facialMetrics.hasUnnaturalMeshSmoothing)
          ? 'Spatial warping detected.'
          : 'Biometric checks normal.',
    };
    const audioLayer = {
      verifiedCount: !audioMetrics.hasTtsAudioSignature && !audioMetrics.hasAbruptDecibelSpikes ? 3 : 0,
      suspiciousCount: audioMetrics.hasAbruptDecibelSpikes ? 1 : 0,
      flaggedCount: audioMetrics.hasTtsAudioSignature ? 1 : 0,
      summary: audioMetrics.hasTtsAudioSignature
        ? 'Vocoder / splicing anomaly present.'
        : audioMetrics.hasAbruptDecibelSpikes
          ? 'Ambient noise variance noted.'
          : 'Acoustic sync aligned.',
    };

    const scoreResult = scoreMediaConsensus({
      provenance: provenanceLayer,
      vision: visionLayer,
      audio: audioLayer,
      context: {
        url: inputUrl,
        title: metadataPayload.title,
        description: metadataPayload.description,
        c2paTags: metadataPayload.tags,
      },
    });
    const score = scoreResult.masterScore;
    const combinedFlags = [
      ...effectiveMetadataRes.flags,
      ...(audioAiResult?.flags || []),
      ...audioFlags.map(f => ({ ...f, label: f.label || 'Audio Kinematic Event' })),
      ...(mediaType === 'video' && mediaProfile?.shouldUseFaceMesh !== false
        ? facialAnomalies.map(f => ({ ...f, seconds: f.time, label: f.type, detail: f.detail || '' }))
        : [])
    ];
    const duration = Number(videoRef.current?.duration || analysisData.current.duration || 0);
    const derivedSamplingPlan = buildSamplingPlan({
      duration,
      flags: combinedFlags,
      audioSamples: (analysisData.current.audioFlags || []).map((flag, index) => ({
        seconds: flag.seconds ?? index * 10,
        db: flag.label === 'Abrupt Volume Splice' ? 1 : flag.label === 'TTS Vocoder Signature' ? 0.9 : 0.1,
      })),
      mediaLabel: mediaProfile?.displayLabel || (mediaType || 'video'),
    });
    analysisData.current.samplingPlan = derivedSamplingPlan;
    setSamplingPlan(derivedSamplingPlan);
    // Human-readable score breakdown for export certificate + Scorecard tooltip
    const facialStatus = mediaType === 'audio'
      ? 'N/A — Standalone Audio'
      : mediaProfile?.isStylized
        ? 'Inconclusive / Faceless'
        : facialMetrics.hasTeleportationJitter
          ? 'Spatial Warping Detected'
          : facialMetrics.hasUnnaturalMeshSmoothing
            ? 'Spatial Warping Detected'
            : facialMetrics.hasZeroBlinkRate
              ? 'Inconclusive / Faceless'
              : 'Biometric Consistency: Normal';

    const newFlags = combinedFlags;
    if (pythonAvSync?.desync_events) {
      pythonAvSync.desync_events.forEach(e => {
        if (!newFlags.some(f => f.label === e.type && f.time === e.timestamp)) {
          newFlags.push({ time: e.timestamp, seconds: e.seconds, label: e.type, detail: e.detail });
        }
      });
    }

    // ── Contextual status message: tells the user WHICH layer flagged and WHY ──
    let statusText = '';
    const deductions = [];

    // Layer 1: metadata
    if (effectiveMetadataRes.isSyntheticMetadata) {
      const kw = effectiveMetadataRes.matchedKeywords[0] || 'AI keyword';
      const isHigh = (effectiveMetadataRes.highRiskKeywords?.length || 0) > 0;
      deductions.push(
        isHigh
          ? `High-risk AI signal detected in metadata ("${kw}") — score hard-capped.`
          : `AI-adjacent keyword "${kw}" detected in title/metadata.`
      );
    }

    // Layer 3: audio TTS
    if (audioMetrics.hasTtsAudioSignature) {
      const conf = audioAiResult?.confidence ?? 0;
      const flatness = audioAiResult?.spectralFlatness
        ? ` (spectral flatness: ${(audioAiResult.spectralFlatness * 100).toFixed(0)}%)`
        : '';
      deductions.push(`TTS/synthetic audio vocoder signature detected${flatness} — confidence ${conf}%.`);
    } else if (audioMetrics.hasAbruptDecibelSpikes) {
      deductions.push('Abrupt audio splice detected — possible laugh-track or dubbed audio injection.');
    }

    // Layer 2: facial
    if (!facialMetrics.isFacelessMedia) {
      if (facialMetrics.hasUnnaturalMeshSmoothing && facialMetrics.hasTeleportationJitter) {
        deductions.push('AI avatar signature: near-zero Z-depth variance + centroid teleportation detected.');
      } else if (facialMetrics.hasUnnaturalMeshSmoothing) {
        deductions.push('Unnatural facial mesh smoothing (σ < 0.0008) — consistent with diffusion model avatar.');
      } else if (facialMetrics.hasTeleportationJitter) {
        deductions.push('Facial landmark teleportation jitter detected between frames.');
      } else if (facialMetrics.hasZeroBlinkRate) {
        deductions.push('Zero blink rate across observation window — inconsistent with natural human behaviour.');
      }
    }

    // Compose final message
    if (deductions.length === 0) {
      if (score >= 90) {
        statusText = 'All forensic layers clear. No synthetic signals detected. High confidence in authenticity.';
      } else if (score >= 76) {
        statusText = 'No significant anomalies detected. Media appears authentic.';
      } else if (score >= 50) {
        statusText = 'Minor inconsistencies noted. Review flagged moments for context.';
      } else {
        statusText = 'Multiple anomaly signals detected. Low confidence in media authenticity.';
      }
    } else if (deductions.length === 1) {
      statusText = deductions[0];
    } else {
      statusText = deductions[0] + ' Additionally: ' + deductions.slice(1).join(' ');
    }

    const provenanceValue = effectiveMetadataRes.provenanceValue || (exifData?.software || 'Provenance appears consistent');
    const provenanceStatus = effectiveMetadataRes.isSyntheticMetadata ? 'warning' : 'verified';
    const layer2Status = mediaProfile?.isStylized
      ? 'Stylized Content — Face Mesh Disabled'
      : facialStatus;
    const layer3Status = mediaType === 'image'
      ? 'N/A — Static Image'
      : (audioAiResult ? `${audioAiResult.status} (${audioAiResult.confidence}%)` : audioLayer.summary);

    const provenanceCheck = !!(exifData?.hasExif || exifData?.hasC2PA || ytMetadata);
    const metadataCheck = !effectiveMetadataRes.isSyntheticMetadata;
    const facialCheck = mediaType === 'audio' || mediaType === 'image' || isFacelessMode
      ? 'N/A'
      : !(facialMetrics.hasUnnaturalMeshSmoothing || facialMetrics.hasTeleportationJitter || facialMetrics.hasZeroBlinkRate || facialAnomalies.length > 0);
    const audioCheck = mediaType === 'image' ? 'N/A' : !audioMetrics.hasTtsAudioSignature;
    const avSyncCheck = mediaType === 'video' || mediaType === 'youtube' ? (pythonAvSync?.correlation_score >= 80) : 'N/A';

    const checks = [
      { label: 'Metadata', result: metadataCheck },
      { label: 'Provenance', result: provenanceCheck },
      { label: 'Facial Mesh', result: facialCheck },
      { label: 'Audio Spectrum', result: audioCheck },
      { label: 'AV Sync', result: avSyncCheck }
    ];

    const validChecks = checks.filter((c) => c.result !== 'N/A');
    const checksPassed = validChecks.filter((c) => c.result === true).length;
    const checksTotal = validChecks.length;
    const checksSummary = `${checksPassed}/${checksTotal} checks passed`;
    const reportFields = buildEnterpriseReportFields({
      mediaProfile,
      samplingPlan: derivedSamplingPlan,
      analysisResult: { flags: newFlags },
    });
    const forensicReport = generateForensicReport({
      score,
      flags: newFlags,
      mediaType,
      duration,
      provenance: {
        sha,
        status: provenanceStatus,
        c2pa: exifData?.hasC2PA ? 'Present' : 'Not detected',
        exif: exifData?.hasExif ? 'Present' : 'Metadata stripped',
        summary: provenanceValue,
        visionSummary: visionLayer.summary,
        audioSummary: audioLayer.summary,
      },
      diagnostics: scoreResult.diagnostics,
      samplingPlan: derivedSamplingPlan,
    });

    setAnalysisResult({
      score,
      statusText,
      sha,
      flags: newFlags,
      checksSummary,
      mediaTypeLabel: reportFields.mediaTypeIdentified,
      samplingStrategy: reportFields.samplingStrategyUsed,
      primaryAnomaly: reportFields.primaryAnomalyFound,
      forensicReport,
      diagnostics: [
        {
          layer: 'Layer 1 - Provenance',
          label: effectiveMetadataRes.isSyntheticMetadata ? 'Synthetic Signature Found' : (exifData?.hasExif || exifData?.hasC2PA ? 'Verified C2PA Standard' : 'Metadata Stripped'),
          tone: effectiveMetadataRes.isSyntheticMetadata ? 'red' : ((exifData?.hasExif || exifData?.hasC2PA) ? 'green' : 'yellow'),
        },
        {
          layer: 'Layer 2 - Vision',
          label: mediaProfile?.isStylized || mediaType === 'audio' ? 'Inconclusive / Faceless' : ((facialMetrics.hasTeleportationJitter || facialMetrics.hasUnnaturalMeshSmoothing) ? 'Spatial Warping Detected' : 'Biometric Consistency: Normal'),
          tone: mediaProfile?.isStylized || mediaType === 'audio' ? 'yellow' : ((facialMetrics.hasTeleportationJitter || facialMetrics.hasUnnaturalMeshSmoothing) ? 'red' : 'green'),
        },
        {
          layer: 'Layer 3 - Audio',
          label: audioMetrics.hasTtsAudioSignature ? 'Vocoder / Splicing Anomaly' : (audioMetrics.hasAbruptDecibelSpikes ? 'Ambient Noise Variance' : 'Acoustic Sync: Aligned'),
          tone: audioMetrics.hasTtsAudioSignature ? 'red' : (audioMetrics.hasAbruptDecibelSpikes ? 'yellow' : 'green'),
        },
      ],
      verifications: [
        {
          label: "EXIF & Provenance",
          value: provenanceValue,
          status: provenanceStatus,
          icon: FileCheck
        },
        {
          label: "Spatial & Facial Mesh",
          value: layer2Status,
          status: (mediaType === 'audio' || mediaType === 'image' || isFacelessMode) ? "verified" : (facialCheck ? "verified" : "warning"),
          icon: ScanFace
        },
        {
          label: "Audio AI Spectrum",
          value: layer3Status,
          status: mediaType === 'image' ? "verified" : (audioMetrics.hasTtsAudioSignature ? "warning" : "verified"),
          icon: AudioLines
        },
      ]
    });
    setIsAnalyzing(false);
  }, [facialAnomalies, pythonAvSync, liveLipSync, nlpMetadataResult, audioAiResult, mediaType, isFacelessMode, ytMetadata, fileDetails, inputUrl, mediaProfile, exifData]);

  // Auto-update estimated time countdown
  useEffect(() => {
    if (!isAnalyzing || !estimatedTime) return;
    const interval = setInterval(() => {
      setEstimatedTime(prev => {
        if (prev && prev > 0) return Math.max(0, prev - 0.1);
        return 0;
      });
    }, 6000); // Update every 6 seconds for visual feedback
    return () => clearInterval(interval);
  }, [isAnalyzing, estimatedTime]);

  // ─── TYPE-AWARE ANALYSIS ENGINE ──────────────────────────
  const runAnalysisOnSource = async (source) => {
    setIsAnalyzing(true); setError(null);
    setFacialAnomalies([]); setPythonAvSync(null);
    setEstimatedTime(null); // Reset time estimate
    analysisData.current = { sha: "N/A (Streamed)", meta: { software: "Streamed Media" }, audioFlags: [], meshMetrics: {}, audioKinematics: null, mediaProfile: mediaProfile, samplingPlan: null, duration: 0 };
    setAnalysisResult(prev => ({ ...prev, score: null, statusText: "Analysis in progress..." }));

    const type = source.mediaType || mediaType || 'video';
    const profile = classifyMediaInput({
      file: source.file || null,
      url: inputUrl || mediaSrc || '',
      title: fileDetails?.name || '',
      description: inputUrl || '',
      mediaType: type,
      duration: videoRef.current?.duration || 0,
    });
    setMediaProfile(profile);
    analysisData.current.mediaProfile = profile;

    // Immediate metadata firewall scan of title & URL
    const immediateNlp = analyzeMetadataFirewall({ title: fileDetails?.name || '', description: inputUrl || '', url: inputUrl });
    if (immediateNlp.isSyntheticMetadata) {
      setNlpMetadataResult(immediateNlp);
    }

    // LAYER 1: EXIF + SHA-256 (all types)
    if (source.type === 'file' && source.file) {
      setAnalysisStep(`1/3: Extracting ${type === 'image' ? 'EXIF/C2PA' : 'metadata'} & SHA-256...`);
      analysisData.current.sha = await calculateFileHash(source.file);
      const meta = await extractFileMetadata(source.file);
      analysisData.current.meta = meta;
      setExifData(meta);
    }

    // LAYER 3: Audio AI — spectral flatness + TTS classification (video + audio only)
    if (type === 'video' || type === 'audio') {
      if (source.type === 'file' && source.file) {
        setAnalysisStep("2/3: Running Audio AI Spectral Analysis...");
        const audioResult = await analyzeAudioKinematics(source.file);
        // kinematics now returns { anomalies[], aiClassification: { isSyntheticAudio, confidence, status, flags } }
        const rawAnomalies = Array.isArray(audioResult) ? audioResult : (audioResult.anomalies || []);
        const classification = Array.isArray(audioResult) ? null : (audioResult.aiClassification || null);
        analysisData.current.audioKinematics = audioResult;
        analysisData.current.audioFlags = rawAnomalies;
        if (classification) setAudioAiResult(classification);
      }
    }

    // Python AV-Sync (video only)
    if (type === 'video' || type === 'youtube') {
      try {
        setAnalysisStep("2/3: Triggering Python OpenCV + Librosa Analysis...");
        const pyResp = await fetch(`${BACKEND_URL}/api/analyze-av-sync`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoUrl: source.type === 'stream' ? mediaSrc : null, videoPath: source.file?.name || null })
        });
        if (pyResp.ok) {
          const pyData = await pyResp.json();
          if (pyData.success) setPythonAvSync(pyData);
        }
      } catch (e) { console.warn("Python AV Sync fallback:", e.message); }
    }

    // LAYER 2: Facial Mesh (video only) or immediate finalize (image/audio/youtube-short)
    if (type === 'video') {
      setAnalysisStep("3/3: Running WebGL Face Mesh & Audio Forensics...");
      const video = videoRef.current;
      let longVideoDetected = false;
      if (video) {
        video.volume = 0.15;
        if (video.duration > 180) {
          longVideoDetected = true;
          setIsLongVideo(true);
          // Estimate processing time: ~1 min per 3-min segment + overhead
          const segments = 3; // Default sampling strategy
          const timePerSegment = 25; // seconds per segment
          const estimatedSeconds = (segments * timePerSegment) + 15; // Add scanning overhead
          setEstimatedTime(Math.ceil(estimatedSeconds / 60)); // Convert to minutes
        } else {
          setEstimatedTime(2); // Short videos take ~1-2 min
        }
      }

      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
      if (smartSampleMode && longVideoDetected && video) {
        await runLongVideoSmartSampling();
        finalizeAnalysis();
      } else {
        if (video) {
          video.play().catch(() => {});
        }
        analysisTimeoutRef.current = setTimeout(() => finalizeAnalysis(), 5000);
      }
    } else {
      // Image, Audio: finalize after brief scan
      setAnalysisStep("3/3: Finalizing forensic layers...");
      setEstimatedTime(1); // Quick analysis
      setTimeout(() => finalizeAnalysis(), 800);
    }
  };

  // ─── FILE HANDLER ─────────────────────────────────────────
  const handleProcessFile = (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const type = classifyMediaType(file);
    setMediaType(type);
    setMediaSrc(objectUrl);
    setYoutubeId(null);

    const profile = classifyMediaInput({ file, mediaType: type, duration: 0 });
    setMediaProfile(profile);
    analysisData.current.mediaProfile = profile;

    setFileDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.type || getFormatLabel(file, null, type)
    });

    setTimeout(() => {
      if (type === 'video' && videoRef.current) videoRef.current.src = objectUrl;
      runAnalysisOnSource({ type: 'file', file, mediaType: type });
    }, 100);
  };

  // ─── URL HANDLER ──────────────────────────────────────────
  const handleUrlSubmit = async () => {
    if (!inputUrl) return;
    setIsAnalyzing(true);
    setAnalysisStep("Resolving URL & extracting metadata...");
    setError(null);
    setLinkFailure(null);

    const validation = validateMediaUrl(inputUrl);
    if (!validation.isValid) {
      const message = validation.reason || getFallbackMessage();
      setLinkFailure({ message });
      setError(message);
      setIsAnalyzing(false);
      setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
      return;
    }

    const type = classifyMediaType(null, inputUrl);
    setMediaType(type);

    // Set estimated time based on URL type (YouTube videos can be long)
    if (type === 'youtube') {
      setEstimatedTime(3); // YouTube typically needs 2-3 minutes
    }

    // Run metadata firewall scan immediately on the URL input string itself
    const urlMetadataRes = analyzeMetadataFirewall({ title: '', description: inputUrl, url: inputUrl });
    if (urlMetadataRes.isSyntheticMetadata) {
      setNlpMetadataResult(urlMetadataRes);
    }

    // YouTube: embed iframe directly
    if (type === 'youtube') {
      const ytId = extractYouTubeId(inputUrl);
      setYoutubeId(ytId);

      try {
        const resp = await fetch(`${BACKEND_URL}/api/process-url`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: inputUrl }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Backend failed.');

        const streamUrl = data.streamUrl || inputUrl;
        setMediaSrc(streamUrl);

        const profile = classifyMediaInput({
          url: inputUrl,
          title: data.metadata?.title || '',
          description: data.metadata?.description || '',
          mediaType: 'video',
          duration: data.metadata?.duration || 0,
        });
        setMediaProfile(profile);
        analysisData.current.mediaProfile = profile;

        if (data.metadata) {
          setYtMetadata(data.metadata);
          analysisData.current.ytMetadata = data.metadata;
          const metadataRes = analyzeMetadataFirewall(data.metadata);
          if (metadataRes.isSyntheticMetadata || urlMetadataRes.isSyntheticMetadata) {
            const chosen = metadataRes.isSyntheticMetadata ? metadataRes : urlMetadataRes;
            setNlpMetadataResult(chosen);
            analysisData.current.nlpMetadataResult = chosen;
          }
          if (data.metadata.duration > 180) setIsLongVideo(true);
        }

        if (!streamUrl || Number(data.metadata?.duration || 0) === 0) {
          const message = getFallbackMessage();
          setLinkFailure({ message });
          setError(message);
          setIsAnalyzing(false);
          setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
          return;
        }

        setFileDetails({ name: data.metadata?.title || inputUrl, size: data.metadata?.channel ? `Channel: ${data.metadata.channel}` : "YouTube", type: "YouTube Web Stream" });

        setTimeout(() => {
          if (videoRef.current) videoRef.current.src = streamUrl;
          runAnalysisOnSource({ type: 'stream', mediaType: 'youtube' });
        }, 150);
      } catch (err) {
        // ── Backend offline fallback: use YouTube oEmbed API (public, no auth, no CORS) ──
        // This lets us still scan the video title for AI keywords even without the backend
        try {
          setAnalysisStep("Fetching YouTube metadata via oEmbed...");
          const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(inputUrl)}&format=json`;
          const oEmbedResp = await fetch(oEmbedUrl);
          if (oEmbedResp.ok) {
            const oEmbedData = await oEmbedResp.json();
            const title   = oEmbedData.title   || '';
            const channel = oEmbedData.author_name || '';

            // Store as ytMetadata so finalizeAnalysis can scan it
            const oEmbedMeta = { title, channel, description: '', tags: [], url: inputUrl };
            setYtMetadata(oEmbedMeta);
            analysisData.current.ytMetadata = oEmbedMeta;
            const profile = classifyMediaInput({ url: inputUrl, title, description: '', mediaType: 'video' });
            setMediaProfile(profile);
            analysisData.current.mediaProfile = profile;
            setFileDetails({ name: title || inputUrl, size: `Channel: ${channel}`, type: 'YouTube Web Stream' });

            // Immediately run the metadata firewall so the red banner appears right away
            const metadataRes = analyzeMetadataFirewall(oEmbedMeta);
            if (metadataRes.isSyntheticMetadata) {
              setNlpMetadataResult(metadataRes);
              analysisData.current.nlpMetadataResult = metadataRes;
            }
            if (Number(oEmbedData.duration_seconds || 0) === 0) {
              const message = getFallbackMessage();
              setLinkFailure({ message });
              setError(message);
              setIsAnalyzing(false);
              setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
              return;
            }
          } else {
            const message = getFallbackMessage();
            setLinkFailure({ message });
            setFileDetails({ name: inputUrl, size: 'YouTube', type: 'YouTube Web Stream' });
            setError(message);
            setIsAnalyzing(false);
            setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
            return;
          }
        } catch (_oEmbedErr) {
          const message = getFallbackMessage();
          setLinkFailure({ message });
          setFileDetails({ name: inputUrl, size: 'YouTube', type: 'YouTube Web Stream' });
          setError(message);
          setIsAnalyzing(false);
          setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
          return;
        }
        setTimeout(() => runAnalysisOnSource({ type: 'stream', mediaType: 'youtube' }), 150);
      }
      return;
    }

    // Image URL: render directly
    if (type === 'image') {
      setMediaSrc(inputUrl);
      const fileName = inputUrl.split('/').pop() || inputUrl;
      setFileDetails({ name: fileName, size: "Remote", type: getFormatLabel(null, inputUrl, 'image') });
      setAnalysisStep("Analyzing remote image...");
      analysisData.current = { sha: "N/A (Remote)", meta: { title: fileName, url: inputUrl, software: "Remote Image" }, audioFlags: [] };
      if (urlMetadataRes.isSyntheticMetadata) setNlpMetadataResult(urlMetadataRes);
      setAnalysisResult(prev => ({ ...prev, score: null, statusText: "Analysis in progress..." }));
      setTimeout(() => finalizeAnalysis(), 1200);
      return;
    }

    // Video/Audio URL: resolve via backend
    try {
      const resp = await fetch(`${BACKEND_URL}/api/process-url`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Backend failed.');

      const streamUrl = data.streamUrl || inputUrl;
      if (!streamUrl) {
        const message = getFallbackMessage();
        setLinkFailure({ message });
        setError(message);
        setIsAnalyzing(false);
        setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
        return;
      }
      setMediaSrc(streamUrl);
      setFileDetails({ name: data.metadata?.title || inputUrl, size: "Streamed", type: getFormatLabel(null, inputUrl, type) });

      const profile = classifyMediaInput({
        url: inputUrl,
        title: data.metadata?.title || '',
        description: inputUrl,
        mediaType: type,
        duration: data.metadata?.duration || 0,
      });
      setMediaProfile(profile);
      analysisData.current.mediaProfile = profile;

      setTimeout(() => {
        if (type === 'video' && videoRef.current) videoRef.current.src = streamUrl;
        runAnalysisOnSource({ type: 'stream', mediaType: type });
      }, 150);
    } catch (err) {
      const message = getFallbackMessage();
      setLinkFailure({ message });
      setError(message);
      setIsAnalyzing(false);
      setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] }));
      return;
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.[0]) handleProcessFile(e.dataTransfer.files[0]); };

  // ─── SAVE / EXPORT / REOPEN ───────────────────────────────
  const handleSaveReport = () => {
    const thumb = thumbnailUrl || captureVideoThumbnail();
    const item = {
      id: "REP-" + Date.now(), timestamp: new Date().toLocaleString(),
      fileName: fileDetails?.name || inputUrl || "Media", mediaSrc, fileDetails, thumbnailUrl: thumb, mediaType,
      score: analysisResult.score ?? null, statusText: analysisResult.statusText,
      flags: analysisResult.flags, sha: analysisResult.sha, verifications: analysisResult.verifications, pythonAvSync,
      mediaTypeLabel: analysisResult.mediaTypeLabel,
      samplingStrategy: analysisResult.samplingStrategy,
      primaryAnomaly: analysisResult.primaryAnomaly,
      forensicReport: analysisResult.forensicReport,
      diagnostics: analysisResult.diagnostics,
    };
    const updated = [item, ...savedReports];
    setSavedReports(updated);
    localStorage.setItem("deepsync_reports_history", JSON.stringify(updated));
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleReopenProject = (report) => {
    setShowHistoryModal(false);
    if (report.mediaSrc) setMediaSrc(report.mediaSrc);
    if (report.fileDetails) setFileDetails(report.fileDetails);
    if (report.thumbnailUrl) setThumbnailUrl(report.thumbnailUrl);
    if (report.mediaType) setMediaType(report.mediaType);
    if (report.pythonAvSync) setPythonAvSync(report.pythonAvSync);
    setAnalysisResult({
      score: report.score,
      statusText: report.statusText,
      sha: report.sha || "N/A",
      flags: report.flags || [],
      verifications: report.verifications || analysisResult.verifications,
      mediaTypeLabel: report.mediaTypeLabel,
      samplingStrategy: report.samplingStrategy,
      primaryAnomaly: report.primaryAnomaly,
      forensicReport: report.forensicReport,
      diagnostics: report.diagnostics || analysisResult.diagnostics,
    });
    setTimeout(() => { if (videoRef.current && report.mediaSrc) videoRef.current.src = report.mediaSrc; }, 100);
  };

  const handleExportReport = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      backgroundColor: '#0B132B',
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 28;
    const renderWidth = pageWidth - (margin * 2);
    const renderHeight = (canvas.height * renderWidth) / canvas.width;
    let remainingHeight = renderHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, renderWidth, renderHeight);
    remainingHeight -= (pageHeight - margin * 2);

    while (remainingHeight > 0) {
      pdf.addPage();
      position = margin - (renderHeight - remainingHeight);
      pdf.addImage(imgData, 'PNG', margin, position, renderWidth, renderHeight);
      remainingHeight -= (pageHeight - margin * 2);
    }

    pdf.save(`MAYA_Certificate_${Date.now()}.pdf`);
  };

  // Computed metrics
  const currentMar = (liveLipSync.mar || 0.28).toFixed(3);
  const currentAudioVolume = Math.round((liveLipSync.audioVolume || 0.42) * 100);
  const phonemeMatchScore = pythonAvSync?.correlation_score || 91;
  const isExportReady = !isAnalyzing && analysisResult.score !== null;
  const lipSyncStatus = mediaType === 'video' ? (liveLipSync.mar > 0.4 && liveLipSync.audioVolume < 0.2 ? 'DESYNC' : 'IN SYNC') : 'N/A';
  const lipSyncDetail = mediaType === 'video'
    ? (liveLipSync.mar > 0.4 && liveLipSync.audioVolume < 0.2
      ? 'Audio activity detected without consistent mouth movement; possible lip-sync anomaly.'
      : 'Mouth motion and audio energy appear aligned for the visible face.')
    : 'Lip-sync diagnostics only apply to video sources.';
  const exportHighlightClasses = isExportReady
    ? 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30 animate-pulse'
    : 'bg-cyan-600 hover:bg-cyan-500';

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="flex h-screen w-full bg-[#080D18] text-slate-200 font-sans overflow-hidden">

      {/* --- SIDEBAR --- */}
      <aside className="w-60 bg-[#0B132B] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="mb-8 px-2 pt-2">
            <h1 className="text-xl font-black text-white tracking-wider font-mono">MAYA</h1>
          </div>
          <nav className="space-y-1">
            {[
              { id: "Overview", icon: LayoutDashboard },
              { id: "Analysis", icon: BarChart3 },
              { id: "Timeline", icon: Clock },
              { id: "Reports", icon: FileText },
              { id: "History", icon: History },
              { id: "Settings", icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id}
                  onClick={() => { setActiveTab(item.id); if (item.id === "History") setShowHistoryModal(true); if (item.id === "Reports") setShowReportModal(true); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${isActive ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                  <span>{item.id}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/30 text-[10px] text-amber-300/90 leading-tight">
            <div className="flex items-center gap-1 font-semibold text-amber-400 mb-1"><Info className="h-3 w-3 shrink-0" /> Note</div>
            Demo UI. Final product algorithms will differ.
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/30 text-[10px] text-amber-300/90 leading-tight">
            <div className="flex items-center gap-1 font-semibold text-amber-400 mb-1"><Info className="h-3 w-3 shrink-0" /> Note</div>
               Currently Not Optimized for Smaller/mobile view kindly open it in dekstop view ! 
          </div>
          <div className="px-2 py-2 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 mb-0.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>468-Mesh Engine Active</span>
            </div>
            <div className="text-[10px] text-slate-500">Multi-Modal Forensics</div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#080D18]">
        {isMobileView && (
          <div className="border-b border-amber-500/20 bg-amber-500/10 text-amber-100 text-center text-xs font-mono px-4 py-3">
            Demo preview only. This app is not optimized for mobile yet — please use desktop view for the best experience. Mobile support coming soon.
          </div>
        )}

        {/* Top Header */}
        <header className="h-20 border-b border-slate-800/80 bg-[#0B132B]/50 px-6 flex flex-col justify-center shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-white tracking-wide">MAYA</h2>
              <span className="text-slate-600">/</span>
              <span className="text-xs text-slate-400">{activeTab}</span>
              {mediaType && (
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                  {mediaType.toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {saveSuccessNotice && <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">Saved!</span>}
              <button onClick={handleAnalyzeNew} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer">
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" /> Analyze New
              </button>
              <button onClick={handleSaveReport} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer">
                <FolderPlus className="h-3.5 w-3.5 text-cyan-400" /> Save
              </button>
              <button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer">
                <Eye className="h-3.5 w-3.5 text-indigo-400" /> Certificate
              </button>
              <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer">
                <History className="h-3.5 w-3.5 text-indigo-400" /> History ({savedReports.length})
              </button>
              <button onClick={handleExportReport} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-xl transition-all cursor-pointer ${isExportReady ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 shadow-cyan-500/50 scale-105' : 'bg-cyan-700 hover:bg-cyan-600 opacity-60'}`} disabled={!isExportReady} title="Export your forensic analysis certificate">
                <Download className="h-4 w-4" /> Export Certificate
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-[10px] font-mono text-slate-300 bg-slate-900/70 px-2 py-1 rounded border border-slate-800">Desktop view recommended; mobile support coming soon.</span>
          </div>
        </header>

        {/* Dashboard */}
        <div className="p-6 space-y-5 max-w-7xl mx-auto w-full">

          {/* === STATUS BANNERS === */}
          {isLongVideo && (
            <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-3 flex items-center justify-between text-xs text-amber-200 font-mono">
              <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-amber-400" /><span>Long media detected (&gt;3 mins). Smart Sample Forensics active.</span></div>
              <button onClick={() => setSmartSampleMode(!smartSampleMode)} className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] px-2.5 py-1 rounded cursor-pointer">
                {smartSampleMode ? "Smart Sample (Active)" : "Full Scan Mode"}
              </button>
            </div>
          )}
          {isExportReady && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-lg p-4 flex items-center justify-between text-sm text-emerald-100 font-mono">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><span>✓ Analysis complete! Your forensic report is ready.</span></div>
              <button onClick={handleExportReport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1">
                <Download className="h-3.5 w-3.5" /> Export Now
              </button>
            </div>
          )}
          {(isFacelessMode || mediaType === 'audio') && (
            <div className="bg-indigo-500/10 border border-indigo-500/40 rounded-lg p-3 flex items-center justify-between text-xs text-indigo-200 font-mono">
              <div className="flex items-center gap-2.5"><Mic className="h-4 w-4 text-indigo-400" /><span>{mediaType === 'audio' ? "Audio-Only Media — Analysis shifted to Audio AI Spectrum (Face penalties bypassed)" : "Faceless Media Mode — Facial Mesh bypassed (0 points deducted)"}</span></div>
              <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">Neutral Facial Layer</span>
            </div>
          )}
          {nlpMetadataResult?.isSyntheticMetadata && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 flex items-center justify-between text-xs text-red-200 font-mono">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span>
                  Synthetic Title/Metadata Marker Detected: "{nlpMetadataResult.matchedKeywords[0]}"
                  {nlpMetadataResult.hardCap <= 15 ? ' (Hard Capped ≤ 15%)' : ' (Hard Capped ≤ 40%)'}
                </span>
              </div>
              <span className="text-[10px] text-red-300 font-semibold bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                {nlpMetadataResult.hardCap <= 15 ? 'High Threat Flag' : 'Medium-High Threat Flag'}
              </span>
            </div>
          )}
          {isAnalyzing && (
            <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 flex items-center justify-between text-xs text-cyan-200 font-mono">
              <div className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin text-cyan-400" /><span>{analysisStep || "Running multi-layer analysis..."}{estimatedTime && <span className="text-cyan-300 ml-3">⏱ ~{Math.ceil(estimatedTime)} min remaining</span>}</span></div>
              <span className="text-[10px] text-cyan-400/80">MAYA Forensics Engine</span>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 flex items-center gap-3 text-xs text-red-300 font-mono">
              <XCircle className="h-4 w-4 text-red-400" /><span>{error}</span>
            </div>
          )}
          {linkFailure && (
            <LinkFallbackCard
              message={linkFailure.message}
              onUpload={() => fileInputRef.current?.click()}
              onRetry={() => { setLinkFailure(null); setInputUrl(''); }}
            />
          )}

          {/* === TOP ROW: SCORE + MEDIA PREVIEW === */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">

            {/* Scorecard */}
            <Scorecard score={analysisResult.score} statusText={analysisResult.statusText} mediaType={mediaType || 'video'} checksSummary={analysisResult.checksSummary} diagnosticBadges={analysisResult.diagnostics || []} />

            {/* Dynamic Media Preview / Dropzone */}
            <div className="bg-[#0B132B]/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl relative min-h-[300px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                  {mediaType === 'audio' ? <><Mic className="h-3.5 w-3.5 text-indigo-400" /> AUDIO WAVEFORM</> :
                   mediaType === 'image' ? <><ImageIcon className="h-3.5 w-3.5 text-cyan-400" /> IMAGE ANALYSIS</> :
                   mediaType === 'youtube' ? <><Video className="h-3.5 w-3.5 text-red-400" /> YOUTUBE STREAM</> :
                   <><Video className="h-3.5 w-3.5 text-cyan-400" /> VIDEO PREVIEW + LANDMARKS</>}
                </span>
                {fileDetails && <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded truncate max-w-[250px]">{fileDetails.name}</span>}
              </div>

              {mediaSrc || youtubeId ? (
                <>
                  {/* YOUTUBE */}
                  {mediaType === 'youtube' && youtubeId && !mediaSrc && <YouTubeEmbed videoId={youtubeId} />}

                  {/* IMAGE */}
                  {mediaType === 'image' && <ImageViewer src={mediaSrc} onImageLoad={(dims) => setMediaResolution(dims)} />}

                  {/* AUDIO */}
                  {mediaType === 'audio' && <AudioWaveform src={mediaSrc} onAudioLoad={(info) => setMediaSampleRate(info.sampleRate)} />}

                  {/* VIDEO */}
                  {(mediaType === 'video' || mediaType === 'youtube') && mediaSrc && (
                    <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video relative flex items-center justify-center">
                      <video ref={videoRef} src={mediaSrc} crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-contain z-10" controls autoPlay loop={!isAnalyzing} onEnded={finalizeAnalysis} onError={() => { const message = getFallbackMessage(); setLinkFailure({ message }); setError(message); setIsAnalyzing(false); setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] })); }} onTimeUpdate={() => setPlayheadTime(videoRef.current?.currentTime || 0)} onLoadedMetadata={() => { const duration = videoRef.current?.duration || 0; analysisData.current.duration = duration; if (duration > 180) setIsLongVideo(true); if (!duration || Number.isNaN(duration)) { const message = getFallbackMessage(); setLinkFailure({ message }); setError(message); setIsAnalyzing(false); setAnalysisResult(prev => ({ ...prev, score: null, statusText: message, flags: [] })); } }} onLoadedData={captureVideoThumbnail} />
                      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-contain pointer-events-none z-20" />
                    </div>
                  )}
                </>
              ) : (
                /* DROPZONE */
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex-1 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer ${isDragOver ? "border-cyan-400 bg-cyan-500/10" : "border-slate-800 hover:border-slate-700 bg-slate-900/40"}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])} accept="video/*,audio/*,image/*,.mp3,.wav,.aac,.m4a,.flac,.ogg,.jpg,.jpeg,.png,.webp,.avif" className="hidden" />
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3 text-cyan-400"><Upload className="h-6 w-6" /></div>
                  <h3 className="text-sm font-medium text-slate-200 mb-1">Drop Video, Image, or Audio Here</h3>
                  <p className="text-xs text-slate-500 mb-4">Supports MP4, WEBM, MOV, JPG, PNG, WEBP, MP3, WAV, AAC, FLAC</p>

                  <div className="w-full max-w-md flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="relative flex-1">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                      <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="Paste YouTube or media URL..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      />
                    </div>
                    <button onClick={handleUrlSubmit} disabled={isAnalyzing} className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer">Analyze URL</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* === MIDDLE ROW: LIP-SYNC + CHART (video only) === */}
          {mediaType === 'video' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-[#0B132B]/80 border border-slate-800 rounded-xl p-4 shadow-xl">
                <div className="flex flex-col gap-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2"><Mic className="h-3.5 w-3.5 text-indigo-400" /> LIP-SYNC DIAGNOSTIC</span>
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${lipSyncStatus === 'DESYNC' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>{lipSyncStatus}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-snug">
                    {lipSyncDetail}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2 font-mono">
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase">MAR</div>
                    <div className="text-sm font-bold text-white">{currentMar}</div>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Audio Level</div>
                    <div className="text-sm font-bold text-cyan-300">{currentAudioVolume}%</div>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Sync Status</div>
                    <div className={`text-sm font-bold ${liveLipSync.mar > 0.4 && liveLipSync.audioVolume < 0.2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {liveLipSync.mar > 0.4 && liveLipSync.audioVolume < 0.2 ? 'DESYNC' : 'IN SYNC'}
                    </div>
                  </div>
                </div>
              </div>

              <TimelineScrubber
                duration={samplingPlan?.totalDuration || videoRef.current?.duration || 0}
                segments={samplingPlan?.segments || []}
                anomalyBadges={samplingPlan?.anomalyBadges || []}
                currentTime={playheadTime}
                onSeek={(seconds) => { if (videoRef.current) videoRef.current.currentTime = seconds; }}
              />
            </div>
          )}

          {/* === BOTTOM ROW: VERIFICATIONS + METADATA + ATTRIBUTION === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Multi-Layer Status */}
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Multi-Layer Forensic Status</span>
              </div>
              <div>
                {analysisResult.verifications.map((v, i) => {
                  const Icon = v.icon;
                  const styles = { verified: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', warning: 'bg-amber-500/20 text-amber-300 border-amber-500/40', pending: 'bg-slate-700/20 text-slate-400 border-slate-700/50' };
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-slate-800 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-3.5 w-3.5 ${v.status === 'pending' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <div>
                          <div className="text-[12px] text-slate-200 font-medium">{v.label}</div>
                          <div className="text-[11px] text-slate-500">{v.value}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${styles[v.status]}`}>{v.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metadata Panel */}
            <MetadataPanel
              fileDetails={fileDetails} mediaType={mediaType} sha={analysisResult.sha}
              exifData={exifData} ytMetadata={ytMetadata}
              resolution={mediaResolution} sampleRate={mediaSampleRate}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="text-[12px] font-medium text-slate-400 mb-2">Final Verdict</div>
              <div className="space-y-2 text-[12px] font-mono text-slate-300">
                <div className="flex justify-between gap-4"><span className="text-slate-500">Media Type Identified:</span><span className="text-right">{analysisResult.mediaTypeLabel || mediaProfile?.displayLabel || 'Pending'}</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-500">Sampling Strategy Used:</span><span className="text-right">{analysisResult.samplingStrategy || samplingPlan?.strategyLabel || 'Pending'}</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-500">Primary Anomaly Found:</span><span className="text-right">{analysisResult.primaryAnomaly || samplingPlan?.primaryAnomaly?.rangeLabel || 'None'}</span></div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0F172A] p-4">
              <div className="flex items-center gap-1.5 mb-3"><Clock className="h-3.5 w-3.5 text-slate-500" /><span className="text-[12px] font-medium text-slate-400">Flagged Moments ({analysisResult.flags.length})</span></div>
              {analysisResult.flags.length === 0 ? (
                <p className="text-xs text-emerald-300 font-mono flex items-center gap-2 py-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {isAnalyzing ? 'Analysis in progress...' : 'Zero anomalies detected across all layers.'}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysisResult.flags.map((f, i) => (
                    <button key={i} onClick={() => { if (videoRef.current && f.seconds) videoRef.current.currentTime = f.seconds; }}
                      className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all px-2.5 py-1.5 cursor-pointer">
                      <span className="text-[11px] font-mono font-bold text-amber-400">{f.time}</span>
                      <span className="h-3 w-px bg-slate-700" />
                      <span className="text-[12px] text-slate-200">{f.label}</span>
                      {f.detail && <span className="text-[11px] font-mono text-amber-400/80">({f.detail})</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reverse Source Attribution (score < 75%) */}
          <AttributionCard score={analysisResult.score} sha={analysisResult.sha} />

        </div>
      </main>

      <div ref={certificateRef} className="fixed left-[-10000px] top-0 w-[800px] bg-[#0B132B] text-slate-100 p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-2xl font-black tracking-wide text-cyan-300">MAYA Forensic Certificate</div>
            <div className="text-xs text-slate-400 mt-1">Media Type Identified: {analysisResult.mediaTypeLabel || mediaProfile?.displayLabel || 'Pending'}</div>
          </div>
          <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-right">
            <div className="text-[10px] uppercase tracking-wider text-cyan-200">Master Score</div>
            <div className="text-3xl font-black font-mono text-cyan-300">{analysisResult.score !== null ? `${analysisResult.score}%` : 'Pending'}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3"><span className="text-slate-500">SHA-256:</span> <span className="text-slate-200 break-all">{analysisResult.sha}</span></div>
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3"><span className="text-slate-500">Sampling:</span> <span className="text-slate-200">{analysisResult.samplingStrategy || samplingPlan?.strategyLabel || 'Pending'}</span></div>
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3"><span className="text-slate-500">Primary Anomaly:</span> <span className="text-slate-200">{analysisResult.primaryAnomaly || samplingPlan?.primaryAnomaly?.rangeLabel || 'None'}</span></div>
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3"><span className="text-slate-500">Checks:</span> <span className="text-slate-200">{analysisResult.checksSummary || 'N/A'}</span></div>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Narrative</div>
          {analysisResult.forensicReport?.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-[12px] leading-relaxed text-slate-200 whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Anomaly Heatmap</div>
          <TimelineScrubber
            duration={samplingPlan?.totalDuration || videoRef.current?.duration || 0}
            segments={samplingPlan?.segments || []}
            anomalyBadges={samplingPlan?.anomalyBadges || []}
            currentTime={playheadTime}
            onSeek={() => {}}
          />
        </div>
      </div>

      {/* === MODALS === */}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-slate-800 rounded-xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><History className="h-4 w-4 text-cyan-400" /> Saved Reports</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white cursor-pointer text-xs font-mono">✕ Close</button>
            </div>
            {savedReports.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono py-6 text-center">No saved reports. Analyze media and click "Save" to begin.</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {savedReports.map((item) => (
                  <div key={item.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded flex items-center gap-3 text-xs font-mono">
                    <div className="w-16 h-12 bg-black rounded overflow-hidden border border-slate-700 shrink-0 flex items-center justify-center">
                      {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="h-5 w-5 text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-200 font-medium truncate">{item.fileName}</div>
                      <div className="text-[10px] text-slate-500">{item.timestamp} · {item.mediaType?.toUpperCase() || 'VIDEO'}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded font-bold ${item.score > 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{item.score}%</span>
                      <button onClick={() => handleReopenProject(item)} className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-2.5 py-1 rounded transition-colors text-[11px] cursor-pointer flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" /> Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <button onClick={() => { localStorage.removeItem("deepsync_reports_history"); setSavedReports([]); }} className="text-xs text-red-400 hover:text-red-300 font-mono cursor-pointer">Clear History</button>
            </div>
          </div>
        </div>
      )}

      {/* C2PA Certificate Modal */}
      <C2PAExportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onExport={handleExportReport}
        score={analysisResult.score}
        statusText={analysisResult.statusText}
        sha={analysisResult.sha}
        flags={analysisResult.flags}
        verifications={analysisResult.verifications}
        fileDetails={fileDetails}
        inputUrl={inputUrl}
        mediaType={mediaType}
        audioAiResult={audioAiResult}
        nlpMetadataResult={nlpMetadataResult}
        facialAnomalies={facialAnomalies}
        mediaTypeLabel={analysisResult.mediaTypeLabel}
        samplingStrategy={analysisResult.samplingStrategy}
        primaryAnomaly={analysisResult.primaryAnomaly}
        forensicReport={analysisResult.forensicReport}
        thumbnailUrl={thumbnailUrl}
      />

    </div>
  );
}
