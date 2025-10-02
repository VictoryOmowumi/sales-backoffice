import { Card } from "@/components/ui/card";

export default function Panel({
  title, subtitle, action, className = "", children
}: {
  title?: string; subtitle?: string; action?: React.ReactNode; className?: string; children: React.ReactNode;
}) {
  return (
    <Card className={["rounded-2xl p-6", className].join(" ")}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <div className="text-2xl font-semibold">{title}</div>}
            {subtitle && <div className="text-sm text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}
