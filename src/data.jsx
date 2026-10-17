import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as db from "./db";
import { uid } from "./utils";

const DataCtx = createContext(null), ActCtx = createContext(null);
export const useData = () => useContext(DataCtx);
export const useActions = () => useContext(ActCtx);

export function DataProvider({ children }) {
  const [data, setData] = useState({ tasks: [], incomes: [], expenses: [], budgets: {}, ready: false });

  useEffect(() => {
    Promise.all([db.getAll("tasks"), db.getAll("incomes"), db.getAll("expenses"), db.getBudgets()]).then(
      ([tasks, incomes, expenses, budgets]) => setData({ tasks, incomes, expenses, budgets, ready: true })
    );
  }, []);

  // Stable action functions (useCallback with no deps) so memoized children never re-render because of them.
  const save = useCallback(async (store, item) => {
    const v = item.id ? item : { ...item, id: uid() };
    await db.put(store, v);
    setData((s) => ({ ...s, [store]: s[store].some((x) => x.id === v.id) ? s[store].map((x) => (x.id === v.id ? v : x)) : [v, ...s[store]] }));
  }, []);
  const remove = useCallback(async (store, id) => {
    await db.del(store, id);
    setData((s) => ({ ...s, [store]: s[store].filter((x) => x.id !== id) }));
  }, []);
  const setBudget = useCallback(async (cat, amount) => {
    await db.putBudget(cat, amount);
    setData((s) => ({ ...s, budgets: { ...s.budgets, [cat]: amount } }));
  }, []);
  const actions = useMemo(() => ({ save, remove, setBudget }), [save, remove, setBudget]);

  return <ActCtx.Provider value={actions}><DataCtx.Provider value={data}>{children}</DataCtx.Provider></ActCtx.Provider>;
}
