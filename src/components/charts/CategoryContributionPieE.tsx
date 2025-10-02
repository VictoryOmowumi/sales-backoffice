import EChart, { cssVar } from "./EChart";

export default function CategoryContributionPieE({
  data
}: {
  data: Array<{ name: string; value: number; pct: number }>;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const C3 = cssVar("--color-chart-3");
  const C4 = cssVar("--color-chart-4");

  const colors = [C1, C2, C3, C4];

  const option = {
    grid: { left: 24, right: 24, top: 24, bottom: 24 },
    tooltip: { 
      trigger: "item", 
      className: "echarts-tooltip",
      formatter: (params: { name: string; value: number; percent: number }) => 
        `${params.name}: ₦${(params.value / 1000000).toFixed(1)}M (${params.percent.toFixed(1)}%)`
    },
    legend: {
      orient: "vertical",
      right: 0,
      top: "center",
      icon: "roundRect",
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: cssVar("--muted-foreground"), fontSize: 12 },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name);
        return `${name} ${item?.pct.toFixed(1)}%`;
      }
    },
    series: [
      {
        name: "Category Contribution",
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
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  };

  return <EChart option={option} height={400} />;
}
