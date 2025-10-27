import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  Package,
  Clock,
  User,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  ShoppingCart,
  FileText,
  Download,
  Printer,
  Eye,
  AlertCircle,
  CheckCircle2,
  TruckIcon,
  Package2,
  Star,
  TrendingUp,
  Phone,
  Mail,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Zap,
  Target,
  Activity,
} from "lucide-react";
import { ordersWithDetails } from "@/data/orders.mock";
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

const eventIcons = {
  submitted: FileText,
  approved: CheckCircle2,
  rejected: XCircle,
  confirmed: CheckCircle,
  packed: Package2,
  shipped: TruckIcon,
  delivered: Package,
  cancelled: XCircle,
  returned: AlertCircle,
  payment_received: DollarSign,
};

const eventColors = {
  submitted: "text-blue-600",
  approved: "text-green-600",
  rejected: "text-red-600",
  confirmed: "text-blue-600",
  packed: "text-orange-600",
  shipped: "text-blue-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
  returned: "text-red-600",
  payment_received: "text-green-600",
};

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundOrder = ordersWithDetails.find((o) => o.id === orderId);
      setOrder(foundOrder || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [orderId]);

  const handleAction = (action: string) => {
    if (!order) return;

    toast({
      title: "Action Performed",
      description: `${action} action completed for order ${order.order_no}`,
      variant: "default",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading order ${order?.order_no} as PDF...`,
      variant: "default",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/orders/overview")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const totalItems = order.lines.reduce((sum, line) => sum + line.qty, 0);
  const totalValue = order.lines.reduce(
    (sum, line) => sum + line.line_value_ngn,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-2">
        {/* Clean Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/orders/overview")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          {/* Minimal Hero Section */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                  <div>
                    <h1 className="text-3xl font-semibold text-foreground">
                      Order {order.order_no}
                    </h1>
                    <p className="text-muted-foreground">
                      Created on {new Date(order.ordered_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Priority Customer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>+15% vs Last Month</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction("Edit")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Order Status
                    </p>
                    <Badge className={cn("text-sm px-2 py-1", statusColors[order.status])}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">85%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={85} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fulfillment
                    </p>
                    <Badge
                      className={cn(
                        "text-sm px-2 py-1",
                        fulfillmentColors[order.fulfillment_status]
                      )}
                    >
                      {order.fulfillment_status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">60%</p>
                  <p className="text-xs text-muted-foreground">Shipped</p>
                </div>
              </div>
              <Progress value={60} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment</p>
                    <Badge
                      className={cn("text-sm px-2 py-1", paymentColors[order.payment_status])}
                    >
                      {order.payment_status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Paid</p>
                </div>
              </div>
              <Progress value={100} className="mt-3 h-1" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clean Customer Information */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-foreground">Customer Information</span>
                      <p className="text-sm font-normal text-muted-foreground">
                        {order.customer.name} • {order.customer.code}
                      </p>
                    </div>
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Region</p>
                        <p className="font-semibold text-foreground">{order.customer.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Business Type</p>
                        <p className="font-semibold text-foreground">Retail Partner</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <p className="font-semibold text-foreground">+234 801 234 5678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-semibold text-foreground">contact@{order.customer.code.toLowerCase()}.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-border">
                      {order.customer.channel}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4" />
                      <span>Premium Customer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clean Order Items */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-foreground">Order Items</span>
                      <p className="text-sm font-normal text-muted-foreground">
                        {order.lines.length} products • {totalItems} total units
                      </p>
                    </div>
                  </CardTitle>
                  <Badge variant="outline" className="border-border">
                    {fmtMoney(totalValue)} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.lines.map((line) => (
                    <div
                      key={line.id}
                      className="border border-border rounded-lg p-4 hover:border-border/60 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground">
                                {line.sku.name}
                              </h4>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs border-border">
                                  {line.sku.code}
                                </Badge>
                                <Badge className="bg-muted text-muted-foreground text-xs">
                                  {line.sku.category}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3 text-green-600" />
                                  <span className="text-xs text-green-600 font-medium">In Stock</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-foreground">
                                  {fmtMoney(line.line_value_ngn)}
                                </span>
                                {line.discount_ngn && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    -{fmtMoney(line.discount_ngn)}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {fmtNum(line.qty)} {line.uom} × {fmtMoney(line.price_ngn)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full w-3/4 bg-muted-foreground/30 rounded-full"></div>
                                </div>
                                <span className="text-xs text-muted-foreground">75% Fulfilled</span>
                              </div>
                              <Badge variant="outline" className="text-xs border-border">
                                <Activity className="h-3 w-3 mr-1" />
                                Processing
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clean Order Timeline */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground">Order Timeline</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      Track order progress and updates
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.events.map((event, index) => {
                    const EventIcon = eventIcons[event.kind as keyof typeof eventIcons];
                    const eventColor = eventColors[event.kind as keyof typeof eventColors];
                    const isLast = index === order.events.length - 1;

                    return (
                      <div key={event.id} className="relative">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "p-2 rounded-lg border border-border bg-card",
                              eventColor
                            )}>
                              <EventIcon className="h-4 w-4" />
                            </div>
                            {!isLast && (
                              <div className="w-px h-6 bg-border mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-4">
                            <div className="bg-muted rounded-lg p-4 border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground capitalize">
                                  {event.kind.replace("_", " ")}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs border-border">
                                    {new Date(event.at).toLocaleDateString()}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(event.at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                              {event.note && (
                                <p className="text-sm text-foreground bg-card p-3 rounded border border-border">
                                  {event.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
        </div>

          {/* Clean Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground">Order Summary</span>
                    <p className="text-sm font-normal text-muted-foreground">Total order value</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Items ({totalItems})</span>
                    <span className="font-semibold text-foreground">{fmtMoney(totalValue)}</span>
                  </div>

                  {order.discount_ngn > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-medium">Discount</span>
                      <span className="text-green-600 font-semibold">-{fmtMoney(order.discount_ngn)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold text-foreground">{fmtMoney(order.tax_ngn)}</span>
                  </div>

                  {order.shipping_ngn > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold text-foreground">{fmtMoney(order.shipping_ngn)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="bg-muted p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">{fmtMoney(order.total_ngn)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Including all fees and taxes</p>
                </div>
              </CardContent>
            </Card>

            {/* Sales Rep Information */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground">Sales Representative</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      Assigned account manager
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{order.salesRep.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.salesRep.role.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{order.customer.region}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground">Order Details</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      Additional information
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                      <p className="font-semibold text-foreground">{new Date(order.ordered_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {order.required_at && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Required Date</p>
                        <p className="font-semibold text-foreground">{new Date(order.required_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Currency</p>
                      <Badge variant="outline" className="border-border">{order.currency}</Badge>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                    <div className="bg-muted p-4 rounded-lg border border-border">
                      <p className="text-sm text-foreground">{order.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clean Actions */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground">Quick Actions</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      Manage this order
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {order.status === "pending_approval" && (
                  <Button
                    className="w-full"
                    onClick={() => handleAction("Approve")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Order
                  </Button>
                )}

                {order.status === "pending_approval" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleAction("Reject")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Order
                  </Button>
                )}

                {order.status !== "cancelled" && order.status !== "rejected" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAction("Cancel")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAction("View Invoice")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Invoice
                </Button>

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
