import { memo, useMemo, useState } from "react";
import { useActions, useData } from "../data";
import { Chip, Empty } from "../ui";
import { CATEGORIES, money } from "../utils";

const Row = memo(({ item, kind, open }) => {
  const { save } = useActions();
  return (
    <li className="item">
      <button className="grow plain" onClick={() => open(kind, item)}>
        <span>{kind === "expense" ? item.category : item.source}</span>
        <small>{item.date}{item.note ? ` · ${item.note}` : ""}{item.method ? ` · ${item.method}` : ""}</small>
      </button>
      {kind === "income" && (
        <button className={`mini ${item.received ? "okc" : ""}`} onClick={() => save("incomes", { ...item, received: !item.received })}>
          {item.received ? "Received" : "Expected"}
        </button>
      )}
      <b className={kind === "income" ? "pos" : ""}>{kind === "income" ? "+" : "-"}{money(item.amount)}</b>
    </li>
  );
});

export default function Money({ open }) {
  const { expenses, incomes } = useData();
  const [tab, setTab] = useState("expense");
  const [cat, setCat] = useState("All");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const list = useMemo(() => {
    if (tab === "income") return incomes;
    return expenses.filter((e) => (cat === "All" || e.category === cat) && (!from || e.date >= from) && (!to || e.date <= to))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [tab, expenses, incomes, cat, from, to]);

  return (
    <>
      <h1>Money</h1>
      <div className="chips"><Chip label="Expenses" active={tab === "expense"} onClick={() => setTab("expense")} /><Chip label="Income" active={tab === "income"} onClick={() => setTab("income")} /></div>
      {tab === "expense" && (
        <div className="row">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category filter"><option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
        </div>
      )}
      {list.length === 0 ? <Empty text={tab === "expense" ? "Koi expense nahi mila. Pehla kharch add karein." : "Abhi koi income nahi. Salary add karein."} /> :
        <ul className="list">{list.map((i) => <Row key={i.id} item={i} kind={tab} open={open} />)}</ul>}
      <button className="fab" onClick={() => open(tab)} aria-label={`Add ${tab}`}>+</button>
    </>
  );
}
