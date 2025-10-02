import { Card } from "@/components/ui/card";
import DirectFilterBar from "@/components/filters/DirectFilterBar";
import { useDirectData } from "@/hooks/useDirectData";
import { Separator } from "@/components/ui/separator";
import DirectPerformanceLineE from "@/components/charts/DirectPerformanceLineE";
import DirectCategoryBarE from "@/components/charts/DirectCategoryBarE";
import DirectBrandTreemapE from "@/components/charts/DirectBrandTreemapE";

const nf = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 1 });
const moneyB = (v: number) => `₦${nf.format(v)}b`;

export default function PerformanceTab() {
  const { data } = useDirectData();

  return (
    <div className="space-y-6">
      <DirectFilterBar />

      {/* KPI Cards - Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Current Period" value={moneyB(data.kpis.cpNgn)} />
        <Kpi label="Previous Period" value={moneyB(data.kpis.ppNgn)} />
        <Kpi label="Growth %" value={`${data.kpis.growthPct.toFixed(1)}%`} tone={data.kpis.growthPct >= 0 ? "pos" : "neg"} />
        <Kpi label="Target Attainment" value="102.3%" tone="pos" />
      </div>

      {/* Time Period Summary */}
      <Card className="rounded-2xl p-6">
        <Header title="Revenue Summary" subtitle="Performance across different time periods" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Mini label="Last 12 Months" value={moneyB(data.shorts.m12)} />
          <Mini label="Last 6 Months" value={moneyB(data.shorts.m6)} />
          <Mini label="Last 3 Months" value={moneyB(data.shorts.m3)} />
          <Mini label="Last Month" value={moneyB(data.shorts.m1)} />
        </div>
      </Card>

      {/* Main Revenue Trend - Full Width */}
      <Card className="rounded-2xl p-6">
        <Header title="Revenue Trend" subtitle="Current Period vs Previous Period (₦ billions)" />
        <div className="min-h-[400px]">
          <DirectPerformanceLineE data={data.months} />
        </div>
      </Card>

      {/* Category & Brand Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl p-6">
          <Header title="Category Performance" subtitle="Revenue contribution by category" />
          <div className="min-h-[400px]">
            <DirectCategoryBarE data={data.categories} />
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <Header title="Brand Segmentation" subtitle="Top brands by contribution" />
          <div className="min-h-[400px]">
            <DirectBrandTreemapE data={data.segmentsTop}  />
          </div>
        </Card>
      </div>

      {/* Detailed Brand Table */}
      <Card className="rounded-2xl p-6">
        <Header title="Brand Performance Details" subtitle="Comprehensive brand analysis" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="text-left py-3 font-semibold">Brand</th>
                <th className="text-left py-3 font-semibold">Contribution %</th>
                <th className="text-left py-3 font-semibold">Current Period</th>
                <th className="text-left py-3 font-semibold">Previous Period</th>
                <th className="text-left py-3 font-semibold">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {data.segmentsTop.map((r) => (
                <tr key={r.name} className="text-left border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className=" py-3">{r.contrPct.toFixed(1)}%</td>
                  <td className=" py-3 font-medium">{moneyB(r.cp)}</td>
                  <td className=" py-3">{moneyB(r.pp)}</td>
                  <td className={cn(" py-3 font-medium", r.growthPct >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {r.growthPct >= 0 ? "+" : ""}{r.growthPct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      <Separator className="mt-3" />
    </div>
  );
}
function Kpi({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  return (
    <Card className="p-6 border bg-gradient-to-br from-background to-muted/10">
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {tone && (
        <div className={`text-xs font-medium mt-1 ${tone === "pos" ? "text-emerald-600" : "text-red-600"}`}>
          {tone === "pos" ? "▲" : "▼"} vs Previous Period
        </div>
      )}
    </Card>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}
function cn(...s: (string | false | undefined)[]) { return s.filter(Boolean).join(" "); }
