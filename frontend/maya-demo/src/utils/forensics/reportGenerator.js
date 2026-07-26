const formatScoreLabel = (score) => {
  if (score >= 80) return 'High Confidence (Authentic)';
  if (score >= 50) return 'Inconclusive / Moderate Anomaly';
  return 'High Synthetic Probability (Flagged)';
};

const formatTime = (seconds = 0) => {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(total / 60)).padStart(2, '0');
  const secs = String(total % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
};

export function generateForensicReport({ score, flags = [], mediaType, duration, provenance = {}, diagnostics = {}, samplingPlan = null }) {
  const verdict = formatScoreLabel(score);
  const sourceLabel = mediaType ? String(mediaType).toUpperCase() : 'MEDIA';
  const durationLabel = duration ? `${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s` : 'unknown duration';
  const provenanceLine = diagnostics.metadataOverride
    ? 'Synthetic keywords were present in URL/title/C2PA metadata, which triggered a hard cap on the final score.'
    : provenance?.summary || 'No synthetic provenance markers were detected.';

  const executiveSummary = `Executive Summary\nThe analyzed ${sourceLabel} asset spans ${durationLabel} and produced a master confidence score of ${score}%. The overall assessment is ${verdict}. ${provenanceLine}`;

  const technicalLayerBreakdown = [
    `Technical Layer Breakdown`,
    `Provenance: ${provenance?.status || 'Unknown'}; SHA fingerprint ${provenance?.sha || 'N/A'}; C2PA / EXIF indicators ${provenance?.c2pa || provenance?.exif || 'not available'}.`,
    `Vision: ${diagnostics.faceless ? 'Faceless or non-biometric media; Vision redistributed away from face tracking.' : provenance?.visionSummary || 'Spatial checks completed.'}`,
    `Audio: ${diagnostics.audioSummary || provenance?.audioSummary || 'Audio kinematics evaluated for lip-sync and vocoder behavior.'}`,
  ].join('\n');

  const hotspotList = (flags || []).length > 0
    ? flags.map((flag) => `Frame ${flag.time || formatTime(flag.seconds || 0)} | ${flag.label}${flag.detail ? ` — ${flag.detail}` : ''}`).join('\n')
    : 'No anomalous hot spots were isolated during sampling.';

  const identifiedHotspotObservations = `Identified Hotspot Observations\n${hotspotList}`;

  const advisory = score >= 80
    ? 'Actionable User Advisory\nThis asset may be used with standard provenance caveats, but maintain the forensic record and source URL for chain-of-custody purposes.'
    : score >= 50
      ? 'Actionable User Advisory\nReview before redistribution. Do not cite as verified evidence without independent corroboration.'
      : 'Actionable User Advisory\nDo not distribute as verified news evidence. Preserve the original file and metadata for further forensic review.';

  const samplingLine = samplingPlan?.strategyLabel
    ? `Sampling strategy: ${samplingPlan.strategyLabel}`
    : 'Sampling strategy: direct analysis';

  return {
    verdict,
    paragraphs: [
      executiveSummary,
      `${technicalLayerBreakdown}\n${samplingLine}`,
      identifiedHotspotObservations,
      advisory,
    ],
    narrative: [executiveSummary, technicalLayerBreakdown, identifiedHotspotObservations, advisory].join('\n\n'),
  };
}
