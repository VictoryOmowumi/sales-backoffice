import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FiltersState, PeriodRange, SizeMode } from "@/types/filters";
import { getDefaultPeriod, clampToToday } from "@/lib/period";

type View = { name: string; filters: FiltersState };

type FiltersStore = FiltersState & {
  setPeriod: (p: PeriodRange) => void;
  setComparePrev: (v: boolean) => void;
  setRegion: (v: string | null) => void;
  setChannel: (v: string | null) => void;
  setBrand: (v: string | null) => void;
  setSize: (v: SizeMode) => void;
  reset: () => void;

  views: View[];
  saveView: (name: string) => void;
  applyView: (name: string) => void;
  deleteView: (name: string) => void;
};

const initial: FiltersState = {
  period: getDefaultPeriod(),
  comparePrev: false,
  region: null,
  channel: null,
  brand: null,
  size: "cases",
};

export const useFilters = create<FiltersStore>()(
  persist(
    (set, get) => ({
      ...initial,

      setPeriod: (p) => set({ period: clampToToday(p) }),
      setComparePrev: (v) => set({ comparePrev: v }),
      setRegion: (v) => set({ region: v }),
      setChannel: (v) => set({ channel: v }),
      setBrand: (v) => set({ brand: v }),
      setSize: (v) => set({ size: v }),
      reset: () => set(initial),

      views: [],
      saveView: (name) => {
        const { views, ...filters } = get();
        const next: View = { name, filters: { ...filters } as FiltersState };
        set({ views: [next, ...views.filter(v => v.name !== name)] });
      },
      applyView: (name) => {
        const v = get().views.find(v => v.name === name);
        if (!v) return;
        set({ ...v.filters });
      },
      deleteView: (name) => set({ views: get().views.filter(v => v.name !== name) }),
    }),
    {
      name: "sbx_filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
