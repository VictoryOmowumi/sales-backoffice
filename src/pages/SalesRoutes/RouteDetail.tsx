import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  Play,
  MapPin,
  Clock,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Route as RouteIcon,
  Zap,
  MoreHorizontal,
  BarChart3,
  Save,
  Maximize2,
  Minimize2
} from "lucide-react";
import { seedRoutesData } from "@/data/routes.mock";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { SalesRoute, RouteVisit, RouteStatus, VisitFrequency } from "@/domain/routes";
import { useAuth } from "@/hooks/useAuth";
import { REGIONS_AND_TERRITORIES } from "@/config/regions";
import RouteMap from "@/components/maps/RouteMap";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const visitStatusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  rescheduled: "bg-orange-100 text-orange-800",
};

const visitStatusIcons = {
  scheduled: Clock,
  in_progress: Play,
  completed: CheckCircle,
  cancelled: XCircle,
  rescheduled: Calendar,
};

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [route, setRoute] = useState<SalesRoute | null>(null);
  const [visits, setVisits] = useState<RouteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Partial<SalesRoute>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const { routes, visits } = seedRoutesData();
      const foundRoute = routes.find((r) => r.id === routeId);
      const routeVisits = visits.filter((v) => v.routeId === routeId);
      
      setRoute(foundRoute || null);
      setVisits(routeVisits);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [routeId]);

  const handleViewMap = () => {
    setShowMapModal(true);
  };

  const handleEditRoute = () => {
    if (route) {
      setEditingRoute(route);
      setShowEditModal(true);
    }
  };

  const handleSaveRoute = () => {
    if (route && editingRoute) {
      const updatedRoute = { ...route, ...editingRoute, updatedAt: new Date().toISOString() };
      setRoute(updatedRoute);
      setShowEditModal(false);
      setEditingRoute({});
      toast({
        title: "Route Updated",
        description: "Route has been updated successfully.",
      });
    }
  };

  const handleOptimizeRoute = () => {
    if (route) {
      // Simulate optimization
      const optimizedRoute = {
        ...route,
        lastOptimized: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoute(optimizedRoute);
      toast({
        title: "Route Optimized",
        description: "Route has been optimized for better efficiency.",
      });
    }
  };

  const handleStartRoute = () => {
    toast({
      title: "Route Started",
      description: "Route execution has been started.",
    });
  };

  const handleStartVisit = (visitId: string) => {
    const updatedVisits = visits.map(visit => 
      visit.id === visitId 
        ? { ...visit, status: "in_progress" as const, checkInTime: new Date().toISOString() }
        : visit
    );
    setVisits(updatedVisits);
    toast({
      title: "Visit Started",
      description: "Customer visit has been started.",
    });
  };

  const handleCompleteVisit = (visitId: string) => {
    const updatedVisits = visits.map(visit => 
      visit.id === visitId 
        ? { ...visit, status: "completed" as const, checkOutTime: new Date().toISOString() }
        : visit
    );
    setVisits(updatedVisits);
    toast({
      title: "Visit Completed",
      description: "Customer visit has been completed.",
    });
  };

  const handleViewAnalytics = () => {
    navigate(`/routes/analytics?routeId=${routeId}`);
  };

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading route details...</p>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <RouteIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-2">Route not found</h3>
        <p className="text-muted-foreground mb-6">The route you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/routes/overview")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Routes
        </Button>
      </div>
    );
  }

  const isRSM = user?.role === "gtm" || user?.role === "executive";
  const todayVisits = visits.filter(v => v.scheduledDate === new Date().toISOString().slice(0, 10));
  const completedVisits = todayVisits.filter(v => v.status === "completed").length;
  const completionRate = todayVisits.length > 0 ? Math.round((completedVisits / todayVisits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/routes/overview")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Routes
        </Button>
        
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">
                    {route.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {route.description || `Route in ${route.territory} territory`}
                  </p>
                </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{route.repName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{route.territory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(route.estimatedDuration)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewMap}
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
              {isRSM && (
                <Button
                  size="sm"
                  onClick={handleEditRoute}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Route
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Route Status
                  </p>
                  <Badge className={cn("text-sm px-2 py-1", statusColors[route.status])}>
                    {route.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
            <Progress value={completionRate} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex flex-col  justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customers
                  </p>
                  <p className="text-sm font-semibold text-foreground">{route.customers.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{todayVisits.length}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Navigation className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Distance
                  </p>
                  <p className="text-sm font-semibold text-foreground">{route.totalDistance} km</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{route.visitFrequency}</p>
                <p className="text-xs text-muted-foreground">Frequency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Performance
                  </p>
                  <p className="text-sm font-semibold text-foreground">85%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">4.2</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Visits */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">Today's Visits</span>
                  <p className="text-sm font-normal text-muted-foreground">
                    {todayVisits.length} scheduled visits
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {todayVisits.map((visit) => {
                  const StatusIcon = visitStatusIcons[visit.status];
                  return (
                    <div
                      key={visit.id}
                      className="border border-border rounded-lg p-4 hover:border-border/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            visitStatusColors[visit.status]
                          )}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {visit.customerName}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatTime(visit.scheduledTime)}</span>
                              {visit.duration && (
                                <span>{formatDuration(visit.duration)}</span>
                              )}
                              {visit.orders && visit.orders.length > 0 && (
                                <span>{visit.orders.length} orders</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", visitStatusColors[visit.status])}>
                            {visit.status.replace("_", " ")}
                          </Badge>
                          {visit.status === "scheduled" && !isRSM && (
                            <Button
                              size="sm"
                              onClick={() => handleStartVisit(visit.id)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {visit.status === "in_progress" && !isRSM && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteVisit(visit.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {visit.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-foreground">{visit.notes}</p>
                        </div>
                      )}
                      
                      {visit.issues && visit.issues.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {visit.issues.map((issue, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-800">{issue.description}</span>
                              {issue.resolved && (
                                <Badge className="bg-green-100 text-green-800 text-xs">Resolved</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <RouteIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">Route Information</span>
                  <p className="text-sm font-normal text-muted-foreground">
                    Detailed route specifications
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="font-semibold text-foreground">
                        {new Date(route.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="font-semibold text-foreground">
                        {new Date(route.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Optimized</p>
                      <p className="font-semibold text-foreground">
                        {route.lastOptimized ? new Date(route.lastOptimized).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created By</p>
                      <p className="font-semibold text-foreground">RSM Manager</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {route.metadata?.notes && (
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <p className="text-sm text-foreground">{route.metadata.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Route Summary */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">Route Summary</span>
                  <p className="text-sm font-normal text-muted-foreground">Performance metrics</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Customers</span>
                  <span className="font-semibold text-foreground">{route.customers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Visit Frequency</span>
                  <span className="font-semibold text-foreground">{route.visitFrequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Duration</span>
                  <span className="font-semibold text-foreground">{formatDuration(route.estimatedDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Distance</span>
                  <span className="font-semibold text-foreground">{route.totalDistance} km</span>
                </div>
              </div>

              <Separator />

              <div className="bg-muted p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Today's Progress</span>
                  <span className="text-xl font-bold text-foreground">{completionRate}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedVisits} of {todayVisits.length} visits completed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sales Rep Information */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">Sales Representative</span>
                  <p className="text-sm font-normal text-muted-foreground">Assigned rep details</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{route.repName}</h4>
                  <p className="text-sm text-muted-foreground">Sales Representative</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{route.territory}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">Quick Actions</span>
                  <p className="text-sm font-normal text-muted-foreground">Manage this route</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {!isRSM && (
                <Button
                  className="w-full"
                  onClick={handleStartRoute}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Route
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewMap}
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>

              {isRSM && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleOptimizeRoute}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Route
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewAnalytics}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Route Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="name">Route Name</Label>
                <Input
                  id="name"
                  value={editingRoute.name || ""}
                  onChange={(e) => setEditingRoute({ ...editingRoute, name: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingRoute.status || ""}
                  onValueChange={(value) => setEditingRoute({ ...editingRoute, status: value as RouteStatus })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingRoute.description || ""}
                onChange={(e) => setEditingRoute({ ...editingRoute, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="territory">Territory</Label>
                <Select
                  value={editingRoute.territory || ""}
                  onValueChange={(value) => setEditingRoute({ ...editingRoute, territory: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select territory" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(REGIONS_AND_TERRITORIES).flatMap(region => 
                      region.territories.map(territory => (
                        <SelectItem key={territory} value={territory}>{territory}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="frequency">Visit Frequency</Label>
                <Select
                  value={editingRoute.visitFrequency || ""}
                  onValueChange={(value) => setEditingRoute({ ...editingRoute, visitFrequency: value as VisitFrequency })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-1">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editingRoute.estimatedDuration || ""}
                  onChange={(e) => setEditingRoute({ ...editingRoute, estimatedDuration: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={editingRoute.totalDistance || ""}
                  onChange={(e) => setEditingRoute({ ...editingRoute, totalDistance: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRoute}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Route Map - {route?.name}</DialogTitle>
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
          </DialogHeader>
          <div className={cn(
            "flex-1",
            isMapFullscreen ? "h-[calc(80vh-120px)]" : "h-96"
          )}>
            {route && (
              <RouteMap 
                routes={[route]} 
                visits={visits}
                role={user?.role || "sales"}
                onStartVisit={(customerId) => {
                  toast({
                    title: "Visit Started",
                    description: `Starting visit for customer ${customerId}`,
                  });
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
