import { twMerge } from "tailwind-merge";
export function cn(...cls: Array<string | false | null | undefined>) {
  return twMerge(cls.filter(Boolean).join(" "));
}
