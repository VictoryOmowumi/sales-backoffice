import { useMemo } from "react";
import { useDirectFilters } from "@/store/filters.direct";
import { generateDirectDataset } from "@/data/direct.fake";

export function useDirectData() {
  const f = useDirectFilters();

  const data = useMemo(() => generateDirectDataset(f), [f.from, f.to, f.region, f.channel]);
  return { f, data };
}
