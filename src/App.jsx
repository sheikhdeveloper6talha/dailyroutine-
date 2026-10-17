import { lazy, Suspense, useCallback, useState } from "react";
import { useData } from "./data";
import InstallPrompt from "./components/InstallPrompt";

// Each screen is its own chunk: the first paint only downloads the dashboard.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Money = lazy(() => import("./pages/Money"));
const Budget = lazy(() => import("./pages/Budget"));
const Form = lazy(() => import("./Form"));

const TABS = [
  ["home", "Home", "🏠"], 
  ["tasks", "Tasks", "✓"], 
  ["money", "Money", "💰"], 
  ["budget", "Budget", "📊"]
];

export default function App() {
  const { ready } = useData();
  const [tab, setTab] = useState("home");
  const [form, setForm] = useState(null); // { type, item? }
  const open = useCallback((type, item) => setForm({ type, item }), []);
  const close = useCallback(() => setForm(null), []);
  const Page = { home: Dashboard, tasks: Tasks, money: Money, budget: Budget }[tab];

  return (
    <div className="app vip-theme">
      <InstallPrompt />
      <main>
        {!ready ? <p className="empty">Loading...</p> : (
          <Suspense fallback={<p className="empty">Loading...</p>}><Page open={open} go={setTab} /></Suspense>
        )}
      </main>
      <nav className="tabs" aria-label="Main">
        {TABS.map(([k, l, i]) => (
          <button key={k} className={tab === k ? "on" : ""} aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>
            <span aria-hidden>{i}</span>{l}
          </button>
        ))}
      </nav>
      {form && <Suspense fallback={null}><Form {...form} onClose={close} /></Suspense>}
    </div>
  );
}
