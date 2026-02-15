import React from 'react';

// Simple responsive SVG area/line chart
const Chart = ({ data = [], width = 720, height = 220, keys = ['students', 'faculty'], colors = ['#3b82f6', '#10b981'] }) => {
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No chart data</div>;

  const padding = { top: 12, right: 20, bottom: 28, left: 28 };
  const w = width;
  const h = height;
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  const labels = data.map((d) => d.label);
  const allValues = data.flatMap(d => keys.map(k => d[k] || 0));
  const max = Math.max(...allValues, 1);

  const x = (i) => padding.left + (i / (data.length - 1)) * innerW;
  const y = (v) => padding.top + innerH - (v / max) * innerH;

  const buildPath = (key) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(d[key] || 0).toFixed(2)}`).join(' ');
  };

  const buildArea = (key) => {
    const path = buildPath(key);
    const lastX = x(data.length - 1);
    const firstX = x(0);
    return `${path} L ${lastX.toFixed(2)} ${ (padding.top + innerH).toFixed(2) } L ${firstX.toFixed(2)} ${ (padding.top + innerH).toFixed(2) } Z`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        {keys.map((k, idx) => (
          <linearGradient key={k} id={`grad-${idx}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors[idx]} stopOpacity="0.28" />
            <stop offset="100%" stopColor={colors[idx]} stopOpacity="0.04" />
          </linearGradient>
        ))}
      </defs>

      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((g, i) => (
        <line key={i} x1={padding.left} x2={w - padding.right} y1={padding.top + g * innerH} y2={padding.top + g * innerH} stroke="rgba(120,130,150,0.06)" strokeWidth={1} />
      ))}

      {/* areas */}
      {keys.map((k, idx) => (
        <path key={k} d={buildArea(k)} fill={`url(#grad-${idx})`} stroke="none" />
      ))}

      {/* lines */}
      {keys.map((k, idx) => (
        <path key={k + '-line'} d={buildPath(k)} fill="none" stroke={colors[idx]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      ))}

      {/* points */}
      {data.map((d, i) => (
        keys.map((k, idx) => (
          <circle key={`${i}-${k}`} cx={x(i)} cy={y(d[k] || 0)} r={3.2} fill={colors[idx]} />
        ))
      ))}

      {/* x labels */}
      {data.map((d, i) => (
        <text key={`lab-${i}`} x={x(i)} y={h - 6} fontSize={11} textAnchor="middle" fill="var(--text-secondary)">{d.label}</text>
      ))}
    </svg>
  );
};

export default Chart;
