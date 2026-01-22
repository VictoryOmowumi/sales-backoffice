// src/config/org.ts
export const ORG_REGION_OPTIONS = [
  { id: "region-abuja", label: "Abuja" },
  { id: "region-kano", label: "Kano" },
  { id: "region-kaduna", label: "Kaduna" },
  { id: "region-aba", label: "Aba" },
  { id: "region-enugu", label: "Enugu" },
  { id: "region-benin", label: "Benin" },
  { id: "region-ibadan", label: "Ibadan" },
  { id: "region-ilorin", label: "Ilorin" },
  { id: "region-ikeja", label: "Ikeja" },
] as const;

export type OrgRegionId = typeof ORG_REGION_OPTIONS[number]["id"];
export type OrgRegionName = typeof ORG_REGION_OPTIONS[number]["label"];

export const ORG_CHANNEL_OPTIONS = [
  "Modern Trade",
  "General Trade",
  "HORECA",
  "E-Commerce",
] as const;

export type OrgChannelName = typeof ORG_CHANNEL_OPTIONS[number];

export const ORG_BUDGET_CENTERS = [
  "National Accounts",
  "Regional Activation",
  "Channel Programs",
  "Trade Investments",
  "Brand Marketing",
] as const;

export type OrgBudgetCenter = typeof ORG_BUDGET_CENTERS[number];

export const SALES_ROLE_OPTIONS = [
  { id: "ce", label: "Customer Executive", code: "CE" },
  { id: "rsm", label: "Regional Sales Manager", code: "RSM" },
  { id: "dsm", label: "Divisional Sales Manager", code: "DSM" },
  { id: "tdm", label: "Trade Distribution Manager", code: "TDM" },
  { id: "mm", label: "Marketing Manager", code: "MM" },
] as const;

export type SalesRoleId = typeof SALES_ROLE_OPTIONS[number]["id"];

export const SUPERVISOR_ROLE_IDS: SalesRoleId[] = ["rsm", "dsm", "tdm", "mm"];

export const SALES_ROLE_LABEL: Record<SalesRoleId, string> = SALES_ROLE_OPTIONS.reduce(
  (acc, role) => {
    acc[role.id] = role.label;
    return acc;
  },
  {} as Record<SalesRoleId, string>
);


