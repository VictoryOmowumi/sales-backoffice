import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function KpiCard({
  title, value, deltaPct, positive = true, right
}: {
  title: string;
  value: string;
  deltaPct?: number;
  positive?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        {right}
      </div>
      <div className=" text-xl md:text-2xl font-semibold">{value}</div>
      {typeof deltaPct === "number" && (
        <div className={cn(" text-xs", positive ? "text-emerald-600" : "text-red-600")}>
          {positive ? "▲" : "▼"} {Math.abs(deltaPct).toFixed(1)}%
          <span className="text-muted-foreground"> vs PP</span>
        </div>
      )}
    </Card>
  );
}
