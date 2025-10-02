import EChart, { cssVar, withAlpha } from "./EChart";

export default function TopCustomersBarE({
  data
}: {
  data: Array<[string, number]>;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const C3 = cssVar("--color-chart-3");
  const C4 = cssVar("--color-chart-4");
  const GRID = cssVar("--border");

  const colors = [C1, C2, C3, C4];
  const customerNames = data.map(([customerId]) => {
    // Extract customer name from ID or use a shortened version
    return `Customer ${customerId.slice(-4)}`;
  });

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
            Value: ₦${(param.value / 1000000).toFixed(1)}M
          </div>
        `;
      }
    },
    xAxis: {
      type: "category",
      data: customerNames,
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
        fontSize: 11,
        formatter: (value: number) => `₦${(value / 1000000).toFixed(0)}M`
      }
    },
    series: [
      {
        name: "Order Value",
        type: "bar",
        data: data.map(([, value], index) => ({
          value,
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
          formatter: (params: { value: number }) => `₦${(params.value / 1000000).toFixed(1)}M`
        }
      }
    ]
  };

  return <EChart option={option} height={400} />;
}
