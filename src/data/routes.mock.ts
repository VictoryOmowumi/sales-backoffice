import type { SalesRoute, RouteVisit, RoutePerformance, RouteAnalytics } from "@/domain/routes";

export const mockRoutes: SalesRoute[] = [
  // IKEJA REGION - Multiple routes per territory
  {
    id: "route-001",
    name: "Ikeja Modern Trade Circuit A",
    description: "Premium outlets in Ikeja business district - Route A",
    status: "active",
    territory: "Ikeja",
    repId: "rep-001",
    repName: "Adebayo Johnson",
    customers: ["cust-001", "cust-002", "cust-003", "cust-004"],
    visitFrequency: "weekly",
    estimatedDuration: 480, // 8 hours
    totalDistance: 45.2,
    lastOptimized: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "rsm-001",
    metadata: {
      priority: "high",
      tags: ["modern-trade", "premium", "lagos"],
      notes: "High-value customers requiring premium service"
    }
  },
  {
    id: "route-002",
    name: "Ikeja General Trade Circuit B",
    description: "General trade outlets in Ikeja - Route B",
    status: "active",
    territory: "Ikeja",
    repId: "rep-002",
    repName: "Fatima Ibrahim",
    customers: ["cust-005", "cust-006", "cust-007"],
    visitFrequency: "bi-weekly",
    estimatedDuration: 360, // 6 hours
    totalDistance: 38.7,
    lastOptimized: "2024-01-10T14:20:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
    createdBy: "rsm-001",
    metadata: {
      priority: "medium",
      tags: ["general-trade", "lagos", "volume"],
      notes: "Volume-focused route with regular customers"
    }
  },
  {
    id: "route-003",
    name: "Ikeja HORECA Circuit C",
    description: "Hotels and restaurants in Ikeja - Route C",
    status: "active",
    territory: "Ikeja",
    repId: "rep-003",
    repName: "Emeka Okonkwo",
    customers: ["cust-008", "cust-009"],
    visitFrequency: "weekly",
    estimatedDuration: 300, // 5 hours
    totalDistance: 25.4,
    lastOptimized: "2024-01-12T09:15:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
    createdBy: "rsm-001",
    metadata: {
      priority: "high",
      tags: ["horeca", "premium", "lagos"],
      notes: "High-margin HORECA customers"
    }
  },
  // SURULERE TERRITORY - Multiple routes
  {
    id: "route-004",
    name: "Surulere Modern Trade Route",
    description: "Modern trade outlets in Surulere area",
    status: "active",
    territory: "Surulere",
    repId: "rep-004",
    repName: "Kemi Adebayo",
    customers: ["cust-010", "cust-011"],
    visitFrequency: "weekly",
    estimatedDuration: 240, // 4 hours
    totalDistance: 18.9,
    lastOptimized: "2024-01-14T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    createdBy: "rsm-001",
    metadata: {
      priority: "medium",
      tags: ["modern-trade", "surulere", "growth"],
      notes: "Growing modern trade segment"
    }
  },
  {
    id: "route-005",
    name: "Surulere General Trade Route",
    description: "General trade outlets in Surulere",
    status: "active",
    territory: "Surulere",
    repId: "rep-005",
    repName: "Musa Abdullahi",
    customers: ["cust-012", "cust-013", "cust-014"],
    visitFrequency: "bi-weekly",
    estimatedDuration: 420, // 7 hours
    totalDistance: 52.1,
    lastOptimized: "2023-12-20T16:45:00Z",
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2023-12-20T16:45:00Z",
    createdBy: "rsm-001",
    metadata: {
      priority: "medium",
      tags: ["general-trade", "surulere", "established"],
      notes: "Well-established trade route"
    }
  },
  // KANO REGION - Kano Municipal Territory (Multiple routes)
  {
    id: "route-006",
    name: "Kano Municipal HORECA Route A",
    description: "Hotels, restaurants, and catering outlets in Kano Municipal - Route A",
    status: "active",
    territory: "Kano Municipal",
    repId: "rep-006",
    repName: "Emeka Okonkwo",
    customers: ["cust-015", "cust-016", "cust-017"],
    visitFrequency: "weekly",
    estimatedDuration: 300, // 5 hours
    totalDistance: 25.4,
    lastOptimized: "2024-01-12T09:15:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
    createdBy: "rsm-002",
    metadata: {
      priority: "high",
      tags: ["horeca", "premium", "kano"],
      notes: "High-margin HORECA customers"
    }
  },
  {
    id: "route-007",
    name: "Kano Municipal General Trade Route B",
    description: "General trade outlets in Kano Municipal - Route B",
    status: "active",
    territory: "Kano Municipal",
    repId: "rep-007",
    repName: "Aisha Mohammed",
    customers: ["cust-018", "cust-019"],
    visitFrequency: "bi-weekly",
    estimatedDuration: 240, // 4 hours
    totalDistance: 18.9,
    lastOptimized: "2024-01-14T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    createdBy: "rsm-002",
    metadata: {
      priority: "medium",
      tags: ["general-trade", "kano", "volume"],
      notes: "Volume-focused general trade"
    }
  },
  // ABUJA REGION - Abuja Municipal Territory (Multiple routes)
  {
    id: "route-008",
    name: "Abuja Municipal E-Commerce Route A",
    description: "E-commerce pickup points and fulfillment centers in Abuja - Route A",
    status: "draft",
    territory: "Abuja Municipal",
    repId: "rep-008",
    repName: "Kemi Adebayo",
    customers: ["cust-020", "cust-021"],
    visitFrequency: "daily",
    estimatedDuration: 240, // 4 hours
    totalDistance: 18.9,
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    createdBy: "rsm-003",
    metadata: {
      priority: "medium",
      tags: ["e-commerce", "fulfillment", "abuja"],
      notes: "New e-commerce route - pending approval"
    }
  },
  {
    id: "route-009",
    name: "Abuja Municipal Modern Trade Route B",
    description: "Modern trade outlets in Abuja Municipal - Route B",
    status: "active",
    territory: "Abuja Municipal",
    repId: "rep-009",
    repName: "Musa Abdullahi",
    customers: ["cust-022", "cust-023", "cust-024"],
    visitFrequency: "weekly",
    estimatedDuration: 320, // 5.3 hours
    totalDistance: 28.5,
    lastOptimized: "2024-01-08T11:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-08T11:30:00Z",
    createdBy: "rsm-003",
    metadata: {
      priority: "high",
      tags: ["modern-trade", "abuja", "premium"],
      notes: "Premium modern trade segment"
    }
  },
  // KADUNA REGION - Kaduna North Territory (Multiple routes)
  {
    id: "route-010",
    name: "Kaduna North General Trade Route A",
    description: "General trade outlets in Kaduna North - Route A",
    status: "inactive",
    territory: "Kaduna North",
    repId: "rep-010",
    repName: "Tunde Ogunlade",
    customers: ["cust-025", "cust-026", "cust-027"],
    visitFrequency: "monthly",
    estimatedDuration: 420, // 7 hours
    totalDistance: 52.1,
    lastOptimized: "2023-12-20T16:45:00Z",
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2023-12-20T16:45:00Z",
    createdBy: "rsm-004",
    metadata: {
      priority: "low",
      tags: ["general-trade", "kaduna", "seasonal"],
      notes: "Seasonal route - currently inactive"
    }
  },
  {
    id: "route-011",
    name: "Kaduna North HORECA Route B",
    description: "HORECA outlets in Kaduna North - Route B",
    status: "active",
    territory: "Kaduna North",
    repId: "rep-011",
    repName: "Chinedu Nwosu",
    customers: ["cust-028", "cust-029"],
    visitFrequency: "weekly",
    estimatedDuration: 280, // 4.7 hours
    totalDistance: 22.3,
    lastOptimized: "2024-01-05T15:20:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-05T15:20:00Z",
    createdBy: "rsm-004",
    metadata: {
      priority: "medium",
      tags: ["horeca", "kaduna", "traditional"],
      notes: "Traditional HORECA focus area"
    }
  },
  // IBADAN REGION - Ibadan North Territory (Multiple routes)
  {
    id: "route-012",
    name: "Ibadan North Modern Trade Route A",
    description: "Modern trade outlets in Ibadan North - Route A",
    status: "active",
    territory: "Ibadan North",
    repId: "rep-012",
    repName: "Grace Okoro",
    customers: ["cust-030", "cust-031"],
    visitFrequency: "weekly",
    estimatedDuration: 200, // 3.3 hours
    totalDistance: 15.8,
    lastOptimized: "2024-01-03T09:45:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-03T09:45:00Z",
    createdBy: "rsm-005",
    metadata: {
      priority: "medium",
      tags: ["modern-trade", "ibadan", "growth"],
      notes: "Growing modern trade segment"
    }
  },
  {
    id: "route-013",
    name: "Ibadan North General Trade Route B",
    description: "General trade outlets in Ibadan North - Route B",
    status: "active",
    territory: "Ibadan North",
    repId: "rep-013",
    repName: "Osas Iyamu",
    customers: ["cust-032", "cust-033", "cust-034"],
    visitFrequency: "bi-weekly",
    estimatedDuration: 350, // 5.8 hours
    totalDistance: 31.2,
    lastOptimized: "2024-01-07T13:15:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-07T13:15:00Z",
    createdBy: "rsm-005",
    metadata: {
      priority: "medium",
      tags: ["general-trade", "ibadan", "established"],
      notes: "Well-established trade route"
    }
  },
  // ENUGU REGION - Enugu East Territory (Multiple routes)
  {
    id: "route-014",
    name: "Enugu East General Trade Route A",
    description: "General trade outlets in Enugu East - Route A",
    status: "active",
    territory: "Enugu East",
    repId: "rep-014",
    repName: "Ahmad Lawal",
    customers: ["cust-035", "cust-036", "cust-037"],
    visitFrequency: "bi-weekly",
    estimatedDuration: 180, // 3 hours
    totalDistance: 12.5,
    lastOptimized: "2024-01-16T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
    createdBy: "rsm-006",
    metadata: {
      priority: "medium",
      tags: ["general-trade", "enugu", "traditional"],
      notes: "Traditional trade focus area"
    }
  },
  {
    id: "route-015",
    name: "Enugu East HORECA Route B",
    description: "HORECA outlets in Enugu East - Route B",
    status: "active",
    territory: "Enugu East",
    repId: "rep-015",
    repName: "Blessing Okafor",
    customers: ["cust-038", "cust-039"],
    visitFrequency: "weekly",
    estimatedDuration: 220, // 3.7 hours
    totalDistance: 16.8,
    lastOptimized: "2024-01-11T14:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-11T14:30:00Z",
    createdBy: "rsm-006",
    metadata: {
      priority: "high",
      tags: ["horeca", "enugu", "premium"],
      notes: "Premium HORECA segment"
    }
  }
];

