import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import KpiCard from "@/components/widgets/KpiCard";
import { 
  customerData
} from "@/data/customers.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { 
  Download,
  FileText,
  Search,
  Eye,
  MoreHorizontal,

} from "lucide-react";


export default function CustomerDirectory() {
  const navigate = useNavigate();
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"region" | "channel" | "customerType" | "sizeTier">("region");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return customerData.filter(item => {
      const segmentMatch = selectedSegment === "all" || item[selectedType] === selectedSegment;
      const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
      const searchMatch = searchTerm === "" || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return segmentMatch && statusMatch && searchMatch;
    });
  }, [selectedSegment, selectedType, selectedStatus, searchTerm]);

  // Get unique segments for current type
  const segments = Array.from(new Set(customerData.map(item => item[selectedType])));
  const statuses = Array.from(new Set(customerData.map(item => item.status)));

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset pagination when filters change
  const resetPagination = () => setCurrentPage(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  const handleSegmentChange = (value: string) => {
    setSelectedSegment(value);
    resetPagination();
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    resetPagination();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSegment("all");
    setSelectedStatus("all");
    resetPagination();
  };

  // Calculate summary KPIs for filtered data
  const summaryKPIs = useMemo(() => {
    const totalSales = filteredData.reduce((sum, item) => sum + item.totalSales, 0);
    const totalOrders = filteredData.reduce((sum, item) => sum + item.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const activeCustomers = filteredData.filter(item => item.status === 'active').length;

    return {
      totalCustomers: filteredData.length,
      activeCustomers,
      totalSales,
      totalOrders,
      avgOrderValue
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Customer Directory</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive customer database with advanced filtering and search capabilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Customers"
          value={fmtNum(summaryKPIs.totalCustomers)}
        />
        <KpiCard
          title="Active Customers"
          value={fmtNum(summaryKPIs.activeCustomers)}
          deltaPct={(summaryKPIs.activeCustomers / summaryKPIs.totalCustomers * 100)}
          positive={true}
        />
        <KpiCard
          title="Total Sales"
          value={fmtMoney(summaryKPIs.totalSales)}
        />
        <KpiCard
          title="Total Orders"
          value={fmtNum(summaryKPIs.totalOrders)}
        />
        <KpiCard
          title="Avg Order Value"
          value={fmtMoney(summaryKPIs.avgOrderValue)}
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          
          <Select value={selectedSegment} onValueChange={handleSegmentChange}>
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

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
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
            <Input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Customer Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Customer Directory</h3>
            <Badge variant="outline">{filteredData.length} Customers</Badge>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Region</th>
                <th className="text-left p-3 font-medium">Channel</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Tier</th>
                <th className="text-right p-3 font-medium">Total Sales</th>
                <th className="text-right p-3 font-medium">Orders</th>
                <th className="text-right p-3 font-medium">AOV</th>
                <th className="text-left p-3 font-medium">Last Order</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Categories</th>
                <th className="text-center p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((customer, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.id}</div>
                      <div className="text-xs text-muted-foreground">{customer.contactPerson}</div>
                    </div>
                  </td>
                  <td className="p-3">{customer.region}</td>
                  <td className="p-3">{customer.channel}</td>
                  <td className="p-3">{customer.customerType}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={`text-xs ${
                      customer.sizeTier === 'gold' ? 'border-yellow-500 text-yellow-600' :
                      customer.sizeTier === 'silver' ? 'border-gray-500 text-gray-600' :
                      'border-orange-500 text-orange-600'
                    }`}>
                      {customer.sizeTier.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-medium">{fmtMoney(customer.totalSales)}</td>
                  <td className="p-3 text-right">{customer.orderCount}</td>
                  <td className="p-3 text-right">{fmtMoney(customer.avgOrderValue)}</td>
                  <td className="p-3">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={`text-xs ${
                      customer.status === 'active' ? 'border-green-500 text-green-600' :
                      customer.status === 'new' ? 'border-blue-500 text-blue-600' :
                      customer.status === 'churn-risk' ? 'border-orange-500 text-orange-600' :
                      'border-red-500 text-red-600'
                    }`}>
                      {customer.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {customer.categories.map((category, idx) => (
                        <div key={idx} className="w-2 h-2 rounded-full bg-blue-500" title={category}></div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/customers/${customer.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{" "}
            {filteredData.length} customers
          </div>
          <div className="flex items-center gap-2">
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
