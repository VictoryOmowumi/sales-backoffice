import {differenceInCalendarDays, format, subDays } from "date-fns";
import type { PeriodRange } from "@/types/filter";

export const fmtRangeLabel = (p: PeriodRange) => {
  const from = new Date(p.from);
  const to = new Date(p.to);
  const sameYear = from.getFullYear() === to.getFullYear();
  const f = sameYear ? "MMM d" : "MMM d, yyyy";
  return `${format(from, f)} → ${format(to, "MMM d, yyyy")}`;
};

export const getDefaultPeriod = (): PeriodRange => {
  const to = new Date();
  const from = subDays(to, 29);
  return { from, to };
};

export const presets: { label: string; get: () => PeriodRange }[] = [
  { label: "Last 7 days",  get: () => ({ from: subDays(new Date(), 6),  to: new Date() }) },
  { label: "Last 30 days", get: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "Last 60 days", get: () => ({ from: subDays(new Date(), 59), to: new Date() }) },
  { label: "MTD",          get: () => { const to = new Date(); const from = new Date(to.getFullYear(), to.getMonth(), 1); return { from, to }; } },
  { label: "QTD",          get: () => { const to = new Date(); const q = Math.floor(to.getMonth() / 3); const from = new Date(to.getFullYear(), q * 3, 1); return { from, to }; } },
];

export const getPreviousPeriod = (p: PeriodRange): PeriodRange => {
  const from = new Date(p.from);
  const to = new Date(p.to);
  const len = differenceInCalendarDays(to, from) + 1; // inclusive length
  const ppTo = subDays(from, 1);
  const ppFrom = subDays(ppTo, len - 1);
  return { from: ppFrom, to: ppTo };
};

export const clampToToday = (p: PeriodRange): PeriodRange => {
  const to = new Date(p.to);
  const today = new Date();
  return to > today ? { ...p, to: today } : p;
};
