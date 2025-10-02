import EChart, { cssVar, withAlpha } from "./EChart";

export default function MarketShareLineE({
  data, showLy
}: {
  data: { date: string; sbc: number; sbcLy?: number; compA: number; compB: number }[];
  showLy?: boolean;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const C3 = cssVar("--color-chart-3");
  const C4 = "oklch(0.52 0.14 280)";
  const GRID = cssVar("--border");

  const mkLine = (name: string, key: string, color: string) => ({
    name, type: "line", smooth: true, symbol: "circle", symbolSize: 5,
    lineStyle: { width: 3, color }, itemStyle: { borderWidth: 2, borderColor: "#fff", color },
    data: data.map(d => (d as any)[key])
  });

  const option = {
    grid: { left: 50, right: 12, top: 16, bottom: 24 },
    tooltip: { trigger: "axis", className: "echarts-tooltip", valueFormatter: (v: any)=>`${v}%` },
    legend: {
      top: 0, icon: "roundRect", itemWidth: 12, itemHeight: 8,
      textStyle: { color: cssVar("--muted-foreground") },
    },
    xAxis: {
      type: "category", data: data.map(d => d.date),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: cssVar("--muted-foreground") },
    },
    yAxis: {
      type: "value", min: 0, max: 100,
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: withAlpha(GRID, .4), type: "dashed" } },
      axisLabel: { color: cssVar("--muted-foreground"), formatter: (v: number)=>`${v}%` },
    },
    series: [
      mkLine("SBC", "sbc", C1),
      ...(showLy ? [mkLine("SBC LY", "sbcLy", C2)] : []),
      mkLine("Comp A", "compA", C3),
      mkLine("Comp B", "compB", C4),
    ],
  };
  return <EChart option={option}  />;
}
