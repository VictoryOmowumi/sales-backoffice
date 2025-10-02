export type RetentionData = {
  segment: string;
  type: 'region' | 'channel' | 'category' | 'brand';
  currentPeriodBuyers: number;
  previousPeriodBuyers: number;
  retainedBuyers: number;
  newCustomers: number;
  churnedCustomers: number;
  retentionRate: number; // percentage
  churnRate: number; // percentage
  revenueAtRisk: number; // NGN
  avgOrderValue: number; // NGN
  lastOrderDays: number; // days since last order
};

export type RetentionKPIs = {
  activeCustomers: number;
  retainedCustomersPct: number;
  churnedCustomersPct: number;
  newCustomersAdded: number;
  winBackPct: number;
  avgRetentionRate: number;
  revenueAtRisk: number;
  customerLifetimeValue: number;
};

export type CohortData = {
  cohort: string; // e.g., "Q1 2024", "Q2 2024"
  initialCustomers: number;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
};

export type RetentionCurveData = {
  month: number;
  retentionRate: number;
};

export const retentionKPIs: RetentionKPIs = {
  activeCustomers: 3248,
  retainedCustomersPct: 68.5,
  churnedCustomersPct: 12.3,
  newCustomersAdded: 456,
  winBackPct: 8.2,
  avgRetentionRate: 68.5,
  revenueAtRisk: 125000000,
  customerLifetimeValue: 1850000
};

