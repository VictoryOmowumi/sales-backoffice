import EChart, { cssVar, withAlpha } from "./EChart";

export default function PackMixDoughnutE({
  mix, priceCompliancePct
}: {
  mix: { name: string; value: number }[];
  priceCompliancePct: number;
}) {
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const C3 = cssVar("--color-chart-3");
  const C4 = "oklch(0.52 0.14 280)";

  const option = {
    grid: { left: 24, right: 24, top: 24, bottom: 24 },
    tooltip: { 
      trigger: "item", 
      className: "echarts-tooltip",
      formatter: (params: { name: string; value: number }) => `${params.name}: ${params.value}%`
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
        const item = mix.find(m => m.name === name);
        return `${name} ${item?.value}%`;
      }
    },
    series: [
      {
        name: "Pack Mix",
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
        data: mix.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: [C1, C2, C3, C4][index % 4]
          }
        }))
      }
    ]
  };

  const pct = Math.max(0, Math.min(100, priceCompliancePct));
  const complianceColor = pct >= 97 ? "#10b981" : pct >= 92 ? "#f59e0b" : "#ef4444";

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
                 <EChart option={option} height={320} />
      </div>
      
      {/* Price Compliance Section */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Price Compliance</span>
          <span className="text-sm font-bold" style={{ color: complianceColor }}>
            {pct.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative mb-2">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ 
                width: `${pct}%`, 
                background: `linear-gradient(90deg, ${complianceColor}, ${withAlpha(complianceColor, 0.7)})`
              }} 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Target: ≥97%</span>
          <span className={`font-medium ${pct >= 97 ? 'text-emerald-600' : pct >= 92 ? 'text-orange-600' : 'text-red-600'}`}>
            {pct >= 97 ? 'Excellent' : pct >= 92 ? 'Good' : 'Needs Attention'}
          </span>
        </div>
      </div>
    </div>
  );
}
