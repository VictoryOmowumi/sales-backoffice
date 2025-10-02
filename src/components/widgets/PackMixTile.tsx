import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { TooltipBox } from "@/components/charts/Primitives";

type MixItem = { name: "RGB" | "PET" | "Water" | "Energy"; value: number };
export default function PackMixTile({
  mix, priceCompliancePct
}:{ mix: MixItem[]; priceCompliancePct: number }) {
  // Modern gradient colors with better contrast
  const COLORS = [
    "url(#gradient1)", 
    "url(#gradient2)", 
    "url(#gradient3)", 
    "url(#gradient4)", 
  ];
  
  const pct = Math.max(0, Math.min(100, priceCompliancePct));
  
  return (
    <Card className="rounded-2xl p-5 border bg-gradient-to-br from-background to-muted/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <svg className="size-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold">Pack Mix & Price Compliance</div>
          <div className="text-xs text-muted-foreground">Product distribution & pricing</div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Define gradients for modern look */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                </linearGradient>
              </defs>
              
              <Pie 
                data={mix} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={45} 
                outerRadius={75} 
                strokeWidth={3}
                stroke="white"
                paddingAngle={2}
              >
                {mix.map((_, i) => (
                  <Cell 
                    key={i} 
                    fill={COLORS[i % COLORS.length]} 
                    strokeWidth={2}
                    stroke="white"
                  />
                ))}
              </Pie>
              
              {/* Center text */}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-medium fill-foreground">
                Total
              </text>
              
              <Tooltip 
                content={({payload}) => (
                  <TooltipBox>
                    <div className="text-sm font-medium">
                      {payload?.[0]?.name}: {payload?.[0]?.value}%
                    </div>
                  </TooltipBox>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom legend with better styling */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {mix.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-2">Price Compliance</div>
            <div className="relative">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ 
                    width: `${pct}%`, 
                    background: pct >= 97 
                      ? "linear-gradient(90deg, #10b981, #059669)" 
                      : pct >= 92 
                      ? "linear-gradient(90deg, #f59e0b, #d97706)" 
                      : "linear-gradient(90deg, #ef4444, #dc2626)"
                  }} 
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-white drop-shadow-sm">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: ≥97% • Current: {pct.toFixed(1)}%
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              pct >= 97 ? 'bg-green-500' : pct >= 92 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs font-medium">
              {pct >= 97 ? 'Excellent' : pct >= 92 ? 'Good' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
