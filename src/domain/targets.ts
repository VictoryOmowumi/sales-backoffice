export type ID = string;

export type Region = { 
  id: ID; 
  name: "Abuja"|"Kano"|"Kaduna"|"Aba"|"Enugu"|"Benin"|"Ibadan"|"Ilorin"|"Ikeja" 
};

export type Channel = { 
  id: ID; 
  name: "Modern Trade"|"General Trade"|"HORECA"|"E-Commerce"|"Distributor" 
};

export type DealerType = { 
  id: ID; 
  name: "Key Distributor"|"Wholesaler"|"Retailer"|"Other" 
};

export type Category = "RGB"|"PET"|"Water"|"Energy";

export type Brand =
  | "Pepsi" | "Mirinda" | "Teem" | "Aquafina"
  | "Lipton Ice Tea" | "Supa Komando" | "Rockstar";

export type SKU = {
  id: ID;
  code: string;
  brand: Brand;
  category: Category;
  size_ml: number;
  pack_type: "Bottle (PET RB)"|"Bottle (Glass NRB)"|"Can";
  name: string; // e.g., "Pepsi PET 50cl"
};

export type UserRole = "Admin"|"RSM"|"TDM"|"TDE"|"SalesRep";

export type User = {
  id: ID;
  name: string;
  role: UserRole;
  region_id?: ID; // RSM/TDM usually tied to a region
  manager_id?: ID; // hierarchy
};

export type Customer = {
  id: ID;
  code: string;     // dealer code
  name: string;
  region_id: ID;
  channel_id: ID;
  dealer_type_id: ID;
  assigned_rep_id?: ID; // convenience for UI
};

export type PeriodKind = "Month"|"Quarter"|"FY";

export type Period = {
  id: ID;
  label: string;         // "2025-09"
  kind: PeriodKind;
  start_date: string;    // ISO
  end_date: string;      // ISO
};

export type BatchStatus = "draft"|"submitted"|"approved"|"rejected";

export type TargetBatch = {
  id: ID;
  period_id: ID;
  region_id?: ID;      // optional scope
  owner_user_id?: ID;  // who owns this batch (e.g., RSM)
  status: BatchStatus;
  note?: string;
  created_by: ID;
  created_at: string;  // ISO
};

export type UOM = "cases"|"units"|"litres"|"value"; // choose primary for input

export type TargetRow = {
  id: ID;
  batch_id: ID;
  period_id: ID;
  customer_id: ID;
  sku_id: ID;
  owner_user_id?: ID;        // rep/tdm/rsm responsible
  uom: UOM;
  target_qty: number;        // main input (e.g., cases)
  target_value_ngn?: number; // optional derived
};

// Extended types for UI
export type CustomerWithDetails = Customer & {
  region: Region;
  channel: Channel;
  dealerType: DealerType;
  assignedRep?: User;
};

export type TargetRowWithDetails = TargetRow & {
  customer: CustomerWithDetails;
  sku: SKU;
  owner?: User;
};

export type TargetBatchWithDetails = TargetBatch & {
  period: Period;
  region?: Region;
  owner?: User;
  rows: TargetRowWithDetails[];
};

// Grid data structure for the Excel-like interface
export type GridCell = {
  customerId: ID;
  skuId: ID;
  value: number;
  isEditable: boolean;
  hasError?: boolean;
  errorMessage?: string;
};

export type GridRow = {
  customer: CustomerWithDetails;
  cells: GridCell[];
  totals: {
    cases: number;
    value: number;
  };
};

export type GridColumn = {
  sku: SKU;
  totals: {
    cases: number;
    value: number;
  };
};

export type TargetGrid = {
  rows: GridRow[];
  columns: GridColumn[];
  grandTotals: {
    cases: number;
    value: number;
  };
};
