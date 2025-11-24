import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  MapPin,
  Users,
  Target,
  Activity,
  Navigation
} from "lucide-react";
import { seedRoutesData } from "@/data/routes.mock";
import { cn } from "@/lib/utils";

export default function RoutesAnalytics() {
  const { routes, visits, analytics } = useMemo(() => seedRoutesData(), []);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Route Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and performance insights for route management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeRoutes} active routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Across all territories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">
              Combined route distance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Visits</span>
              <span className="font-semibold">{analytics.totalVisitsToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="font-semibold text-green-600">{analytics.completedVisitsToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Issues</span>
              <span className="font-semibold text-red-600">{analytics.pendingIssues}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Territory Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.territoryCoverage.slice(0, 3).map((territory) => (
              <div key={territory.territory} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{territory.territory}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{territory.completionRate}%</span>
                  <Progress value={territory.completionRate} className="w-16 h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rep Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.repPerformance.slice(0, 3).map((rep) => (
              <div key={rep.repId} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{rep.repName}</p>
                  <p className="text-xs text-muted-foreground">{rep.routes} routes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{rep.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">{rep.totalVisits} visits</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Route Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Route Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route) => {
              const performance = getRoutePerformance(route.id);
              return (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <Navigation className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{route.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{route.repName}</span>
                        <span>{route.territory}</span>
                        <span>{route.customers.length} customers</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">{performance.completion}%</div>
                      <div className="text-xs text-muted-foreground">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{performance.visits}</div>
                      <div className="text-xs text-muted-foreground">Visits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{performance.orders}</div>
                      <div className="text-xs text-muted-foreground">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-foreground">{route.totalDistance} km</div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                    </div>
                    <Badge className={cn(
                      "text-xs",
                      route.status === "active" ? "bg-green-100 text-green-800" :
                      route.status === "inactive" ? "bg-gray-100 text-gray-800" :
                      route.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    )}>
                      {route.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
