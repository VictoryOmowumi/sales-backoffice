import EChart from "./EChart";

export default function DirectBrandTreemapE({
  data,
 
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
    backgroundColor: 'transparent',
    tooltip: {
      trigger: "item",
      className: "echarts-tooltip",
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      },
      formatter: (params: { name: string; value: number }) => {
        const item = data.find(d => d.name === params.name);
        return `
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">
            ${params.name}
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 2px;">
            Contribution: ${params.value.toFixed(1)}%
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 2px;">
            CP: ₦${item?.cp.toFixed(1)}b | PP: ₦${item?.pp.toFixed(1)}b
          </div>
          <div style="font-size: 12px; color: ${(item?.growthPct ?? 0) >= 0 ? '#10b981' : '#ef4444'};">
            Growth: ${(item?.growthPct ?? 0).toFixed(1)}%
          </div>
        `;
      }
    },
    series: [
      {
        name: "Brand Contribution",
        type: "treemap",
        data: data.map((item, index) => ({
          name: item.name,
          value: item.contrPct,
          itemStyle: {
            color: colors[index % colors.length],
            borderRadius: 8,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
          }
        })),
        breadcrumb: { show: false },
        roam: false, // Disable zoom/pan to prevent size changes on scroll
        nodeClick: false, // Disable click to prevent unwanted interactions
        label: {
          show: true,
          formatter: (params: { name: string; value: number }) => {
            return [
              `{name|${params.name}}`,
              `{value|${params.value.toFixed(1)}%}`
            ].join('\n');
          },
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            },
            value: {
              fontSize: 12,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }
          }
        },
        itemStyle: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          gapWidth: 2
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 2
          },
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold'
          }
        }
      }
    ]
  };

  return <EChart option={option}  />;
}
