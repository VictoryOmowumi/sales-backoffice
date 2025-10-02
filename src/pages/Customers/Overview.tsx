import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import EChart, { cssVar, withAlpha } from "@/components/charts/EChart";
import KpiCard from "@/components/widgets/KpiCard";
import { 
  customerKPIs, 
  customerGrowthData, 
  customerSegments,
  customerInsights
} from "@/data/customers.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { 
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      <Separator className="mt-3" />
    </div>
  );
}

export default function CustomersOverview() {
  const [selectedType, setSelectedType] = useState<"region" | "channel" | "customerType" | "sizeTier">("region");

  // Prepare chart data
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const C3 = cssVar("--color-chart-3");
  const GRID = cssVar("--border");

  const chartData = {
    customerGrowth: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        axisPointer: { type: "cross" }
      },
      legend: {
        data: ['Active Customers', 'New Customers', 'Churned Customers'],
        top: 10,
        textStyle: {
          color: cssVar("--foreground"),
          fontSize: 11
        }
      },
      xAxis: {
        type: 'category',
        data: customerGrowthData.map(d => d.period),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { 
          color: cssVar("--muted-foreground"), 
          fontSize: 11,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
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
          formatter: (value: number) => fmtNum(value)
        }
      },
      series: [
        {
          name: 'Active Customers',
          type: 'line',
          data: customerGrowthData.map(d => d.activeCustomers),
          smooth: true,
          lineStyle: { color: C1, width: 3 },
          itemStyle: { color: C1 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: withAlpha(C1, 0.3) },
                { offset: 1, color: withAlpha(C1, 0.05) }
              ]
            }
          }
        },
        {
          name: 'New Customers',
          type: 'bar',
          data: customerGrowthData.map(d => d.newCustomers),
          itemStyle: { color: C2, borderRadius: [4, 4, 0, 0] }
        },
        {
          name: 'Churned Customers',
          type: 'bar',
          data: customerGrowthData.map(d => d.churnedCustomers),
          itemStyle: { color: C3, borderRadius: [4, 4, 0, 0] }
        }
      ]
    },
    customerMix: {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: customerSegments.filter(s => s.type === selectedType).map(item => ({
            value: item.count,
            name: item.segment
          })),
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ]
    },
    customerValueBands: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        axisPointer: { type: "shadow" }
      },
      xAxis: {
        type: 'category',
        data: ['High Value', 'Mid Value', 'Low Value'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: cssVar("--muted-foreground"), fontSize: 11 }
      },
      yAxis: {
        type: 'value',
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
          formatter: (value: number) => fmtNum(value)
        }
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: 450, itemStyle: { color: C1, borderRadius: [8, 8, 0, 0] } },
            { value: 1200, itemStyle: { color: C2, borderRadius: [8, 8, 0, 0] } },
            { value: 1598, itemStyle: { color: C3, borderRadius: [8, 8, 0, 0] } }
          ],
          barWidth: "60%",
          label: {
            show: true,
            position: "top",
            color: cssVar("--muted-foreground"),
            fontSize: 11,
            formatter: (params: { value: number }) => fmtNum(params.value)
          }
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Customer Overview</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive customer analytics and segmentation insights
          </p>
        </div>
      </div>

      {/* Analysis Type Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Analysis Type:</span>
          <Select value={selectedType} onValueChange={(value: "region" | "channel" | "customerType" | "sizeTier") => setSelectedType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Analysis Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="region">By Region</SelectItem>
              <SelectItem value="channel">By Channel</SelectItem>
              <SelectItem value="customerType">By Customer Type</SelectItem>
              <SelectItem value="sizeTier">By Size Tier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Customers"
          value={fmtNum(customerKPIs.totalCustomers)}
          deltaPct={customerKPIs.newCustomers}
          positive={customerKPIs.newCustomers >= 0}
        />
        <KpiCard
          title="Active (1M)"
          value={fmtNum(customerKPIs.activeCustomers1m)}
          deltaPct={customerKPIs.activeCustomers1m / customerKPIs.totalCustomers * 100}
          positive={true}
        />
        <KpiCard
          title="New Customers"
          value={fmtNum(customerKPIs.newCustomers)}
          deltaPct={customerKPIs.newCustomers}
          positive={customerKPIs.newCustomers >= 0}
        />
        <KpiCard
          title="Avg Order Value"
          value={fmtMoney(customerKPIs.avgOrderValue)}
          deltaPct={customerKPIs.avgPurchaseFrequency}
          positive={customerKPIs.avgPurchaseFrequency >= 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Trend */}
        <Card className="rounded-2xl p-6">
          <Header 
            title="Customer Growth Trend" 
            subtitle="Active customers, new acquisitions, and churn over time" 
          />
          <div className="min-h-[400px]">
            <EChart option={chartData.customerGrowth} />
          </div>
        </Card>

        {/* Customer Mix */}
        <Card className="rounded-2xl p-6">
          <Header 
            title="Customer Mix" 
            subtitle={`Distribution of customers by ${selectedType}`} 
          />
          <div className="min-h-[400px]">
            <EChart option={chartData.customerMix} />
          </div>
        </Card>
      </div>

      {/* Customer Value Bands */}
      <Card className="rounded-2xl p-6">
        <Header 
          title="Customer Value Bands" 
          subtitle="Distribution of customers by value tier (Gold, Silver, Bronze)" 
        />
        <div className="min-h-[400px]">
          <EChart option={chartData.customerValueBands} />
        </div>
      </Card>

      {/* Executive Insights */}
      <Card className="p-6">
        <Header title="Executive Insights" subtitle="Key findings and strategic recommendations" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerInsights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  insight.type === 'positive' ? 'bg-green-100 text-green-600' :
                  insight.type === 'negative' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {insight.type === 'positive' ? <CheckCircle className="w-4 h-4" /> :
                   insight.type === 'negative' ? <AlertTriangle className="w-4 h-4" /> :
                   <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <div className="text-xs font-medium text-muted-foreground">
                    Impact: {insight.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
