import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EChart, { cssVar, withAlpha } from "@/components/charts/EChart";
import KpiCard from "@/components/widgets/KpiCard";
import { 
  retentionKPIs, 
  retentionData, 
  retentionCurveData, 
  executiveInsights,
  rollingRetentionData,
  retentionDrivers,
  earlyWarningSignals,
  topChurnedGroups,
  cohortData
} from "@/data/retention.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { 
  TrendingUp, 
  TrendingDown, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  FileText,
  Clock
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

export default function DirectSalesRetention() {
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"region" | "channel" | "category" | "brand">("region");
  const [viewMode, setViewMode] = useState<"retention" | "churn" | "revenue">("retention");

  // Filter data based on selections
  const filteredData = retentionData.filter(item => {
    const segmentMatch = selectedSegment === "all" || item.segment === selectedSegment;
    const typeMatch = item.type === selectedType;
    return segmentMatch && typeMatch;
  });

  // Get unique segments for current type
  const segments = Array.from(new Set(retentionData.filter(item => item.type === selectedType).map(item => item.segment)));

  // Prepare chart data
  const C1 = cssVar("--color-chart-1");
  const GRID = cssVar("--border");

  const chartData = {
    retentionCurve: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        formatter: (params: { name: string; value: number }[]) => {
          const month = params[0]?.name;
          const rate = params[0]?.value;
          return `
            <div class="text-xs text-muted-foreground">Month ${month}</div>
            <div class="text-sm">${rate.toFixed(1)}% Retention</div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: retentionCurveData.map(d => d.month),
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
          formatter: (value: number) => `${value}%`
        }
      },
      series: [
        {
          type: 'line',
          data: retentionCurveData.map(d => d.retentionRate),
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
        }
      ]
    },
    churnDistribution: {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: filteredData.map(item => ({
            value: item.churnedCustomers,
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
    retentionComparison: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        axisPointer: { type: "shadow" }
      },
      xAxis: {
        type: 'category',
        data: filteredData.map(item => item.segment),
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
          formatter: (value: number) => `${value}%`
        }
      },
      series: [
        {
          name: 'Retention Rate',
          type: 'bar',
          data: filteredData.map(item => ({
            value: item.retentionRate,
            itemStyle: {
              color: item.retentionRate >= 70 ? cssVar("--color-chart-1") : item.retentionRate >= 60 ? cssVar("--color-chart-3") : cssVar("--color-chart-4"),
              borderRadius: [8, 8, 0, 0]
            }
          })),
          barWidth: "60%",
          label: {
            show: true,
            position: "top",
            color: cssVar("--muted-foreground"),
            fontSize: 11,
            formatter: (params: { value: number }) => `${params.value.toFixed(1)}%`
          }
        }
      ]
    },
    rollingRetention: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        axisPointer: { type: "shadow" }
      },
      legend: {
        data: ['1 Month', '3 Months', '6 Months', '12 Months'],
        top: 10,
        textStyle: {
          color: cssVar("--foreground"),
          fontSize: 11
        }
      },
      xAxis: {
        type: 'category',
        data: rollingRetentionData.map(d => d.period),
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
          formatter: (value: number) => `${value}%`
        }
      },
      series: [
        {
          name: '1 Month',
          type: 'bar',
          data: rollingRetentionData.map(d => d.retention1m),
          itemStyle: { color: C1, borderRadius: [4, 4, 0, 0] }
        },
        {
          name: '3 Months',
          type: 'bar',
          data: rollingRetentionData.map(d => d.retention3m),
          itemStyle: { color: cssVar("--color-chart-2"), borderRadius: [4, 4, 0, 0] }
        },
        {
          name: '6 Months',
          type: 'bar',
          data: rollingRetentionData.map(d => d.retention6m),
          itemStyle: { color: cssVar("--color-chart-3"), borderRadius: [4, 4, 0, 0] }
        },
        {
          name: '12 Months',
          type: 'bar',
          data: rollingRetentionData.map(d => d.retention12m),
          itemStyle: { color: cssVar("--color-chart-4"), borderRadius: [4, 4, 0, 0] }
        }
      ]
    },
    retentionDrivers: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        axisPointer: { type: "shadow" }
      },
      xAxis: {
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
          formatter: (value: number) => `${value}%`
        }
      },
      yAxis: {
        type: 'category',
        data: retentionDrivers.map(d => d.driver),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: cssVar("--muted-foreground"), fontSize: 11 }
      },
      series: [
        {
          type: 'bar',
          data: retentionDrivers.map(d => ({
            value: d.impact,
            itemStyle: {
              color: d.impact >= 10 ? '#10b981' : d.impact >= 5 ? '#f59e0b' : '#3b82f6',
              borderRadius: [0, 4, 4, 0]
            }
          })),
          barWidth: "60%",
          label: {
            show: true,
            position: "right",
            color: cssVar("--muted-foreground"),
            fontSize: 11,
            formatter: (params: { value: number }) => `${params.value.toFixed(1)}%`
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
          <h1 className="font-display text-3xl font-bold">Customer Retention Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Track customer loyalty, identify churn patterns, and measure retention performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "retention" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("retention")}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Retention
          </Button>
          <Button
            variant={viewMode === "churn" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("churn")}
          >
            <UserX className="w-4 h-4 mr-2" />
            Churn
          </Button>
          <Button
            variant={viewMode === "revenue" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("revenue")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Revenue Impact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedType} onValueChange={(value: "region" | "channel" | "category" | "brand") => setSelectedType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Analysis Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="region">By Region</SelectItem>
              <SelectItem value="channel">By Channel</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="brand">By Brand</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              {segments.map(segment => (
                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Customers"
          value={fmtNum(retentionKPIs.activeCustomers)}
          deltaPct={retentionKPIs.retainedCustomersPct}
          positive={retentionKPIs.retainedCustomersPct >= 0}
        />
        <KpiCard
          title="Retention Rate"
          value={`${retentionKPIs.retainedCustomersPct.toFixed(1)}%`}
          deltaPct={retentionKPIs.retainedCustomersPct}
          positive={retentionKPIs.retainedCustomersPct >= 0}
        />
        <KpiCard
          title="New Customers"
          value={fmtNum(retentionKPIs.newCustomersAdded)}
          deltaPct={retentionKPIs.winBackPct}
          positive={retentionKPIs.winBackPct >= 0}
        />
        <KpiCard
          title="Revenue at Risk"
          value={fmtMoney(retentionKPIs.revenueAtRisk)}
          deltaPct={-retentionKPIs.churnedCustomersPct}
          positive={retentionKPIs.churnedCustomersPct <= 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Curve */}
        <Card className="rounded-2xl p-6">
          <Header 
            title="Customer Retention Curve" 
            subtitle="Percentage of customers retained over time since first purchase" 
          />
          <div className="min-h-[400px]">
            <EChart option={chartData.retentionCurve} />
          </div>
        </Card>

        {/* Churn Distribution */}
        <Card className="rounded-2xl p-6">
          <Header 
            title="Churn Distribution" 
            subtitle="Breakdown of churned customers by segment" 
          />
          <div className="min-h-[400px]">
            <EChart option={chartData.churnDistribution} />
          </div>
        </Card>
      </div>

      {/* Retention Comparison */}
      <Card className="rounded-2xl p-6">
        <Header 
          title={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Retention Comparison`}
          subtitle={`Retention rates across different ${selectedType}s - Green: ≥70%, Orange: 60-69%, Red: <60%`}
        />
        <div className="min-h-[400px]">
          <EChart option={chartData.retentionComparison} />
        </div>
      </Card>

      {/* Rolling Retention Metrics */}
      <Card className="rounded-2xl p-6">
        <Header 
          title="Rolling Retention Metrics" 
          subtitle="Retention rates across different time periods - 1m, 3m, 6m, 12m" 
        />
        <div className="min-h-[400px]">
          <EChart option={chartData.rollingRetention} />
        </div>
      </Card>

      {/* Cohort Analysis */}
      <Card className="rounded-2xl p-6">
        <Header 
          title="Cohort Analysis" 
          subtitle="Customer retention by acquisition cohort - grouped by when customers first purchased" 
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Cohort</th>
                <th className="text-right p-2">Initial Customers</th>
                <th className="text-right p-2">Month 1</th>
                <th className="text-right p-2">Month 2</th>
                <th className="text-right p-2">Month 3</th>
                <th className="text-right p-2">Month 6</th>
                <th className="text-right p-2">Month 12</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{cohort.cohort}</td>
                  <td className="p-2 text-right">{fmtNum(cohort.initialCustomers)}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-green-600">{cohort.month1.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-blue-600">{cohort.month2.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-orange-600">{cohort.month3.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-yellow-600">{cohort.month6.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-red-600">{cohort.month12.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Retention Drivers */}
      <Card className="rounded-2xl p-6">
        <Header 
          title="Top Retention Drivers" 
          subtitle="Factors that help keep customers loyal - impact on retention percentage" 
        />
        <div className="min-h-[400px]">
          <EChart option={chartData.retentionDrivers} />
        </div>
      </Card>

      {/* Early Warning Signals */}
      <Card className="p-6">
        <Header title="Early Warning Signals" subtitle="Customer groups showing signs of potential churn" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earlyWarningSignals.map((signal, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  signal.riskLevel === 'high' ? 'bg-red-100 text-red-600' :
                  signal.riskLevel === 'medium' ? 'bg-orange-100 text-orange-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {signal.riskLevel === 'high' ? <AlertTriangle className="w-4 h-4" /> :
                   signal.riskLevel === 'medium' ? <Clock className="w-4 h-4" /> :
                   <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{signal.customerGroup}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{signal.signal}</p>
                  <div className="text-xs text-muted-foreground mb-2">
                    {fmtNum(signal.customers)} customers • {fmtMoney(signal.revenueAtRisk)} at risk
                  </div>
                  <div className="text-xs font-medium text-blue-600">
                    {signal.recommendation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top 5 Churned Groups */}
      <Card className="p-6">
        <Header title="Top 5 Churned Groups" subtitle="Customer segments with highest churn rates and revenue impact" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Customer Group</th>
                <th className="text-right p-2">Churn Rate</th>
                <th className="text-right p-2">Customers Lost</th>
                <th className="text-right p-2">Revenue Lost</th>
                <th className="text-left p-2">Primary Reason</th>
              </tr>
            </thead>
            <tbody>
              {topChurnedGroups.map((group, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{group.group}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-red-600 font-medium">{group.churnRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">{fmtNum(group.customersLost)}</td>
                  <td className="p-2 text-right">{fmtMoney(group.revenueLost)}</td>
                  <td className="p-2 text-muted-foreground">{group.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Retention Performance Details</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filteredData.length} Segments</Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Segment</th>
                <th className="text-right p-2">Current Buyers</th>
                <th className="text-right p-2">Previous Buyers</th>
                <th className="text-right p-2">Retained</th>
                <th className="text-right p-2">New</th>
                <th className="text-right p-2">Churned</th>
                <th className="text-right p-2">Retention %</th>
                <th className="text-right p-2">Churn %</th>
                <th className="text-right p-2">Revenue at Risk</th>
                <th className="text-right p-2">Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{item.segment}</td>
                  <td className="p-2 text-right">{fmtNum(item.currentPeriodBuyers)}</td>
                  <td className="p-2 text-right">{fmtNum(item.previousPeriodBuyers)}</td>
                  <td className="p-2 text-right">{fmtNum(item.retainedBuyers)}</td>
                  <td className="p-2 text-right">{fmtNum(item.newCustomers)}</td>
                  <td className="p-2 text-right">{fmtNum(item.churnedCustomers)}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.retentionRate >= 70 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : item.retentionRate >= 60 ? (
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={item.retentionRate >= 70 ? "text-green-600" : item.retentionRate >= 60 ? "text-orange-600" : "text-red-600"}>
                        {item.retentionRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.churnRate <= 20 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : item.churnRate <= 30 ? (
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={item.churnRate <= 20 ? "text-green-600" : item.churnRate <= 30 ? "text-orange-600" : "text-red-600"}>
                        {item.churnRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-right">{fmtMoney(item.revenueAtRisk)}</td>
                  <td className="p-2 text-right">{fmtMoney(item.avgOrderValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Executive Insights */}
      <Card className="p-6">
        <Header title="Executive Insights" subtitle="Key findings and strategic recommendations" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {executiveInsights.map((insight, index) => (
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
