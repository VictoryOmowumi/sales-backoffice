import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { seedPaymentsData } from "@/data/payments.mock";
import type { PaymentStatus, PaymentProvider } from "@/domain/payments";
import DailyCollectionLineE from "@/components/charts/DailyCollectionLineE";
import RegionalCollectionBarE from "@/components/charts/RegionalCollectionBarE";
import BankCollectionPieE from "@/components/charts/BankCollectionPieE";

// Format currency helper
function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `₦${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(1)}K`;
  }
  return `₦${amount.toFixed(0)}`;
}

// Format date helper
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Status badge component
function StatusBadge({ status }: { status: PaymentStatus }) {
  const variants = {
    Successful: "bg-green-100 text-green-800 border-green-200",
    Failed: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };

  const icons = {
    Successful: CheckCircle2,
    Failed: XCircle,
    Pending: Clock
  };

  const Icon = icons[status];

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

// Header component for chart cards
function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      <Separator className="mt-3" />
    </div>
  );
}

export default function PaymentOverview() {
  const { transactions, analytics, kpis } = useMemo(() => seedPaymentsData(), []);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [providerFilter, setProviderFilter] = useState<PaymentProvider | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionReference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || transaction.paymentStatus === statusFilter;
      const matchesProvider = providerFilter === "all" || transaction.paymentProvider === providerFilter;
      
      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [transactions, searchTerm, statusFilter, providerFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset pagination when filters change
  const resetPagination = () => setCurrentPage(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  const handleStatusFilterChange = (value: PaymentStatus | "all") => {
    setStatusFilter(value);
    resetPagination();
  };

  const handleProviderFilterChange = (value: PaymentProvider | "all") => {
    setProviderFilter(value);
    resetPagination();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setProviderFilter("all");
    resetPagination();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Monitor payment transactions, collections, and revenue analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.totalTransactions.toLocaleString()} total transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.collectionSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {kpis.failedTransactionsCount} failed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.avgTransactionValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per successful transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Payment</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.largestCustomerPayment)}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <Header title="Daily Collection Trend" subtitle="Weekly collection patterns (₦ billions)" />
          <div className="min-h-[400px]">
            <DailyCollectionLineE data={analytics.dailyCollection} />
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <Header title="Regional Collection" subtitle="Revenue by region (₦ billions)" />
          <div className="min-h-[400px]">
            <RegionalCollectionBarE data={analytics.regionalCollection} />
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl p-6">
        <Header title="Collection by Bank" subtitle="Payment provider distribution" />
        <div className="min-h-[400px]">
          <BankCollectionPieE data={analytics.collectionByBank} />
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Successful">Successful</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={providerFilter} onValueChange={handleProviderFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="ABVA">Access Bank</SelectItem>
                  <SelectItem value="ZBVA">Zenith Bank</SelectItem>
                  <SelectItem value="GBVA">Globus Bank</SelectItem>
                  <SelectItem value="GTB">GT Bank</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Transaction
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Provider
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">{transaction.tellerNo}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.transactionReference.slice(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.customerId}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                        {transaction.merchantFee > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Fee: {formatCurrency(transaction.merchantFee)}
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <StatusBadge status={transaction.paymentStatus} />
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm">{transaction.bankName}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.paymentProvider}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-sm text-muted-foreground">
                        {formatDate(transaction.paymentDate)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
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
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} transactions
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
        </CardContent>
      </Card>
    </div>
  );
}
