

function renderReportHtml(fd, r, lang = 'en') {
  const isHi = lang === 'hi';
  const now   = new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const rotSection = r.rotation ? `
  <div class="section">
    <h2>🔄 ${isHi ? 'फसल चक्र सुझाव' : 'Crop Rotation Suggestions'}</h2>
    <div class="alt-grid">
      ${r.rotation.suggestions.map(s => `
        <div class="alt-card">
          <div class="alt-name">${s.emoji} ${s.name}</div>
          <div class="alt-note">${s.reason}</div>
        </div>`).join('')}
    </div>
    <p style="margin-top:12px;font-size:13px;color:#5c3d2e;line-height:1.6;">${r.rotation.soilBenefit}</p>
  </div>` : '';

  return `<!DOCTYPE html>
<html lang="${isHi ? 'hi' : 'en'}">
<head>
<meta charset="UTF-8">
<title>Krishi Report — ${r.topCrop.name}</title>
<style>
  body { font-family: 'Georgia', serif; background: #f7f1e8; color: #2c1810; margin: 0; padding: 32px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; padding-bottom:16px; border-bottom:2px solid #c9a96e; }
  .logo-h { font-size:24px; font-weight:bold; color:#2d5a3d; }
  .logo-sub { font-size:11px; letter-spacing:2px; color:#8b5e3c; text-transform:uppercase; margin-top:4px; }
  .date { font-size:12px; color:#8b5e3c; }
  .top-box { background:#2d5a3d; color:#f7f1e8; border-radius:12px; padding:28px 32px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; }
  .top-crop-name { font-size:36px; font-weight:900; margin-bottom:8px; }
  .top-why { font-size:14px; opacity:0.8; line-height:1.6; max-width:480px; }
  .top-meta { margin-top:12px; font-size:12px; opacity:0.7; display:flex; gap:20px; flex-wrap:wrap; }
  .conf-box { text-align:center; }
  .conf-num { font-size:40px; font-weight:bold; color:#a8c5a0; }
  .conf-lbl { font-size:10px; letter-spacing:2px; text-transform:uppercase; opacity:0.7; }
  .section { background:#fff; border-radius:10px; padding:24px 28px; margin-bottom:20px; }
  h2 { font-size:18px; color:#2d5a3d; margin-bottom:16px; }
  .field-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .field-item { background:#f7f1e8; border-radius:8px; padding:12px 14px; }
  .field-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#c9a96e; margin-bottom:4px; }
  .field-val { font-size:15px; font-weight:600; color:#2c1810; }
  .alt-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .alt-card { background:#f7f1e8; border-radius:8px; padding:14px; }
  .alt-name { font-size:16px; font-weight:700; color:#2c1810; margin-bottom:4px; }
  .alt-score { font-size:11px; color:#2d5a3d; font-weight:600; margin-bottom:4px; }
  .alt-note { font-size:12px; color:#5c3d2e; line-height:1.5; }
  .steps-list { display:flex; flex-direction:column; gap:10px; }
  .step { display:flex; gap:12px; align-items:flex-start; }
  .step-n { min-width:26px; height:26px; background:#2d5a3d; color:#a8c5a0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; margin-top:1px; }
  .step-t { font-size:13px; line-height:1.6; color:#5c3d2e; padding-top:3px; }
  .risk-row { display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap; }
  .risk-badge { padding:6px 16px; border-radius:100px; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600; display:inline-block; }
  .risk-low { background:rgba(74,124,89,0.15); color:#2d5a3d; }
  .risk-medium { background:rgba(240,165,0,0.15); color:#7a5500; }
  .risk-high { background:rgba(232,93,42,0.15); color:#8b2600; }
  .market-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .market-item { background:#f7f1e8; border-radius:8px; padding:12px; }
  .market-name { font-size:14px; font-weight:700; color:#2c1810; margin-bottom:4px; }
  .market-use { font-size:11px; color:#5c3d2e; line-height:1.5; margin-bottom:4px; }
  .market-price { font-size:12px; color:#2d5a3d; font-weight:600; }
  ul { padding-left:18px; }
  ul li { margin-bottom:8px; font-size:13px; line-height:1.5; color:#5c3d2e; }
  .footer { text-align:center; margin-top:28px; padding-top:16px; border-top:1px solid rgba(92,61,46,0.15); font-size:11px; color:#c9a96e; letter-spacing:1px; }
  @media print { body { padding:20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo-h">🌾 Krishi</div>
    <div class="logo-sub">${isHi ? 'स्मार्ट फसल सिफारिश रिपोर्ट' : 'Smart Crop Recommendation Report'}</div>
  </div>
  <div class="date">${isHi ? 'दिनांक' : 'Date'}: ${now}</div>
</div>

<div class="top-box">
  <div>
    <div style="font-size:11px;letter-spacing:2px;opacity:0.6;text-transform:uppercase;margin-bottom:8px;">${isHi ? 'सबसे अच्छी फसल' : 'Top Recommendation'}</div>
    <div class="top-crop-name">${r.topCrop.emoji} ${r.topCrop.name}</div>
    <div class="top-why">${r.topCrop.why}</div>
    <div class="top-meta">
      <span>📅 ${r.topCrop.season}</span>
      <span>💰 ${r.topCrop.profit}</span>
      <span>🏷️ ${r.topCrop.cost}</span>
    </div>
  </div>
  <div class="conf-box">
    <div class="conf-num">${r.topCrop.confidence}%</div>
    <div class="conf-lbl">${isHi ? 'मेल' : 'Match'}</div>
  </div>
</div>

<div class="section">
  <h2>📋 ${isHi ? 'खेत की जानकारी' : 'Field Details'}</h2>
  <div class="field-grid">
    <div class="field-item"><div class="field-label">${isHi?'मिट्टी':'Soil'}</div><div class="field-val">${fd.soil||'—'}</div></div>
    <div class="field-item"><div class="field-label">${isHi?'मौसम':'Season'}</div><div class="field-val">${fd.climate||'—'}</div></div>
    <div class="field-item"><div class="field-label">${isHi?'राज्य':'Region'}</div><div class="field-val">${fd.region||'—'}</div></div>
    <div class="field-item"><div class="field-label">${isHi?'तापमान':'Temp'}</div><div class="field-val">${fd.temp}°C</div></div>
    <div class="field-item"><div class="field-label">${isHi?'नमी':'Humidity'}</div><div class="field-val">${fd.humidity}%</div></div>
    <div class="field-item"><div class="field-label">${isHi?'वर्षा':'Rainfall'}</div><div class="field-val">${fd.rainfall} mm</div></div>
    <div class="field-item"><div class="field-label">${isHi?'उपजाऊपन':'Fertility'}</div><div class="field-val">${fd.fertility}</div></div>
    <div class="field-item"><div class="field-label">${isHi?'पानी':'Water'}</div><div class="field-val">${fd.water}</div></div>
    ${fd.fieldSize ? `<div class="field-item"><div class="field-label">${isHi?'क्षेत्रफल':'Field Size'}</div><div class="field-val">${fd.fieldSize} ${isHi?'एकड़':'acres'}</div></div>` : ''}
  </div>
</div>

<div class="section">
  <h2>🌿 ${isHi?'वैकल्पिक फसलें':'Alternative Crops'}</h2>
  <div class="alt-grid">
    ${r.alternatives.map(a=>`<div class="alt-card"><div class="alt-name">${a.emoji} ${a.name}</div><div class="alt-score">${a.score}% ${isHi?'मेल':'match'}</div><div class="alt-note">${a.note}</div></div>`).join('')}
  </div>
</div>

<div class="section">
  <h2>📋 ${isHi?'कदम-दर-कदम गाइड':'Step-by-Step Guide'}</h2>
  <div class="steps-list">
    ${r.steps.map((st,i)=>`<div class="step"><div class="step-n">${i+1}</div><div class="step-t">${st}</div></div>`).join('')}
  </div>
</div>

${rotSection}

<div class="section">
  <h2>⚠️ ${isHi?'जोखिम और सलाह':'Risk Assessment'}</h2>
  <div class="risk-row">
    <div>
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c9a96e;margin-bottom:8px;">${isHi?'जोखिम स्तर':'Risk Level'}</div>
      <span class="risk-badge risk-${r.risk.level.toLowerCase()}">${r.risk.level}</span>
    </div>
    <div style="flex:1">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c9a96e;margin-bottom:8px;">${isHi?'कारण':'Reason'}</div>
      <div style="font-size:13px;color:#5c3d2e;line-height:1.6;">${r.risk.reason}</div>
    </div>
  </div>
</div>

<div class="section">
  <h2>🛒 ${isHi?'क्या खरीदना होगा':'What to Buy'}</h2>
  <div class="market-grid">
    ${r.marketplace.map(m=>`<div class="market-item"><div class="market-name">${m.item}</div><div class="market-use">${m.use}</div><div class="market-price">${m.approx_price}</div></div>`).join('')}
  </div>
</div>

<div class="footer">Krishi — AI-Powered Crop Advisory · ${now}</div>
</body></html>`;
}

module.exports = { renderReportHtml };
