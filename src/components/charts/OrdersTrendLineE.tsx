import EChart, { cssVar, withAlpha } from "./EChart";

export default function OrdersTrendLineE({
  data
}: {
  data: Array<{ date: string; orders: number; value: number }>;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const GRID = cssVar("--border");

  const option = {
    grid: { left: 60, right: 60, top: 40, bottom: 60 },
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
      axisPointer: { type: "line" },
      formatter: (params: Array<{ axisValue: string; seriesName: string; value: number }>) => {
        const date = params[0]?.axisValue;
        const orders = params.find(p => p.seriesName === "Orders")?.value;
        const value = params.find(p => p.seriesName === "Value")?.value || 0;
        return `
          <div class="text-xs text-muted-foreground">${date}</div>
          <div class="text-sm">
            <span class="inline-block w-2 h-2 rounded-full mr-2" style="background: ${C1}"></span>
            Orders: ${orders}
          </div>
          <div class="text-sm">
            <span class="inline-block w-2 h-2 rounded-full mr-2" style="background: ${C2}"></span>
            Value: ₦${(value / 1000000).toFixed(1)}M
          </div>
        `;
      }
    },
    legend: {
      data: ["Orders", "Value"],
      top: 10,
      textStyle: { color: cssVar("--muted-foreground"), fontSize: 12 },
      icon: "roundRect",
      itemWidth: 12,
      itemHeight: 8
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.date),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        color: cssVar("--muted-foreground"), 
        fontSize: 11,
        rotate: 45,
        margin: 12
      }
    },
    yAxis: [
      {
        type: "value",
        name: "Orders",
        position: "left",
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
          formatter: (value: number) => value.toString()
        }
      },
      {
        type: "value",
        name: "Value (₦M)",
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { 
          color: cssVar("--muted-foreground"), 
          fontSize: 11,
          formatter: (value: number) => `₦${(value / 1000000).toFixed(0)}M`
        }
      }
    ],
    series: [
      {
        name: "Orders",
        type: "line",
        yAxisIndex: 0,
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { width: 3, color: C1 },
        itemStyle: { borderWidth: 2, borderColor: "#fff", color: C1 },
        data: data.map(d => d.orders)
      },
      {
        name: "Value",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { width: 3, color: C2 },
        itemStyle: { borderWidth: 2, borderColor: "#fff", color: C2 },
        data: data.map(d => d.value)
      }
    ]
  };

  return <EChart option={option} height={400} />;
}
