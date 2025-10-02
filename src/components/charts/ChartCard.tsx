import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download } from "lucide-react";

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
        {action ?? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Download className="size-4" /></Button>
            <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
          </div>
        )}
      </div>
      <div className="h-64">{children}</div>
    </Card>
  );
}
