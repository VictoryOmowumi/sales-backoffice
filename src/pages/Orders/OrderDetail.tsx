import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <div className="space-y-6">
      {/* Header */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/orders/overview")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order {order.order_no}
            </h1>
            <p className="text-muted-foreground">
              Created on {new Date(order.ordered_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Edit")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Order Status
            </p>
            <Badge className={cn("text-xs", statusColors[order.status])}>
              {order.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Package className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Fulfillment
            </p>
            <Badge
              className={cn(
                "text-xs",
                fulfillmentColors[order.fulfillment_status]
              )}
            >
              {order.fulfillment_status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payment</p>
            <Badge
              className={cn("text-xs", paymentColors[order.payment_status])}
            >
              {order.payment_status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Name
                  </p>
                  <p className="text-lg font-semibold">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Code
                  </p>
                  <p className="text-lg font-semibold">{order.customer.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Region
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer.region}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Channel
                  </p>
                  <Badge variant="outline">{order.customer.channel}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.lines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{line.sku.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {line.sku.code}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {line.sku.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {fmtNum(line.qty)} {line.uom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fmtMoney(line.price_ngn)} per {line.uom}
                      </p>
                      <p className="font-semibold text-lg">
                        {fmtMoney(line.line_value_ngn)}
                      </p>
                      {line.discount_ngn && (
                        <p className="text-sm text-green-600">
                          -{fmtMoney(line.discount_ngn)} discount
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.events.map((event) => {
                  const EventIcon =
                    eventIcons[event.kind as keyof typeof eventIcons];
                  const eventColor =
                    eventColors[event.kind as keyof typeof eventColors];

                  return (
                    <div key={event.id} className="flex items-start gap-3">
                      <div
                        className={cn("p-2 rounded-full bg-muted", eventColor)}
                      >
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium capitalize">
                            {event.kind.replace("_", " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.at).toLocaleString()}
                          </p>
                        </div>
                        {event.note && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Items ({totalItems})
                </span>
                <span>{fmtMoney(totalValue)}</span>
              </div>

              {order.discount_ngn > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{fmtMoney(order.discount_ngn)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{fmtMoney(order.tax_ngn)}</span>
              </div>

              {order.shipping_ngn > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{fmtMoney(order.shipping_ngn)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{fmtMoney(order.total_ngn)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sales Rep Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Sales Representative
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.salesRep.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {order.salesRep.role.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.customer.region}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Order Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(order.ordered_at).toLocaleDateString()}</span>
                </div>
              </div>

              {order.required_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Required Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(order.required_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Currency
                </p>
                <p>{order.currency}</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {order.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
