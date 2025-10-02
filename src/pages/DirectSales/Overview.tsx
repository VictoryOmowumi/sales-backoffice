import { Outlet, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const tabs = [
  { to: "/direct/overview/performance", label: "Performance Overview" },
  { to: "/direct/overview/brand",       label: "Brand Overview" },
  { to: "/direct/overview/location",    label: "Location Overview" },
  { to: "/direct/overview/group",       label: "Group Overview" },
];

export default function DirectSalesOverview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Direct Overview</h1>
          <p className="text-sm text-muted-foreground">Performance insights across channels, brands, and regions</p>
        </div>
      </div>

      <Card className="rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-3 py-1.5 text-sm transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-foreground hover:bg-accent"
                )
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>
      </Card>

      <Outlet />
    </div>
  );
}
