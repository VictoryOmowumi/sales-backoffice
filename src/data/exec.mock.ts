export type ExecKpis = {
    revenueNgn: number;
    marketSharePct: number;
    yoyPct: number;
    targetAttainmentPct: number;
  };
  
  export type RevenueTrendPoint = { date: string; actual: number; pp: number; ly: number };
  export type ShareTrendPoint   = { date: string; sbc: number; sbcLy: number; compA: number; compB: number };
  export type BrandContribution = { name: string; value: number };
  export type VarianceDriver    = { name: string; impactNgn: number };
  
  export type ExecData = {
    kpis: ExecKpis;
    revenueTrend: RevenueTrendPoint[];
    shareTrend: ShareTrendPoint[];
    brandContribution: BrandContribution[];
    varianceDrivers: VarianceDriver[];
  };
  
  export const execData: ExecData = {
    kpis: { revenueNgn: 962_450_000, marketSharePct: 48.6, yoyPct: 12.4, targetAttainmentPct: 80.2 },
    revenueTrend: [
      { date: "Mar", actual: 152, pp: 143, ly: 137 },
      { date: "Apr", actual: 108, pp: 154, ly: 145 },
      { date: "May", actual: 176, pp: 162, ly: 151 },
      { date: "Jun", actual: 111, pp: 170, ly: 160 },
      { date: "Jul", actual: 189, pp: 176, ly: 168 },
      { date: "Aug", actual: 194, pp: 179, ly: 172 },
    ],
    shareTrend: [
      { date: "Mar", sbc: 66.1, sbcLy: 43.9, compA: 12.2, compB: 9.7 },
      { date: "Apr", sbc: 77.2, sbcLy: 44.3, compA: 43.3, compB: 1.5 },
      { date: "May", sbc: 87.9, sbcLy: 44.9, compA: 32.6, compB: 5.5 },
      { date: "Jun", sbc: 68.3, sbcLy: 45.5, compA: 42.1, compB: 23.6 },
      { date: "Jul", sbc: 88.5, sbcLy: 45.8, compA: 52.9, compB: 9.6 },
      { date: "Aug", sbc: 48.6, sbcLy: 46.0, compA: 41.8, compB: 1.6 },
    ],
    brandContribution: [
      { name: "Cola", value: 992 },
      { name: "Orange", value: 182 },
      { name: "Lemon/Lime", value: 140 },
      { name: "Water", value: 110 },
      { name: "Energy", value: 78 },
    ],
    varianceDrivers: [
      { name: "Lagos", impactNgn: 42 },
      { name: "Abuja", impactNgn: 17 },
      { name: "HORECA", impactNgn: 11 },
      { name: "Orange", impactNgn: -8 },
      { name: "PHC", impactNgn: -12 },
      { name: "E-Commerce", impactNgn: 6 },
    ],
  };
  