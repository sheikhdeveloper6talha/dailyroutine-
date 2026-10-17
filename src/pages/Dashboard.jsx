import { memo, useMemo } from "react";
import { useData } from "../data";
import { Bar } from "../ui";
import { money, monthOf, sum, today } from "../utils";

const Stat = memo(({ label, value, tone }) => (
  <div className="card"><small>{label}</small><strong className={tone}>{value}</strong></div>
));

export default function Dashboard({ open, go }) {
  const { tasks, incomes, expenses, budgets } = useData();
  const d = useMemo(() => {
    const day = today(), m = monthOf(day);
    const todays = tasks.filter((t) => t.date === day);
    const monthExp = expenses.filter((e) => monthOf(e.date) === m);
    const spent = sum(monthExp), budget = Object.values(budgets).reduce((a, b) => a + b, 0);
    const byCat = {};
    monthExp.forEach((e) => (byCat[e.category] = (byCat[e.category] || 0) + e.amount));
    return {
      day, total: todays.length, done: todays.filter((t) => t.done).length,
      next: tasks.filter((t) => !t.done && t.date >= day).sort((a, b) => a.date.localeCompare(b.date))[0],
      income: sum(incomes.filter((i) => i.received && monthOf(i.date) === m)), spent, budget,
      balance: sum(incomes.filter((i) => i.received)) - sum(expenses),
      top: Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 3),
    };
  }, [tasks, incomes, expenses, budgets]);

  return (
    <>
      <h1>Aaj, {d.day}</h1>
      <div className="card"><small>Aaj ke tasks</small><strong>{d.done} / {d.total} complete</strong>
        <small>{d.next ? `Agla task: ${d.next.title} (${d.next.date})` : "Koi upcoming task nahi"}</small></div>
      <div className="row"><Stat label="Income (received)" value={money(d.income)} /><Stat label="Kharch" value={money(d.spent)} /></div>
      <Stat label="Estimated balance (app entries ke mutabiq)" value={money(d.balance)} tone={d.balance < 0 ? "neg" : ""} />
      <div className="card"><small>Budget used</small>
        {d.budget > 0 ? <><strong>{money(d.spent)} / {money(d.budget)}</strong><Bar ratio={d.spent / d.budget} /></> : <small>Budget tab mein category budgets set karein.</small>}</div>
      <div className="card"><small>Sab se zyada kharch</small>
        {d.top.length ? d.top.map(([c, v]) => <div className="line" key={c}><span>{c}</span><b>{money(v)}</b></div>) : <small>Abhi koi expense nahi.</small>}</div>
      <div className="row actions">
        <button className="btn" onClick={() => open("task")}>+ Task</button>
        <button className="btn" onClick={() => open("expense")}>+ Expense</button>
        <button className="btn" onClick={() => open("income")}>+ Income</button>
        <button className="btn ghost" onClick={() => go("tasks")}>Calendar</button>
      </div>
    </>
  );
}