export const retentionData: RetentionData[] = [
  // Regional Analysis - 9 Regions
  {
    segment: "Abuja",
    type: "region",
    currentPeriodBuyers: 680,
    previousPeriodBuyers: 720,
    retainedBuyers: 520,
    newCustomers: 160,
    churnedCustomers: 200,
    retentionRate: 72.2,
    churnRate: 27.8,
    revenueAtRisk: 25000000,
    avgOrderValue: 1100000,
    lastOrderDays: 18
  },
  {
    segment: "Kano",
    type: "region",
    currentPeriodBuyers: 420,
    previousPeriodBuyers: 480,
    retainedBuyers: 320,
    newCustomers: 100,
    churnedCustomers: 160,
    retentionRate: 66.7,
    churnRate: 33.3,
    revenueAtRisk: 20000000,
    avgOrderValue: 950000,
    lastOrderDays: 25
  },
  {
    segment: "Kaduna",
    type: "region",
    currentPeriodBuyers: 380,
    previousPeriodBuyers: 420,
    retainedBuyers: 280,
    newCustomers: 100,
    churnedCustomers: 140,
    retentionRate: 66.7,
    churnRate: 33.3,
    revenueAtRisk: 18000000,
    avgOrderValue: 900000,
    lastOrderDays: 28
  },
  {
    segment: "Aba",
    type: "region",
    currentPeriodBuyers: 350,
    previousPeriodBuyers: 380,
    retainedBuyers: 260,
    newCustomers: 90,
    churnedCustomers: 120,
    retentionRate: 68.4,
    churnRate: 31.6,
    revenueAtRisk: 16000000,
    avgOrderValue: 850000,
    lastOrderDays: 26
  },
  {
    segment: "Enugu",
    type: "region",
    currentPeriodBuyers: 320,
    previousPeriodBuyers: 360,
    retainedBuyers: 240,
    newCustomers: 80,
    churnedCustomers: 120,
    retentionRate: 66.7,
    churnRate: 33.3,
    revenueAtRisk: 15000000,
    avgOrderValue: 920000,
    lastOrderDays: 24
  },
  {
    segment: "Benin",
    type: "region",
    currentPeriodBuyers: 300,
    previousPeriodBuyers: 340,
    retainedBuyers: 220,
    newCustomers: 80,
    churnedCustomers: 120,
    retentionRate: 64.7,
    churnRate: 35.3,
    revenueAtRisk: 14000000,
    avgOrderValue: 880000,
    lastOrderDays: 30
  },
  {
    segment: "Ibadan",
    type: "region",
    currentPeriodBuyers: 388,
    previousPeriodBuyers: 420,
    retainedBuyers: 280,
    newCustomers: 108,
    churnedCustomers: 140,
    retentionRate: 66.7,
    churnRate: 33.3,
    revenueAtRisk: 15000000,
    avgOrderValue: 1050000,
    lastOrderDays: 20
  },
  {
    segment: "Ilorin",
    type: "region",
    currentPeriodBuyers: 280,
    previousPeriodBuyers: 320,
    retainedBuyers: 200,
    newCustomers: 80,
    churnedCustomers: 120,
    retentionRate: 62.5,
    churnRate: 37.5,
    revenueAtRisk: 13000000,
    avgOrderValue: 800000,
    lastOrderDays: 32
  },
  {
    segment: "Ikeja",
    type: "region",
    currentPeriodBuyers: 1240,
    previousPeriodBuyers: 1180,
    retainedBuyers: 850,
    newCustomers: 390,
    churnedCustomers: 330,
    retentionRate: 72.0,
    churnRate: 28.0,
    revenueAtRisk: 45000000,
    avgOrderValue: 1200000,
    lastOrderDays: 15
  },

  // Channel Analysis
  {
    segment: "Modern Trade",
    type: "channel",
    currentPeriodBuyers: 850,
    previousPeriodBuyers: 820,
    retainedBuyers: 720,
    newCustomers: 130,
    churnedCustomers: 100,
    retentionRate: 87.8,
    churnRate: 12.2,
    revenueAtRisk: 15000000,
    avgOrderValue: 2500000,
    lastOrderDays: 12
  },
  {
    segment: "General Trade",
    type: "channel",
    currentPeriodBuyers: 1800,
    previousPeriodBuyers: 1950,
    retainedBuyers: 1200,
    newCustomers: 600,
    churnedCustomers: 750,
    retentionRate: 61.5,
    churnRate: 38.5,
    revenueAtRisk: 75000000,
    avgOrderValue: 850000,
    lastOrderDays: 28
  },
  {
    segment: "HORECA",
    type: "channel",
    currentPeriodBuyers: 598,
    previousPeriodBuyers: 650,
    retainedBuyers: 480,
    newCustomers: 118,
    churnedCustomers: 170,
    retentionRate: 73.8,
    churnRate: 26.2,
    revenueAtRisk: 35000000,
    avgOrderValue: 1800000,
    lastOrderDays: 16
  },

  // Category Analysis
  {
    segment: "PET",
    type: "category",
    currentPeriodBuyers: 2100,
    previousPeriodBuyers: 2050,
    retainedBuyers: 1680,
    newCustomers: 420,
    churnedCustomers: 370,
    retentionRate: 82.0,
    churnRate: 18.0,
    revenueAtRisk: 45000000,
    avgOrderValue: 1400000,
    lastOrderDays: 14
  },
  {
    segment: "RGB",
    type: "category",
    currentPeriodBuyers: 1800,
    previousPeriodBuyers: 1950,
    retainedBuyers: 1200,
    newCustomers: 600,
    churnedCustomers: 750,
    retentionRate: 61.5,
    churnRate: 38.5,
    revenueAtRisk: 60000000,
    avgOrderValue: 800000,
    lastOrderDays: 32
  },
  {
    segment: "Water",
    type: "category",
    currentPeriodBuyers: 950,
    previousPeriodBuyers: 920,
    retainedBuyers: 760,
    newCustomers: 190,
    churnedCustomers: 160,
    retentionRate: 82.6,
    churnRate: 17.4,
    revenueAtRisk: 20000000,
    avgOrderValue: 1200000,
    lastOrderDays: 18
  },
  {
    segment: "Energy",
    type: "category",
    currentPeriodBuyers: 398,
    previousPeriodBuyers: 380,
    retainedBuyers: 340,
    newCustomers: 58,
    churnedCustomers: 40,
    retentionRate: 89.5,
    churnRate: 10.5,
    revenueAtRisk: 5000000,
    avgOrderValue: 1600000,
    lastOrderDays: 10
  },

  // Brand Analysis
  {
    segment: "Pepsi",
    type: "brand",
    currentPeriodBuyers: 1500,
    previousPeriodBuyers: 1450,
    retainedBuyers: 1200,
    newCustomers: 300,
    churnedCustomers: 250,
    retentionRate: 82.8,
    churnRate: 17.2,
    revenueAtRisk: 35000000,
    avgOrderValue: 1500000,
    lastOrderDays: 12
  },
  {
    segment: "Mirinda",
    type: "brand",
    currentPeriodBuyers: 850,
    previousPeriodBuyers: 920,
    retainedBuyers: 650,
    newCustomers: 200,
    churnedCustomers: 270,
    retentionRate: 70.7,
    churnRate: 29.3,
    revenueAtRisk: 30000000,
    avgOrderValue: 1100000,
    lastOrderDays: 20
  },
  {
    segment: "Aquafina",
    type: "brand",
    currentPeriodBuyers: 750,
    previousPeriodBuyers: 720,
    retainedBuyers: 600,
    newCustomers: 150,
    churnedCustomers: 120,
    retentionRate: 83.3,
    churnRate: 16.7,
    revenueAtRisk: 15000000,
    avgOrderValue: 1200000,
    lastOrderDays: 16
  },
  {
    segment: "Sting",
    type: "brand",
    currentPeriodBuyers: 398,
    previousPeriodBuyers: 380,
    retainedBuyers: 340,
    newCustomers: 58,
    churnedCustomers: 40,
    retentionRate: 89.5,
    churnRate: 10.5,
    revenueAtRisk: 5000000,
    avgOrderValue: 1600000,
    lastOrderDays: 10
  }
];

