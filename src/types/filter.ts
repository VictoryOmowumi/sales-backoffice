export type SizeMode = "cases" | "value";

export type PeriodRange = {
  from: Date | string; // persisted as string; convert to Date when using
  to: Date | string;
};

export type FiltersState = {
  period: PeriodRange;          // Current Period (CP)
  comparePrev: boolean;         // Compare CP to Previous Period (PP)
  region?: string | null;
  channel?: string | null;
  brand?: string | null;
  size: SizeMode;
};
