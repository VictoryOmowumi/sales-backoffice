import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Package
} from "lucide-react";
import { 
  ordersWithDetails, 
  topCustomersByValue, 
  categoryContribution, 
  ordersTrend,
  regions,
  channels
} from "@/data/orders.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import OrdersTrendLineE from "@/components/charts/OrdersTrendLineE";
import TopCustomersBarE from "@/components/charts/TopCustomersBarE";
import CategoryContributionPieE from "@/components/charts/CategoryContributionPieE";
import OrderStatusBarE from "@/components/charts/OrderStatusBarE";


export default function OrdersAnalytics() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = ordersWithDetails;

    if (selectedRegion !== "all") {
      filtered = filtered.filter(order => order.customer.region === selectedRegion);
    }

    if (selectedChannel !== "all") {
      filtered = filtered.filter(order => order.customer.channel === selectedChannel);
    }

    if (selectedPeriod !== "all") {
      const days = parseInt(selectedPeriod);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(order => 
        new Date(order.ordered_at) >= cutoffDate
      );
    }

    return filtered;
  }, [selectedRegion, selectedChannel, selectedPeriod]);

  // Calculate filtered KPIs
  const filteredKPIs = useMemo(() => {
    const totalOrders = filteredData.length;
    const orderValue = filteredData.reduce((s, o) => s + o.total_ngn, 0);
    const avgOrderValue = totalOrders ? Math.round(orderValue / totalOrders) : 0;
    const fulfilled = filteredData.filter(o => o.fulfillment_status === "delivered").length;
    const pending = filteredData.filter(o => ["unfulfilled","partially_fulfilled","shipped"].includes(o.fulfillment_status)).length;
    
    return {
      totalOrders,
      orderValue,
      avgOrderValue,
      fulfilled,
      pending,
      fulfillmentRate: totalOrders ? Math.round((fulfilled / totalOrders) * 100) : 0,
    };
  }, [filteredData]);

  // Calculate trend data
  const trendData = useMemo(() => {
    return ordersTrend(filteredData, parseInt(selectedPeriod));
  }, [filteredData, selectedPeriod]);

  // Calculate top customers
  const topCustomers = useMemo(() => {
    return topCustomersByValue(filteredData);
  }, [filteredData]);

  // Calculate category contribution
  const categoryData = useMemo(() => {
    const allLines = filteredData.flatMap(order => order.lines);
    return categoryContribution(allLines);
  }, [filteredData]);

  // Calculate status breakdown
  const statusData = useMemo(() => {
    const statusCounts = filteredData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.replace('_', ' '),
      count,
      percentage: Math.round((count / filteredData.length) * 100)
    }));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into order patterns, performance, and trends
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channels.map(channel => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{fmtNum(filteredKPIs.totalOrders)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Value</p>
                <p className="text-2xl font-bold">{fmtMoney(filteredKPIs.orderValue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{fmtMoney(filteredKPIs.avgOrderValue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">-3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fulfillment Rate</p>
                <p className="text-2xl font-bold">{filteredKPIs.fulfillmentRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <OrdersTrendLineE data={trendData} />
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Customers by Value
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <TopCustomersBarE data={topCustomers} />
            </div>
          </CardContent>
        </Card>

        {/* Category Contribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Category Contribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <CategoryContributionPieE data={categoryData} />
            </div>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Order Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <OrderStatusBarE data={statusData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Executive Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Top Performance</h4>
              <p className="text-sm text-blue-700">
                Top 10 customers contributed {Math.round((topCustomers.slice(0, 10).reduce((sum, [, value]) => sum + value, 0) / filteredKPIs.orderValue) * 100)}% of total orders this period.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Category Trends</h4>
              <p className="text-sm text-green-700">
                {categoryData[0]?.name} leads with {categoryData[0]?.pct.toFixed(1)}% of order value, showing strong market demand.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Regional Insights</h4>
              <p className="text-sm text-orange-700">
                {selectedRegion === "all" ? "National" : selectedRegion} shows {filteredKPIs.fulfillmentRate}% fulfillment rate, 
                {filteredKPIs.fulfillmentRate > 90 ? " exceeding" : " below"} target performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}