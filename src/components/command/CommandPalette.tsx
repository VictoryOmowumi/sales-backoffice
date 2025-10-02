import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem,
  CommandList, CommandSeparator,
} from "@/components/ui/command";
import { nav, type NavItem } from "@/config/nav";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/store/favorites";
import { useRecents } from "@/store/recents";
import { useFilters } from "@/store/filters";
import { ShoppingCart, Users, Megaphone, Tag, Upload, FileText, Search, Sparkles, Star, Bookmark, BookmarkCheck, Command as CommandIcon } from "lucide-react";
import { cn } from "@/lib/utils";


function flattenLeaves(items: NavItem[]): NavItem[] {
  const out: NavItem[] = [];
  const walk = (i: NavItem) => {
    if (i.children?.length) i.children.forEach(walk);
    else if (i.to) out.push(i);
  };
  items.forEach(walk);
  return out;
}

/** ----- Quick actions (not just nav) ----- */
type CmdAction = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  run: (go: (to: string) => void) => void;
  keywords?: string[];
};

const ACTIONS: CmdAction[] = [
  { id: "go-orders",     label: "Open Orders",     icon: ShoppingCart, run: (go) => go("/orders") },
  { id: "go-customers",  label: "Open Customers",  icon: Users,        run: (go) => go("/customers") },
  { id: "go-campaigns",  label: "Manage Campaigns",icon: Megaphone,    run: (go) => go("/campaigns") },
  { id: "go-promos",     label: "Manage Promotions",icon: Tag,         run: (go) => go("/promotions") },
  { id: "upload-sales",  label: "Upload Sales Data",icon: Upload,      run: (go) => go("/data-import") },
  { id: "open-pivot",    label: "Open Pivot Grid", icon: FileText,     run: (go) => go("/reports/pivot") },
];

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const go = (to: string) => { setOpen(false); navigate(to); };

  const { user } = useAuth();
  const { favorites, toggle, isFav } = useFavorites();
  const { recents } = useRecents();
  const { views, applyView } = useFilters();

  // role-filtered nav leaves
  const allowed = React.useMemo(
    () => nav.filter((i) => !i.roles || (user && i.roles.includes(user.role))),
    [user]
  );
  const leaves = React.useMemo(() => flattenLeaves(allowed), [allowed]);
  const favLeaves = React.useMemo(
    () => leaves.filter((l) => l.to && favorites.includes(l.to)),
    [leaves, favorites]
  );

  // ⌘K / Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-lg border px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Open command palette"
      >
        <Search className="size-4" />
        <span className="hidden md:inline">Search pages, actions & views…</span>
        <kbd className="ml-auto hidden  rounded bg-muted px-1.5 py-1  text-muted-foreground font-semibold uppercase md:flex items-center gap-1">
          <CommandIcon className="size-4" />
          K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} className="w-7xl h-[90vh]">
        <CommandInput placeholder="Type a page, action, or view…" />
        <CommandList className="max-h-[80vh] overflow-y-auto w-full">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Quick Actions */}
          <CommandGroup heading="Quick actions">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.id} value={`${a.label} ${a.keywords?.join(" ") ?? ""}`} onSelect={() => a.run(go)}>
                  <Icon className="mr-2 size-4" />
                  <span>{a.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          {/* Favorites */}
          {!!favLeaves.length && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Favorites">
                {favLeaves.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem key={`fav-${item.to}`} value={item.label} onSelect={() => go(item.to!)}>
                      {Icon && <Icon className="mr-2 size-4" />}
                      <span>{item.label}</span>
                      <Star className="ml-auto size-4 text-primary" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {/* Recents */}
          {!!recents.length && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent pages">
                {recents.map((r) => (
                  <CommandItem key={r.path} value={`${r.label} ${r.path}`} onSelect={() => go(r.path)}>
                    <Sparkles className="mr-2 size-4" />
                    <span>{r.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(r.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Saved Views */}
          {!!views.length && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Saved views">
                {views.map((v: { name: string; filters: any }) => (
                  <CommandItem key={v.name} value={v.name} onSelect={() => { applyView(v.name); setOpen(false); }}>
                    <Tag className="mr-2 size-4" />
                    <span>{v.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* All Pages */}
          <CommandSeparator />
          <CommandGroup heading="All pages">
            {leaves.map((item) => {
              const Icon = item.icon;
              const fav = isFav(item.to!);
              return (
                <CommandItem key={item.to} value={item.label} onSelect={() => go(item.to!)}>
                  {Icon && <Icon className="mr-2 size-4" />}
                  <span>{item.label}</span>
                  <button
                    className={cn(
                      "ml-auto inline-flex items-center rounded px-1.5 py-0.5 text-xs",
                      fav ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => { e.stopPropagation(); toggle(item.to!); }}
                    title={fav ? "Unpin" : "Pin to favorites"}
                    aria-label={fav ? "Unpin" : "Pin"}
                  >
                    {fav ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                  </button>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
