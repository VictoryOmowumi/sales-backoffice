import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
export { echarts }; // export for gradient helpers below

export default function EChart({ option, height = 400 }: { option: Record<string, unknown>; height?: number }) {
  return (
    <div style={{ width: "100%", height, overflow: "hidden" }}>
      <ReactECharts 
        option={option} 
        style={{ height, width: "100%" }} 
        notMerge={true} 
        lazyUpdate={true}
        opts={{ 
          renderer: 'canvas'
        }}
        onEvents={{
          // Prevent wheel events from affecting chart size
          wheel: (e: Event) => {
            e.stopPropagation();
          }
        }}
      />
    </div>
  );
}

export function cssVar(name: string, fallback = "#888") {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
export function withAlpha(hexOrOkLCH: string, alpha: number) {
  // If you use OKLCH in CSS, browsers resolve to rgb(...) in getComputedStyle.
  // We trust ECharts to accept rgba(...) fine. Here we simply append alpha if color is rgb(a).
  if (hexOrOkLCH.startsWith("rgb")) return hexOrOkLCH.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  // naive hex → rgba
  const hex = hexOrOkLCH.replace("#", "");
  const bigint = parseInt(hex.length === 3 ? hex.split("").map(h=>h+h).join("") : hex, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
