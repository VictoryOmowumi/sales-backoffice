import { faker } from "@faker-js/faker";
import { BRANDS, CATEGORIES, REGIONS, CHANNELS } from "@/config/direct.constants";
import type { Brand, Category } from "@/config/direct.constants";

export type DirectKpis = {
  cpNgn: number;  // current period total
  ppNgn: number;  // previous period (same months prior year)
  growthPct: number;
};

export type MonthPoint = { m: string; cp: number; pp: number; growthPct: number }; // billions
export type CategoryRow = { name: Category; value: number }; // billions
export type SegmentRow = { name: Brand; contrPct: number; cp: number; pp: number; growthPct: number };

export type DirectDataset = {
  kpis: DirectKpis;
  months: MonthPoint[];
  categories: CategoryRow[];
  segmentsTop: SegmentRow[]; // top brands
  shorts: { m12: number; m6: number; m3: number; m1: number }; // totals (billions)
};

export type DirectFilters = {
  from: string; // "YYYY-MM"
  to: string;   // "YYYY-MM"
  region: "All" | (typeof REGIONS)[number];
  channel: "All" | (typeof CHANNELS)[number];
};

// ---- helpers
const monthsInRange = (from: string, to: string): string[] => {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  const out: string[] = [];
  let y = fy, m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m++; if (m > 12) { m = 1; y++; }
  }
  return out;
};

const seedFrom = (f: DirectFilters) =>
  [...`${f.from}|${f.to}|${f.region}|${f.channel}`].reduce((a, c) => a + c.charCodeAt(0), 0);

// ---- generator
export function generateDirectDataset(f: DirectFilters): DirectDataset {
  faker.seed(seedFrom(f));

  const months = monthsInRange(f.from, f.to);
  // baseline volume scaler by region/channel (keeps things deterministic)
  const regionBoost = f.region === "All" ? 1 : 1 + (REGIONS.indexOf(f.region as typeof REGIONS[number]) * 0.03);
  const channelBoost = f.channel === "All" ? 1 : 1 + (CHANNELS.indexOf(f.channel as typeof CHANNELS[number]) * 0.04);

  const monthSeries: MonthPoint[] = months.map((m) => {
    // cp random base then smooth upward seasonality
    const base = faker.number.float({ min: 2.2, max: 5.5 }); // billions
    const season = 1 + [0.0, 0.04, 0.06, 0.02, -0.01, 0.03, 0.07, 0.09, 0.04, 0.02, 0.00, 0.05][new Date(m + "-01").getMonth()];
    const cp = Math.max(1.5, base * season * regionBoost * channelBoost);

    // previous period ~ 10%-15% lower/higher with small noise
    const drift = faker.number.float({ min: -0.12, max: 0.1 });
    const pp = Math.max(1, cp * (1 + drift));
    const growthPct = ((cp - pp) / Math.max(pp, 0.0001)) * 100;

    return { m, cp: round1(cp), pp: round1(pp), growthPct: round1(growthPct) };
  });

  const cpTotal = monthSeries.reduce((s, x) => s + x.cp, 0);
  const ppTotal = monthSeries.reduce((s, x) => s + x.pp, 0);

  // categories share
  const catShares = CATEGORIES.map(() => faker.number.float({ min: 0.15, max: 0.35 }));
  const catSum = catShares.reduce((a, b) => a + b, 0);
  const categories = CATEGORIES.map((c, i) => ({
    name: c,
    value: round1((cpTotal * (catShares[i] / catSum))),
  }));

  // brand segments (top 6)
  const topBrands = [...BRANDS].slice(0, 6);
  const segRows = topBrands.map((b) => {
    const weight = faker.number.float({ min: 0.07, max: 0.2 });
    const cp = round1(cpTotal * weight);
    const pp = round1(cp * faker.number.float({ min: 0.85, max: 1.08 }));
    const growthPct = round1(((cp - pp) / Math.max(pp, 0.0001)) * 100);
    return { name: b, cp, pp, growthPct, contrPct: round1((cp / cpTotal) * 100) };
  }).sort((a, b) => b.cp - a.cp);

  // short windows (totals for last 12/6/3/1 months in range)
  const take = (n: number) => monthSeries.slice(-n).reduce((s, x) => s + x.cp, 0);
  const shorts = { m12: round1(take(12)), m6: round1(take(6)), m3: round1(take(3)), m1: round1(take(1)) };

  return {
    kpis: { cpNgn: round1(cpTotal), ppNgn: round1(ppTotal), growthPct: round1(((cpTotal - ppTotal) / Math.max(ppTotal, 0.0001)) * 100) },
    months: monthSeries,
    categories,
    segmentsTop: segRows,
    shorts,
  };
}

const round1 = (x: number) => Math.round(x * 10) / 10;
