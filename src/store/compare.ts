import { create } from "zustand";

export type CompareMode = "none" | "pp" | "ly";

type State = { mode: CompareMode; setMode: (m: CompareMode) => void };

export const useCompare = create<State>((set) => ({
  mode: "pp",
  setMode: (mode) => set({ mode }),
}));
