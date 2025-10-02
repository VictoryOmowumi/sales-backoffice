import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function KpiCardPro({
  label, value, deltaPct, tone = "neutral", hint, right
}: {
  label: string;
  value: string;
  deltaPct?: number;          // vs PP or YoY
  tone?: "up" | "down" | "neutral";
  hint?: string;
  right?: React.ReactNode;
}) {
  const toneCls =
    tone === "up" ? "text-emerald-600" : tone === "down" ? "text-red-600" : "text-muted-foreground";
  return (
    <Card className="p-4 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        {right}
      </div>
      <div className="mt-2 text-3xl font-semibold leading-none">{value}</div>
      <div className={cn("mt-1 text-xs", toneCls)}>
        {typeof deltaPct === "number" ? (
          <>
            {tone === "down" ? "▼" : tone === "up" ? "▲" : "—"} {Math.abs(deltaPct).toFixed(1)}%
            {hint && <span className="text-muted-foreground"> {hint}</span>}
          </>
        ) : hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </Card>
  );
}
