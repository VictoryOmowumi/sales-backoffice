import { useMemo } from "react";
import { execData } from "@/data/exec.mock";
import { useCompare } from "@/store/compare";
import { useExecFilters } from "@/store/filters.exec";
import {  parseISO } from "date-fns";

const REGION_FACTOR: Record<string, number> = {
  All: 1, Abuja: 1.09, Kano: 0.94, Kaduna: 0.96, Aba: 0.92, Enugu: 0.95, Benin: 0.88, Ibadan: 1.03, Ilorin: 0.91, Ikeja: 1.15,
};
const CHANNEL_FACTOR: Record<string, number> = {
  All: 1, "Modern Trade": 1.04, "General Trade": 0.96, HORECA: 1.06, "E-Commerce": 1.03,
};


/** convert "Mar" aligned items to "YYYY-MM" for the selected range */
function monthKey(year: number, short: string) {
  const idx = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(short);
  const m = (idx+1).toString().padStart(2,"0");
  return `${year}-${m}`;
}

export function useExecData() {
  const { mode } = useCompare();
  const f = useExecFilters();

  const out = useMemo(() => {
    const factor = (REGION_FACTOR[f.region] ?? 1) * (CHANNEL_FACTOR[f.channel] ?? 1);

    // Build month keys for mock (assume current year for display)
    const thisYear = parseISO(`${f.to}-01`).getFullYear();
    const trend = execData.revenueTrend.map((p) => ({ ...p, key: monthKey(thisYear, p.date) }));
    const share = execData.shareTrend.map((p) => ({ ...p, key: monthKey(thisYear, p.date) }));

    // Filter by date range (keys are YYYY-MM)
    const rangeFiltered = trend.filter((p) => p.key >= f.from && p.key <= f.to);
    const shareFiltered = share.filter((p) => p.key >= f.from && p.key <= f.to);

    // Apply region/channel factor
    const revenue = rangeFiltered.map((p) => ({
      date: p.date,
      actual: +(p.actual * factor).toFixed(1),
      pp: +(p.pp * factor).toFixed(1),
      ly: +(p.ly * factor).toFixed(1),
    }));

    const shareTrend = shareFiltered.map((p) => ({
      date: p.date,
      sbc: +(p.sbc * (factor * 0.02 + 0.99)).toFixed(1), // tiny movement with filters so it "feels" live
      sbcLy: p.sbcLy,
      compA: p.compA,
      compB: p.compB,
    }));

    // KPIs recompute
    const sum = (k: "actual" | "pp" | "ly") => revenue.reduce((a, b) => a + b[k], 0);
    const sumActual = sum("actual");
    const sumLy = sum("ly");
    const yoy = sumLy ? ((sumActual - sumLy) / sumLy) * 100 : 0;

    // Derive target from original attainment (mock) then recompute
    const impliedTarget = sumActual / 0.802; // based on 80.2% from mock
    const attainment = (sumActual / impliedTarget) * 100;

    return {
      revenueTrend: revenue,
      shareTrend,
      kpis: {
        revenueNgn: Math.round(sumActual * 1_000_000_000), // trend numbers are in “billions”
        marketSharePct: shareTrend.at(-1)?.sbc ?? execData.shareTrend.at(-1)!.sbc,
        yoyPct: yoy,
        targetAttainmentPct: attainment,
      },
      brandContribution: execData.brandContribution.map(b => ({
        ...b, value: +(b.value * factor).toFixed(0),
      })),
      varianceDrivers: execData.varianceDrivers, // leave static for now
      compKey: mode === "pp" ? "pp" : "ly",
      compLabel: mode === "pp" ? "Previous Period" : "Last Year",
    };
  }, [f.from, f.to, f.region, f.channel, mode]);

  return out;
}
