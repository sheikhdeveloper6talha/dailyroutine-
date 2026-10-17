import { memo, useCallback, useMemo, useState } from "react";
import { useActions, useData } from "../data";
import { Chip, Empty } from "../ui";
import { addDays, today } from "../utils";

const Row = memo(({ task, overdue, open }) => {
  const { save } = useActions();
  const toggle = useCallback(() => save("tasks", { ...task, done: !task.done }), [save, task]);
  const tomorrow = useCallback(() => save("tasks", { ...task, date: addDays(task.date, 1) }), [save, task]);
  return (
    <li className="item">
      <input type="checkbox" checked={task.done} onChange={toggle} aria-label={`Complete ${task.title}`} />
      <button className="grow plain" onClick={() => open("task", task)}>
        <span className={task.done ? "done" : ""}>{task.title}</span>
        <small className={overdue ? "neg" : ""}>{overdue ? "Overdue · " : ""}{task.date}{task.time ? ` ${task.time}` : ""} · {task.category}</small>
      </button>
      <span className={`pri ${task.priority}`}>{task.priority}</span>
      {!task.done && <button className="mini" onClick={tomorrow} aria-label="Kal par move karein">→ Kal</button>}
    </li>
  );
});

const FILTERS = ["Aaj", "Week", "Month", "Overdue", "Upcoming", "Done"];

export default function Tasks({ open }) {
  const { tasks } = useData();
  const [filter, setFilter] = useState("Aaj");
  const [q, setQ] = useState("");
  const d = today();
  const list = useMemo(() => {
    const wk = addDays(d, 6), mo = d.slice(0, 7);
    const f = tasks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      switch (filter) {
        case "Aaj": return t.date === d && !t.done;
        case "Week": return t.date >= d && t.date <= wk && !t.done;
        case "Month": return t.date.startsWith(mo) && !t.done;
        case "Overdue": return t.date < d && !t.done;
        case "Upcoming": return t.date > d && !t.done;
        default: return t.done;
      }
    });
    return f.sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")));
  }, [tasks, filter, q, d]);

  return (
    <>
      <h1>Tasks</h1>
      <input type="search" placeholder="Search tasks…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tasks" />
      <div className="chips">{FILTERS.map((f) => <Chip key={f} label={f} active={f === filter} onClick={() => setFilter(f)} />)}</div>
      {list.length === 0 ? <Empty text={q ? "Koi result nahi mila." : "Is filter mein koi task nahi."} /> :
        <ul className="list">{list.map((t) => <Row key={t.id} task={t} overdue={!t.done && t.date < d} open={open} />)}</ul>}
      <button className="fab" onClick={() => open("task")} aria-label="Add task">+</button>
    </>
  );
}
