export default function PremiumBadge({ size = "md" }) {
  return (
    <span className={`vip-badge ${size}`}>
      <span className="badge-icon">✨</span>
      <span className="badge-text">VIP</span>
    </span>
  );
}
