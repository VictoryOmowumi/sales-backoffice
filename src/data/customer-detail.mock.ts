import { faker } from "@faker-js/faker";
import type { Customer, OrderSummary, Payment, ReturnClaim, Visit, ActivityItem } from "@/domain/customer-detail";

function id() {
  return faker.string.uuid();
}

export function generateCustomerDetail(customerId: string): Customer {
  const regions = ["Abuja", "Kano", "Kaduna", "Aba", "Enugu", "Benin", "Ibadan", "Ilorin", "Ikeja"];
  const channels = ["ModernTrade", "GeneralTrade", "HORECA", "ECom"];
  const statuses = ["Active", "OnHold", "Inactive"];
  const paymentTerms = ["Prepaid", "COD", "Net7", "Net14", "Net30"];
  
  const region = faker.helpers.arrayElement(regions);
  const channel = faker.helpers.arrayElement(channels);
  const status = faker.helpers.arrayElement(statuses);
  const paymentTerm = faker.helpers.arrayElement(paymentTerms);
  
  // Generate revenue trend for last 12 months
  const revenueTrend = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      actual: faker.number.int({ min: 500000, max: 2000000 }),
      target: faker.number.int({ min: 600000, max: 1800000 })
    };
  });

  return {
    id: customerId,
    code: `CUST-${faker.string.alphanumeric(6).toUpperCase()}`,
    name: faker.company.name(),
    status: status as Customer["status"],
    channel: channel as Customer["channel"],
    segment: faker.helpers.arrayElement(["Premium", "Standard", "Basic"]),
    region: region as Customer["region"],
    route: faker.helpers.arrayElement(["Route A", "Route B", "Route C", "Route D"]),
    address: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    },
    contacts: [
      {
        role: "Primary",
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email()
      },
      {
        role: "Finance",
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email()
      },
      {
        role: "Receiving",
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email()
      }
    ],
    paymentTerms: paymentTerm as Customer["paymentTerms"],
    priceTier: faker.helpers.arrayElement(["Tier 1", "Tier 2", "Tier 3"]),
    owner: {
      repId: faker.string.uuid(),
      repName: faker.person.fullName(),
      tdm: faker.person.fullName(),
      rsm: faker.person.fullName()
    },
    credit: {
      limit: faker.number.int({ min: 1000000, max: 10000000 }),
      exposure: faker.number.int({ min: 0, max: 5000000 }),
      aging: {
        b0_30: faker.number.int({ min: 0, max: 2000000 }),
        b31_60: faker.number.int({ min: 0, max: 1500000 }),
        b61_90: faker.number.int({ min: 0, max: 1000000 }),
        b90p: faker.number.int({ min: 0, max: 500000 })
      },
      dsoDays: faker.number.int({ min: 15, max: 60 }),
      holds: faker.helpers.maybe(() => [
        {
          id: id(),
          reason: "Credit limit exceeded",
          createdAt: faker.date.recent().toISOString(),
          by: faker.person.fullName(),
          active: true
        }
      ], { probability: 0.3 }) || []
    },
    kpis: {
      last90dRevenue: faker.number.int({ min: 2000000, max: 15000000 }),
      ytdRevenue: faker.number.int({ min: 8000000, max: 50000000 }),
      ordersCount90d: faker.number.int({ min: 10, max: 100 }),
      aov: faker.number.int({ min: 50000, max: 500000 }),
      fillRatePct: faker.number.float({ min: 85, max: 100, fractionDigits: 1 }),
      onTimePct: faker.number.float({ min: 80, max: 100, fractionDigits: 1 }),
      priceCompliancePct: faker.number.float({ min: 90, max: 100, fractionDigits: 1 }),
      returnRatePct: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      visitCompliancePct: faker.number.float({ min: 70, max: 100, fractionDigits: 1 })
    },
    revenueTrend
  };
}

