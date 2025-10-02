import EChart, { cssVar, withAlpha } from "./EChart";

export default function DirectPerformanceLineE({
  data
}: {
  data: { m: string; cp: number; pp: number; growthPct: number }[];
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const GRID = cssVar("--border");

  const option = {
    grid: { left: 24, right: 24, top: 24, bottom: 24 },
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
      axisPointer: { type: "line" },
      formatter: (params: any[]) => {
        const date = params[0]?.axisValue;
        const cp = params.find(p => p.seriesName === "Current Period")?.value;
        const pp = params.find(p => p.seriesName === "Previous Period")?.value;
        return `
          <div class="text-xs text-muted-foreground">${date}</div>
          <div class="text-sm">
            <span class="inline-block w-2 h-2 rounded-full mr-2" style="background: ${C1}"></span>
            Current Period: ₦${cp?.toFixed(1)}b
          </div>
          <div class="text-sm">
            <span class="inline-block w-2 h-2 rounded-full mr-2" style="background: ${C2}"></span>
            Previous Period: ₦${pp?.toFixed(1)}b
          </div>
        `;
      }
    },
    legend: {
      data: ["Current Period", "Previous Period"],
      textStyle: { color: cssVar("--muted-foreground"), fontSize: 12 },
      icon: "roundRect",
      itemWidth: 12,
      itemHeight: 8
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.m),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: cssVar("--muted-foreground"), fontSize: 11 }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { 
        lineStyle: { 
          color: withAlpha(GRID, 0.3), 
          type: "dashed" 
        } 
      },
      axisLabel: { 
        color: cssVar("--muted-foreground"), 
        fontSize: 11,
        formatter: (value: number) => `${value}b`
      }
    },
    series: [
      {
        name: "Current Period",
        type: "line",
        data: data.map(d => d.cp),
        smooth: true,
        lineStyle: { color: C1, width: 3 },
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: withAlpha(C1, 0.2) },
              { offset: 1, color: withAlpha(C1, 0.05) }
            ]
          }
        }
      },
      {
        name: "Previous Period",
        type: "line",
        data: data.map(d => d.pp),
        smooth: true,
        lineStyle: { color: C2, width: 3 },
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: withAlpha(C2, 0.2) },
              { offset: 1, color: withAlpha(C2, 0.05) }
            ]
          }
        }
      }
    ]
  };

  return <EChart option={option} />;
}
