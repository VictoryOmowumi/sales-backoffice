import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Download, 
  Eye, 
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  MapPin,
  User,
} from "lucide-react";
import { 
  ordersWithDetails, 
  orderKPIs, 
  regions,
  channels
} from "@/data/orders.mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { fmtMoney, fmtNum } from "@/lib/format";
import type { OrderWithDetails } from "@/domain/orders";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-red-100 text-red-800",
};

const fulfillmentColors = {
  unfulfilled: "bg-gray-100 text-gray-800",
  partially_fulfilled: "bg-orange-100 text-orange-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  returned: "bg-red-100 text-red-800",
};

const paymentColors = {
  unpaid: "bg-red-100 text-red-800",
  partially_paid: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedFulfillmentStatus, setSelectedFulfillmentStatus] = useState<string>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let results = ordersWithDetails;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(order => 
        order.order_no.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.code.toLowerCase().includes(query) ||
        order.salesRep.name.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (selectedRegion !== "all") {
      results = results.filter(order => order.customer.region === selectedRegion);
    }

    if (selectedChannel !== "all") {
      results = results.filter(order => order.customer.channel === selectedChannel);
    }

    if (selectedStatus !== "all") {
      results = results.filter(order => order.status === selectedStatus);
    }

    if (selectedFulfillmentStatus !== "all") {
      results = results.filter(order => order.fulfillment_status === selectedFulfillmentStatus);
    }

    if (selectedPaymentStatus !== "all") {
      results = results.filter(order => order.payment_status === selectedPaymentStatus);
    }

    // Apply date range
    if (dateRange !== "all") {
      const days = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      results = results.filter(order => 
        new Date(order.ordered_at) >= cutoffDate
      );
    }

    return results;
  }, [searchQuery, selectedRegion, selectedChannel, selectedStatus, selectedFulfillmentStatus, selectedPaymentStatus, dateRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [searchQuery, selectedRegion, selectedChannel, selectedStatus, selectedFulfillmentStatus, selectedPaymentStatus, dateRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedChannel("all");
    setSelectedStatus("all");
    setSelectedFulfillmentStatus("all");
    setSelectedPaymentStatus("all");
    setDateRange("30");
    resetPagination();
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${filteredOrders.length} orders to Excel...`,
      variant: "default",
    });
  };

  const handleOrderAction = (orderId: string, action: string) => {
    if (action === "View") {
      navigate(`/orders/${orderId}`);
      return;
    }
    
    toast({
      title: "Action Performed",
      description: `${action} action completed for order ${orderId}`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all customer orders across regions and channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{fmtNum(orderKPIs.totalOrders)}</p>
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
                <p className="text-2xl font-bold">{fmtMoney(orderKPIs.orderValue)}</p>
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
                <p className="text-2xl font-bold">{fmtMoney(orderKPIs.avgOrderValue)}</p>
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
                <p className="text-2xl font-bold">{Math.round((orderKPIs.fulfilled / orderKPIs.totalOrders) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search and Main Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, or sales reps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Date Range" />
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

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedFulfillmentStatus} onValueChange={setSelectedFulfillmentStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Fulfillment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fulfillment</SelectItem>
                  <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                  <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || selectedRegion !== "all" || selectedChannel !== "all" || selectedStatus !== "all" || selectedFulfillmentStatus !== "all" || selectedPaymentStatus !== "all" || dateRange !== "30") && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Orders ({filteredOrders.length})
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => {
                setPageSize(parseInt(value));
                resetPagination();
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Order #</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Channel</th>
                  <th className="text-left p-3 font-medium">Sales Rep</th>
                  <th className="text-left p-3 font-medium">Order Date</th>
                  <th className="text-left p-3 font-medium">Value</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Fulfillment</th>
                  <th className="text-left p-3 font-medium">Payment</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <OrderRow 
                    key={order.id} 
                    order={order} 
                    onAction={handleOrderAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderRow({ order, onAction }: { order: OrderWithDetails; onAction: (orderId: string, action: string) => void }) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3">
        <div className="font-medium">{order.order_no}</div>
        <div className="text-xs text-muted-foreground">{order.customer.code}</div>
      </td>
      <td className="p-3">
        <div className="font-medium">{order.customer.name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {order.customer.region}
        </div>
      </td>
      <td className="p-3">
        <Badge variant="outline" className="text-xs">{order.customer.channel}</Badge>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{order.salesRep.name}</span>
        </div>
      </td>
      <td className="p-3">
        <div className="text-xs">
          {new Date(order.ordered_at).toLocaleDateString()}
        </div>
        {order.required_at && (
          <div className="text-xs text-muted-foreground italic">
            Required: {new Date(order.required_at).toLocaleDateString()}
          </div>
        )}
      </td>
      <td className="p-3">
        <div className="font-medium text-sm">{fmtMoney(order.total_ngn)}</div>
        <div className="text-xs text-muted-foreground">
          {order.lines.length} items
        </div>
      </td>
      <td className="">
        <Badge className={cn("text-xs font-normal", statusColors[order.status])}>
          {order.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="">
        <Badge className={cn("text-xs font-normal", fulfillmentColors[order.fulfillment_status])}>
          {order.fulfillment_status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="p-3">
        <Badge className={cn("text-xs font-normal", paymentColors[order.payment_status])}>
          {order.payment_status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAction(order.id, "View")}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
        </div>
      </td>
    </tr>
  );
}