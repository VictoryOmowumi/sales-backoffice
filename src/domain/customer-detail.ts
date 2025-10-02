export type Money = { amount: number; currency: "NGN" };

export type Customer = {
  id: string;
  code: string;
  name: string;
  status: "Active" | "OnHold" | "Inactive";
  channel: "ModernTrade" | "GeneralTrade" | "HORECA" | "ECom";
  segment?: string;
  region: "Abuja" | "Kano" | "Kaduna" | "Aba" | "Enugu" | "Benin" | "Ibadan" | "Ilorin" | "Ikeja";
  route?: string;
  address: { line1: string; city: string; state: string; lat?: number; lng?: number };
  contacts: { role: "Primary"|"Finance"|"Receiving"; name: string; phone?: string; email?: string }[];
  paymentTerms: "Prepaid" | "COD" | "Net7" | "Net14" | "Net30";
  priceTier?: string;
  owner: { repId: string; repName: string; tdm?: string; rsm?: string };

  credit: {
    limit: number;
    exposure: number;            // current outstanding
    aging: { b0_30: number; b31_60: number; b61_90: number; b90p: number };
    dsoDays: number;
    holds: { id: string; reason: string; createdAt: string; by: string; active: boolean }[];
  };

  kpis: {
    last90dRevenue: number;
    ytdRevenue: number;
    ordersCount90d: number;
    aov: number;
    fillRatePct: number;
    onTimePct: number;
    priceCompliancePct: number;
    returnRatePct: number;
    visitCompliancePct: number;
  };

  revenueTrend: { month: string; actual: number; target?: number }[]; // for sparkline/lollipop
};

export type OrderSummary = {
  id: string;
  number: string;
  date: string;
  status: "Pending"|"Approved"|"Shipped"|"Delivered"|"Invoiced"|"Cancelled"|"Returned";
  cases: number;
  lines: number;
  value: number;
  fillRatePct: number;
  onTime: boolean;
};

export type Payment = {
  id: string;
  receiptNo: string;
  date: string;
  method: "BankTransfer"|"POS"|"Cash"|"Gateway";
  provider?: string;     // e.g., Zenith, Paystack
  amount: number;
  success: boolean;
  reference?: string;
  appliedTo: { invoiceNo: string; amount: number }[];
};

export type ReturnClaim = {
  id: string;
  date: string;
  status: "Pending"|"Approved"|"Rejected"|"InTransit"|"Credited";
  reason: "Damaged"|"Expired"|"WrongItem"|"Shortdated"|"Other";
  items: { sku: string; name: string; qty: number }[];
  creditNoteNo?: string;
};

export type Visit = {
  id: string;
  plannedAt: string;
  completedAt?: string;
  status: "Planned"|"Completed"|"Missed"|"Cancelled";
  repId: string;
  notes?: string;
  checklist?: { key: string; ok: boolean }[];
};

export type ActivityItem = {
  id: string;
  type: "order" | "payment" | "claim" | "credit" | "note" | "document";
  date: string;
  title: string;
  description?: string;
  user?: string;
  metadata?: Record<string, unknown>;
};
