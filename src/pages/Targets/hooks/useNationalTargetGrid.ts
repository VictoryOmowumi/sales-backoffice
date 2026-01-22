export type DimensionType =
  | "sku"
  | "brand"
  | "category"
  | "channel"
  | "weekly"
  | "daily";

export interface TargetDimensionColumn {
  id: string;
  type: DimensionType;
  refId?: string;
}

