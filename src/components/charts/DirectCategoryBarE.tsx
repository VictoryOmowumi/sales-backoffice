import EChart, { cssVar, withAlpha } from "./EChart";

export default function DirectCategoryBarE({
  data
}: {
  data: { name: string; value: number }[];
}) {
  const C1 = cssVar("--color-chart-1");
  const GRID = cssVar("--border");

  const option = {
    grid: { left: 24, right: 24, top: 24, bottom: 24 },
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
      axisPointer: { type: "shadow" },
      formatter: (params: any[]) => {
        const category = params[0]?.name;
        const value = params[0]?.value;
        return `
          <div class="text-xs text-muted-foreground">${category}</div>
          <div class="text-sm">₦${value?.toFixed(1)}b</div>
        `;
      }
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.name),
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
        type: "bar",
        data: data.map(d => ({
          value: d.value,
          itemStyle: {
            color: C1,
            borderRadius: [8, 8, 0, 0]
          }
        })),
        barWidth: "60%",
       
        label: {
          show: true,
          position: "top",
          color: cssVar("--muted-foreground"),
          fontSize: 11,
          formatter: (params: any) => `₦${params.value.toFixed(1)}b`
        }
      }
    ],
    aria: {
      enabled: true,
      decal: {
          show: true,
          image: "https://echarts.apache.org/examples/data/asset/img/data/strip.png",
          repeat: "repeat"
      }
  }
  };

  return <EChart option={option} />;
}
