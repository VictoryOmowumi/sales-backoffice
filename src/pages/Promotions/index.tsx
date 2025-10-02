import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Promotions() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Promotions</h1>
      <Card className="p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Input placeholder="Search promotions…" className="max-w-sm" />
          <Button className="rounded-xl">New promotion</Button>
        </div>
        <Separator className="my-3" />
        <div className="text-sm text-muted-foreground">No promotions yet. Create a promotion to define mechanics (discount, bundle), channels, dates, and tracking KPIs.</div>
      </Card>
    </div>
  );
}