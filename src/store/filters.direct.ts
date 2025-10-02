import { create } from "zustand";

export type DirectFilters = {
  from: string; // "2024-08"
  to: string;   // "2025-07"
  region: "All" | "Abuja" | "Kano" | "Kaduna" | "Aba" | "Enugu" | "Benin" | "Ibadan" | "Ilorin" | "Ikeja";
  channel: "All" | "Modern Trade" | "General Trade" | "HORECA" | "E-Commerce";
};

type State = DirectFilters & {
  set<K extends keyof DirectFilters>(k: K, v: DirectFilters[K]): void;
  setMany(p: Partial<DirectFilters>): void;
  reset(): void;
};

const defaultFromTo = (): { from: string; to: string } => {
  const now = new Date();
  const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const fromD = new Date(now); fromD.setMonth(fromD.getMonth() - 11);
  const from = `${fromD.getFullYear()}-${String(fromD.getMonth() + 1).padStart(2, "0")}`;
  return { from, to };
};

export const useDirectFilters = create<State>((set) => ({
  ...defaultFromTo(),
  region: "All",
  channel: "All",
  set: (k, v) => set({ [k]: v } as Partial<DirectFilters>),
  setMany: (p) => set(p),
  reset: () => set({ ...defaultFromTo(), region: "All", channel: "All" }),
}));