export const mockRouteVisits: RouteVisit[] = [
  {
    id: "visit-001",
    routeId: "route-001",
    customerId: "cust-001",
    customerName: "Shoprite Ikeja City Mall",
    repId: "rep-001",
    repName: "Adebayo Johnson",
    scheduledDate: "2024-01-20",
    scheduledTime: "09:00",
    actualStartTime: "2024-01-20T09:15:00Z",
    actualEndTime: "2024-01-20T10:30:00Z",
    status: "completed",
    duration: 75,
    distance: 0,
    orders: [
      {
        id: "order-001",
        value: 125000,
        items: 45
      }
    ],
    notes: "Customer requested additional stock for weekend promotion",
    location: {
      lat: 6.5244,
      lng: 3.3792,
      accuracy: 5
    }
  },
  {
    id: "visit-002",
    routeId: "route-001",
    customerId: "cust-002",
    customerName: "Spar Victoria Island",
    repId: "rep-001",
    repName: "Adebayo Johnson",
    scheduledDate: "2024-01-20",
    scheduledTime: "11:00",
    status: "scheduled",
    distance: 12.5
  },
  {
    id: "visit-003",
    routeId: "route-002",
    customerId: "cust-005",
    customerName: "Kano Central Market Store",
    repId: "rep-002",
    repName: "Fatima Ibrahim",
    scheduledDate: "2024-01-20",
    scheduledTime: "08:00",
    actualStartTime: "2024-01-20T08:05:00Z",
    actualEndTime: "2024-01-20T09:20:00Z",
    status: "completed",
    duration: 75,
    distance: 0,
    orders: [
      {
        id: "order-002",
        value: 85000,
        items: 32
      }
    ],
    notes: "Payment collected successfully",
    issues: [
      {
        type: "inventory",
        description: "Some products out of stock",
        resolved: false
      }
    ],
    location: {
      lat: 12.0022,
      lng: 8.5920,
      accuracy: 8
    }
  }
];

