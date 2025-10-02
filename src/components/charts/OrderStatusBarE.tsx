import EChart, { cssVar, withAlpha } from "./EChart";

export default function OrderStatusBarE({
  data
}: {
  data: Array<{ status: string; count: number; percentage: number }>;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const C3 = cssVar("--color-chart-3");
  const C4 = cssVar("--color-chart-4");
  const C5 = cssVar("--color-chart-5");
  const GRID = cssVar("--border");

  const colors = [C1, C2, C3, C4, C5];

  const option = {
    grid: { left: 60, right: 24, top: 24, bottom: 80 },
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
      axisPointer: { type: "shadow" },
      formatter: (params: Array<{ name: string; value: number; color: string }>) => {
        const param = params[0];
        return `
          <div class="text-xs text-muted-foreground">${param.name}</div>
          <div class="text-sm">
            <span class="inline-block w-2 h-2 rounded-full mr-2" style="background: ${param.color}"></span>
            Count: ${param.value}
          </div>
        `;
      }
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.status),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        color: cssVar("--muted-foreground"), 
        fontSize: 11,
        rotate: 45,
        margin: 12
      }
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
        fontSize: 11
      }
    },
    series: [
      {
        name: "Order Count",
        type: "bar",
        data: data.map((item, index) => ({
          value: item.count,
          itemStyle: {
            color: colors[index % colors.length],
            borderRadius: [8, 8, 0, 0]
          }
        })),
        barWidth: "60%",
        label: {
          show: true,
          position: "top",
          color: cssVar("--muted-foreground"),
          fontSize: 11,
          formatter: (params: { value: number }) => params.value.toString()
        }
      }
    ]
  };

  return <EChart option={option} height={400} />;
}
