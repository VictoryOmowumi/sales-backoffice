import type { PropsWithChildren } from "react";

export const C1 = "var(--color-chart-1)";
export const C2 = "var(--color-chart-2)";
export const C3 = "var(--color-chart-3)";
export const POS = "oklch(0.65 0.20 150)"; // greenish
export const NEG = "oklch(0.62 0.19 27)";  // red-ish
export const GRID = "oklch(0.92 0 0)";

export function TooltipBox({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "6px 8px",
        background: "var(--card)",
      }}
    >
      {children}
    </div>
  );
}
