import { formatClock } from './samplingEngine';

export function buildEnterpriseReportFields({
  mediaProfile,
  samplingPlan,
  analysisResult,
}) {
  const mediaTypeIdentified = mediaProfile?.displayLabel || 'Photorealistic Video';
  const samplingStrategyUsed = samplingPlan?.strategyLabel || 'Direct scan';
  const primaryAnomalyFound = samplingPlan?.primaryAnomaly
    ? `${samplingPlan.primaryAnomaly.rangeLabel} - ${samplingPlan.primaryAnomaly.label}${samplingPlan.primaryAnomaly.detail ? ` (${samplingPlan.primaryAnomaly.detail})` : ''}`
    : 'No primary anomaly identified';

  return {
    mediaTypeIdentified,
    samplingStrategyUsed,
    primaryAnomalyFound,
    samplingDurationLabel: samplingPlan?.durationLabel || formatClock(0),
    flagsLabel: analysisResult?.flags?.length ? `${analysisResult.flags.length} anomalies` : 'No anomalies',
  };
}
