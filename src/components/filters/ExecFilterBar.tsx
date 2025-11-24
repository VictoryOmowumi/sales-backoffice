import { useCompare } from "@/store/compare";
import { useExecFilters } from "@/store/filters.exec";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ORG_CHANNEL_OPTIONS, ORG_REGION_OPTIONS } from "@/config/org";

export default function ExecFilterBar() {
  const { mode, setMode } = useCompare();
  const f = useExecFilters();

  // Convert YYYY-MM → Date for DateRangePicker
  const fromDate = parseISO(`${f.from}-01`);
  const toDate = parseISO(`${f.to}-01`);

  const handleDateRangeUpdate = ({ range }: { range: DateRange }) => {
    if (!range.from || !range.to) return;
    
    // Convert to YYYY-MM format for the first day of each month
    const from = format(range.from, "yyyy-MM");
    const to = format(range.to, "yyyy-MM");
    
    // Update the filters
    f.set("from", from);
    f.set("to", to);
  };

  const clearAllFilters = () => {
    f.set("region", "All");
    f.set("channel", "All");
    setMode("none");
    // Reset to default date range (last 6 months)
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    f.set("from", format(sixMonthsAgo, "yyyy-MM"));
    f.set("to", format(today, "yyyy-MM"));
  };

  const hasActiveFilters =
    f.region !== "All" || f.channel !== "All" || mode !== "none";

  return (
    <div className="space-y-3">
      <Card className="rounded-2xl p-4 border bg-gradient-to-br from-background to-muted/10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Period (Advanced Date Range Picker) */}
          <DateRangePicker
            initialDateFrom={fromDate}
            initialDateTo={toDate}
            onUpdate={handleDateRangeUpdate}
            align="start"
            className="rounded-xl h-10 px-4 border-2 hover:border-primary/50 transition-colors font-medium"
          />

          {/* Region */}
          <Select
            value={f.region}
            onValueChange={(v) => f.set("region", v as typeof f.region)}
          >
            <SelectTrigger className="w-[180px] rounded-xl h-10 border-2 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="max-h-64 rounded-xl">
              <SelectItem value="All">Regions</SelectItem>
              {ORG_REGION_OPTIONS.map((region) => (
                <SelectItem key={region.id} value={region.label} className="rounded-lg">
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Channel */}
          <Select
            value={f.channel}
            onValueChange={(v) => f.set("channel", v as typeof f.channel)}
          >
            <SelectTrigger className="w-[180px] rounded-xl h-10 border-2 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">Channels</SelectItem>
              {ORG_CHANNEL_OPTIONS.map((channel) => (
                <SelectItem key={channel} value={channel} className="rounded-lg">
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-8" />

          {/* Compare mode */}
          <div className="inline-flex rounded-xl border-2 p-1 bg-background">
            <Toggle
              label="None"
              active={mode === "none"}
              onClick={() => setMode("none")}
            />
            <Toggle
              label="Prev Period"
              active={mode === "pp"}
              onClick={() => setMode("pp")}
            />
            <Toggle
              label="Last Year"
              active={mode === "ly"}
              onClick={() => setMode("ly")}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground rounded-xl"
              >
                <X className="size-4 mr-1" />
                Clear all
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-xl h-10 border-2 hover:border-primary/50 transition-colors"
            >
              <SlidersHorizontal className="mr-2 size-4" />
              Save view
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Card className="rounded-xl p-3 border bg-muted/20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Active filters:
            </span>
            {f.region !== "All" && (
              <Badge
                variant="secondary"
                className="rounded-lg text-xs px-2 py-1"
              >
                Region: {f.region}
                <button
                  onClick={() => f.set("region", "All")}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {f.channel !== "All" && (
              <Badge
                variant="secondary"
                className="rounded-lg text-xs px-2 py-1"
              >
                Channel: {f.channel}
                <button
                  onClick={() => f.set("channel", "All")}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {mode !== "none" && (
              <Badge
                variant="secondary"
                className="rounded-lg text-xs px-2 py-1"
              >
                Compare: {mode === "pp" ? "Previous Period" : "Last Year"}
                <button
                  onClick={() => setMode("none")}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
