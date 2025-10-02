import { useMemo } from "react";
import { homeUx } from "@/data/home.ux.mock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommandPalette from "@/components/command/CommandPalette";
import { useFavorites } from "@/store/favorites";
import { useRecents } from "@/store/recents";
import { nav } from "@/config/nav";
import { useAuth } from "@/hooks/useAuth";
import { useFilters } from "@/store/filters";
import {FileText, Users, Download, AlertTriangle, Clock, ShoppingCart, Megaphone, Tag} from "lucide-react";

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(v);

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium text-muted-foreground">{children}</div>;
}
function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-3 py-2 bg-card shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { period } = useFilters();
  const { favorites } = useFavorites();
  const { recents } = useRecents();

  // map favorites to nav info
  const favoriteItems = useMemo(() => {
    const leaves: { label: string; to: string }[] = [];
    const walk = (i: any) => { if (i.children?.length) i.children.forEach(walk); else if (i.to) leaves.push({ label: i.label, to: i.to }); };
    nav.forEach(walk);
    return leaves.filter((l) => favorites.includes(l.to));
  }, [favorites]);

  return (
    <div className="space-y-4">
      {/* Warm header */}
      <div className="rounded-2xl p-5 bg-[radial-gradient(1200px_400px_at_-100px_-200px,oklch(0.97_0_0),transparent)] dark:bg-[radial-gradient(1200px_400px_at_-100px_-200px,oklch(0.03_0_0),transparent)] border">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h1 className="font-semibold text-2xl">Good {greet()}, {user?.name ?? "there"} 👋</h1>
            <p className="text-sm text-muted-foreground">
              Your command center. Current period: <Badge variant="secondary" className="ml-1">{fmtPeriod(period)}</Badge>
            </p>
          </div>
        </div>

        {/* Search + Quick actions */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Card className="p-3 md:col-span-2 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-full"><CommandPalette /></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" className="rounded-xl" asChild><a href="/orders"><ShoppingCart className="mr-1 size-4" /> Orders</a></Button>
              <Button size="sm" variant="secondary" className="rounded-xl" asChild><a href="/customers"><Users className="mr-1 size-4" /> Customers</a></Button>
              <Button size="sm" variant="secondary" className="rounded-xl" asChild><a href="/campaigns"><Megaphone className="mr-1 size-4" /> Campaigns</a></Button>
              <Button size="sm" variant="secondary" className="rounded-xl" asChild><a href="/promotions"><Tag className="mr-1 size-4" /> Promotions</a></Button>
              <Button size="sm" variant="ghost" className="rounded-xl" asChild><a href="/reports/pivot"><FileText className="mr-1 size-4" /> Open Pivot</a></Button>
              <Button size="sm" variant="ghost" className="rounded-xl"><Download className="mr-1 size-4" /> Exec PDF</Button>
            </div>
          </Card>

          <Card className="p-3 rounded-2xl">
            <SectionTitle>My Day</SectionTitle>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <StatChip label="Revenue goal" value={fmtMoney(homeUx.myDay.goalRevenueNgn)} />
              <StatChip label="Visits" value={`${homeUx.myDay.goalVisits}`} />
              <StatChip label="Approvals" value={`${homeUx.approvals.length}`} />
            </div>
            <Separator className="my-3" />
            <div className="space-y-1">
              {homeUx.myDay.nextEvents.map((e) => (
                <div key={e.title} className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="tabular-nums w-14 text-muted-foreground">{e.time}</span>
                  <span className="truncate">{e.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Approvals */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionTitle>Approvals & Tasks</SectionTitle>
            <Button variant="ghost" size="sm" className="rounded-xl" asChild><a href="/tasks">View all</a></Button>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {homeUx.approvals.map((a) => (
              <a key={a.id} href={a.href} className="group rounded-xl border p-3 hover:bg-accent transition">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="rounded-lg capitalize">{a.type}</Badge>
                  {a.dueISO && <span>Due {new Date(a.dueISO).toLocaleString()}</span>}
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* Quick links column to replace old Data Health */}
        <Card className="p-4 rounded-2xl">
          <SectionTitle>Quick links</SectionTitle>
          <div className="mt-3 grid gap-2">
            <a className="rounded-xl border p-3 hover:bg-accent flex items-center gap-2" href="/orders">
              <ShoppingCart className="size-4" /> <span>Manage Orders</span>
            </a>
            <a className="rounded-xl border p-3 hover:bg-accent flex items-center gap-2" href="/customers">
              <Users className="size-4" /> <span>Manage Customers</span>
            </a>
            <a className="rounded-xl border p-3 hover:bg-accent flex items-center gap-2" href="/campaigns">
              <Megaphone className="size-4" /> <span>Campaigns</span>
            </a>
            <a className="rounded-xl border p-3 hover:bg-accent flex items-center gap-2" href="/promotions">
              <Tag className="size-4" /> <span>Promotions</span>
            </a>
          </div>
        </Card>
      </div>

      {/* Digest + Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionTitle>Since you were away</SectionTitle>
            <Button variant="ghost" size="sm" className="rounded-xl" asChild><a href="/dashboard/overview">Open Overview</a></Button>
          </div>
          <ul className="mt-2 space-y-2">
            {homeUx.sinceLastVisit.map((c) => (
              <li key={c.id} className="rounded-xl border p-3 bg-card">
                {c.href ? <a className="hover:underline" href={c.href}>{c.text}</a> : c.text}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 rounded-2xl">
          <SectionTitle>Alerts inbox</SectionTitle>
          <div className="mt-3 space-y-2">
            {homeUx.alerts.map((a) => (
              <a key={a.id} href={a.href} className="flex items-center gap-2 rounded-xl border p-3 hover:bg-accent">
                <SeverityIcon level={a.severity} />
                <span className="text-sm">{a.title}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* Favorites & Recents / Campaigns / Announce & Kudos */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <SectionTitle>Favorites & Recents</SectionTitle>
            <Button variant="ghost" size="sm" className="rounded-xl" asChild><a href="/settings/favorites">Manage</a></Button>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase text-muted-foreground mb-1">Favorites</div>
            {favoriteItems.length ? (
              <div className="grid gap-2">
                {favoriteItems.map((f) => (
                  <a key={f.to} href={f.to} className="rounded-xl border p-2 hover:bg-accent text-sm">{f.label}</a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Pin pages from the sidebar ★</div>
            )}
          </div>
          <Separator className="my-3" />
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-1">Recents</div>
            <div className="grid gap-2">
              {recents.slice(0, 3).map((r) => (
                <a key={r.path} href={r.path} className="rounded-xl border p-2 hover:bg-accent text-sm">
                  <span>{r.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {new Date(r.ts).toLocaleString()}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <SectionTitle>Campaigns & Promotions</SectionTitle>
          <div className="mt-3 space-y-3">
            {homeUx.campaigns.map((c) => (
              <a key={c.id} href={c.href} className="block rounded-xl border p-3 hover:bg-accent">
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-xs text-muted-foreground">Ends {new Date(c.endISO).toLocaleDateString()}</div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${c.progressPct}%` }} />
                </div>
              </a>
            ))}
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <SectionTitle>Announcements & Kudos</SectionTitle>
          <div className="mt-3 space-y-3">
            {homeUx.announcements.map((a) => (
              <a key={a.id} href={a.href} className="block rounded-xl border p-3 hover:bg-accent">
                <div className="text-sm">{a.title}</div>
              </a>
            ))}
            <Separator />
            <div className="space-y-2">
              {homeUx.kudos.map((k) => (
                <div key={k.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <Avatar className="size-8">
                    {k.avatarUrl ? <AvatarImage src={k.avatarUrl} /> : <AvatarFallback>{initials(k.person)}</AvatarFallback>}
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{k.person}</div>
                    <div className="text-muted-foreground">{k.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function greet() { const h = new Date().getHours(); if (h < 12) return "morning"; if (h < 17) return "afternoon"; return "evening"; }
function fmtPeriod(p: { from: Date | string; to: Date | string }) {
  const f = new Date(p.from); const t = new Date(p.to);
  const sameYear = f.getFullYear() === t.getFullYear();
  return `${f.toLocaleDateString(undefined,{month:"short",day:"numeric",year:sameYear?undefined:"numeric"})} → ${t.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}`;
}
function initials(name: string) { return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(); }
function SeverityIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "high") return <AlertTriangle className="size-4 text-red-600" />;
  if (level === "medium") return <AlertTriangle className="size-4 text-amber-600" />;
  return <AlertTriangle className="size-4 text-foreground/70" />;
}
