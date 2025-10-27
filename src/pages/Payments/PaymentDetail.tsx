import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  CreditCard,
  Download,
  Printer,
  Eye,
  AlertCircle,
  CheckCircle2,
  Globe,
  Copy,
  RefreshCw
} from "lucide-react";
import { seedPaymentsData } from "@/data/payments.mock";
import { cn } from "@/lib/utils";
import type { PaymentTransaction, PaymentStatus } from "@/domain/payments";
import { useToast } from "@/hooks/use-toast";

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

const timelineEvents = [
  {
    id: 1,
    type: "initiated",
    title: "Payment Initiated",
    description: "Customer initiated payment process",
    timestamp: "2024-01-15T10:30:00Z",
    icon: CreditCard,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "processing",
    title: "Processing Payment",
    description: "Payment is being processed by the bank",
    timestamp: "2024-01-15T10:31:00Z",
    icon: RefreshCw,
    color: "text-orange-600"
  },
  {
    id: 3,
    type: "completed",
    title: "Payment Completed",
    description: "Payment successfully processed and confirmed",
    timestamp: "2024-01-15T10:32:00Z",
    icon: CheckCircle2,
    color: "text-green-600"
  }
];

export default function PaymentDetail() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payment, setPayment] = useState<PaymentTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const { transactions } = seedPaymentsData();
      const foundPayment = transactions.find((t) => t.id.toString() === paymentId);
      setPayment(foundPayment || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [paymentId]);

  const handleAction = (action: string) => {
    if (!payment) return;

    toast({
      title: "Action Performed",
      description: `${action} action completed for payment ${payment.tellerNo}`,
      variant: "default",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading payment receipt for ${payment?.tellerNo}...`,
      variant: "default",
    });
  };

  const handleCopyReference = () => {
    if (payment) {
      navigator.clipboard.writeText(payment.transactionReference);
      toast({
        title: "Copied to Clipboard",
        description: "Transaction reference copied successfully",
        variant: "default",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Payment Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The payment you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/payments/overview")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/payments/overview")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payments
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payment {payment.tellerNo}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(payment.paymentDate)} • {payment.transactionReference}
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
            Download Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Payment Status
            </p>
            <StatusBadge status={payment.paymentStatus} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Payment Provider
            </p>
            <Badge variant="outline">{payment.paymentProvider}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Building className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Bank
            </p>
            <p className="text-sm font-medium">{payment.bankName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Name
                  </p>
                  <p className="text-lg font-semibold">{payment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer ID
                  </p>
                  <p className="text-lg font-semibold">{payment.customerId}</p>
                </div>
                {payment.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </p>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{payment.email}</span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Region
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{payment.regionCode}</span>
                  </div>
                </div>
                {payment.customerAccountNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </p>
                    <p className="text-sm font-mono">{payment.customerAccountNumber}</p>
                  </div>
                )}
                {payment.channelName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Channel
                    </p>
                    <Badge variant="outline">{payment.channelName}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transaction Reference
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono">{payment.transactionReference}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyReference}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teller Number
                  </p>
                  <p className="text-sm font-mono">{payment.tellerNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Vendor Transaction Ref
                  </p>
                  <p className="text-sm font-mono">{payment.vendorTransactionRef}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </p>
                  <p className="text-sm">{payment.orderId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(payment.paymentDate)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(payment.createdDate)}</span>
                  </div>
                </div>
              </div>

              {payment.naration && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Narration
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-lg font-mono">
                    {payment.naration}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Bank Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Name
                  </p>
                  <p className="text-lg font-semibold">{payment.bankName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Description
                  </p>
                  <p className="text-sm">{payment.bankDescription}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Provider Code
                  </p>
                  <Badge variant="outline">{payment.paymentProvider}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Type
                  </p>
                  <Badge variant="outline">
                    {payment.paymentType === 1 ? "Direct" : "Virtual Account"}
                  </Badge>
                </div>
              </div>

              {payment.logo && (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={payment.logo}
                    alt={payment.bankName}
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <p className="text-sm font-medium">Bank Logo</p>
                    <p className="text-xs text-muted-foreground">
                      Official bank branding
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Payment Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => {
                  const EventIcon = event.icon;
                  const isLast = index === timelineEvents.length - 1;

                  return (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "p-2 rounded-full bg-muted",
                            event.color
                          )}
                        >
                          <EventIcon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <div className="w-px h-8 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(payment.amount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid Amount</span>
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(payment.paidAmount)}
                </span>
              </div>

              {payment.customerFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Fee</span>
                  <span>{formatCurrency(payment.customerFee)}</span>
                </div>
              )}

              {payment.merchantFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant Fee</span>
                  <span>{formatCurrency(payment.merchantFee)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Net Amount</span>
                <span>{formatCurrency(payment.paidAmount - payment.merchantFee)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Processing Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Invoice Created</span>
                <Badge variant={payment.invoiceCreated ? "default" : "secondary"}>
                  {payment.invoiceCreated ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Processed</span>
                <Badge variant={payment.processed ? "default" : "secondary"}>
                  {payment.processed ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Navision Processed</span>
                <Badge variant={payment.navisionProcessed ? "default" : "secondary"}>
                  {payment.navisionProcessed ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Notification Received</span>
                <Badge variant={payment.notificationReceived ? "default" : "secondary"}>
                  {payment.notificationReceived ? "Yes" : "No"}
                </Badge>
              </div>

              {payment.invoiceNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="text-sm font-mono">{payment.invoiceNumber}</p>
                </div>
              )}

              {payment.processedDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Processed Date
                  </p>
                  <p className="text-sm">{formatDate(payment.processedDate)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {payment.paymentStatus === "Failed" && (
                <Button
                  className="w-full"
                  onClick={() => handleAction("Retry Payment")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Payment
                </Button>
              )}

              {payment.paymentStatus === "Pending" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAction("Check Status")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Status
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
              {payment.notificationRequeryable && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAction("Requery Payment")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Requery Payment
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
