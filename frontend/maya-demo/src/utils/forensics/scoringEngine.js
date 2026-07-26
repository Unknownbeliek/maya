const SYNTHETIC_KEYWORDS = ['ai', 'sora', 'deepfake', 'midjourney', 'voice clone', '#ai'];

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const hasKeyword = (text = '', keywords = []) => {
  const lower = String(text || '').toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
};

function weightedAverage(values = {}, weights = {}) {
  const weighted = Object.entries(weights).reduce((sum, [key, weight]) => {
    const value = Number(values[key] ?? 0);
    return sum + (value * weight);
  }, 0);
  return clamp(Math.round(weighted));
}

function normalizeLayerScore(layer = {}) {
  const suspiciousCount = Number(layer.suspiciousCount || 0);
  const flaggedCount = Number(layer.flaggedCount || 0);
  const verifiedCount = Number(layer.verifiedCount || 0);
  const total = Math.max(verifiedCount + suspiciousCount + flaggedCount, 1);
  const raw = ((verifiedCount / total) * 100) - (suspiciousCount * 12) - (flaggedCount * 30);
  return clamp(Math.round(raw));
}

export function scoreMediaConsensus({
  provenance = {},
  vision = {},
  audio = {},
  context = {},
} = {}) {
  const facesDetected = Number(vision.facesDetected ?? 0);
  const faceless = facesDetected === 0;

  const provenanceScore = normalizeLayerScore(provenance);
  const visionScore = faceless
    ? 100
    : normalizeLayerScore(vision);
  const audioScore = normalizeLayerScore(audio);

  const weights = faceless
    ? { provenance: 0.5, audio: 0.5 }
    : { provenance: 0.35, vision: 0.4, audio: 0.25 };

  const masterScore = faceless
    ? weightedAverage({ provenance: provenanceScore, audio: audioScore }, weights)
    : weightedAverage({ provenance: provenanceScore, vision: visionScore, audio: audioScore }, weights);

  const keywordScope = [
    provenance?.text,
    context?.url,
    context?.title,
    context?.c2paTags,
    context?.description,
  ].filter(Boolean).join(' ');

  const metadataOverride = hasKeyword(keywordScope, SYNTHETIC_KEYWORDS);
  const cappedScore = metadataOverride ? Math.min(masterScore, 15) : masterScore;

  const diagnostics = {
    provenance: provenanceScore,
    vision: visionScore,
    audio: audioScore,
    masterScore: cappedScore,
    faceless,
    metadataOverride,
  };

  return { masterScore: cappedScore, diagnostics };
}
