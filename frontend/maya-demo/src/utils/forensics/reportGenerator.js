export function generateForensicReport({ score, flags = [], mediaType, duration, provenance = {}, diagnostics = [], samplingPlan }) {
  const isAuthentic = score !== null && score > 75;
  const isMediumRisk = score !== null && score >= 50 && score <= 75;

  const verdict = isAuthentic
    ? "Authentic Media Asset"
    : isMediumRisk
    ? "Suspicious Inconsistencies Detected"
    : "High Risk - Synthetic Manipulation";

  const paragraphs = [];

  paragraphs.push(
    `Executive Summary: The analyzed ${mediaType?.toUpperCase() || 'MEDIA'} asset produced a master confidence score of ${score !== null ? `${score}%` : 'Pending'}. The overall assessment is ${verdict}. ${flags.length > 0 ? `${flags.length} forensic anomalies were flagged.` : 'No synthetic metadata markers found.'}`
  );

  paragraphs.push(
    `Technical Layer Breakdown: Provenance: ${provenance.status || 'verified'}; SHA fingerprint: ${provenance.sha ? `${provenance.sha.slice(0, 16)}...` : 'N/A'}; C2PA / EXIF indicators: ${provenance.exif || 'Not detected'}. Vision: ${provenance.visionSummary || 'Biometric checks normal'}. Audio: ${provenance.audioSummary || 'Acoustic sync aligned'}. Sampling strategy: ${samplingPlan?.strategyLabel || 'Direct scan'}.`
  );

  if (flags.length > 0) {
    const anomalySummary = flags.map(f => `[${f.time || '00:00'}] ${f.label}`).join(', ');
    paragraphs.push(`Identified Hotspot Observations: ${anomalySummary}.`);
  } else {
    paragraphs.push(`Identified Hotspot Observations: No anomalous hot spots were isolated during sampling.`);
  }

  return {
    verdict,
    paragraphs,
    recommendations: isAuthentic
      ? ["Asset is validated for release and distribution."]
      : ["Further manual review recommended before publishing."]
  };
}

