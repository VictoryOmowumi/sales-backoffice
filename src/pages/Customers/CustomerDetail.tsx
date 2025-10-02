import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  generateCustomerDetail, 
  generateCustomerOrders, 
  generateCustomerPayments, 
  generateCustomerReturns, 
  generateCustomerVisits, 
  generateCustomerActivity 
} from "@/data/customer-detail.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { 
  Phone, 
  Mail, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Download,
  Package,
  DollarSign,
  Target,
  Clock,
  Eye
} from "lucide-react";

// Helper components
function KpiCard({ title, value, delta, positive, icon: Icon }: {
  title: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {delta && (
            <div className={`flex items-center gap-1 text-xs ${
              positive ? "text-green-600" : "text-red-600"
            }`}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta}
            </div>
          )}
        </div>
        {Icon && 
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" strokeWidth={1} />
        </div>}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    Active: "bg-green-100 text-green-800 border-green-200",
    OnHold: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Inactive: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Badge className={`${variants[status as keyof typeof variants]} flex items-center gap-1`}>
      {status === "Active" ? <CheckCircle className="h-3 w-3" /> : 
       status === "OnHold" ? <AlertTriangle className="h-3 w-3" /> : 
       <AlertTriangle className="h-3 w-3" />}
      {status}
    </Badge>
  );
}

