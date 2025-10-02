import { faker } from "@faker-js/faker";
import { addDays, subDays, formatISO } from "date-fns";
import type { Order, OrderLine, OrderEvent, UOM, OrderWithDetails, OrderLineWithDetails, OrderKPIs } from "@/domain/orders";

faker.seed(101);

// Reference types for seeding
type RefSKU = { id: string; code: string; name: string; category: "RGB"|"PET"|"Water"|"Energy"; };
type RefCustomer = { id: string; code: string; name: string; region_id: string; channel_id: string; region: string; channel: string; };
type RefUser = { id: string; name: string; region_id: string; role: "SalesRep"|"TDM"|"RSM"|"Admin" };

function id() { return faker.string.uuid(); }

// Simple price model per category/UOM
function unitPrice(category: RefSKU["category"], uom: UOM): number {
  const base = { RGB: 3800, PET: 4400, Water: 2400, Energy: 8800 }; // per case ballparks
  const perCase = base[category];
  return uom === "cases" ? perCase : Math.round(perCase / 12); // naive: 12 units per case
}

function statusFlow(): { status: Order["status"]; fulfillment: Order["fulfillment_status"]; payment: Order["payment_status"]; events: OrderEvent["kind"][] } {
  // plausible lifecycle
  const flows = [
    { s: "confirmed", f: "delivered", p: "paid", e: ["submitted","approved","confirmed","shipped","delivered","payment_received"] },
    { s: "confirmed", f: "shipped",   p: "partially_paid", e: ["submitted","approved","confirmed","shipped"] },
    { s: "pending_approval", f: "unfulfilled", p: "unpaid", e: ["submitted"] },
    { s: "rejected", f: "unfulfilled", p: "unpaid", e: ["submitted","rejected"] },
    { s: "cancelled", f: "unfulfilled", p: "unpaid", e: ["submitted","cancelled"] },
    { s: "confirmed", f: "returned", p: "refunded", e: ["submitted","approved","confirmed","shipped","delivered","returned"] },
  ] as const;

  const pick = faker.helpers.weightedArrayElement([
    { weight: 50, value: 0 },
    { weight: 15, value: 1 },
    { weight: 10, value: 2 },
    { weight: 5,  value: 3 },
    { weight: 5,  value: 4 },
    { weight: 15, value: 5 },
  ]);

  const f = flows[pick];
  const mapStatus = (s: typeof f.s) => s as Order["status"];
  const mapFul = (x: typeof f.f) => x as Order["fulfillment_status"];
  const mapPay = (x: typeof f.p) => x as Order["payment_status"];

  return { status: mapStatus(f.s), fulfillment: mapFul(f.f), payment: mapPay(f.p), events: f.e as any };
}

// Generate reference data
const regions = ["Abuja", "Kano", "Kaduna", "Aba", "Enugu", "Benin", "Ibadan", "Ilorin", "Ikeja"];
const channels = ["Modern Trade", "General Trade", "HORECA", "E-Commerce", "Distributor"];

const skus: RefSKU[] = [
  { id: id(), code: "PEP-PET-500B", name: "Pepsi PET 50cl", category: "PET" },
  { id: id(), code: "PEP-PET-1500B", name: "Pepsi PET 1.5L", category: "PET" },
  { id: id(), code: "MIR-PET-500B", name: "Mirinda PET 50cl", category: "PET" },
  { id: id(), code: "PEP-RGB-300G", name: "Pepsi RGB 30cl Glass", category: "RGB" },
  { id: id(), code: "MIR-RGB-300G", name: "Mirinda RGB 30cl Glass", category: "RGB" },
  { id: id(), code: "PEP-RGB-350C", name: "Pepsi RGB 35cl Can", category: "RGB" },
  { id: id(), code: "AQF-WAT-500B", name: "Aquafina Water 50cl", category: "Water" },
  { id: id(), code: "AQF-WAT-1500B", name: "Aquafina Water 1.5L", category: "Water" },
  { id: id(), code: "SUP-ENG-500C", name: "Supa Komando Energy 50cl", category: "Energy" },
  { id: id(), code: "ROC-ENG-500C", name: "Rockstar Energy 50cl", category: "Energy" },
];

const customers: RefCustomer[] = Array.from({ length: 150 }).map(() => {
  const region = faker.helpers.arrayElement(regions);
  const channel = faker.helpers.arrayElement(channels);
  return {
    id: id(),
    code: `${region.slice(0,3).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`,
    name: `${faker.company.name()} ${region}`,
    region_id: region,
    channel_id: channel,
    region,
    channel,
  };
});