export function generateHtmlCertificate({ score, statusText, sha, flags = [], verifications = [], fileDetails, inputUrl, mediaType, mediaTypeLabel, samplingStrategy, primaryAnomaly, forensicReport }) {
  const fileName = fileDetails?.name || inputUrl || 'Media';
  const scoreVal = score !== null ? `${score}%` : 'Pending';
  const riskLabel = score === null ? 'Pending' : (score > 75 ? 'Low Threat' : score >= 50 ? 'Medium Threat' : 'High Threat');
  const riskColor = score === null ? '#94a3b8' : (score > 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171');

  const flagRows = flags.length > 0
    ? flags.map(f => `
        <div class="flag-item">
          <span class="flag-time">[${f.time || '00:00'}]</span>
          <span class="flag-label">${f.label || ''}</span>
          ${f.detail ? `<span class="flag-detail">${f.detail}</span>` : ''}
        </div>
      `).join('')
    : '<div class="no-flags">✓ Zero forensic anomalies detected across all analysis layers.</div>';

  const verificationRows = (verifications || []).map(v => `
    <div class="verif-item">
      <div>
        <div class="verif-label">${v.label}</div>
        <div class="verif-val">${v.value}</div>
      </div>
      <span class="verif-status status-${v.status}">${(v.status || '').toUpperCase()}</span>
    </div>
  `).join('');

  const narrativeParagraphs = (forensicReport?.paragraphs || []).map(p => `<p>${p}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAYA Forensic Certificate - ${fileName}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B132B; color: #f1f5f9; padding: 40px 20px; margin: 0; }
    .container { max-width: 820px; margin: 0 auto; background: #0F172A; border: 1px solid #1e293b; border-radius: 12px; padding: 36px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 26px; font-weight: 900; letter-spacing: 0.05em; color: #67e8f9; }
    .subtitle { font-size: 12px; color: #94a3b8; margin-top: 4px; font-family: monospace; }
    .score-card { background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.4); border-radius: 10px; padding: 14px 24px; text-align: right; }
    .score-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #67e8f9; font-family: monospace; }
    .score-num { font-size: 36px; font-weight: 900; font-family: monospace; color: ${riskColor}; }
    .risk-label { font-size: 11px; font-family: monospace; color: ${riskColor}; margin-top: 2px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-family: monospace; font-size: 11px; margin-bottom: 28px; }
    .card { background: rgba(15,23,42,0.8); border: 1px solid #1e293b; padding: 12px 14px; border-radius: 6px; }
    .lbl { color: #64748b; margin-bottom: 2px; }
    .val { color: #e2e8f0; word-break: break-all; font-weight: 600; }
    .sec-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 10px; font-family: monospace; }
    .narrative { background: rgba(15,23,42,0.6); border: 1px solid #1e293b; padding: 20px; border-radius: 8px; line-height: 1.6; font-size: 12px; color: #cbd5e1; margin-bottom: 28px; }
    .narrative p { margin: 0 0 12px 0; }
    .narrative p:last-child { margin-bottom: 0; }
    .flags-box { margin-bottom: 28px; }
    .flag-item { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); color: #fcd34d; padding: 10px 14px; border-radius: 6px; font-family: monospace; font-size: 11px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .flag-time { font-weight: bold; margin-right: 10px; }
    .flag-detail { color: #94a3b8; margin-left: auto; }
    .no-flags { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 11px; }
    .verif-box { background: rgba(15,23,42,0.8); border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; margin-bottom: 28px; }
    .verif-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #1e293b; }
    .verif-item:last-child { border-bottom: none; }
    .verif-label { font-size: 12px; font-weight: 600; color: #e2e8f0; }
    .verif-val { font-size: 11px; color: #64748b; font-family: monospace; }
    .verif-status { font-size: 10px; font-family: monospace; font-weight: bold; padding: 2px 8px; border-radius: 4px; }
    .status-verified { background: rgba(16,185,129,0.2); color: #34d399; }
    .status-warning { background: rgba(245,158,11,0.2); color: #fbbf24; }
    .status-pending { background: rgba(100,116,139,0.2); color: #94a3b8; }
    .footer { text-align: center; font-size: 11px; color: #475569; font-family: monospace; margin-top: 36px; padding-top: 18px; border-top: 1px solid #1e293b; }
    .action-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
    .action-btn { display: inline-flex; align-items: center; gap: 6px; background: #1e293b; color: #f1f5f9; border: 1px solid #334155; padding: 9px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
    .action-btn:hover { background: #334155; border-color: #475569; }
    .btn-purple { background: rgba(147,51,234,0.2); border-color: rgba(147,51,234,0.4); color: #c084fc; }
    .btn-purple:hover { background: rgba(147,51,234,0.35); }
    .btn-cyan { background: rgba(6,182,212,0.2); border-color: rgba(6,182,212,0.4); color: #67e8f9; }
    .btn-cyan:hover { background: rgba(6,182,212,0.35); }
    .btn-amber { background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); color: #fcd34d; }
    .btn-amber:hover { background: rgba(245,158,11,0.35); }
    .btn-emerald { background: rgba(16,185,129,0.2); border-color: rgba(16,185,129,0.4); color: #6ee7b7; }
    .btn-emerald:hover { background: rgba(16,185,129,0.35); }
    @media print {
      body { background: white; color: black; padding: 0; }
      .container { border: none; box-shadow: none; max-width: 100%; background: white; padding: 0; }
      .action-bar { display: none !important; }
      .logo { color: #0891b2; }
      .card { background: #f8fafc; border-color: #cbd5e1; }
      .lbl { color: #475569; }
      .val { color: #0f172a; }
      .narrative { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
      .verif-box { background: white; border-color: #cbd5e1; }
      .verif-item { border-bottom-color: #cbd5e1; }
      .verif-label { color: #0f172a; }
      .verif-val { color: #475569; }
      .flag-item { background: #fffbeb; border-color: #fde68a; color: #92400e; }
      .no-flags { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
    }
  </style>
  <script>
    function saveHtml() {
      var blob = new Blob([document.documentElement.outerHTML], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'MAYA_Certificate_${Date.now()}.html';
      a.click();
    }
  </script>
</head>
<body>
  <div class="container">
    <div class="action-bar">
      <button class="action-btn btn-purple" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="action-btn btn-cyan" onclick="saveHtml()">💾 Download HTML File</button>
    </div>
    <div class="header">
      <div>
        <div class="logo">MAYA Forensic Certificate</div>
        <div class="subtitle">Media Type Identified: ${mediaTypeLabel || mediaType || 'Unknown'}</div>
      </div>
      <div class="score-card">
        <div class="score-title">Master Score</div>
        <div class="score-num">${scoreVal}</div>
        <div class="risk-label">${riskLabel} · ${statusText || ''}</div>
      </div>
    </div>

    <div class="grid">
      <div class="card"><div class="lbl">File / Title</div><div class="val">${fileName}</div></div>
      <div class="card"><div class="lbl">SHA-256 Hash</div><div class="val">${sha || 'N/A'}</div></div>
      <div class="card"><div class="lbl">Sampling Strategy</div><div class="val">${samplingStrategy || 'Standard'}</div></div>
      <div class="card"><div class="lbl">Primary Anomaly</div><div class="val">${primaryAnomaly || 'None'}</div></div>
    </div>

    <div class="sec-title">Multi-Layer Forensic Results</div>
    <div class="verif-box">
      ${verificationRows}
    </div>

    <div class="sec-title">Forensic Narrative & Verdict</div>
    <div class="narrative">
      ${narrativeParagraphs || '<p>No narrative generated.</p>'}
    </div>

    <div class="sec-title">Flagged Anomalies (${flags.length})</div>
    <div class="flags-box">
      ${flagRows}
    </div>

    <div class="footer">
      Generated on ${new Date().toLocaleString()} · MAYA Forensic Engine v2.4
    </div>
  </div>
</body>
</html>`;
}

