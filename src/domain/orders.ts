export type ID = string;

export type OrderStatus = "draft" | "pending_approval" | "confirmed" | "rejected" | "cancelled";
export type FulfillmentStatus = "unfulfilled" | "partially_fulfilled" | "shipped" | "delivered" | "returned";
export type PaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";
export type UOM = "cases" | "units";

export type Order = {
  id: ID;
  order_no: string;
  customer_id: ID;
  sales_rep_id: ID;
  region_id: ID;
  channel_id: ID;
  ordered_at: string;   // ISO
  required_at?: string; // ISO (ETA/requested)
  status: OrderStatus;
  fulfillment_status: FulfillmentStatus;
  payment_status: PaymentStatus;
  currency: "NGN";
  subtotal_ngn: number;
  discount_ngn: number;
  tax_ngn: number;
  shipping_ngn: number;
  total_ngn: number;
  notes?: string;
};

export type OrderLine = {
  id: ID;
  order_id: ID;
  sku_id: ID;
  uom: UOM;
  qty: number;           // in chosen UOM (usually cases)
  price_ngn: number;     // per UOM
  line_value_ngn: number;
  discount_ngn?: number;
};

export type OrderEvent = {
  id: ID;
  order_id: ID;
  kind:
    | "submitted"
    | "approved"
    | "rejected"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "payment_received";
  at: string;          // ISO
  by_user_id?: ID;
  note?: string;
};

// Extended types for UI
export type OrderWithDetails = Order & {
  customer: {
    id: string;
    code: string;
    name: string;
    region: string;
    channel: string;
  };
  salesRep: {
    id: string;
    name: string;
    role: string;
  };
  lines: OrderLineWithDetails[];
  events: OrderEvent[];
};

export type OrderLineWithDetails = OrderLine & {
  sku: {
    id: string;
    code: string;
    name: string;
    category: "RGB" | "PET" | "Water" | "Energy";
  };
};

export type OrderFilter = {
  dateRange?: {
    start: string;
    end: string;
  };
  region?: string;
  channel?: string;
  status?: OrderStatus;
  fulfillmentStatus?: FulfillmentStatus;
  paymentStatus?: PaymentStatus;
  customer?: string;
  salesRep?: string;
  sku?: string;
  category?: string;
};

export type OrderKPIs = {
  totalOrders: number;
  orderValue: number;
  avgOrderValue: number;
  fulfilled: number;
  pending: number;
  onTimeDelivery: number;
  returnsRate: number;
  byStatus: Record<string, number>;
  byFulfillmentStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
};
