/** Dates travel as 'YYYY-MM-DD' strings so time zones never shift a day. */
export type DateKey = string;
export type DateRange = [DateKey | null, DateKey | null];

const pad2 = (n: number) => (n < 10 ? '0' : '') + n;
export const toKey = (d: Date): DateKey => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const fromKey = (s: DateKey): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d: Date, n: number) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
};
export const dotted = (s?: DateKey | null) => (s ? s.replace(/-/g, '.') : '');
export const WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const;
