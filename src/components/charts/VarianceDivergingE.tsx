import EChart, { cssVar, withAlpha } from "./EChart";

export default function VarianceDivergingE({
  data
}:{ data: { name: string; impactNgn: number }[] }) {
  const POS = cssVar("--color-chart-1");
  const NEG = "oklch(0.62 0.19 27)";
  const GRID = cssVar("--border");

  const option = {
    grid: { left: 100, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: any)=>`₦${v}b` },
    xAxis: {
      type: "value",
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: withAlpha(GRID, .4), type: "dashed" } },
      axisLabel: { color: cssVar("--muted-foreground") },
    },
    yAxis: {
      type: "category", inverse: false, data: data.map(d=>d.name),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { 
        color: cssVar("--muted-foreground"),
        fontSize: 12,
        margin: 16
      },
    },
    series: [{
      type: "bar",
      data: data.map(d=>({ value: d.impactNgn, itemStyle: { color: d.impactNgn >= 0 ? POS : NEG, borderRadius: 6, height: 24 } })),
      barWidth: 12,
      label: { show: true, position: (val:any)=> val.data.value>=0 ? "right" : "left", color: cssVar("--foreground"), fontSize: 10, padding: [1, 0, 0, 5], formatter: (p:any)=>`₦${p.data.value}b` },
      markLine: { silent: true, data: [{ xAxis: 0 }], lineStyle: { color: withAlpha(GRID, .8), type: "dashed" } },
    }]
  };
  return <EChart option={option} />;
}
