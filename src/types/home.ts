export type TimePoint = { date: string; value: number };

export type SalesSummary = {
  lastSyncISO: string;
  revenueNgn: number;      // company totals for current period (CP)
  cases: number;
  orders: { completed: number; pending: number };
  activeCustomers: number;
  marketSharePct: number;  // SBC % of market
  yoyPct: number;          // CP vs same period last year
  ppDeltaPct: number;      // CP vs PP
  aovNgn: number;          // average order value
  otifPct: number;         // on-time in-full
  returnRatePct: number;
};

export type TargetProgress = {
  level: "company" | "region" | "rep";
  name: string;
  targetNgn: number;
  achievedNgn: number;
};

export type OrdersByStatus = { status: string; count: number };

export type CategoryContribution = {
  category: string;
  salesNgn: number;
  cases: number;
  sharePct: number; // of company sales
};

export type MarketSharePoint = { date: string; sbc: number; competitorA: number; competitorB: number };

export type Alert = {
  id: string;
  severity: "low" | "medium" | "high";
  type: "credit_hold" | "low_stock" | "target_risk" | "churn_risk" | "system";
  title: string;
  entity?: { type: "customer" | "rep" | "region" | "sku"; id: string; name: string };
  action?: { label: string; href: string };
};

export type Leaders = {
  regions: { name: string; revenueNgn: number; cases: number; growthPct: number; otifPct: number }[];
  reps: { name: string; region: string; targetNgn: number; achievedNgn: number; orders: number; winRatePct: number }[];
  customers: { name: string; region: string; revenueNgn: number; aovNgn: number; lastOrderISO: string; balanceStatus: "ok" | "hold" | "overdue" }[];
};

export type HomeData = {
  salesSummary: SalesSummary;
  targets: { company: TargetProgress; regions: TargetProgress[]; reps: TargetProgress[] };
  ordersByStatus: OrdersByStatus[];
  categoryContribution: CategoryContribution[];
  marketShareTrend: MarketSharePoint[];
  alerts: Alert[];
  leaders: Leaders;
};
