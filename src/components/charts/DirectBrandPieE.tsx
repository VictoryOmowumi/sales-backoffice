import EChart, { cssVar } from "./EChart";

export default function DirectBrandPieE({
  data
}: {
  data: { name: string; contrPct: number; cp: number; pp: number; growthPct: number }[];
}) {
  const C1 = "oklch(0.72 0.2 250)";
  const C2 = "oklch(0.8 0.19 150)";
  const C3 = "oklch(0.65 0.18 280)";
  const C4 = "oklch(0.75 0.16 200)";
  const C5 = "oklch(0.68 0.22 320)";
  const C6 = "oklch(0.82 0.17 180)";

  const colors = [C1, C2, C3, C4, C5, C6];

  const option = {
    grid: { left: 24, right: 24, top: 24, bottom: 24 },
    tooltip: {
      trigger: "item",
      className: "echarts-tooltip",
      formatter: (params: any) => {
        const item = data.find(d => d.name === params.name);
        return `
          <div class="text-sm font-medium">
            ${params.name}: ${params.value.toFixed(1)}%
          </div>
          <div class="text-xs text-muted-foreground">
            CP: ₦${item?.cp.toFixed(1)}b | PP: ₦${item?.pp.toFixed(1)}b
          </div>
        `;
      }
    },
    legend: {
      orient: "vertical",
      right: 0,
      top: "center",
      icon: "roundRect",
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: cssVar("--muted-foreground"), fontSize: 11 },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name);
        return `${name} ${item?.contrPct.toFixed(1)}%`;
      }
    },
    series: [
      {
        name: "Brand Contribution",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          name: item.name,
          value: item.contrPct,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  };

  return <EChart option={option} />;
}
