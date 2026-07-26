const DEFAULT_MACRO_STEP_SECONDS = 10;
const HOT_ZONE_PADDING_SECONDS = 2;

const pad2 = (value) => String(Math.max(0, Math.floor(value))).padStart(2, '0');

export const formatClock = (seconds = 0) => {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0 ? `${hours}:${pad2(minutes)}:${pad2(secs)}` : `${pad2(minutes)}:${pad2(secs)}`;
};

const parseTimeToSeconds = (timeValue) => {
  if (Number.isFinite(timeValue)) return timeValue;
  if (!timeValue) return 0;
  const parts = String(timeValue).split(':').map(Number).filter(value => !Number.isNaN(value));
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  if (parts.length === 2) return (parts[0] * 60) + parts[1];
  return Number.parseFloat(timeValue) || 0;
};

const severityRank = (severity = 'suspicious') => {
  if (severity === 'flagged') return 3;
  if (severity === 'suspicious') return 2;
  return 1;
};

const inferSeverity = (flag = {}) => {
  const text = `${flag.label || ''} ${flag.detail || ''}`.toLowerCase();
  if (text.includes('clone') || text.includes('in-paint') || text.includes('teleport') || text.includes('synthetic')) {
    return 'flagged';
  }
  if (text.includes('anomaly') || text.includes('splice') || text.includes('desync') || text.includes('suspicious')) {
    return 'suspicious';
  }
  return 'watch';
};

const buildBadgeLabel = (zone) => {
  const severityEmoji = zone.severity === 'flagged' ? '🔴' : zone.severity === 'suspicious' ? '🟡' : '🟢';
  return `[${formatClock(zone.start)} - ${formatClock(zone.end)}] ${severityEmoji} ${zone.label}`;
};

const mergeZones = (zones = []) => {
  if (!zones.length) return [];
  const sorted = [...zones].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = merged[merged.length - 1];
    if (current.start <= previous.end + 1) {
      previous.end = Math.max(previous.end, current.end);
      previous.severity = severityRank(current.severity) > severityRank(previous.severity) ? current.severity : previous.severity;
      previous.labels = [...new Set([...(previous.labels || []), ...(current.labels || [])])];
      previous.details = [...new Set([...(previous.details || []), ...(current.details || [])])];
    } else {
      merged.push(current);
    }
  }

  return merged;
};

const scoreSegment = (segmentStart, segmentEnd, zones) => {
  const overlaps = zones.filter(zone => segmentStart <= zone.end && segmentEnd >= zone.start);
  if (!overlaps.length) return { status: 'authentic', severity: 'watch' };
  const highest = overlaps.reduce((carry, zone) => (severityRank(zone.severity) > severityRank(carry.severity) ? zone : carry), overlaps[0]);
  return { status: highest.severity === 'flagged' ? 'flagged' : 'suspicious', severity: highest.severity };
};

