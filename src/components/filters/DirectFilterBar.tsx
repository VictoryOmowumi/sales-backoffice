import * as React from "react";
import { useDirectFilters } from "@/store/filters.direct";
import { REGIONS, CHANNELS } from "@/config/direct.constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // shadcn (react-day-picker)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

function ymToDate(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
}
function toYm(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function DirectFilterBar() {
  const f = useDirectFilters();
  const [open, setOpen] = React.useState(false);

  const from = ymToDate(f.from);
  const to = ymToDate(f.to);

  return (
    <Card className="rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Month range via shadcn calendar (range) */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-xl">
              <CalendarIcon className="mr-2 size-4" />
              {format(from, "LLL yyyy")} → {format(to, "LLL yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-2 gap-2">
              <Calendar
                mode="single"
                month={from}
                selected={from}
                onMonthChange={(m) => f.set("from", toYm(m))}
                onSelect={(d) => d && f.set("from", toYm(new Date(d.getFullYear(), d.getMonth(), 1)))}
              />
              <Calendar
                mode="single"
                month={to}
                selected={to}
                onMonthChange={(m) => f.set("to", toYm(m))}
                onSelect={(d) => d && f.set("to", toYm(new Date(d.getFullYear(), d.getMonth(), 1)))}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Select value={f.region} onValueChange={(v) => f.set("region", v as any)}>
          <SelectTrigger className="w-[200px] rounded-xl"><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All regions</SelectItem>
            {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={f.channel} onValueChange={(v) => f.set("channel", v as any)}>
          <SelectTrigger className="w-[200px] rounded-xl"><SelectValue placeholder="Channel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All channels</SelectItem>
            {CHANNELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground" onClick={() => f.reset()}>
          Reset
        </Button>
      </div>
    </Card>
  );
}