export const cohortData: CohortData[] = [
  {
    cohort: "Q1 2024",
    initialCustomers: 1200,
    month1: 85,
    month2: 72,
    month3: 65,
    month6: 58,
    month12: 52
  },
  {
    cohort: "Q2 2024",
    initialCustomers: 1350,
    month1: 88,
    month2: 75,
    month3: 68,
    month6: 61,
    month12: 55
  },
  {
    cohort: "Q3 2024",
    initialCustomers: 1100,
    month1: 82,
    month2: 70,
    month3: 63,
    month6: 56,
    month12: 50
  },
  {
    cohort: "Q4 2024",
    initialCustomers: 1450,
    month1: 90,
    month2: 78,
    month3: 71,
    month6: 64,
    month12: 58
  }
];

export const retentionCurveData: RetentionCurveData[] = [
  { month: 1, retentionRate: 86.2 },
  { month: 2, retentionRate: 73.8 },
  { month: 3, retentionRate: 66.9 },
  { month: 6, retentionRate: 59.8 },
  { month: 12, retentionRate: 53.9 },
  { month: 18, retentionRate: 48.2 },
  { month: 24, retentionRate: 43.1 }
];

export type ExecutiveInsight = {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: string;
};

export type RollingRetentionData = {
  period: string;
  retention1m: number;
  retention3m: number;
  retention6m: number;
  retention12m: number;
};

export type RetentionDriver = {
  driver: string;
  impact: number; // percentage impact on retention
  customers: number;
  revenue: number;
  description: string;
};

export type EarlyWarningSignal = {
  customerGroup: string;
  riskLevel: 'low' | 'medium' | 'high';
  signal: string;
  customers: number;
  revenueAtRisk: number;
  recommendation: string;
};

export type ChurnedGroup = {
  group: string;
  churnRate: number;
  customersLost: number;
  revenueLost: number;
  reason: string;
};

export const executiveInsights: ExecutiveInsight[] = [
  {
    type: 'positive',
    title: 'Energy Category Shows Strong Retention',
    description: 'Sting brand maintains 89.5% retention rate, indicating strong customer loyalty in the energy segment.',
    impact: 'Lowest churn rate at 10.5%'
  },
  {
    type: 'positive',
    title: 'Modern Trade Channel Excellence',
    description: 'Modern Trade achieves 87.8% retention rate, significantly outperforming General Trade at 61.5%.',
    impact: 'Revenue at risk reduced by ₦60M'
  },
  {
    type: 'negative',
    title: 'General Trade Retention Challenge',
    description: 'General Trade shows concerning 38.5% churn rate, with 750 customers lost in current period.',
    impact: '₦75M revenue at risk'
  },
  {
    type: 'negative',
    title: 'RGB Category Under Pressure',
    description: 'RGB category faces 38.5% churn rate, significantly higher than PET category at 18.0%.',
    impact: '₦60M revenue at risk'
  },
  {
    type: 'neutral',
    title: 'Regional Performance Varies',
    description: 'Ikeja leads with 72% retention, while Ilorin and Benin show higher churn rates above 35%.',
    impact: 'Geographic strategy needed'
  }
];

