import { useCallback, useEffect, useState } from "react";
import { useActions } from "./data";
import { Chip } from "./ui";
import { CATEGORIES, TASK_CATS, addDays, today } from "./utils";

const TITLES = { task: "Task", expense: "Expense", income: "Income" };
const METHODS = ["Cash", "Card", "Bank", "Wallet"];

export default function Form({ type, item, onClose }) {
  const { save, remove } = useActions();
  const [f, setF] = useState(() => item ?? (
    type === "task" ? { title: "", detail: "", date: today(), time: "", priority: "medium", category: "Personal", done: false }
    : type === "expense" ? { amount: "", category: "Rashan", note: "", method: "", date: today() }
    : { amount: "", source: "", date: today(), received: true }));
  const [err, setErr] = useState("");
  const set = useCallback((k, v) => setF((s) => ({ ...s, [k]: v })), []);
  useEffect(() => { const h = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const store = type + "s";
    if (type === "task") { if (!f.title.trim()) return setErr("Title likhein."); await save(store, { ...f, title: f.title.trim() }); }
    else {
      const amount = Number(f.amount);
      if (!Number.isInteger(amount) || amount <= 0) return setErr("Sahi positive amount likhein.");
      if (type === "income" && !f.source.trim()) return setErr("Source likhein (misal: Salary).");
      await save(store, { ...f, amount });
    }
    onClose();
  };
  const del = async () => { if (confirm("Yeh entry hamesha ke liye delete ho jayegi. Pakka?")) { await remove(type + "s", item.id); onClose(); } };
  const chips = (list, cur, key) => <div className="chips wrap">{list.map((c) => <Chip key={c} label={c} active={c === cur} onClick={() => set(key, c)} />)}</div>;

  return (
    <div className="overlay" onClick={onClose}>
      <form className="sheet" onClick={(e) => e.stopPropagation()} onSubmit={submit} role="dialog" aria-modal="true" aria-label={`${item ? "Edit" : "Add"} ${TITLES[type]}`}>
        <h2>{item ? "Edit" : "Add"} {TITLES[type]}</h2>
        {type === "task" && <><label>Title<input autoFocus value={f.title} onChange={(e) => set("title", e.target.value)} /></label>
          <label>Detail (optional)<input value={f.detail} onChange={(e) => set("detail", e.target.value)} /></label></>}
        {type === "income" && <label>Source<input autoFocus value={f.source} placeholder="Salary" onChange={(e) => set("source", e.target.value)} /></label>}
        {type !== "task" && <label>Amount (Rs.)<input inputMode="numeric" autoFocus={type === "expense"} value={f.amount} onChange={(e) => set("amount", e.target.value.replace(/\D/g, ""))} /></label>}
        {type === "expense" && <label>Note (optional)<input value={f.note} onChange={(e) => set("note", e.target.value)} /></label>}
        <div className="row"><label>Date<input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} required /></label>
          {type === "task" && <label>Time<input type="time" value={f.time} onChange={(e) => set("time", e.target.value)} /></label>}</div>
        <div className="chips"><Chip label="Aaj" onClick={() => set("date", today())} /><Chip label="Kal" onClick={() => set("date", addDays(today(), 1))} /></div>
        {type !== "income" && <><small>Category</small>{chips(type === "task" ? TASK_CATS : CATEGORIES, f.category, "category")}</>}
        {type === "task" && <><small>Priority</small>{chips(["high", "medium", "low"], f.priority, "priority")}</>}
        {type === "expense" && <><small>Payment method (optional)</small>{chips(METHODS, f.method, "method")}</>}
        {type === "income" && <><small>Status</small><div className="chips"><Chip label="Received" active={f.received} onClick={() => set("received", true)} /><Chip label="Expected" active={!f.received} onClick={() => set("received", false)} /></div></>}
        {err && <p className="neg" role="alert">{err}</p>}
        <div className="row"><button className="btn grow" type="submit">Save</button>
          {item && <button type="button" className="btn danger" onClick={del}>Delete</button>}
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button></div>
      </form>
    </div>
  );
}
