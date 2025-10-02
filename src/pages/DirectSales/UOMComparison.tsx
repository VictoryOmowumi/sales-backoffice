import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EChart, { cssVar, withAlpha } from "@/components/charts/EChart";
import KpiCard from "@/components/widgets/KpiCard";
import { uomData, uomSummary } from "@/data/uom.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { TrendingUp, TrendingDown, Package, DollarSign, } from "lucide-react";

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      <Separator className="mt-3" />
    </div>
  );
}

export default function DirectSalesUOMComparison() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedUOMSize, setSelectedUOMSize] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<"current" | "previous" | "lastYear">("current");
  const [viewMode, setViewMode] = useState<"volume" | "value" | "growth">("volume");

  // Filter data based on selections
  const filteredData = uomData.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const brandMatch = selectedBrand === "all" || item.brand === selectedBrand;
    const regionMatch = selectedRegion === "all" || item.region === selectedRegion;
    const uomSizeMatch = selectedUOMSize === "all" || item.uomSize === selectedUOMSize;
    
    // Channel filter - check if the selected channel has significant share (>20%)
    const channelMatch = selectedChannel === "all" || 
      (selectedChannel === "modernTrade" && item.channelMix.modernTrade > 20) ||
      (selectedChannel === "traditional" && item.channelMix.traditional > 20) ||
      (selectedChannel === "horca" && item.channelMix.horca > 20) ||
      (selectedChannel === "ecommerce" && item.channelMix.ecommerce > 20);
    
    return categoryMatch && brandMatch && regionMatch && uomSizeMatch && channelMatch;
  });

  // Get unique values for filters
  const categories = Array.from(new Set(uomData.map(item => item.category)));
  const brands = Array.from(new Set(uomData.map(item => item.brand)));
  const regions = Array.from(new Set(uomData.map(item => item.region)));
  // const uomSizes = Array.from(new Set(uomData.map(item => item.uomSize)));
  const channels = [
    { value: "modernTrade", label: "Modern Trade" },
    { value: "traditional", label: "Traditional" },
    { value: "horca", label: "HORECA" },
    { value: "ecommerce", label: "E-commerce" }
  ];

  // Prepare chart data
  const C1 = cssVar("--color-chart-1");
  const C2 = cssVar("--color-chart-2");
  const GRID = cssVar("--border");

  const chartData = {
    uomComparison: {
      grid: { left: 24, right: 24, top: 24, bottom: 24 },
      tooltip: {
        trigger: "axis",
        className: "echarts-tooltip",
        axisPointer: { type: "shadow" },
        formatter: (params: { name: string; value: number }[]) => {
          const uom = params[0]?.name;
          const current = params[0]?.value;
          const previous = params[1]?.value;
          const unit = viewMode === "volume" ? "cases" : viewMode === "value" ? "₦" : "%";
          return `
            <div class="text-xs text-muted-foreground">${uom}</div>
            <div class="text-sm">Current: ${viewMode === "value" ? fmtMoney(current) : fmtNum(current)}${viewMode === "value" ? "" : unit}</div>
            <div class="text-sm">Previous: ${viewMode === "value" ? fmtMoney(previous) : fmtNum(previous)}${viewMode === "value" ? "" : unit}</div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: filteredData.map(item => item.uom),
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
          formatter: (value: number) => {
            if (viewMode === "value") return `₦${(value / 1000000).toFixed(0)}M`;
            if (viewMode === "volume") return `${(value / 1000).toFixed(0)}K`;
            return `${value}%`;
          }
        }
      },
      series: [
        {
          name: selectedTimePeriod === "current" ? 'Current Period' : 
                selectedTimePeriod === "previous" ? 'Previous Period' : 'Last Year',
          type: 'bar',
          data: filteredData.map(item => {
            const periodData = selectedTimePeriod === "current" ? item.currentPeriod :
                              selectedTimePeriod === "previous" ? item.previousPeriod :
                              item.lastYear;
            return {
              value: viewMode === "volume" ? periodData.volume :
                     viewMode === "value" ? periodData.value :
                     selectedTimePeriod === "current" ? item.growthVsPP : item.growthVsLY,
              itemStyle: {
                color: C1,
                borderRadius: [8, 8, 0, 0]
              }
            };
          }),
          barWidth: "60%",
          label: {
            show: true,
            position: "top",
            color: cssVar("--muted-foreground"),
            fontSize: 11,
            formatter: (params: { value: number }) => {
              if (viewMode === "value") return fmtMoney(params.value);
              if (viewMode === "volume") return fmtNum(params.value);
              return `${params.value.toFixed(1)}%`;
            }
          }
        },
        {
          name: selectedTimePeriod === "current" ? 'Previous Period' : 
                selectedTimePeriod === "previous" ? 'Current Period' : 'Previous Year',
          type: 'bar',
          data: filteredData.map(item => {
            const comparisonData = selectedTimePeriod === "current" ? item.previousPeriod :
                                  selectedTimePeriod === "previous" ? item.currentPeriod :
                                  item.previousPeriod;
            return {
              value: viewMode === "volume" ? comparisonData.volume :
                     viewMode === "value" ? comparisonData.value :
                     0,
              itemStyle: {
                color: C2,
                borderRadius: [8, 8, 0, 0]
              }
            };
          }),
          barWidth: "60%"
        }
      ]
    },
    shareOfMix: {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: filteredData.map(item => ({
            value: item.shareOfMix,
            name: `${item.uom} (${item.brand})`
          }))
        }
      ]
    },
    growthBubble: {
      xAxis: {
        type: 'value',
        name: 'Growth vs PP (%)'
      },
      yAxis: {
        type: 'value',
        name: 'Volume (Cases)'
      },
      series: [
        {
          type: 'scatter',
          symbolSize: function (data: number[]) {
            return Math.sqrt(data[2]) * 2;
          },
          data: filteredData.map(item => [
            item.growthVsPP,
            item.currentPeriod.volume,
            item.currentPeriod.value / 1000000 // Value in millions for bubble size
          ]),
          itemStyle: {
            color: function(params: { data: number[] }): string {
              return params.data[0] >= 0 ? '#10b981' : '#ef4444';
            }
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
          <h1 className="font-display text-3xl font-bold">UOM vs UOM Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Compare performance across different packaging sizes and selling units
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "volume" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("volume")}
          >
            <Package className="w-4 h-4 mr-2" />
            Volume
          </Button>
          <Button
            variant={viewMode === "value" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("value")}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Value
          </Button>
          <Button
            variant={viewMode === "growth" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("growth")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Growth
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Select value={selectedTimePeriod} onValueChange={(value: "current" | "previous" | "lastYear") => setSelectedTimePeriod(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="previous">Previous Period</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {channels.map(channel => (
                <SelectItem key={channel.value} value={channel.value}>{channel.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedUOMSize} onValueChange={setSelectedUOMSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="UOM Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (25cl-35cl)</SelectItem>
              <SelectItem value="medium">Medium (50cl)</SelectItem>
              <SelectItem value="large">Large (1L+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Volume"
          value={fmtNum(uomSummary.totalVolume)}
          deltaPct={uomSummary.avgGrowthVsPP}
          positive={uomSummary.avgGrowthVsPP >= 0}
        />
        <KpiCard
          title="Total Value"
          value={fmtMoney(uomSummary.totalValue)}
          deltaPct={uomSummary.avgGrowthVsPP}
          positive={uomSummary.avgGrowthVsPP >= 0}
        />
        <KpiCard
          title="Total Units"
          value={fmtNum(uomSummary.totalUnits)}
          deltaPct={uomSummary.avgGrowthVsPP}
          positive={uomSummary.avgGrowthVsPP >= 0}
        />
        <KpiCard
          title="Avg Growth"
          value={`${uomSummary.avgGrowthVsPP.toFixed(1)}%`}
          deltaPct={uomSummary.avgGrowthVsPP}
          positive={uomSummary.avgGrowthVsPP >= 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UOM Comparison Chart */}
        <Card className="rounded-2xl p-6">
          <Header 
            title="UOM Performance Comparison" 
            subtitle={`${viewMode === "volume" ? "Volume (Cases)" : 
                      viewMode === "value" ? "Value (₦)" : "Growth (%)"} comparison across pack sizes - ${selectedTimePeriod === "current" ? "Current vs Previous Period" : selectedTimePeriod === "previous" ? "Previous vs Current Period" : "Last Year vs Previous Year"}`} 
          />
          <div className="min-h-[400px]">
            <EChart option={chartData.uomComparison} />
          </div>
        </Card>

        {/* Share of Mix */}
        <Card className="rounded-2xl p-6">
          <Header 
            title="Share of Mix" 
            subtitle="Percentage contribution of each UOM to total category sales" 
          />
          <div className="min-h-[400px]">
            <EChart option={chartData.shareOfMix} />
          </div>
        </Card>
      </div>

      {/* Growth vs Volume Bubble Chart */}
      <Card className="rounded-2xl p-6">
        <Header 
          title="Growth vs Volume Analysis" 
          subtitle="Bubble size represents value (₦), position shows growth vs volume relationship" 
        />
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Positive Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Negative Growth</span>
          </div>
        </div>
        <div className="min-h-[400px]">
          <EChart option={chartData.growthBubble} />
        </div>
      </Card>

      {/* Detailed Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">UOM Performance Details</h3>
          <Badge variant="outline">{filteredData.length} UOMs</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">UOM</th>
                <th className="text-left p-2">Brand</th>
                <th className="text-left p-2">Region</th>
                <th className="text-left p-2">Size</th>
                <th className="text-right p-2">Current Volume</th>
                <th className="text-right p-2">Current Value</th>
                <th className="text-right p-2">Growth vs PP</th>
                <th className="text-right p-2">Growth vs LY</th>
                <th className="text-right p-2">Share of Mix</th>
                <th className="text-right p-2">Avg Price/Case</th>
                <th className="text-center p-2">Channel Mix</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{item.uom}</td>
                  <td className="p-2">{item.brand}</td>
                  <td className="p-2">{item.region}</td>
                  <td className="p-2">
                    <Badge variant="outline" className="text-xs">
                      {item.uomSize === 'small' ? 'Small' : item.uomSize === 'medium' ? 'Medium' : 'Large'}
                    </Badge>
                  </td>
                  <td className="p-2 text-right">{fmtNum(item.currentPeriod.volume)}</td>
                  <td className="p-2 text-right">{fmtMoney(item.currentPeriod.value)}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.growthVsPP >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={item.growthVsPP >= 0 ? "text-green-600" : "text-red-600"}>
                        {item.growthVsPP.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.growthVsLY >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={item.growthVsLY >= 0 ? "text-green-600" : "text-red-600"}>
                        {item.growthVsLY.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-right">{item.shareOfMix.toFixed(1)}%</td>
                  <td className="p-2 text-right">{fmtMoney(item.avgPricePerCase)}</td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" title={`Modern Trade: ${item.channelMix.modernTrade}%`}></div>
                      <div className="w-2 h-2 rounded-full bg-green-500" title={`Traditional: ${item.channelMix.traditional}%`}></div>
                      <div className="w-2 h-2 rounded-full bg-orange-500" title={`HORECA: ${item.channelMix.horca}%`}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500" title={`E-commerce: ${item.channelMix.ecommerce}%`}></div>
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
        <h3 className="text-lg font-semibold mb-4">Executive Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-600 mb-2">Top Performing UOM</h4>
            <p className="text-sm text-muted-foreground">
              <strong>{uomSummary.topPerformingUOM}</strong> is driving the strongest growth with 
              {filteredData.find(item => `${item.uom} (${item.brand})` === uomSummary.topPerformingUOM)?.growthVsPP.toFixed(1)}% 
              growth vs previous period. This pack size is gaining market share and should be prioritized for expansion.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-red-600 mb-2">Declining UOM</h4>
            <p className="text-sm text-muted-foreground">
              <strong>{uomSummary.topDecliningUOM}</strong> is showing decline with 
              {filteredData.find(item => `${item.uom} (${item.brand})` === uomSummary.topDecliningUOM)?.growthVsPP.toFixed(1)}% 
              growth vs previous period. Review pricing strategy and promotional activities for this pack size.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <h4 className="font-medium mb-2">Channel Insights</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Modern Trade</div>
              <div className="text-muted-foreground">{uomSummary.channelInsights.modernTrade.share}% share</div>
            </div>
            <div>
              <div className="font-medium">Traditional</div>
              <div className="text-muted-foreground">{uomSummary.channelInsights.traditional.share}% share</div>
            </div>
            <div>
              <div className="font-medium">HORECA</div>
              <div className="text-muted-foreground">{uomSummary.channelInsights.horca.share}% share</div>
            </div>
            <div>
              <div className="font-medium">E-commerce</div>
              <div className="text-muted-foreground">{uomSummary.channelInsights.ecommerce.share}% share</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
