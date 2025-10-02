export type Approval = {
    id: string;
    type: "order" | "price" | "credit" | "return";
    title: string;
    dueISO?: string;
    href: string;
  };
  
  export type ChangeDigest = { id: string; text: string; href?: string };
  
  export type Campaign = {
    id: string;
    title: string;
    endISO: string;
    progressPct: number;
    href: string;
  };
  
  export type Kudos = { id: string; person: string; message: string; avatarUrl?: string };
  
  export type HomeUx = {
    myDay: { goalRevenueNgn: number; goalVisits: number; nextEvents: { time: string; title: string }[] };
    approvals: Approval[];
    alerts: { id: string; severity: "low" | "medium" | "high"; title: string; href: string }[];
    sinceLastVisit: ChangeDigest[];
    campaigns: Campaign[];
    announcements: { id: string; title: string; href?: string }[];
    kudos: Kudos[];
  };
  
  export const homeUx: HomeUx = {
    myDay: {
      goalRevenueNgn: 5_000_000,
      goalVisits: 8,
      nextEvents: [
        { time: "10:00", title: "Review Lagos targets" },
        { time: "14:30", title: "Key account check-in – FineFoods Yaba" },
      ],
    },
    approvals: [
      { id: "ap1", type: "price",  title: "Price exception – SuperMart Ikeja (₦-120k)", dueISO: "2025-08-24T16:00:00Z", href: "/orders/price-exceptions" },
      { id: "ap2", type: "credit", title: "Lift credit hold – MegaMart Garki (₦1.2m)", href: "/customers/credit-holds" },
      { id: "ap3", type: "return", title: "Return claim – Aquafina 50cl (120 cases)", href: "/orders/returns" },
    ],
    alerts: [
      { id: "al1", severity: "high",   title: "Lagos target at risk (79%)", href: "/targets" },
      { id: "al2", severity: "medium", title: "Low stock – Pepsi 50cl at Mushin depot", href: "/inventory" },
      { id: "al3", severity: "low",    title: "2 customers inactive for 60 days", href: "/customers/inactive" },
    ],
    sinceLastVisit: [
      { id: "ch1", text: "Revenue +3.1% vs last week" },
      { id: "ch2", text: "Abuja moved up 2 spots by growth", href: "/dashboard/overview" },
      { id: "ch3", text: "3 new promotions published", href: "/promotions" },
    ],
    campaigns: [
      { id: "cp1", title: "Back-to-School Cola Promo", endISO: "2025-09-15", progressPct: 62, href: "/campaigns" },
      { id: "cp2", title: "HORECA Cold Bottle Drive",  endISO: "2025-10-01", progressPct: 34, href: "/campaigns" },
    ],
    announcements: [
      { id: "an1", title: "New price list effective Sept 1", href: "/resources/pricing" },
      { id: "an2", title: "Mobile app beta now open",       href: "/resources/mobile" },
    ],
    kudos: [
      { id: "kd1", person: "Mary Johnson", message: "Closed ₦12.4m this week 🎉" },
      { id: "kd2", person: "James Okoro",  message: "Top OTIF – 98.2%" },
    ],
  };
  