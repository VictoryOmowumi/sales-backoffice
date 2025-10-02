export const fmtMoney = (v: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(v);
  
  export const fmtNum = (v: number) => new Intl.NumberFormat("en-NG").format(v);
  export const fmtPct = (v: number) => `${v.toFixed(1)}%`;
  export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });