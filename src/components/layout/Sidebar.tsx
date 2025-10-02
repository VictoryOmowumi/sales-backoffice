import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { nav, type NavItem } from "@/config/nav";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/store/sidebar";
import { useFullscreen } from "@/hooks/useFullscreen";
import { Badge } from "@/components/ui/badge";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import {  ChevronDown, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import { useFavorites } from "@/store/favorites";
import { Star } from "lucide-react";

import { ChevronsLeftIcon } from "../ui/ChevronsLeftIcon";
import { ChevronsRightIcon } from "../ui/ChevronsRightIcon";

function ItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;
  const { isFav, toggle } = useFavorites();
  return (
    <div className="relative group">
    <NavLink
      to={item.to!}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )
      }
      aria-current="page"
      title={collapsed ? item.label : undefined}
    >
      {Icon && <Icon className="size-5 shrink-0" strokeWidth={1.5} />}
      {!collapsed && <span className="truncate">{item.label}</span>}
      {item.badge && !collapsed && (
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
          {item.badge === "dot" ? (
            <span className="size-1.5 rounded-full bg-primary" />
          ) : (
            item.badge
          )}
        </Badge>
      )}
    </NavLink>
   {/* pin button */}
   {!collapsed && item.to && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden rounded p-1 text-muted-foreground hover:text-foreground group-hover:block"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item.to!); }}
          aria-label={isFav(item.to!) ? "Unpin from favorites" : "Pin to favorites"}
          title={isFav(item.to!) ? "Unpin" : "Pin"}
        >
          {isFav(item.to!) ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </button>
      )}
    </div>
  );
}

function Group({
  item,
  collapsed,
  activePath,
}: {
  item: NavItem;
  collapsed: boolean;
  activePath: string;
}) {
  const [open, setOpen] = useState(() =>
    (item.children ?? []).some((c) => c.to && (
      activePath === c.to || 
      activePath.startsWith(c.to + "/")
    ))
  );
  const Icon = item.icon;

  // Check if any child is active
  const hasActiveChild = (item.children ?? []).some(
    (child) => child.to && (
      activePath === child.to || 
      activePath.startsWith(child.to + "/")
    )
  ) || (
    // Check if current path matches the parent route pattern (for dynamic routes like /orders/:orderId)
    (item.children ?? []).some(child => {
      if (!child.to) return false;
      // Extract the parent route pattern (e.g., "/orders" from "/orders/overview")
      const parentRoute = child.to.split('/').slice(0, -1).join('/');
      return parentRoute && activePath.startsWith(parentRoute + "/");
    })
  );

  return (
    <div className="space-y-1">
      <button
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
          hasActiveChild
            ? "bg-primary/10 text-primary "
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
        onClick={() => setOpen((o) => !o)}
        title={collapsed ? item.label : undefined}
      >
        {Icon && <Icon className="size-5 shrink-0" strokeWidth={1.5} />}
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && (
          <ChevronDown
            className={cn(
              "ml-auto size-4 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        )}
      </button>
      <div
        className={cn(
          "relative space-y-1 mt-2 overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          collapsed ? "pl-4" : "pl-6"
        )}
      >
        {/* Trailing line - always visible when open */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-px",
            collapsed ? "left-1/2" : "left-6",
            hasActiveChild ? "bg-primary" : "bg-border"
          )}
        />

        {(item.children ?? []).map((child) =>
          child.children ? null : (
            <NavLink
              key={child.to}
              to={child.to!}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 relative",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {!collapsed && isActive && (
                    <div className="absolute left-0 top-1/2 w-3 h-px bg-gradient-to-r from-primary/60 to-primary rounded-full -translate-y-1/2" />
                  )}
                  {child.icon && (
                    <child.icon className="size-4 shrink-0" strokeWidth={1.5} />
                  )}
                  {!collapsed && (
                    <span className="truncate">{child.label}</span>
                  )}
                  {child.badge && !collapsed && (
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 px-1.5 text-xs"
                    >
                      {child.badge === "dot" ? (
                        <span className="size-1.5 rounded-full bg-primary" />
                      ) : (
                        child.badge
                      )}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          )
        )}
      </div>
    </div>
  );
}

function NavList({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const items = useMemo(
    () => nav.filter((i) => !i.roles || (user && i.roles.includes(user.role))),
    [user]
  );

  return (
    <div className="space-y-4">
      {items.map((item) =>
        item.children ? (
          <Group
            key={item.label}
            item={item}
            collapsed={collapsed}
            activePath={pathname}
          />
        ) : (
          <ItemLink key={item.to} item={item} collapsed={collapsed} />
        )
      )}
    </div>
  );
}

function FavoritesGroup({ collapsed }: { collapsed: boolean }) {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const allowed = useMemo(
    () => nav.filter((i) => !i.roles || (user && i.roles.includes(user.role))),
    [user]
  );

  // flatten & filter only pinned
  const leaves: NavItem[] = useMemo(() => {
    const out: NavItem[] = [];
    const walk = (i: NavItem) => {
      if (i.children?.length) i.children.forEach(walk);
      else if (i.to && favorites.includes(i.to)) out.push(i);
    };
    allowed.forEach(walk);
    return out;
  }, [allowed, favorites]);

  if (!leaves.length) return null;

  return (
    <div className="mb-2">
      {!collapsed && (
        <div className="flex items-center gap-2 px-4 pb-2 text-xs uppercase text-muted-foreground">
          <Star className="size-3.5" /> Favorites
        </div>
      )}
      <div className={collapsed ? "px-2 space-y-2" : "space-y-1"}>
        {leaves.map((i) => (
          <ItemLink key={i.to} item={i} collapsed={collapsed} />
        ))}
      </div>
      {!collapsed && <div className="my-2 h-px bg-border mx-4" />}
    </div>
  );
}

export function SidebarDesktop() {
  const { collapsed, setCollapsed } = useSidebar();
  const { isFullscreen } = useFullscreen();

  // Hide sidebar completely when in fullscreen
  if (isFullscreen) {
    return null;
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-background transition-[width] duration-200 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border mb-2">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg text-primary">
              SBC Sales
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-2"
          aria-label="Toggle sidebar"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRightIcon className="size-4" />
          ) : (
            <ChevronsLeftIcon className="size-4" />
          )}
        </button>
      </div>
    
      
      <nav className="flex-1 mx-1 my-2 overflow-y-auto no-scrollbar">
        <NavList collapsed={collapsed} />
      </nav>
       {/* Favorites */}
       <div className="mx-1 my-1 overflow-visible">
        <FavoritesGroup collapsed={collapsed} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {collapsed ? null : "© Seven-Up Bottling Company Ltd"}
        </div>
      </div>
    </aside>
  );
}

export function SidebarMobile() {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="p-0 w-72">
        <div className="p-4 font-display text-lg">SBC Sales</div>
        <nav className="p-3 space-y-1">
          <NavList collapsed={false} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
