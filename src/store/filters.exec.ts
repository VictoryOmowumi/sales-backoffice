import { create } from "zustand";
import type { OrgChannelName, OrgRegionName } from "@/config/org";

export type ExecFilters = {
  from: string;  // YYYY-MM (inclusive)
  to: string;    // YYYY-MM (inclusive)
  region: "All" | OrgRegionName;
  channel: "All" | OrgChannelName;
  set: <K extends keyof ExecFilters>(k: K, v: ExecFilters[K]) => void;
};

export const useExecFilters = create<ExecFilters>((set) => ({
  from: "2025-03",
  to:   "2025-08",
  region: "All",
  channel: "All",
  set: (k, v) => set((s) => ({ ...s, [k]: v })),
}));
