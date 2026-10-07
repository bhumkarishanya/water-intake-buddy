export default function WaterCard({ icon, label, value, hint, accent }) {
  return (
    <div className={`stat-card ${accent ? `stat-${accent}` : ''}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {hint && <div className="stat-hint">{hint}</div>}
      </div>
    </div>
  );
}
