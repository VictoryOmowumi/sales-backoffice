import ExecFilterBar from "@/components/filters/ExecFilterBar";
import { useExecData } from "@/hooks/useExecData";
import { useCompare } from "@/store/compare";
import { useExecFilters } from "@/store/filters.exec";
import Panel from "@/components/layout/Panel";
import KpiCardPro from "@/components/widgets/KpiCardPro";
import RunRateTile from "@/components/widgets/RunRateTile";
import PackMixDoughnutE from "@/components/charts/PackMixDoughnutE";
import RevenueAreaE from "@/components/charts/RevenueAreaE";
import MarketShareLineE from "@/components/charts/MarketShareLineE";
import BrandLollipopE from "@/components/charts/BrandLollipopE";
import VarianceDivergingE from "@/components/charts/VarianceDivergingE";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Target, BarChart3 } from "lucide-react";

const nf = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const money = (x: number) => `₦${nf.format(x)}`;

export default function ExecutiveDashboard() {
  const d = useExecData();
  const { mode, setMode } = useCompare();
  const f = useExecFilters();

  const clearAllFilters = () => {
    f.set("region", "All");
    f.set("channel", "All");
    setMode("none");
  };
  const hasActiveFilters =
    f.region !== "All" || f.channel !== "All" || mode !== "none";

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className=" bg-[radial-gradient(1200px_400px_at_-100px_-200px,oklch(0.97_0_0),transparent)] dark:bg-[radial-gradient(1200px_400px_at_-100px_-200px,oklch(0.03_0_0),transparent)]">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold">Executive Dashboard</h1>
            <p className="text-base text-muted-foreground mt-2">
              Company performance at a glance
            </p>
          </div>
          <div className="flex items-center gap-4">
            {mode !== "none" && (
              <Badge
                variant="secondary"
                className="rounded-lg px-4 py-2 text-sm"
              >
                Compare: {d.compLabel}
              </Badge>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4 mr-2" /> Clear filters
              </Button>
            )}
          </div>
        </div>
        <ExecFilterBar />
      </div>

      {/* KPIs — Better spacing and proportions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCardPro
          label="Revenue"
          value={money(d.kpis.revenueNgn)}
          deltaPct={d.kpis.yoyPct}
          tone={d.kpis.yoyPct >= 0 ? "up" : "down"}
          hint="vs PP"
          right={<TrendingUp className="size-6 text-emerald-500" />}
        />
        <KpiCardPro
          label="Market Share"
          value={`${d.kpis.marketSharePct.toFixed(1)}%`}
          deltaPct={d.kpis.marketSharePct - 15.2}
          tone={d.kpis.marketSharePct >= 15.2 ? "up" : "down"}
          hint="pp vs PP"
          right={<BarChart3 className="size-6 text-blue-500" />}
        />
        <KpiCardPro
          label="YoY Growth"
          value={`${d.kpis.yoyPct.toFixed(1)}%`}
          deltaPct={d.kpis.yoyPct}
          tone={d.kpis.yoyPct >= 0 ? "up" : "down"}
          hint="vs LY"
          right={<TrendingUp className="size-6 text-emerald-500" />}
        />
        <KpiCardPro
          label="Target Attainment"
          value={`${d.kpis.targetAttainmentPct.toFixed(1)}%`}
          deltaPct={d.kpis.targetAttainmentPct - 100}
          tone={d.kpis.targetAttainmentPct >= 100 ? "up" : "down"}
          hint="of target"
          right={<Target className="size-6 text-orange-500" />}
        />
      </div>

      {/* Revenue Trend + Run Rate - Wide chart paired with compact metric */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-9">
          <Panel
            title="Revenue Trend"
            subtitle={`Actual ${mode !== "none" ? "vs " + d.compLabel : ""}`}
          >
            <div className="h-[420px]">
              <RevenueAreaE
                data={d.revenueTrend}
                compareKey={
                  mode === "none" ? undefined : (d.compKey as "pp" | "ly")
                }
                compareLabel={d.compLabel}
              />
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <RunRateTile
            revenueNgn={d.kpis.revenueNgn}
            attainmentPct={d.kpis.targetAttainmentPct}
            periodTo={f.to}
          />
          <Panel title="Quick Insights">
            <div className="space-y-6">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                      Regional Performance
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Ikeja & Abuja lead positive variance—replicate mechanics
                      in two lagging regions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Product Alert
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Mirinda softness—check PET 50cl flavors & promo depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Market Share + Quick Insights - Compact chart paired with text insights */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4">
          <Panel
            title="Market Share"
            subtitle={`SBC ${mode === "ly" ? "vs LY" : ""}`}
          >
            <div className="h-[420px]">
              <MarketShareLineE data={d.shareTrend} showLy={mode === "ly"} />
            </div>
          </Panel>
        </div>
        <div className="xl:col-span-8">
          <Panel
            title="Brand Contribution"
            subtitle="Top categories by sales (₦ billions)"
          >
            <div className="">
              <BrandLollipopE data={d.brandContribution} />
            </div>
          </Panel>
        </div>
      </div>

      {/* Variance Drivers + Pack Mix - Wide analysis paired with visual summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
          <Panel
            title="Variance Drivers"
            subtitle="Contribution to revenue variance vs PP (₦ billions)"
          >
            <div className="">
              <VarianceDivergingE data={d.varianceDrivers} />
            </div>
          </Panel>
        </div>
        <div className="xl:col-span-4">
          <Panel title="Pack Mix & Compliance">
            <PackMixDoughnutE
              mix={[
                { name: "RGB", value: 38 },
                { name: "PET", value: 34 },
                { name: "Water", value: 20 },
                { name: "Energy", value: 8 },
              ]}
              priceCompliancePct={96.2}
            />
          </Panel>
        </div>
      </div>

      {/* Brand Contribution - Standalone chart with adequate space */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
       
        <div className="xl:col-span-6">
          <Panel title="Performance Summary">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className={`text-2xl font-bold ${d.kpis.yoyPct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {d.kpis.yoyPct >= 0 ? '+' : ''}{d.kpis.yoyPct.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Revenue Growth
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className={`text-2xl font-bold ${d.kpis.marketSharePct >= 15.2 ? 'text-blue-600' : 'text-red-600'}`}>
                    {d.kpis.marketSharePct >= 15.2 ? '+' : ''}{(d.kpis.marketSharePct - 15.2).toFixed(1)}pp
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Market Share
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Key Highlights</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Revenue exceeds target by {(d.kpis.targetAttainmentPct - 100).toFixed(1)}%</li>
                  <li>• Market share gains in {f.region === "All" ? "7 out of 9" : "1"} region{f.region === "All" ? "s" : ""}</li>
                  <li>• Digital channels growing {d.kpis.yoyPct.toFixed(1)}% YoY</li>
                  <li>• Price compliance at 96.2%</li>
                </ul>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