export const mockRoutePerformance: RoutePerformance[] = [
  {
    routeId: "route-001",
    period: "2024-01",
    totalVisits: 16,
    completedVisits: 14,
    completionRate: 87.5,
    totalOrders: 14,
    totalValue: 1850000,
    averageVisitDuration: 68,
    totalDistance: 180.8,
    onTimeRate: 92.3,
    customerSatisfaction: 4.2
  },
  {
    routeId: "route-002",
    period: "2024-01",
    totalVisits: 8,
    completedVisits: 7,
    completionRate: 87.5,
    totalOrders: 7,
    totalValue: 595000,
    averageVisitDuration: 72,
    totalDistance: 154.8,
    onTimeRate: 85.7,
    customerSatisfaction: 4.0
  }
];

export const mockRouteAnalytics: RouteAnalytics = {
  totalRoutes: 5,
  activeRoutes: 3,
  totalCustomers: 17,
  averageCompletionRate: 78.5,
  totalDistance: 180.3,
  totalVisitsToday: 12,
  completedVisitsToday: 8,
  pendingIssues: 5,
  territoryCoverage: [
    {
      territory: "Ikeja",
      routes: 1,
      customers: 4,
      completionRate: 87.5
    },
    {
      territory: "Kano",
      routes: 1,
      customers: 5,
      completionRate: 87.5
    },
    {
      territory: "Abuja",
      routes: 1,
      customers: 3,
      completionRate: 75.0
    },
    {
      territory: "Ibadan",
      routes: 1,
      customers: 2,
      completionRate: 0
    },
    {
      territory: "Kaduna",
      routes: 1,
      customers: 3,
      completionRate: 0
    }
  ],
  repPerformance: [
    {
      repId: "rep-001",
      repName: "Adebayo Johnson",
      routes: 1,
      completionRate: 87.5,
      totalVisits: 16,
      totalOrders: 14
    },
    {
      repId: "rep-002",
      repName: "Fatima Ibrahim",
      routes: 1,
      completionRate: 87.5,
      totalVisits: 8,
      totalOrders: 7
    },
    {
      repId: "rep-003",
      repName: "Emeka Okonkwo",
      routes: 1,
      completionRate: 75.0,
      totalVisits: 12,
      totalOrders: 10
    }
  ]
};

export function seedRoutesData() {
  return {
    routes: mockRoutes,
    visits: mockRouteVisits,
    performance: mockRoutePerformance,
    analytics: mockRouteAnalytics
  };
}
