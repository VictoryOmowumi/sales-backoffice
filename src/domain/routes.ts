export type RouteStatus = "active" | "inactive" | "draft" | "completed";
export type VisitFrequency = "daily" | "weekly" | "bi-weekly" | "monthly";
export type VisitStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled";

export type SalesRoute = {
  id: string;
  name: string;
  description?: string;
  status: RouteStatus;
  territory: string;
  repId: string;
  repName: string;
  customers: string[]; // Customer IDs
  visitFrequency: VisitFrequency;
  estimatedDuration: number; // in minutes
  totalDistance?: number; // in km
  lastOptimized?: string; // ISO date
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: {
    priority: "high" | "medium" | "low";
    tags: string[];
    notes?: string;
  };
};

export type RouteVisit = {
  id: string;
  routeId: string;
  customerId: string;
  customerName: string;
  repId: string;
  repName: string;
  scheduledDate: string; // ISO date
  scheduledTime: string; // HH:MM format
  actualStartTime?: string;
  actualEndTime?: string;
  status: VisitStatus;
  duration?: number; // actual duration in minutes
  distance?: number; // distance from previous visit
  orders?: {
    id: string;
    value: number;
    items: number;
  }[];
  notes?: string;
  issues?: {
    type: "delivery" | "payment" | "inventory" | "other";
    description: string;
    resolved: boolean;
  }[];
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
};

export type RoutePerformance = {
  routeId: string;
  period: string; // YYYY-MM format
  totalVisits: number;
  completedVisits: number;
  completionRate: number;
  totalOrders: number;
  totalValue: number;
  averageVisitDuration: number;
  totalDistance: number;
  onTimeRate: number;
  customerSatisfaction?: number; // 1-5 scale
};

export type RouteOptimization = {
  routeId: string;
  optimizedAt: string;
  originalDistance: number;
  optimizedDistance: number;
  savings: number; // percentage
  newSequence: string[]; // customer IDs in optimized order
  estimatedTimeSavings: number; // in minutes
};

export type RouteAnalytics = {
  totalRoutes: number;
  activeRoutes: number;
  totalCustomers: number;
  averageCompletionRate: number;
  totalDistance: number;
  totalVisitsToday: number;
  completedVisitsToday: number;
  pendingIssues: number;
  territoryCoverage: {
    territory: string;
    routes: number;
    customers: number;
    completionRate: number;
  }[];
  repPerformance: {
    repId: string;
    repName: string;
    routes: number;
    completionRate: number;
    totalVisits: number;
    totalOrders: number;
  }[];
};
