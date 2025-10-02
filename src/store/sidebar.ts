import { create } from "zustand";

type SidebarState = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (v: boolean) => void;
};
export const useSidebar = create<SidebarState>((set) => ({
  collapsed: JSON.parse(localStorage.getItem("sbx_collapsed") || "false"),
  setCollapsed: (v) => { localStorage.setItem("sbx_collapsed", JSON.stringify(v)); set({ collapsed: v }); },
  openMobile: false,
  setOpenMobile: (v) => set({ openMobile: v }),
}));
