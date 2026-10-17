import { memo } from "react";
export const Bar = memo(({ ratio }) => (
  <div className="bar" role="progressbar" aria-valuenow={Math.round(ratio * 100)}>
    <div className={ratio >= 1 ? "over" : ratio >= 0.8 ? "warn" : "ok"} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
  </div>
));
export const Empty = ({ text }) => <p className="empty">{text}</p>;
export const Chip = memo(({ label, active, onClick }) => (
  <button type="button" className={`chip${active ? " on" : ""}`} aria-pressed={!!active} onClick={onClick}>{label}</button>
));
