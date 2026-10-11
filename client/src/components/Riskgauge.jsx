import React from 'react';

export default function RiskGauge({ score = 0 }) {
  const getScoreColor = (s) => {
    if (s < 40) return '#198754'; // Green
    if (s < 70) return '#ffc107'; // Yellow
    return '#dc3545';            // Red
  };

  const getRiskLabel = (s) => {
    if (s < 40) return 'LOW RISK';
    if (s < 70) return 'MODERATE RISK';
    return 'CRITICAL RISK';
  };

  const color = getScoreColor(score);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#e9ecef"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div 
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <span className="fs-2 fw-bold text-dark">{score}</span>
          <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '10px' }}>Out of 100</small>
        </div>
      </div>
      <span className="badge mt-2 px-3 py-2 fs-6" style={{ backgroundColor: color, color: '#fff' }}>
        {getRiskLabel(score)}
      </span>
    </div>
  );
}