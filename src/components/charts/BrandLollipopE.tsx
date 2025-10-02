import EChart, { cssVar, withAlpha } from "./EChart";

export default function BrandLollipopE({
  data
}:{ data: { name: string; value: number }[] }) {
  const C1 = cssVar("--color-chart-1");
  const GRID = cssVar("--border");

  const option = {
    grid: {  left: 100, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: "axis", axisPointer: { type: "line" } },
    xAxis: {
      type: "value",
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: withAlpha(GRID, .4), type: "dashed" } },
      axisLabel: { color: cssVar("--muted-foreground"), formatter: (v: number)=>`${v}b` },
    },
    yAxis: {
      type: "category", data: data.map(d=>d.name),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { 
        color: cssVar("--muted-foreground"),
        fontSize: 12,
        margin: 16
      },
    },
    series: [
      {
        name: "Sales", type: "bar",
        data: data.map(d=>d.value),
        barWidth: 8, itemStyle: { borderRadius: [4, 4, 4, 4], color: C1 },
        z: 1
      },
      {
        name: "Tips", type: "scatter",
        data: data.map(d=>d.value),
        symbol: "circle", symbolSize: 12,
        itemStyle: { color: C1, borderColor: "#fff", borderWidth: 2 },
        z: 2
      }
    ]
  };
  return <EChart option={option} />;
}
