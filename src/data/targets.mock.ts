import { faker } from "@faker-js/faker";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import type {
  Region, Channel, DealerType, SKU, User, Customer, Period, TargetBatch, TargetRow, Category, Brand,
  CustomerWithDetails, TargetRowWithDetails, TargetBatchWithDetails, TargetGrid, GridRow, GridColumn, GridCell,
  ID
} from "@/domain/targets";

faker.seed(77);

const REGIONS: Region["name"][] = ["Abuja","Kano","Kaduna","Aba","Enugu","Benin","Ibadan","Ilorin","Ikeja"];
const CHANNELS: Channel["name"][] = ["Modern Trade","General Trade","HORECA","E-Commerce","Distributor"];
const DEALER_TYPES: DealerType["name"][] = ["Key Distributor","Wholesaler","Retailer","Other"];

const SKUS: Array<{brand: Brand; category: Category; size_ml: number; pack_type: SKU["pack_type"]}> = [
  // RGB (glass + cans)
  { brand: "Pepsi",   category: "RGB",   size_ml: 300, pack_type: "Bottle (Glass NRB)" },
  { brand: "Mirinda", category: "RGB",   size_ml: 300, pack_type: "Bottle (Glass NRB)" },
  { brand: "Teem",    category: "RGB",   size_ml: 300, pack_type: "Bottle (Glass NRB)" },
  { brand: "Pepsi",   category: "RGB",   size_ml: 350, pack_type: "Can" },
  { brand: "Mirinda", category: "RGB",   size_ml: 350, pack_type: "Can" },

  // PET
  { brand: "Pepsi",   category: "PET",   size_ml: 500,  pack_type: "Bottle (PET RB)" },
  { brand: "Pepsi",   category: "PET",   size_ml: 1500, pack_type: "Bottle (PET RB)" },
  { brand: "Mirinda", category: "PET",   size_ml: 500,  pack_type: "Bottle (PET RB)" },
  { brand: "Lipton Ice Tea", category: "PET", size_ml: 500, pack_type: "Bottle (PET RB)" },

  // Water
  { brand: "Aquafina", category: "Water", size_ml: 500,  pack_type: "Bottle (PET RB)" },
  { brand: "Aquafina", category: "Water", size_ml: 1500, pack_type: "Bottle (PET RB)" },

  // Energy
  { brand: "Supa Komando", category: "Energy", size_ml: 500, pack_type: "Can" },
  { brand: "Rockstar",     category: "Energy", size_ml: 500, pack_type: "Can" },
];

function id() { return faker.string.uuid(); }

function buildRefs() {
  const regions: Region[] = REGIONS.map((name) => ({ id: id(), name: name as Region["name"] }));
  const channels: Channel[] = CHANNELS.map((name) => ({ id: id(), name: name as Channel["name"] }));
  const dealerTypes: DealerType[] = DEALER_TYPES.map((name) => ({ id: id(), name: name as DealerType["name"] }));

  const skus: SKU[] = SKUS.map((s) => {
    const code = `${s.brand.split(" ").join("").slice(0,3).toUpperCase()}-${s.category}-${s.size_ml}${s.pack_type.includes("Can")?"C":"B"}`;
    return {
      id: id(),
      code,
      brand: s.brand,
      category: s.category,
      size_ml: s.size_ml,
      pack_type: s.pack_type,
      name: `${s.brand} ${s.category} ${s.size_ml/10/10}cl ${s.pack_type.includes("Can") ? "Can" : "Bottle"}`,
    };
  });

  return { regions, channels, dealerTypes, skus };
}

function buildOrg(regions: Region[]) {
  // 1 RSM per region, 2 TDM per region, 4 reps per region
  const users: User[] = [];
  const rsms: Record<string, User> = {};
  const repsByRegion: Record<string, User[]> = {};

  regions.forEach((r) => {
    const rsm: User = { id: id(), name: `${r.name} RSM`, role: "RSM", region_id: r.id };
    users.push(rsm);
    rsms[r.id] = rsm;

    const tdmA: User = { id: id(), name: `${r.name} TDM A`, role: "TDM", region_id: r.id, manager_id: rsm.id };
    const tdmB: User = { id: id(), name: `${r.name} TDM B`, role: "TDM", region_id: r.id, manager_id: rsm.id };
    users.push(tdmA, tdmB);

    const reps: User[] = Array.from({ length: 4 }).map((_, i) => ({
      id: id(),
      name: `${r.name} Rep ${i+1}`,
      role: "SalesRep",
      region_id: r.id,
      manager_id: faker.helpers.arrayElement([tdmA.id, tdmB.id]),
    }));
    users.push(...reps);
    repsByRegion[r.id] = reps;
  });

  return { users, rsms, repsByRegion };
}

