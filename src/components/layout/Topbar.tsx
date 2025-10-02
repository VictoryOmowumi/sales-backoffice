import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useFullscreen } from "@/hooks/useFullscreen";
import {
  Sun,
  Moon,
  Menu,
  Search,
  Bell,
  User,
  HelpCircle,
  LogOut,
  ChevronRight,
  Fullscreen,
} from "lucide-react";
import { useSidebar } from "@/store/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { nav } from "@/config/nav";

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { setOpenMobile } = useSidebar();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  // Generate breadcrumb based on current pathname
  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems = [];

    // Always start with Home
    breadcrumbItems.push({ label: "Home", path: "/" });

    if (segments.length === 0) {
      return breadcrumbItems;
    }

    // Helper function to find parent group and default child route
    const findParentGroup = (items: typeof nav, targetPath: string) => {
      for (const item of items) {
        if (item.children) {
          // Check if any child matches the target path
          const matchingChild = item.children.find(child => 
            child.to === targetPath || targetPath.startsWith(child.to + "/")
          );
          if (matchingChild) {
            return {
              parent: item,
              defaultChild: item.children[0] // First child is usually the default
            };
          }
        }
      }
      return null;
    };

    // Helper function to find nav item by path
    const findNavItem = (items: typeof nav, path: string): typeof nav[0] | null => {
      for (const item of items) {
        if (item.to === path) {
          return item;
        }
        if (item.children) {
          const childItem = findNavItem(item.children, path);
          if (childItem) return childItem;
        }
      }
      return null;
    };

    // Build breadcrumb dynamically
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === segments.length - 1;

      // Check if this path exists in navigation
      const navItem = findNavItem(nav, currentPath);
      
      if (navItem) {
        // Path exists in navigation
        breadcrumbItems.push({ 
          label: navItem.label, 
          path: currentPath 
        });
      } else {
        // Path doesn't exist in navigation - might be a dynamic route or parent group
        const parentGroup = findParentGroup(nav, currentPath);
        
        if (parentGroup && !isLastSegment) {
          // This is a parent group without a direct route
          // Link to the default child route instead
          breadcrumbItems.push({ 
            label: parentGroup.parent.label, 
            path: parentGroup.defaultChild.to 
          });
        } else if (parentGroup && isLastSegment) {
          // This is a dynamic route under a parent group
          // Link parent to default child, current segment is not clickable
          breadcrumbItems.push({ 
            label: parentGroup.parent.label, 
            path: parentGroup.defaultChild.to 
          });
          breadcrumbItems.push({ 
            label: segment, 
            path: currentPath 
          });
        } else {
          // Fallback: use segment as label
          breadcrumbItems.push({ 
            label: segment.charAt(0).toUpperCase() + segment.slice(1), 
            path: currentPath 
          });
        }
      }
    });

    return breadcrumbItems;
  }, [pathname]);

  // Remove the old handleFullscreen function since we're using the hook now

  return (
    <TooltipProvider>
      <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left Section - Logo & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-accent"
                  onClick={() => setOpenMobile(true)}
                >
                  <Menu className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle sidebar</p>
              </TooltipContent>
            </Tooltip>

            {/* Breadcrumb Navigation */}
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              {breadcrumbs.map((item, index) => (
                <div key={item.path} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="size-4" />}
                  <button
                    onClick={() => navigate(item.path)}
                    className={`hover:text-foreground transition-colors ${
                      index === breadcrumbs.length - 1
                        ? "text-foreground font-medium cursor-default"
                        : "text-muted-foreground hover:text-foreground cursor-pointer"
                    }`}
                    disabled={index === breadcrumbs.length - 1}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search resources, services, and docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </form>
          </div>

          {/* Right Section - Utility Icons */}
          <div className="flex items-center gap-1">
            {/* Fullscreen */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent" onClick={toggleFullscreen}>
                  <Fullscreen className="size-4" strokeWidth={1.5} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hover:bg-accent"
                >
                  {theme === "dark" ? (
                    <Sun className="size-4" strokeWidth={1.5} />
                  ) : (
                    <Moon className="size-4" strokeWidth={1.5} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-accent"
                    >
                      <Bell className="size-4" strokeWidth={1.5} />
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm font-medium">
                          New order received
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          2m ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Order #12345 has been placed by John Doe
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium">
                          Payment successful
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          5m ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Payment of $299.99 has been processed
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span className="text-sm font-medium">
                          Low inventory alert
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          1h ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Product "Widget Pro" is running low on stock
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center text-primary">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-accent"
                    >
                      <HelpCircle className="size-4" strokeWidth={1.5} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span className="text-sm">Documentation</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="text-sm">Contact Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="text-sm">Feedback</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>

            {/* User Profile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-accent"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User
                          className="size-4 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="hidden sm:block text-sm font-medium">
                        {user?.name ?? "Guest"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <HelpCircle className="size-4 mr-2" />
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user && (
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-destructive"
                      >
                        <LogOut className="size-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>User menu</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
