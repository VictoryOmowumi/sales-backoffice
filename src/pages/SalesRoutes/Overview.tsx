import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Clock,
  Plus,
  Search,
  BarChart3,
  Play,
  Activity,
  UserCheck,
  Eye,
  FileText,
  Map,
  Maximize2,
  Minimize2,
  Users,
  X
} from "lucide-react";
import { seedRoutesData } from "@/data/routes.mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { RouteStatus } from "@/domain/routes";
import { useAuth } from "@/hooks/useAuth";
import RouteMap from "@/components/maps/RouteMap";
import { REGIONS_AND_TERRITORIES, getTerritoriesForRegion, getRegionForTerritory } from "@/config/regions";
const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};


export default function RoutesOverview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { routes, visits, analytics } = useMemo(() => seedRoutesData(), []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RouteStatus | "all">("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [territoryFilter, setTerritoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "map" | "analytics">("list");
  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Get unique territories and regions
  const territories = [...new Set(routes.map(r => r.territory))];
  const regions = Object.keys(REGIONS_AND_TERRITORIES);
  
  // Get available territories based on selected region
  const availableTerritories = regionFilter === "all" 
    ? territories 
    : getTerritoriesForRegion(regionFilter as keyof typeof REGIONS_AND_TERRITORIES).filter(t => territories.includes(t));

  // Filter routes
  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchesSearch = 
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.repName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.territory.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || route.status === statusFilter;
      const matchesTerritory = territoryFilter === "all" || route.territory === territoryFilter;
      
      // Check if route territory belongs to selected region
      const routeRegion = getRegionForTerritory(route.territory);
      const matchesRegion = regionFilter === "all" || routeRegion === regionFilter;
      
      return matchesSearch && matchesStatus && matchesTerritory && matchesRegion;
    });
  }, [routes, searchTerm, statusFilter, territoryFilter, regionFilter]);

  // Get route performance
  const getRoutePerformance = (routeId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const routeVisits = visits.filter(v => 
      v.routeId === routeId && 
      v.scheduledDate.startsWith(today)
    );
    
    const completedVisits = routeVisits.filter(v => v.status === "completed").length;
    const totalVisits = routeVisits.length;
    const totalOrders = routeVisits.reduce((sum, v) => sum + (v.orders?.length || 0), 0);
    
    return {
      completion: totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0,
      visits: totalVisits,
      orders: totalOrders
    };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleCreateRoute = () => {
    setShowCreateRoute(true);
  };

  const handleStartRoute = (routeId: string) => {
    toast({
      title: "Route Started",
      description: `Starting route execution for ${routeId}...`,
    });
  };

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMapFullscreen) {
        setIsMapFullscreen(false);
      }
    };

    if (isMapFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMapFullscreen]);

  const handleViewRoute = (routeId: string) => {
    navigate(`/routes/${routeId}`);
  };

  const isRSM = user?.role === "gtm" || user?.role === "executive";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Management</h1>
          <p className="text-muted-foreground">
            {isRSM 
              ? "Plan, optimize, and monitor sales routes for your team"
              : "Execute your assigned routes and manage customer visits"
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isRSM && (
            <Button onClick={handleCreateRoute}>
              <Plus className="h-4 w-4 mr-2" />
              Create Route
            </Button>
          )}
          <div className="flex items-center space-x-2 bg-card border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              Map
            </Button>
            {isRSM && (
              <Button
                variant={viewMode === "analytics" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("analytics")}
              >
                Analytics
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="px-6 py-2">
          <div className="flex items-center gap-4">
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RouteStatus | "all")} >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={(value) => {
              setRegionFilter(value);
              setTerritoryFilter("all"); // Reset territory when region changes
            }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={territoryFilter} 
              onValueChange={setTerritoryFilter}
              disabled={regionFilter !== "all" && availableTerritories.length === 0}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={
                  regionFilter === "all" ? "All Territories" : 
                  availableTerritories.length === 0 ? "No territories" : "Select Territory"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {regionFilter === "all" ? "All Territories" : "All in Region"}
                </SelectItem>
                {availableTerritories.map(territory => (
                  <SelectItem key={territory} value={territory}>{territory}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Found {filteredRoutes.length} routes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics View for RSM */}
      {viewMode === "analytics" && isRSM && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Route Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Routes</span>
                  <span className="font-semibold">{analytics.activeRoutes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Customers</span>
                  <span className="font-semibold">{analytics.totalCustomers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Completion</span>
                  <span className="font-semibold text-green-600">{analytics.averageCompletionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Reps</span>
                  <span className="font-semibold">{analytics.repPerformance.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Today's Visits</span>
                  <span className="font-semibold">{analytics.totalVisitsToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Issues</span>
                  <span className="font-semibold text-red-600">{analytics.pendingIssues}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Territory Coverage</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Covered Areas</span>
                  <span className="font-semibold">{analytics.territoryCoverage.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Distance</span>
                  <span className="font-semibold">{analytics.totalDistance.toFixed(1)} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Optimization Score</span>
                  <span className="font-semibold text-blue-600">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map View */}
      {viewMode === "map" && (
        <div className={cn(
          "transition-all duration-300",
          isMapFullscreen ? "fixed inset-0 z-50 bg-background backdrop-blur-sm" : ""
        )}>
          <Card className={cn(
            isMapFullscreen ? "h-full border-0 rounded-none" : ""
          )}>
            <CardHeader className={cn(
              isMapFullscreen ? "border-b" : ""
            )}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Route Map View
                  {isMapFullscreen && (
                    <span className="text-sm font-normal text-muted-foreground">
                      - {filteredRoutes.length} routes
                      {regionFilter !== "all" && ` in ${regionFilter}`}
                      {territoryFilter !== "all" && ` (${territoryFilter})`}
                    </span>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMapFullscreen}
                  className="flex items-center gap-2"
                >
                  {isMapFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      Fullscreen
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn(
              isMapFullscreen ? "flex-1 p-0" : ""
            )}>
              <div className={cn(
                isMapFullscreen ? "h-[calc(100vh-120px)]" : "h-screen"
              )}>
                <RouteMap 
                  routes={filteredRoutes} 
                  visits={visits}
                  role={user?.role || "sales"}
                  onStartVisit={(customerId) => {
                    toast({
                      title: "Visit Started",
                      description: `Starting visit for customer ${customerId}`,
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Route Table */}
      {viewMode === "list" && (
        <Card className="!pt-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50 text-sm uppercase">
                  <tr>
                    <th className="text-left p-4 font-medium">Route Name</th>
                    <th className="text-left p-4 font-medium">Territory</th>
                    <th className="text-left p-4 font-medium">Sales Rep</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Customers</th>
                    <th className="text-left p-4 font-medium">Duration</th>
                    <th className="text-left p-4 font-medium">Distance</th>
                    <th className="text-left p-4 font-medium">Completion</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => {
                    const performance = getRoutePerformance(route.id);
                    const isRSM = user?.role === "gtm" || user?.role === "executive";
                    
                    return (
                      <tr key={route.id} className="border-b hover:bg-muted/30 transition-colors text-sm">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{route.name}</div>
                            <div className="text-sm text-muted-foreground">{route.description}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{route.territory}</div>
                              <div className="text-xs text-muted-foreground">
                                {getRegionForTerritory(route.territory) || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                            <span>{route.repName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={cn("text-sm px-2 py-1", statusColors[route.status])}>
                            {route.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{route.customers.length}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDuration(route.estimatedDuration)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{route.totalDistance} km</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{performance.completion}%</span>
                            </div>
                            <Progress value={performance.completion} className="h-1.5 w-16" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewRoute(route.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {!isRSM && (
                              <Button
                                size="sm"
                                onClick={() => handleStartRoute(route.id)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredRoutes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">No routes found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
            {isRSM && (
              <Button onClick={handleCreateRoute}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Route
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Route Modal */}
      {showCreateRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Route</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateRoute(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Route Name</label>
                <Input placeholder="Enter route name..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Territory</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select territory..." />
                    </SelectTrigger>
                    <SelectContent>
                      {territories.map(territory => (
                        <SelectItem key={territory} value={territory}>{territory}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Visit Frequency</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Duration (hours)</label>
                <Input type="number" placeholder="8" />
              </div>
            </CardContent>
            <CardContent className="flex items-center justify-end space-x-3 pt-0">
              <Button
                variant="outline"
                onClick={() => setShowCreateRoute(false)}
              >
                Cancel
              </Button>
              <Button>
                Create Route
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