function buildCustomers(regions: Region[], channels: Channel[], dealerTypes: DealerType[], repsByRegion: Record<string, User[]>) {
  const customers: Customer[] = [];

  regions.forEach((r) => {
    const reps = repsByRegion[r.id];
    const n = faker.number.int({ min: 1, max: 5 }); // customers per region

    for (let i=0; i<n; i++) {
      const ch = faker.helpers.arrayElement(channels);
      const dt = faker.helpers.arrayElement(dealerTypes);
      const rep = faker.helpers.arrayElement(reps);
      customers.push({
        id: id(),
        code: `${r.name.slice(0,3).toUpperCase()}-${String(i+1).padStart(4,"0")}`,
        name: `${faker.company.name()} ${r.name}`,
        region_id: r.id,
        channel_id: ch.id,
        dealer_type_id: dt.id,
        assigned_rep_id: rep.id,
      });
    }
  });

  return customers;
}

function buildPeriods(monthsBack = 2, monthsFwd = 1): Period[] {
  const now = startOfMonth(new Date());
  const start = addMonths(now, -monthsBack);
  const end = addMonths(now, monthsFwd);
  const out: Period[] = [];
  for (let d = start; d <= end; d = addMonths(d, 1)) {
    out.push({
      id: id(),
      label: format(d, "yyyy-MM"),
      kind: "Month",
      start_date: startOfMonth(d).toISOString(),
      end_date: endOfMonth(d).toISOString(),
    });
  }
  return out;
}

// Simple price model per SKU
export function pricePerCase(sku: SKU): number {
  const base: Record<Category, number> = { RGB: 3600, PET: 4200, Water: 2200, Energy: 8400 };
  const sizeFactor = sku.size_ml >= 1500 ? 2.1 : sku.size_ml >= 500 ? 1.0 : 0.8;
  const packFactor = sku.pack_type.includes("Can") ? 1.25 : 1.0;
  return Math.round(base[sku.category] * sizeFactor * packFactor);
}

export function seedTargets() {
  const refs = buildRefs();
  const { users, rsms, repsByRegion } = buildOrg(refs.regions);
  const customers = buildCustomers(refs.regions, refs.channels, refs.dealerTypes, repsByRegion);
  const periods = buildPeriods(5, 0); // last 6 months including current

  // Build one batch per region for current period
  const currentPeriod = periods[periods.length - 1];
  const batches: TargetBatch[] = refs.regions.map((r) => ({
    id: id(),
    period_id: currentPeriod.id,
    region_id: r.id,
    owner_user_id: rsms[r.id].id,
    status: "draft",
    created_by: rsms[r.id].id,
    created_at: new Date().toISOString(),
    note: `Auto-seeded targets for ${r.name} ${currentPeriod.label}`,
  }));

  // Target rows: for each batch/region, pick ~12 SKUs × subset of customers and assign case targets
  const rows: TargetRow[] = [];

  for (const batch of batches) {
    const regionCustomers = customers.filter(c => c.region_id === batch.region_id);

    // choose a subset of SKUs to keep volume reasonable
    const skus = faker.helpers.arrayElements(refs.skus, 10 + faker.number.int({ min:0, max:4 }));

    regionCustomers.forEach((cust) => {
      const repId = cust.assigned_rep_id;
      const channelBias =
        cust.channel_id === refs.channels.find(c=>c.name==="Distributor")?.id ? 1.2 :
        cust.channel_id === refs.channels.find(c=>c.name==="HORECA")?.id ? 0.85 : 1.0;

      skus.forEach((sku) => {
        // randomize sparsity (not every customer gets every SKU)
        if (faker.number.float() < 0.55) return;

        const baseCases =
          faker.number.float({ min: 4, max: 60 }) *
          channelBias *
          (sku.category === "Water" ? 1.3 : 1.0) *
          (sku.category === "Energy" ? 0.7 : 1.0);

        const cases = Math.round(baseCases);
        if (cases <= 0) return;

        const value = cases * pricePerCase(sku) * faker.number.float({ min: 0.96, max: 1.04 });

        rows.push({
          id: id(),
          batch_id: batch.id,
          period_id: batch.period_id,
          customer_id: cust.id,
          sku_id: sku.id,
          owner_user_id: repId,
          uom: "cases",
          target_qty: cases,
          target_value_ngn: Math.round(value),
        });
      });
    });
  }

  return {
    regions: refs.regions,
    channels: refs.channels,
    dealerTypes: refs.dealerTypes,
    skus: refs.skus,
    users,
    customers,
    periods,
    batches,
    rows,
  };
}

