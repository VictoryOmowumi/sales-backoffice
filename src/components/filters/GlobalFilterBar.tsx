import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, CalendarIcon, Check, X, Save, Eye, Trash2 } from "lucide-react";
import { useFilters } from "@/store/filters";
import { presets, fmtRangeLabel, getPreviousPeriod } from "@/lib/period";
import { REGIONS, CHANNELS, BRANDS, SIZE_OPTIONS } from "@/constants/filters";
import type { FiltersState, SizeMode } from "@/types/filter";
import { cn } from "@/lib/utils";

function DateRangePicker() {
  const { period, setPeriod, comparePrev } = useFilters();
  const [open, setOpen] = React.useState(false);

  const label = fmtRangeLabel(period);
  const pp = comparePrev ? getPreviousPeriod(period) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <CalendarIcon className="size-4" />
          <span className="hidden sm:inline">{label}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <div className="p-3">
          <div className="text-xs text-muted-foreground mb-2">Current period</div>
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={{
              from: new Date(period.from),
              to:   new Date(period.to),
            }}
            onSelect={(range) => {
              if (!range?.from || !range?.to) return;
              setPeriod({ from: range.from, to: range.to });
            }}
            defaultMonth={new Date(period.to)}
          />

          <Separator className="my-3" />
          <div className="text-xs text-muted-foreground mb-2">Presets</div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <Button key={p.label} variant="secondary" size="sm" onClick={() => setPeriod(p.get())}>
                {p.label}
              </Button>
            ))}
          </div>

          {pp && (
            <>
              <Separator className="my-3" />
              <div className="text-xs text-muted-foreground">Previous period</div>
              <div className="mt-1 text-sm">{fmtRangeLabel(pp)}</div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SelectCommand({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <span className={cn("truncate max-w-[10rem]", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          {value && (
            <X
              className="size-3 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          )}
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[260px]">
        <Command shouldFilter>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}…`} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check className={cn("size-4", value === opt ? "opacity-100" : "opacity-0")} />
                  <span>{opt}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function GlobalFilterBar() {
  const {
    period, comparePrev, region, channel, brand, size,
    setComparePrev, setRegion, setChannel, setBrand, setSize,
    reset, views, saveView, applyView, deleteView
  } = useFilters();

  const onSave = () => {
    const name = window.prompt("Save view as:");
    if (name) saveView(name.trim());
  };

  return (
    <div className=" bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl p-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Date range */}
        <DateRangePicker />

        {/* Compare toggle */}
        <div className="flex items-center gap-2 px-2">
          <Switch id="compare" checked={comparePrev} onCheckedChange={setComparePrev} />
          <label htmlFor="compare" className="text-sm">Compare to previous</label>
        </div>

        {/* Region / Channel / Brand */}
        <SelectCommand value={region ?? null} onChange={setRegion} placeholder="Region" options={REGIONS} />
        <SelectCommand value={channel ?? null} onChange={setChannel} placeholder="Channel" options={CHANNELS} />
        <SelectCommand value={brand ?? null} onChange={setBrand} placeholder="Brand" options={BRANDS} />

        {/* Size */}
        <RadioGroup
          value={size}
          onValueChange={(v: string) => setSize(v as SizeMode)}
          className="flex items-center gap-2 ml-auto"
        >
          {SIZE_OPTIONS.map((s) => (
            <div key={s.value} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1.5">
              <RadioGroupItem id={`sz-${s.value}`} value={s.value} />
              <label htmlFor={`sz-${s.value}`} className="text-sm">{s.label}</label>
            </div>
          ))}
        </RadioGroup>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onSave}>
            <Save className="size-4 mr-1" /> Save view
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <Trash2 className="size-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Active chips + Views */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {/* Active filters as chips */}
        <Badge variant="secondary" className="gap-1">
          CP: {fmtRangeLabel(period)}
        </Badge>
        {comparePrev && (
          <Badge variant="secondary" className="gap-1">
            PP: {fmtRangeLabel(getPreviousPeriod(period))}
          </Badge>
        )}
        {region && <Badge variant="secondary">{region}</Badge>}
        {channel && <Badge variant="secondary">{channel}</Badge>}
        {brand && <Badge variant="secondary">{brand}</Badge>}
        <Badge variant="secondary">Size: {size}</Badge>

        {/* Saved views */}
        {views.length > 0 && (
          <>
            <Separator className="mx-2 h-4" orientation="vertical" />
            <span className="text-xs text-muted-foreground">Views:</span>
            {views.map((v: { name: string; filters: FiltersState }) => (
              <span key={v.name} className="inline-flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => applyView(v.name)}>
                  <Eye className="size-3 mr-1" /> {v.name}
                </Button>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Delete view ${v.name}`}
                  onClick={() => deleteView(v.name)}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