const users: RefUser[] = [
  ...regions.flatMap(region => [
    { id: id(), name: `${region} RSM`, region_id: region, role: "RSM" as const },
    { id: id(), name: `${region} TDM A`, region_id: region, role: "TDM" as const },
    { id: id(), name: `${region} TDM B`, region_id: region, role: "TDM" as const },
    ...Array.from({ length: 4 }).map((_, i) => ({
      id: id(),
      name: `${region} Rep ${i+1}`,
      region_id: region,
      role: "SalesRep" as const
    }))
  ])
];

// Main seeder
export function seedOrders(opts: {
  startDate?: Date;
  endDate?: Date;
  approxOrders?: number;
} = {}): { orders: Order[]; lines: OrderLine[]; events: OrderEvent[] } {
  const start = opts.startDate ?? subDays(new Date(), 60);
  const end = opts.endDate ?? new Date();

  const reps = users.filter(u => u.role === "SalesRep");
  const orders: Order[] = [];
  const lines: OrderLine[] = [];
  const events: OrderEvent[] = [];

  // baseline orders: proportional to #customers
  const baseN = opts.approxOrders ?? Math.max(300, Math.round(customers.length * 6));

  for (let i = 0; i < baseN; i++) {
    const cust = faker.helpers.arrayElement(customers);
    const rep = faker.helpers.arrayElement(reps.filter(r => r.region_id === cust.region_id)) || faker.helpers.arrayElement(reps);

    const orderedAt = faker.date.between({ from: start, to: end });
    const requiredAt = addDays(orderedAt, faker.number.int({ min: 1, max: 7 }));

    const flow = statusFlow();

    // Build order skeleton
    const ord: Order = {
      id: id(),
      order_no: `SO-${faker.number.int({ min: 100000, max: 999999 })}`,
      customer_id: cust.id,
      sales_rep_id: rep.id,
      region_id: cust.region_id,
      channel_id: cust.channel_id,
      ordered_at: formatISO(orderedAt),
      required_at: formatISO(requiredAt),
      status: flow.status,
      fulfillment_status: flow.fulfillment,
      payment_status: flow.payment,
      currency: "NGN",
      subtotal_ngn: 0,
      discount_ngn: 0,
      tax_ngn: 0,
      shipping_ngn: 0,
      total_ngn: 0,
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
    };

    // Lines (2–8 SKUs)
    const nLines = faker.number.int({ min: 2, max: 8 });
    const skuPool = faker.helpers.arrayElements(skus, nLines + 3);
    let subtotal = 0;
    let discount = 0;

    for (let j = 0; j < nLines; j++) {
      const sku = skuPool[j];
      const uom: UOM = "cases";
      const qty = faker.number.int({ min: 2, max: 80 });
      const price = unitPrice(sku.category, uom);
      const lineGross = qty * price;

      // occasional line-level discount for promos
      const lineDiscount = faker.helpers.maybe(() => Math.round(lineGross * faker.number.float({ min: 0.03, max: 0.12 })), { probability: 0.25 }) ?? 0;

      const ln: OrderLine = {
        id: id(),
        order_id: ord.id,
        sku_id: sku.id,
        uom,
        qty,
        price_ngn: price,
        line_value_ngn: lineGross - lineDiscount,
        discount_ngn: lineDiscount || undefined,
      };

      subtotal += ln.line_value_ngn;
      discount += lineDiscount;
      lines.push(ln);
    }

    // Order-level pricing
    const orderDisc = faker.helpers.maybe(() => Math.round(subtotal * faker.number.float({ min: 0.01, max: 0.05 })), { probability: 0.15 }) ?? 0;
    discount += orderDisc;
    const taxable = subtotal - orderDisc;
    const tax = Math.round(taxable * 0.075); // 7.5% VAT (example)
    const shipping = faker.helpers.maybe(() => faker.number.int({ min: 2000, max: 12000 }), { probability: 0.5 }) ?? 0;
    const total = taxable + tax + shipping;

    ord.subtotal_ngn = subtotal;
    ord.discount_ngn = discount;
    ord.tax_ngn = tax;
    ord.shipping_ngn = shipping;
    ord.total_ngn = total;

    // Events timeline
    let t = orderedAt;
    for (const kind of flow.events) {
      t = addDays(t, 1);
      events.push({
        id: id(),
        order_id: ord.id,
        kind,
        at: formatISO(t),
        by_user_id: faker.helpers.maybe(() => rep.id, { probability: 0.6 }),
        note: faker.helpers.maybe(() => faker.lorem.words({ min: 2, max: 6 }), { probability: 0.2 }),
      });
    }

    orders.push(ord);
  }

  return { orders, lines, events };
}

