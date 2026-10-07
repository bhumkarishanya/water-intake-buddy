import { formatMl } from '../utils/date.js';

export default function WaterProgress({ total, goal, percentage }) {
  const size = 220;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="progress-card">
      <div className="ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} className="ring-bg" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="ring-fg"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="ring-label">
          <div className="ring-percent">{percentage}%</div>
          <div className="ring-sub">{formatMl(total)} of {formatMl(goal)}</div>
        </div>
      </div>

      <div className="linear-wrap">
        <div className="linear-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
          <div className="linear-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
