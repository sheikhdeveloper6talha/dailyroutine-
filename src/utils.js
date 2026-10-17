const p = (n) => String(n).padStart(2, "0");
export const toKey = (d) => `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; // local date, no timezone drift
export const today = () => toKey(new Date());
export const addDays = (k, n) => { const [y, m, d] = k.split("-").map(Number); return toKey(new Date(y, m - 1, d + n)); };
export const monthOf = (k) => k.slice(0, 7);
export const prevMonth = (m) => { const [y, mo] = m.split("-").map(Number); return toKey(new Date(y, mo - 2, 1)).slice(0, 7); };
export const money = (n) => `Rs. ${Math.round(n).toLocaleString("en-PK")}`; // amounts stored as whole-rupee integers
export const uid = () => crypto.randomUUID();
export const sum = (a) => a.reduce((t, x) => t + x.amount, 0);
export const CATEGORIES = ["Rashan", "Rent", "Bills", "Internet/Mobile", "Transport", "Health", "Education", "Food", "Shopping", "Family", "Entertainment", "Other"];
export const TASK_CATS = ["Personal", "Work", "Study", "Home", "Health", "Other"];
