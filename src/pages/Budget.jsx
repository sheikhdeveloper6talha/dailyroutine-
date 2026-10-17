import { memo, useCallback, useMemo, useState } from "react";
import { useActions, useData } from "../data";
import { Bar } from "../ui";
import { CATEGORIES, money, monthOf, prevMonth, sum, today } from "../utils";

const CatRow = memo(({ cat, budget, used, onSet }) => {
  const [v, setV] = useState(budget ? String(budget) : "");
  const r = budget > 0 ? used / budget : 0;
  return (
    <div className="card">
      <div className="line"><b>{cat}</b>
        <input inputMode="numeric" className="amt" placeholder="Budget" aria-label={`${cat} budget`} value={v}
          onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} onBlur={() => onSet(cat, Number(v) || 0)} /></div>
      {budget > 0 && <><Bar ratio={r} />
        <small className={r >= 1 ? "neg" : r >= 0.8 ? "warnt" : ""}>{money(used)} / {money(budget)}{r >= 1 ? " · Budget cross ho gaya!" : r >= 0.8 ? " · Budget ke qareeb" : ""}</small></>}
    </div>
  );
});

export default function Budget() {
  const { expenses, incomes, budgets } = useData();
  const { setBudget } = useActions();
  const onSet = useCallback((c, a) => setBudget(c, a), [setBudget]);
  const r = useMemo(() => {
    const m = monthOf(today()), pm = prevMonth(m), used = {};
    expenses.filter((e) => monthOf(e.date) === m).forEach((e) => (used[e.category] = (used[e.category] || 0) + e.amount));
    const inc = (mm) => sum(incomes.filter((i) => i.received && monthOf(i.date) === mm));
    const exp = (mm) => sum(expenses.filter((e) => monthOf(e.date) === mm));
    return { used, m, pm, inc: inc(m), exp: exp(m), pinc: inc(pm), pexp: exp(pm) };
  }, [expenses, incomes]);
  const max = Math.max(r.inc, r.exp, r.pinc, r.pexp, 1);
  const rows = [["Income", r.inc, r.pinc, "pos"], ["Kharch", r.exp, r.pexp, "neg"]];

  return (
    <>
      <h1>Budget &amp; Report</h1>
      <div className="card">
        <small>Monthly report: {r.m} vs pichla mahina ({r.pm})</small>
        {rows.map(([l, cur, prev, tone]) => (
          <div key={l} className="rep"><div className="line"><span>{l}</span><b className={tone}>{money(cur)}</b></div>
            <div className="bar"><div className="ok" style={{ width: `${(cur / max) * 100}%` }} /></div>
            <div className="line"><small>Pichla mahina</small><small>{money(prev)}</small></div>
            <div className="bar"><div className="prev" style={{ width: `${(prev / max) * 100}%` }} /></div></div>
        ))}
      </div>
      <p className="hint">Har category ka is mahine ka budget set karein (khali = no budget).</p>
      {CATEGORIES.map((c) => <CatRow key={c} cat={c} budget={budgets[c] || 0} used={r.used[c] || 0} onSet={onSet} />)}
    </>
  );
}
