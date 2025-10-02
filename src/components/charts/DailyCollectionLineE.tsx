import EChart, { cssVar } from "./EChart";
import type { DailyCollection } from "@/domain/payments";

export default function DailyCollectionLineE({
  data
}: {
  data: DailyCollection[];
}) {
  // Debug: Log data to console
  console.log("DailyCollectionLineE data:", data);
  
  const option = {
    backgroundColor: "transparent",
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "10%",
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      className: "echarts-tooltip",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "transparent",
      textStyle: {
        color: "#fff"
      },
      formatter: (params: Array<{ axisValue: string; seriesName: string; value: number }>) => {
        const param = params[0];
        return `
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">
            ${param.axisValue}
          </div>
          <div style="font-size: 12px; color: #94a3b8;">
            ${param.seriesName}: ₦${(param.value / 1000000000).toFixed(2)}B
          </div>
        `;
      }
    },
    xAxis: {
      type: "category",
      data: data.map(d => d.text),
      axisLabel: {
        color: cssVar("--muted-foreground", "#6b7280"),
        fontSize: 12,
        rotate: 0,
        margin: 12
      },
      axisLine: {
        lineStyle: {
          color: cssVar("--border", "#e5e7eb")
        }
      }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: cssVar("--muted-foreground", "#6b7280"),
        fontSize: 12,
        formatter: (value: number) => `₦${(value / 1000000000).toFixed(1)}B`
      },
      axisLine: {
        lineStyle: {
          color: cssVar("--border", "#e5e7eb")
        }
      },
      splitLine: {
        lineStyle: {
          color: cssVar("--border", "#e5e7eb"),
          opacity: 0.3
        }
      }
    },
    series: [
      {
        name: "Daily Collection",
        type: "line",
        data: data.map(d => d.amount),
        smooth: true,
        lineStyle: {
          color: cssVar("--primary", "#3b82f6"),
          width: 3
        },
        itemStyle: {
          color: cssVar("--primary", "#3b82f6")
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: cssVar("--primary", "#3b82f6") + "4D"
              },
              {
                offset: 1,
                color: cssVar("--primary", "#3b82f6") + "0D"
              }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: cssVar("--primary", "#3b82f6"),
            borderColor: "#fff",
            borderWidth: 2
          }
        }
      }
    ]
  };

  return <EChart option={option} height={400} />;
}
