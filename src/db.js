import { openDB } from "idb";
const dbp = openDB("routine-budget", 1, {
  upgrade(db) {
    ["tasks", "incomes", "expenses"].forEach((s) => db.createObjectStore(s, { keyPath: "id" }));
    db.createObjectStore("budgets");
  },
});
export const getAll = async (s) => (await dbp).getAll(s);
export const put = async (s, v) => (await dbp).put(s, v);
export const del = async (s, id) => (await dbp).delete(s, id);
export const getBudgets = async () => {
  const d = await dbp, keys = await d.getAllKeys("budgets"), vals = await d.getAll("budgets");
  return Object.fromEntries(keys.map((k, i) => [k, vals[i]]));
};
export const putBudget = async (k, v) => (await dbp).put("budgets", v, k);
