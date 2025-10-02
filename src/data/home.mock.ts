import type { HomeData } from "@/types/home";

export const homeData: HomeData = {
  salesSummary: {
    lastSyncISO: "2025-08-23T10:42:00Z",
    revenueNgn: 962_450_000,
    cases: 1_284_200,
    orders: { completed: 812, pending: 147 },
    activeCustomers: 3_248,
    marketSharePct: 48.6,
    yoyPct: 12.4,
    ppDeltaPct: 3.1,
    aovNgn: 1_120_000,
    otifPct: 93.2,
    returnRatePct: 1.8,
  },

  targets: {
    company: { level: "company", name: "SBC", targetNgn: 1_200_000_000, achievedNgn: 962_450_000 },
    regions: [
      { level: "region", name: "Lagos",  targetNgn: 420_000_000, achievedNgn: 332_000_000 },
      { level: "region", name: "Abuja",  targetNgn: 210_000_000, achievedNgn: 182_000_000 },
      { level: "region", name: "Port Harcourt", targetNgn: 180_000_000, achievedNgn: 146_000_000 },
    ],
    reps: [
      { level: "rep", name: "James Okoro", targetNgn: 25_000_000, achievedNgn: 20_400_000 },
      { level: "rep", name: "Mary Johnson", targetNgn: 22_000_000, achievedNgn: 17_750_000 },
      { level: "rep", name: "Chika Ude", targetNgn: 18_000_000, achievedNgn: 14_600_000 },
    ],
  },

  ordersByStatus: [
    { status: "Draft",     count: 38 },
    { status: "Submitted", count: 121 },
    { status: "Approved",  count: 96 },
    { status: "In transit",count: 58 },
    { status: "Delivered", count: 646 },
  ],

  categoryContribution: [
    { category: "Cola",          salesNgn: 392_000_000, cases: 510_000, sharePct: 40.7 },
    { category: "Orange",        salesNgn: 182_000_000, cases: 245_000, sharePct: 18.9 },
    { category: "Lemon/Lime",    salesNgn: 140_000_000, cases: 190_000, sharePct: 14.5 },
    { category: "Water",         salesNgn: 110_000_000, cases: 205_000, sharePct: 11.4 },
    { category: "Energy",        salesNgn:  78_000_000, cases:  82_000, sharePct:  8.1 },
    { category: "Others",        salesNgn:  60_450_000, cases:  52_200, sharePct:  6.3 },
  ],

  marketShareTrend: [
    { date: "2025-03", sbc: 46.1, competitorA: 44.2, competitorB: 9.7 },
    { date: "2025-04", sbc: 47.2, competitorA: 43.3, competitorB: 9.5 },
    { date: "2025-05", sbc: 47.9, competitorA: 42.6, competitorB: 9.5 },
    { date: "2025-06", sbc: 48.3, competitorA: 42.1, competitorB: 9.6 },
    { date: "2025-07", sbc: 48.5, competitorA: 41.9, competitorB: 9.6 },
    { date: "2025-08", sbc: 48.6, competitorA: 41.8, competitorB: 9.6 },
  ],

  alerts: [
    { id: "a1", severity: "high",   type: "target_risk", title: "Lagos region at 79% of MTD target", entity: { type: "region", id: "rg-lag", name: "Lagos" }, action: { label: "Open targets", href: "/targets" } },
    { id: "a2", severity: "medium", type: "credit_hold", title: "FineFoods Yaba on credit hold (₦1.8m)", entity: { type: "customer", id: "C-4412", name: "FineFoods Yaba" }, action: { label: "View customer", href: "/customers" } },
    { id: "a3", severity: "low",    type: "low_stock",   title: "Pepsi 50cl low at Mushin depot", entity: { type: "sku", id: "SKU-PEP-50", name: "Pepsi 50cl" }, action: { label: "Open inventory", href: "/orders" } },
  ],

  leaders: {
    regions: [
      { name: "Lagos", revenueNgn: 332_000_000, cases: 438_000, growthPct: 5.2, otifPct: 94.5 },
      { name: "Abuja", revenueNgn: 182_000_000, cases: 246_000, growthPct: 3.8, otifPct: 92.1 },
      { name: "PHC",   revenueNgn: 146_000_000, cases: 212_000, growthPct: 2.4, otifPct: 91.0 },
    ],
    reps: [
      { name: "James Okoro", region: "Lagos", orders: 85, targetNgn: 25_000_000, achievedNgn: 20_400_000, winRatePct: 61 },
      { name: "Mary Johnson", region: "Abuja", orders: 62, targetNgn: 22_000_000, achievedNgn: 17_750_000, winRatePct: 58 },
      { name: "Chika Ude",    region: "PHC",   orders: 54, targetNgn: 18_000_000, achievedNgn: 14_600_000, winRatePct: 55 },
    ],
    customers: [
      { name: "SuperMart Ikeja", region: "Lagos", revenueNgn: 38_500_000, aovNgn: 1_35e6, lastOrderISO: "2025-08-21", balanceStatus: "ok" },
      { name: "FineFoods Yaba",  region: "Lagos", revenueNgn: 31_200_000, aovNgn: 1_1e6,  lastOrderISO: "2025-08-18", balanceStatus: "hold" },
      { name: "MegaMart Garki",  region: "Abuja", revenueNgn: 27_900_000, aovNgn: 0.95e6, lastOrderISO: "2025-08-16", balanceStatus: "ok" },
    ],
  },
};