// Generate the data
const { orders, lines, events } = seedOrders();

// Build orders with details
export function buildOrderWithDetails(order: Order): OrderWithDetails {
  const customer = customers.find(c => c.id === order.customer_id)!;
  const salesRep = users.find(u => u.id === order.sales_rep_id)!;
  const orderLines = lines.filter(l => l.order_id === order.id);
  const orderEvents = events.filter(e => e.order_id === order.id);

  const linesWithDetails: OrderLineWithDetails[] = orderLines.map(line => ({
    ...line,
    sku: skus.find(s => s.id === line.sku_id)!
  }));

  return {
    ...order,
    customer: {
      id: customer.id,
      code: customer.code,
      name: customer.name,
      region: customer.region,
      channel: customer.channel,
    },
    salesRep: {
      id: salesRep.id,
      name: salesRep.name,
      role: salesRep.role,
    },
    lines: linesWithDetails,
    events: orderEvents,
  };
}

export const ordersWithDetails: OrderWithDetails[] = orders.map(buildOrderWithDetails);

// KPI calculations
export function calculateOrderKPIs(orders: Order[]): OrderKPIs {
  const totalOrders = orders.length;
  const orderValue = orders.reduce((s, o) => s + o.total_ngn, 0);
  const avgOrderValue = totalOrders ? Math.round(orderValue / totalOrders) : 0;

  const byStatus = orders.reduce<Record<string, number>>((a, o) => {
    a[o.status] = (a[o.status] ?? 0) + 1;
    return a;
  }, {});

  const byFulfillmentStatus = orders.reduce<Record<string, number>>((a, o) => {
    a[o.fulfillment_status] = (a[o.fulfillment_status] ?? 0) + 1;
    return a;
  }, {});

  const byPaymentStatus = orders.reduce<Record<string, number>>((a, o) => {
    a[o.payment_status] = (a[o.payment_status] ?? 0) + 1;
    return a;
  }, {});

  const fulfilled = orders.filter(o => o.fulfillment_status === "delivered").length;
  const pending = orders.filter(o => ["unfulfilled","partially_fulfilled","shipped"].includes(o.fulfillment_status)).length;
  
  // Mock on-time delivery rate
  const onTimeDelivery = Math.round(faker.number.float({ min: 85, max: 98 }));
  
  // Mock returns rate
  const returnsRate = Math.round(faker.number.float({ min: 2, max: 8 }) * 10) / 10;

  return {
    totalOrders,
    orderValue,
    avgOrderValue,
    fulfilled,
    pending,
    onTimeDelivery,
    returnsRate,
    byStatus,
    byFulfillmentStatus,
    byPaymentStatus,
  };
}

export const orderKPIs = calculateOrderKPIs(orders);

// Helper functions
export function topCustomersByValue(orders: Order[]) {
  const m = new Map<string, number>();
  orders.forEach(o => m.set(o.customer_id, (m.get(o.customer_id) ?? 0) + o.total_ngn));
  return [...m.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
}

export function categoryContribution(lines: OrderLine[]) {
  const m = new Map<string, number>();
  lines.forEach(l => {
    const sku = skus.find(s => s.id === l.sku_id);
    const cat = sku?.category ?? "Other";
    m.set(cat, (m.get(cat) ?? 0) + l.line_value_ngn);
  });
  const total = [...m.values()].reduce((s,v)=>s+v,0) || 1;
  return [...m.entries()].map(([k,v]) => ({ name: k, value: v, pct: (v/total)*100 }));
}

export function ordersTrend(orders: Order[], days: number = 30) {
  const endDate = new Date();
  const _startDate = subDays(endDate, days);
  
  const trend = new Map<string, { orders: number; value: number }>();
  
  // Initialize all days
  for (let i = 0; i < days; i++) {
    const date = subDays(endDate, i);
    const dateStr = date.toISOString().split('T')[0];
    trend.set(dateStr, { orders: 0, value: 0 });
  }
  
  // Aggregate orders by date
  orders.forEach(order => {
    const orderDate = new Date(order.ordered_at).toISOString().split('T')[0];
    if (trend.has(orderDate)) {
      const current = trend.get(orderDate)!;
      trend.set(orderDate, {
        orders: current.orders + 1,
        value: current.value + order.total_ngn
      });
    }
  });
  
  return [...trend.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({ date, ...data }));
}

// Export reference data
export { skus, customers, users, regions, channels };
