export default function Header({ title, subtitle }) {
  return (
    <header className="vip-header">
      <div>
        <h1 className="vip-title">{title}</h1>
        {subtitle && <p className="vip-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}