function MiniInsight({ type, message, positive }: { type: "risk" | "trend" | "compliance"; message: string; positive?: boolean }) {
  const colors = {
    risk: "bg-red-50 text-red-700 border-red-200",
    trend: positive ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200",
    compliance: "bg-blue-50 text-blue-700 border-blue-200"
  };

  return (
    <Badge className={`${colors[type]} text-xs`}>
      {type === "risk" ? "Risk" : type === "trend" ? "Trend" : "Compliance"}: {message}
    </Badge>
  );
}

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Generate mock data
  const customer = useMemo(() => generateCustomerDetail(customerId || "1"), [customerId]);
  const orders = useMemo(() => generateCustomerOrders(customerId || "1"), [customerId]);
  const payments = useMemo(() => generateCustomerPayments(customerId || "1"), [customerId]);
  const returns = useMemo(() => generateCustomerReturns(customerId || "1"), [customerId]);
  const visits = useMemo(() => generateCustomerVisits(customerId || "1"), [customerId]);
  const activity = useMemo(() => generateCustomerActivity(customerId || "1"), [customerId]);

  // Calculate derived values
  const creditBalance = customer.credit.limit - customer.credit.exposure;
  const paymentSuccessRate = payments.length > 0 ? 
    (payments.filter(p => p.success).length / payments.length * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{customer.code}</span>
                <StatusBadge status={customer.status} />
                <span>•</span>
                <span>{customer.channel}</span>
                <span>•</span>
                <span>{customer.region}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={creditBalance < 0 ? "border-red-500 text-red-600" : ""}>
              Balance: {fmtMoney(creditBalance)}
            </Badge>
           
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-6">
        {/* Quick KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            title="Revenue (90d)"
            value={fmtMoney(customer.kpis.last90dRevenue)}
            icon={DollarSign}
          />
          <KpiCard
            title="Orders (90d)"
            value={fmtNum(customer.kpis.ordersCount90d)}
            icon={Package}
          />
          <KpiCard
            title="Avg Order Value"
            value={fmtMoney(customer.kpis.aov)}
            icon={Target}
          />
          <KpiCard
            title="Fill Rate"
            value={`${customer.kpis.fillRatePct}%`}
            icon={CheckCircle}
          />
        </div>

        {/* Credit & Performance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <CreditCard className="h-5 w-5" strokeWidth={1.5} />
                Credit Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Credit Limit</p>
                  <p className="text-lg font-semibold">{fmtMoney(customer.credit.limit)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credit Used</p>
                  <p className="text-lg font-semibold">{fmtMoney(customer.credit.exposure)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className={`text-lg font-semibold ${creditBalance < 0 ? "text-red-600" : ""}`}>
                    {fmtMoney(creditBalance)}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">AR Aging</p>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="">
                    <p className="font-medium">0-30</p>
                    <p className="text-green-600">{fmtMoney(customer.credit.aging.b0_30)}</p>
                  </div>
                  <div className="">
                    <p className="font-medium">31-60</p>
                    <p className="text-yellow-600">{fmtMoney(customer.credit.aging.b31_60)}</p>
                  </div>
                  <div className="">
                    <p className="font-medium">61-90</p>
                    <p className="text-orange-600">{fmtMoney(customer.credit.aging.b61_90)}</p>
                  </div>
                  <div className="">
                    <p className="font-medium">90+</p>
                    <p className="text-red-600">{fmtMoney(customer.credit.aging.b90p)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <p className="text-sm text-muted-foreground">Payment Success</p>
                  <p className="text-lg font-semibold">{paymentSuccessRate.toFixed(1)}%</p>
                </div>
                <div className="">
                  <p className="text-sm text-muted-foreground">Return Rate</p>
                  <p className="text-lg font-semibold">{customer.kpis.returnRatePct}%</p>
                </div>
                <div className="">
                  <p className="text-sm text-muted-foreground">Visit Compliance</p>
                  <p className="text-lg font-semibold">{customer.kpis.visitCompliancePct}%</p>
                </div>
                <div className="">
                  <p className="text-sm text-muted-foreground">On-time Delivery</p>
                  <p className="text-lg font-semibold">{customer.kpis.onTimePct}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mini Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <MiniInsight 
                type="risk" 
                message="61-90 bucket ↑ 12% WoW" 
              />
              <MiniInsight 
                type="trend" 
                message="Spend trend ↑ vs PP" 
                positive={true}
              />
              <MiniInsight 
                type="compliance" 
                message={`Price compliance ${customer.kpis.priceCompliancePct}% (target ≥97%)`} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Legal Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer Code</p>
                  <p className="font-medium">{customer.code}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{customer.address.line1}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.address.city}, {customer.address.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Terms</p>
                  <p className="font-medium">{customer.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price Tier</p>
                  <p className="font-medium">{customer.priceTier}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.contacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    </div>
                    <div className="flex gap-1">
                      {contact.phone && (
                        <Button variant="ghost" size="sm">
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                      {contact.email && (
                        <Button variant="ghost" size="sm">
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Account Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Sales Rep</p>
                  <p className="font-medium">{customer.owner.repName}</p>
                </div>
                {customer.owner.tdm && (
                  <div>
                    <p className="text-xs text-muted-foreground">TDM</p>
                    <p className="font-medium">{customer.owner.tdm}</p>
                  </div>
                )}
                {customer.owner.rsm && (
                  <div>
                    <p className="text-xs text-muted-foreground">RSM</p>
                    <p className="font-medium">{customer.owner.rsm}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Order #</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-right p-2">Value</th>
                      <th className="text-right p-2">Fill Rate</th>
                      <th className="text-center p-2">On Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{order.number}</td>
                        <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">{fmtMoney(order.value)}</td>
                        <td className="p-2 text-right">{order.fillRatePct}%</td>
                        <td className="p-2 text-center">
                          {order.onTime ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <Clock className="h-4 w-4 text-red-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Receipt #</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Method</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 10).map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{payment.receiptNo}</td>
                        <td className="p-2">{new Date(payment.date).toLocaleDateString()}</td>
                        <td className="p-2">{payment.method}</td>
                        <td className="p-2 text-right">{fmtMoney(payment.amount)}</td>
                        <td className="p-2 text-center">
                          {payment.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Limit</p>
                    <p className="text-2xl font-bold">{fmtMoney(customer.credit.limit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Exposure</p>
                    <p className="text-2xl font-bold">{fmtMoney(customer.credit.exposure)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Credit</p>
                  <p className={`text-2xl font-bold ${creditBalance < 0 ? "text-red-600" : "text-green-600"}`}>
                    {fmtMoney(creditBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Sales Outstanding</p>
                  <p className="text-lg font-semibold">{customer.credit.dsoDays} days</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AR Aging Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">0-30 days</span>
                    <span className="font-semibold text-green-600">{fmtMoney(customer.credit.aging.b0_30)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">31-60 days</span>
                    <span className="font-semibold text-yellow-600">{fmtMoney(customer.credit.aging.b31_60)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">61-90 days</span>
                    <span className="font-semibold text-orange-600">{fmtMoney(customer.credit.aging.b61_90)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">90+ days</span>
                    <span className="font-semibold text-red-600">{fmtMoney(customer.credit.aging.b90p)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {customer.credit.holds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Credit Holds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customer.credit.holds.map((hold) => (
                    <div key={hold.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{hold.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          By {hold.by} on {new Date(hold.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={hold.active ? "destructive" : "secondary"}>
                        {hold.active ? "Active" : "Resolved"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Returns & Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">RMA #</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Reason</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Credit Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.slice(0, 10).map((returnItem) => (
                      <tr key={returnItem.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{returnItem.id}</td>
                        <td className="p-2">{new Date(returnItem.date).toLocaleDateString()}</td>
                        <td className="p-2">{returnItem.reason}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {returnItem.status}
                          </Badge>
                        </td>
                        <td className="p-2">{returnItem.creditNoteNo || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visit Summary Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Visit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Planned</span>
                  <span className="font-semibold">{visits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-semibold text-green-600">
                    {visits.filter(v => v.status === 'Completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Missed</span>
                  <span className="font-semibold text-red-600">
                    {visits.filter(v => v.status === 'Missed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                  <span className="font-semibold text-orange-600">
                    {visits.filter(v => v.status === 'Cancelled').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Compliance Rate</span>
                  <span className="font-semibold text-blue-600">
                    {((visits.filter(v => v.status === 'Completed').length / visits.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Visits */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Recent Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          visit.status === 'Completed' ? 'bg-green-500' :
                          visit.status === 'Missed' ? 'bg-red-500' :
                          visit.status === 'Cancelled' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">
                            {new Date(visit.plannedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {visit.completedAt ? 
                              `Completed: ${new Date(visit.completedAt).toLocaleDateString()}` :
                              `Status: ${visit.status}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${
                          visit.status === 'Completed' ? 'border-green-500 text-green-600' :
                          visit.status === 'Missed' ? 'border-red-500 text-red-600' :
                          visit.status === 'Cancelled' ? 'border-orange-500 text-orange-600' :
                          'border-blue-500 text-blue-600'
                        }`}>
                          {visit.status}
                        </Badge>
                        {visit.notes ? (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        ) : <div className=""> — </div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Visits Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Planned Date</th>
                      <th className="text-left p-2">Completed Date</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Rep</th>
                      <th className="text-left p-2">Notes</th>
                      <th className="text-center p-2">Checklist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit) => (
                      <tr key={visit.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{new Date(visit.plannedAt).toLocaleDateString()}</td>
                        <td className="p-2">
                          {visit.completedAt ? new Date(visit.completedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className={`text-xs ${
                            visit.status === 'Completed' ? 'border-green-500 text-green-600' :
                            visit.status === 'Missed' ? 'border-red-500 text-red-600' :
                            visit.status === 'Cancelled' ? 'border-orange-500 text-orange-600' :
                            'border-blue-500 text-blue-600'
                          }`}>
                            {visit.status}
                          </Badge>
                        </td>
                        <td className="p-2">{visit.repId}</td>
                        <td className="p-2">
                          {visit.notes ? (
                            <div className="max-w-xs truncate" title={visit.notes}>
                              {visit.notes}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="p-2 text-center">
                          {visit.checklist ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                {visit.checklist.filter(c => c.ok).length}/{visit.checklist.length}
                              </span>
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {activity.slice(0, 20).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{item.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                          {item.user && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">by {item.user}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
