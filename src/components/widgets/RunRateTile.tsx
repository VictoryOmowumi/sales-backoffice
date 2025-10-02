import { Card } from "@/components/ui/card";
import { format, endOfMonth, differenceInCalendarWeeks, parseISO } from "date-fns";

export default function RunRateTile({ revenueNgn, attainmentPct, periodTo }:{
  revenueNgn: number;    // absolute ₦
  attainmentPct: number; // 0..100+
  periodTo: string;      // YYYY-MM
}) {
  const target = revenueNgn / (attainmentPct / 100);
  const gap = Math.max(0, target - revenueNgn);
  const end = endOfMonth(parseISO(`${periodTo}-01`));
  const weeksLeft = Math.max(1, differenceInCalendarWeeks(end, new Date(), { weekStartsOn: 1 }));
  const needPerWeek = gap / weeksLeft;

  const pct = Math.min(100, attainmentPct);
  return (
    <Card className="rounded-2xl p-4">
      <div className="text-sm font-medium">Run-rate to Target</div>
      <div className="mt-2">
        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Attainment: </span>
          <span className="font-medium">{pct.toFixed(1)}%</span>
        </div>
        <div className="mt-1 text-sm">
          <span className="text-muted-foreground">Gap: </span>
          <span className="font-medium">₦{fmt(~~gap)}</span>
          <span className="text-muted-foreground"> • Need / week: </span>
          <span className="font-medium">₦{fmt(~~needPerWeek)}</span>
          <span className="text-muted-foreground"> • Weeks left: </span>
          <span className="font-medium">{weeksLeft}</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Through {format(end, "dd MMM yyyy")}</div>
      </div>
    </Card>
  );
}

const nf = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 });
const fmt = (x:number)=> nf.format(x);
