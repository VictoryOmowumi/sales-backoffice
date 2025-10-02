import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EChart, { cssVar, withAlpha } from "@/components/charts/EChart";
import KpiCard from "@/components/widgets/KpiCard";
import { 
  customerKPIs, 
  customerData, 
  customerGrowthData, 
  customerSegments,
  customerInsights
} from "@/data/customers.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { 
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  FileText,
  Search,
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

export default function Customers() {
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"region" | "channel" | "customerType" | "sizeTier">("region");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter data based on selections
  const filteredData = customerData.filter(item => {
    const segmentMatch = selectedSegment === "all" || item[selectedType] === selectedSegment;
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
    const searchMatch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return segmentMatch && statusMatch && searchMatch;
  });

  // Get unique segments for current type
  const segments = Array.from(new Set(customerData.map(item => item[selectedType])));
  const statuses = Array.from(new Set(customerData.map(item => item.status)));

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
          <h1 className="font-display text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive customer analytics, segmentation, and management dashboard
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={selectedType} onValueChange={(value: "region" | "channel" | "customerType" | "sizeTier") => setSelectedType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Analysis Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="region">By Region</SelectItem>
              <SelectItem value="channel">By Channel</SelectItem>
              <SelectItem value="customerType">By Customer Type</SelectItem>
              <SelectItem value="sizeTier">By Size Tier</SelectItem>
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

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Customer Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Customer Directory</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filteredData.length} Customers</Badge>
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
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Region</th>
                <th className="text-left p-2">Channel</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Tier</th>
                <th className="text-right p-2">Total Sales</th>
                <th className="text-right p-2">Orders</th>
                <th className="text-right p-2">AOV</th>
                <th className="text-left p-2">Last Order</th>
                <th className="text-center p-2">Status</th>
                <th className="text-center p-2">Categories</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((customer, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.id}</div>
                    </div>
                  </td>
                  <td className="p-2">{customer.region}</td>
                  <td className="p-2">{customer.channel}</td>
                  <td className="p-2">{customer.customerType}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={`text-xs ${
                      customer.sizeTier === 'gold' ? 'border-yellow-500 text-yellow-600' :
                      customer.sizeTier === 'silver' ? 'border-gray-500 text-gray-600' :
                      'border-orange-500 text-orange-600'
                    }`}>
                      {customer.sizeTier.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-2 text-right">{fmtMoney(customer.totalSales)}</td>
                  <td className="p-2 text-right">{customer.orderCount}</td>
                  <td className="p-2 text-right">{fmtMoney(customer.avgOrderValue)}</td>
                  <td className="p-2">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                  <td className="p-2 text-center">
                    <Badge variant="outline" className={`text-xs ${
                      customer.status === 'active' ? 'border-green-500 text-green-600' :
                      customer.status === 'new' ? 'border-blue-500 text-blue-600' :
                      customer.status === 'churn-risk' ? 'border-orange-500 text-orange-600' :
                      'border-red-500 text-red-600'
                    }`}>
                      {customer.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {customer.categories.map((category, idx) => (
                        <div key={idx} className="w-2 h-2 rounded-full bg-blue-500" title={category}></div>
                      ))}
                    </div>
                  </td>
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