export const rollingRetentionData: RollingRetentionData[] = [
  {
    period: "Current Period",
    retention1m: 86.2,
    retention3m: 66.9,
    retention6m: 59.8,
    retention12m: 53.9
  },
  {
    period: "Previous Period",
    retention1m: 84.5,
    retention3m: 64.2,
    retention6m: 57.1,
    retention12m: 51.3
  },
  {
    period: "Last Year",
    retention1m: 82.8,
    retention3m: 61.5,
    retention6m: 54.7,
    retention12m: 48.9
  }
];

export const retentionDrivers: RetentionDriver[] = [
  {
    driver: "PET 50cl Loyalty",
    impact: 15.2,
    customers: 1200,
    revenue: 180000000,
    description: "Customers buying PET 50cl show 82% retention vs 60% for other sizes"
  },
  {
    driver: "Modern Trade Channel",
    impact: 12.8,
    customers: 850,
    revenue: 212500000,
    description: "Modern Trade customers have 87.8% retention vs 61.5% for General Trade"
  },
  {
    driver: "Energy Category Stickiness",
    impact: 8.5,
    customers: 398,
    revenue: 63680000,
    description: "Energy drinks show highest retention at 89.5% due to habit formation"
  },
  {
    driver: "Regular Order Frequency",
    impact: 6.3,
    customers: 2100,
    revenue: 252000000,
    description: "Customers ordering weekly show 78% retention vs 45% for monthly"
  },
  {
    driver: "Premium Brand Mix",
    impact: 4.7,
    customers: 750,
    revenue: 112500000,
    description: "Customers buying premium brands (Pepsi, Aquafina) show higher loyalty"
  }
];

export const earlyWarningSignals: EarlyWarningSignal[] = [
  {
    customerGroup: "RGB 35cl General Trade",
    riskLevel: "high",
    signal: "Order frequency decreased by 40%",
    customers: 450,
    revenueAtRisk: 36000000,
    recommendation: "Implement targeted promotions and check distribution issues"
  },
  {
    customerGroup: "Small Retailers in Ilorin",
    riskLevel: "high",
    signal: "Average order value dropped 35%",
    customers: 280,
    revenueAtRisk: 22400000,
    recommendation: "Review pricing strategy and provide volume incentives"
  },
  {
    customerGroup: "HORECA in Benin",
    riskLevel: "medium",
    signal: "Last order 45+ days ago",
    customers: 120,
    revenueAtRisk: 21600000,
    recommendation: "Direct sales team intervention and relationship check"
  },
  {
    customerGroup: "Modern Trade in Kaduna",
    riskLevel: "medium",
    signal: "Reduced SKU variety (buying fewer products)",
    customers: 85,
    revenueAtRisk: 17000000,
    recommendation: "Product availability audit and assortment review"
  },
  {
    customerGroup: "Water Category Buyers",
    riskLevel: "low",
    signal: "Seasonal pattern deviation",
    customers: 200,
    revenueAtRisk: 24000000,
    recommendation: "Monitor for seasonal adjustment vs actual churn"
  }
];

export const topChurnedGroups: ChurnedGroup[] = [
  {
    group: "Small RGB Retailers in Ilorin",
    churnRate: 45.2,
    customersLost: 120,
    revenueLost: 9600000,
    reason: "Price sensitivity and distribution challenges"
  },
  {
    group: "General Trade in Benin",
    churnRate: 42.8,
    customersLost: 140,
    revenueLost: 12320000,
    reason: "Competition from local brands and economic pressure"
  },
  {
    group: "Traditional Outlets in Kaduna",
    churnRate: 38.5,
    customersLost: 160,
    revenueLost: 14400000,
    reason: "Supply chain disruptions and payment terms"
  },
  {
    group: "Small PET Retailers in Enugu",
    churnRate: 35.7,
    customersLost: 100,
    revenueLost: 12000000,
    reason: "Market saturation and margin pressure"
  },
  {
    group: "HORECA in Aba",
    churnRate: 33.3,
    customersLost: 80,
    revenueLost: 14400000,
    reason: "Economic downturn affecting hospitality sector"
  }
];