// Helper functions to build extended data structures
export function buildCustomerWithDetails(
  customer: Customer,
  regions: Region[],
  channels: Channel[],
  dealerTypes: DealerType[],
  users: User[]
): CustomerWithDetails {
  return {
    ...customer,
    region: regions.find(r => r.id === customer.region_id)!,
    channel: channels.find(c => c.id === customer.channel_id)!,
    dealerType: dealerTypes.find(dt => dt.id === customer.dealer_type_id)!,
    assignedRep: customer.assigned_rep_id ? users.find(u => u.id === customer.assigned_rep_id) : undefined,
  };
}

export function buildTargetRowWithDetails(
  row: TargetRow,
  customers: CustomerWithDetails[],
  skus: SKU[],
  users: User[]
): TargetRowWithDetails {
  return {
    ...row,
    customer: customers.find(c => c.id === row.customer_id)!,
    sku: skus.find(s => s.id === row.sku_id)!,
    owner: row.owner_user_id ? users.find(u => u.id === row.owner_user_id) : undefined,
  };
}

export function buildTargetBatchWithDetails(
  batch: TargetBatch,
  periods: Period[],
  regions: Region[],
  users: User[],
  rows: TargetRowWithDetails[]
): TargetBatchWithDetails {
  return {
    ...batch,
    period: periods.find(p => p.id === batch.period_id)!,
    region: batch.region_id ? regions.find(r => r.id === batch.region_id) : undefined,
    owner: batch.owner_user_id ? users.find(u => u.id === batch.owner_user_id) : undefined,
    rows: rows.filter(r => r.batch_id === batch.id),
  };
}

// Build grid data structure for Excel-like interface
export function buildTargetGrid(
  customers: CustomerWithDetails[],
  skus: SKU[],
  rows: TargetRowWithDetails[],
  selectedRegion?: ID,
  selectedChannel?: ID
): TargetGrid {
  // Filter customers based on selection
  let filteredCustomers = customers;
  if (selectedRegion) {
    filteredCustomers = filteredCustomers.filter(c => c.region_id === selectedRegion);
  }
  if (selectedChannel) {
    filteredCustomers = filteredCustomers.filter(c => c.channel_id === selectedChannel);
  }

  // Build grid rows
  const gridRows: GridRow[] = filteredCustomers.map(customer => {
    const cells: GridCell[] = skus.map(sku => {
      const row = rows.find(r => r.customer_id === customer.id && r.sku_id === sku.id);
      return {
        customerId: customer.id,
        skuId: sku.id,
        value: row?.target_qty || 0,
        isEditable: true,
        hasError: false,
      };
    });

    const totals = {
      cases: cells.reduce((sum, cell) => sum + cell.value, 0),
      value: cells.reduce((sum, cell) => {
        const sku = skus.find(s => s.id === cell.skuId);
        return sum + (cell.value * (sku ? pricePerCase(sku) : 0));
      }, 0),
    };

    return {
      customer,
      cells,
      totals,
    };
  });

  // Build grid columns
  const gridColumns: GridColumn[] = skus.map(sku => {
    const totals = {
      cases: gridRows.reduce((sum, row) => {
        const cell = row.cells.find(c => c.skuId === sku.id);
        return sum + (cell?.value || 0);
      }, 0),
      value: gridRows.reduce((sum, row) => {
        const cell = row.cells.find(c => c.skuId === sku.id);
        return sum + ((cell?.value || 0) * pricePerCase(sku));
      }, 0),
    };

    return {
      sku,
      totals,
    };
  });

  // Calculate grand totals
  const grandTotals = {
    cases: gridRows.reduce((sum, row) => sum + row.totals.cases, 0),
    value: gridRows.reduce((sum, row) => sum + row.totals.value, 0),
  };

  return {
    rows: gridRows,
    columns: gridColumns,
    grandTotals,
  };
}

// Export the seeded data
export const targetsData = seedTargets();
