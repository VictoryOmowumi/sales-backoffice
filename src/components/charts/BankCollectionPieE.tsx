import EChart, { cssVar } from "./EChart";
import type { CollectionByBank } from "@/domain/payments";

// Using OKLCH colors for better color harmony like other charts
const C1 = "oklch(0.72 0.2 250)";
const C2 = "oklch(0.8 0.19 150)";
const C3 = "oklch(0.65 0.18 280)";
const C4 = "oklch(0.75 0.16 200)";
const C5 = "oklch(0.68 0.22 320)";
const C6 = "oklch(0.82 0.17 180)";

const colors = [C1, C2, C3, C4, C5, C6];

export default function BankCollectionPieE({
  data
}: {
  data: CollectionByBank[];
}) {
  const option = {
    backgroundColor: "transparent",
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "3%",
      containLabel: true
    },
    tooltip: {
      trigger: "item",
      className: "echarts-tooltip",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "transparent",
      textStyle: {
        color: "#fff"
      },
      formatter: (params: { name: string; value: number; percent: number }) => {
        return `
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">
            ${params.name}
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 2px;">
            Amount: ₦${(params.value / 1000000000).toFixed(2)}B
          </div>
          <div style="font-size: 12px; color: #94a3b8;">
            Share: ${params.percent}%
          </div>
        `;
      }
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: {
        color: cssVar("--muted-foreground", "#6b7280"),
        fontSize: 12
      },
      itemGap: 8
    },
    series: [
      {
        name: "Bank Collection",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["60%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: cssVar("--background", "#ffffff"),
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
            color: cssVar("--foreground", "#000000")
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          value: item.amount,
          name: item.text,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  };

  return <EChart option={option} height={400} />;
}
