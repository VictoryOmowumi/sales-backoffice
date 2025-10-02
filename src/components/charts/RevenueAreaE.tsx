import EChart, { echarts, cssVar, withAlpha } from "./EChart";

export default function RevenueAreaE({
  data, compareKey, compareLabel,
}: {
  data: { date: string; actual: number; pp?: number; ly?: number }[];
  compareKey?: "pp" | "ly";
  compareLabel?: string;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const GRID = cssVar("--border");

  const option = {
    grid: { left: 50, right: 12, top: 16, bottom: 24 },
    tooltip: { trigger: "axis", className: "echarts-tooltip" },
    legend: {
      top: 0, icon: "roundRect", itemWidth: 12, itemHeight: 8,
      textStyle: { color: cssVar("--muted-foreground") },
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.date),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: cssVar("--muted-foreground") },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: withAlpha(GRID, .4), type: "dashed" } },
      axisLabel: { color: cssVar("--muted-foreground"), formatter: (v: number)=>`${v}b` },
    },
    series: [
      {
        name: "Actual",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 3, color: C1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: withAlpha(C1, .28) },
            { offset: 1, color: withAlpha(C1, .04) },
          ])
        },
        itemStyle: { shadowBlur: 8, shadowColor: withAlpha(C1, .4) },
        data: data.map(d => d.actual),
      },
      ...(compareKey ? [{
        name: compareLabel,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 3, color: C2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: withAlpha(C2, .22) },
            { offset: 1, color: withAlpha(C2, .03) },
          ])
        },
        itemStyle: { shadowBlur: 8, shadowColor: withAlpha(C2, .35) },
        data: data.map(d => (d as any)[compareKey]),
      }] : []),
    ],
  };
  return <EChart option={option} />;
}
