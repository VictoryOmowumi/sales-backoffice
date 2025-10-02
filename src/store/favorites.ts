import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavState = {
  favorites: string[];                 // store `to` paths of leaf items
  toggle: (path: string) => void;
  isFav: (path: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (path) =>
        set((s) =>
          s.favorites.includes(path)
            ? { favorites: s.favorites.filter((p) => p !== path) }
            : { favorites: [...s.favorites, path] }
        ),
      isFav: (path) => get().favorites.includes(path),
      clear: () => set({ favorites: [] }),
    }),
    { name: "sbx_favorites" }
  )
);
