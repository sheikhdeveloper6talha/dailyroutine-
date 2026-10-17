export default function StatsCard({ title, value, icon, color = "primary", change, onClick }) {
  return (
    <div className={`vip-card stats-card ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <div className="stats-header">
        <div className={`stats-icon ${color}`}>
          <span aria-hidden>{icon}</span>
        </div>
        <div className="stats-info">
          <p className="stats-label">{title}</p>
          <h2 className="stats-value">{value}</h2>
          {change && <span className="stats-change">{change}</span>}
        </div>
      </div>
    </div>
  );
}