export function buildSamplingPlan({
  duration = 0,
  flags = [],
  audioSamples = [],
  hashSamples = [],
  mediaLabel = 'Media',
} = {}) {
  const totalDuration = Math.max(0, Number(duration) || 0);
  const isLongForm = totalDuration > 180;
  const macroStepSeconds = isLongForm ? DEFAULT_MACRO_STEP_SECONDS : Math.max(5, Math.round(totalDuration / 12) || 5);

  const macroScanPoints = [];
  for (let cursor = 0; cursor <= totalDuration; cursor += macroStepSeconds) {
    macroScanPoints.push(Math.min(totalDuration, Math.round(cursor)));
  }
  if (macroScanPoints[macroScanPoints.length - 1] !== Math.round(totalDuration)) {
    macroScanPoints.push(Math.round(totalDuration));
  }

  const derivedZones = [];

  flags.forEach((flag) => {
    const start = Math.max(0, parseTimeToSeconds(flag.seconds ?? flag.time) - HOT_ZONE_PADDING_SECONDS);
    const end = Math.min(totalDuration || (start + 5), parseTimeToSeconds(flag.seconds ?? flag.time) + 5 + HOT_ZONE_PADDING_SECONDS);
    derivedZones.push({
      start,
      end: Math.max(end, start + 1),
      severity: inferSeverity(flag),
      label: flag.label || 'Anomaly',
      labels: [flag.label || 'Anomaly'],
      details: [flag.detail || ''],
    });
  });

  const audioVarianceHotspots = audioSamples
    .map((sample, index, source) => {
      if (index === 0) return null;
      const prev = source[index - 1];
      const currentDb = Number(sample.db ?? sample.level ?? sample.audio ?? 0);
      const previousDb = Number(prev.db ?? prev.level ?? prev.audio ?? 0);
      const delta = Math.abs(currentDb - previousDb);
      if (delta >= 0.18) {
        return {
          start: Math.max(0, (sample.seconds ?? sample.time ?? index) - HOT_ZONE_PADDING_SECONDS),
          end: (sample.seconds ?? sample.time ?? index) + HOT_ZONE_PADDING_SECONDS + 3,
          severity: delta > 0.35 ? 'flagged' : 'suspicious',
          label: 'Audio variance spike',
          labels: ['Audio variance spike'],
          details: [`ΔdB continuity ${delta.toFixed(2)}`],
        };
      }
      return null;
    })
    .filter(Boolean);

  const hashContinuityHotspots = hashSamples
    .map((sample, index, source) => {
      if (index === 0) return null;
      const prev = source[index - 1];
      const current = Number(sample.continuity ?? sample.hashDelta ?? 0);
      const previous = Number(prev.continuity ?? prev.hashDelta ?? 0);
      const delta = Math.abs(current - previous);
      if (delta >= 0.25) {
        return {
          start: Math.max(0, (sample.seconds ?? sample.time ?? index) - HOT_ZONE_PADDING_SECONDS),
          end: (sample.seconds ?? sample.time ?? index) + HOT_ZONE_PADDING_SECONDS + 3,
          severity: delta > 0.5 ? 'flagged' : 'suspicious',
          label: 'pHash continuity spike',
          labels: ['pHash continuity spike'],
          details: [`Continuity delta ${delta.toFixed(2)}`],
        };
      }
      return null;
    })
    .filter(Boolean);

  const hotZones = mergeZones([...derivedZones, ...audioVarianceHotspots, ...hashContinuityHotspots]);

  const segmentCount = Math.max(1, Math.ceil(totalDuration / macroStepSeconds));
  const segments = Array.from({ length: segmentCount }, (_, index) => {
    const start = index * macroStepSeconds;
    const end = Math.min(totalDuration, start + macroStepSeconds);
    const { status, severity } = scoreSegment(start, end, hotZones);
    return {
      id: `${start}-${end}`,
      start,
      end,
      startLabel: formatClock(start),
      endLabel: formatClock(end),
      status,
      severity,
      width: totalDuration > 0 ? ((end - start) / totalDuration) * 100 : 100,
    };
  });

  const anomalyBadges = hotZones.map(zone => ({
    start: zone.start,
    end: zone.end,
    label: buildBadgeLabel(zone),
    severity: zone.severity,
    detail: zone.details?.filter(Boolean).join(' · '),
    seconds: zone.start,
  }));

  const primaryZone = hotZones[0] || null;
  const primaryAnomaly = primaryZone
    ? {
        label: primaryZone.labels?.[0] || primaryZone.label,
        detail: primaryZone.details?.filter(Boolean).join(' · ') || '',
        start: primaryZone.start,
        end: primaryZone.end,
        severity: primaryZone.severity,
        time: formatClock(primaryZone.start),
        rangeLabel: `${formatClock(primaryZone.start)} - ${formatClock(primaryZone.end)}`,
      }
    : null;

  return {
    mediaLabel,
    totalDuration,
    durationLabel: formatClock(totalDuration),
    isLongForm,
    macroStepSeconds,
    strategyLabel: isLongForm
      ? `Hierarchical Macro/Micro Scan across ${formatClock(totalDuration)}`
      : `Direct scan across ${formatClock(totalDuration)}`,
    macroScanPoints,
    hotZones,
    anomalyBadges,
    segments,
    primaryAnomaly,
    microScanCadence: 60,
    microScanDescription: hotZones.length > 0
      ? `60fps micro scan inside ${hotZones.length} hot zone${hotZones.length === 1 ? '' : 's'}`
      : 'No hot zones detected during macro scan',
    summary: hotZones.length > 0
      ? `${hotZones.length} hot zone${hotZones.length === 1 ? '' : 's'} identified from macro scan`
      : 'No anomalous hot zones identified',
  };
}
