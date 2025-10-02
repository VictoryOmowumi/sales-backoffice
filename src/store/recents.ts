import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentItem = { path: string; label: string; ts: number };

type RecentsState = {
  recents: RecentItem[];
  push: (item: RecentItem) => void;
  clear: () => void;
};

export const useRecents = create<RecentsState>()(
  persist(
    (set, get) => ({
      recents: [],
      push: (item) => {
        const list = get().recents.filter((r) => r.path !== item.path);
        list.unshift(item);
        set({ recents: list.slice(0, 12) }); // keep last 12
      },
      clear: () => set({ recents: [] }),
    }),
    { name: "sbx_recents" }
  )
);