export function generateCustomerOrders(_customerId: string, count: number = 20): OrderSummary[] {
  const statuses = ["Pending", "Approved", "Shipped", "Delivered", "Invoiced", "Cancelled", "Returned"];
  
  return Array.from({ length: count }, () => ({
    id: id(),
    number: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
    date: faker.date.recent({ days: 90 }).toISOString(),
    status: faker.helpers.arrayElement(statuses) as OrderSummary["status"],
    cases: faker.number.int({ min: 5, max: 200 }),
    lines: faker.number.int({ min: 1, max: 15 }),
    value: faker.number.int({ min: 50000, max: 2000000 }),
    fillRatePct: faker.number.float({ min: 80, max: 100, fractionDigits: 1 }),
    onTime: faker.datatype.boolean()
  }));
}

export function generateCustomerPayments(_customerId: string, count: number = 15): Payment[] {
  const methods = ["BankTransfer", "POS", "Cash", "Gateway"];
  const providers = ["Zenith", "Access", "GTB", "Paystack", "Flutterwave"];
  
  return Array.from({ length: count }, () => ({
    id: id(),
    receiptNo: `RCP-${faker.string.alphanumeric(8).toUpperCase()}`,
    date: faker.date.recent({ days: 60 }).toISOString(),
    method: faker.helpers.arrayElement(methods) as Payment["method"],
    provider: faker.helpers.arrayElement(providers),
    amount: faker.number.int({ min: 10000, max: 1000000 }),
    success: faker.datatype.boolean({ probability: 0.9 }),
    reference: faker.string.alphanumeric(12).toUpperCase(),
    appliedTo: [
      {
        invoiceNo: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
        amount: faker.number.int({ min: 10000, max: 1000000 })
      }
    ]
  }));
}

export function generateCustomerReturns(_customerId: string, count: number = 8): ReturnClaim[] {
  const statuses = ["Pending", "Approved", "Rejected", "InTransit", "Credited"];
  const reasons = ["Damaged", "Expired", "WrongItem", "Shortdated", "Other"];
  
  return Array.from({ length: count }, () => ({
    id: id(),
    date: faker.date.recent({ days: 30 }).toISOString(),
    status: faker.helpers.arrayElement(statuses) as ReturnClaim["status"],
    reason: faker.helpers.arrayElement(reasons) as ReturnClaim["reason"],
    items: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      sku: faker.string.alphanumeric(8).toUpperCase(),
      name: faker.commerce.productName(),
      qty: faker.number.int({ min: 1, max: 10 })
    })),
    creditNoteNo: faker.helpers.maybe(() => `CN-${faker.string.alphanumeric(8).toUpperCase()}`, { probability: 0.6 })
  }));
}

export function generateCustomerVisits(_customerId: string, count: number = 12): Visit[] {
  const statuses = ["Planned", "Completed", "Missed", "Cancelled"];
  
  return Array.from({ length: count }, () => ({
    id: id(),
    plannedAt: faker.date.recent({ days: 30 }).toISOString(),
    completedAt: faker.helpers.maybe(() => faker.date.recent({ days: 30 }).toISOString(), { probability: 0.7 }),
    status: faker.helpers.arrayElement(statuses) as Visit["status"],
    repId: faker.string.uuid(),
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 }),
    checklist: faker.helpers.maybe(() => [
      { key: "Stock Check", ok: faker.datatype.boolean() },
      { key: "Payment Collection", ok: faker.datatype.boolean() },
      { key: "Order Taking", ok: faker.datatype.boolean() }
    ], { probability: 0.5 })
  }));
}

export function generateCustomerActivity(_customerId: string, count: number = 25): ActivityItem[] {
  const types = ["order", "payment", "claim", "credit", "note", "document"];
  
  return Array.from({ length: count }, () => ({
    id: id(),
    type: faker.helpers.arrayElement(types) as ActivityItem["type"],
    date: faker.date.recent({ days: 60 }).toISOString(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
    user: faker.person.fullName(),
    metadata: {
      orderNumber: faker.helpers.maybe(() => `ORD-${faker.string.alphanumeric(8)}`, { probability: 0.3 }),
      amount: faker.helpers.maybe(() => faker.number.int({ min: 10000, max: 1000000 }), { probability: 0.4 })
    }
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
