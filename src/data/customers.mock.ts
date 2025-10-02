export type CustomerData = {
  id: string;
  name: string;
  region: string;
  channel: string;
  customerType: 'distributor' | 'wholesaler' | 'retailer' | 'on-premise';
  sizeTier: 'gold' | 'silver' | 'bronze';
  totalSales: number; // NGN
  orderCount: number;
  lastOrderDate: string;
  status: 'active' | 'new' | 'churn-risk' | 'inactive';
  avgOrderValue: number; // NGN
  purchaseFrequency: number; // orders per month
  customerSince: string;
  categories: string[]; // RGB, PET, Water, Energy
  contactPerson: string;
  phone: string;
  address: string;
};

export type CustomerKPIs = {
  totalCustomers: number;
  activeCustomers1m: number;
  activeCustomers3m: number;
  activeCustomers12m: number;
  newCustomers: number;
  churnedCustomers: number;
  avgOrderValue: number;
  avgPurchaseFrequency: number;
  topCustomerContribution: number; // percentage
};

export type CustomerGrowthData = {
  period: string;
  activeCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
};

export type CustomerSegment = {
  segment: string;
  type: 'region' | 'channel' | 'customerType' | 'sizeTier';
  count: number;
  percentage: number;
  avgOrderValue: number;
  totalSales: number;
};

export type CustomerInsight = {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: string;
};

export const customerKPIs: CustomerKPIs = {
  totalCustomers: 3248,
  activeCustomers1m: 2890,
  activeCustomers3m: 3100,
  activeCustomers12m: 3200,
  newCustomers: 456,
  churnedCustomers: 120,
  avgOrderValue: 1850000,
  avgPurchaseFrequency: 2.3,
  topCustomerContribution: 42.5
};

export const customerData: CustomerData[] = [
  // High-value customers
  {
    id: "CUST001",
    name: "Lagos Mega Distributors Ltd",
    region: "Ikeja",
    channel: "Modern Trade",
    customerType: "distributor",
    sizeTier: "gold",
    totalSales: 45000000,
    orderCount: 24,
    lastOrderDate: "2024-01-15",
    status: "active",
    avgOrderValue: 1875000,
    purchaseFrequency: 2.0,
    customerSince: "2020-03-15",
    categories: ["RGB", "PET", "Water", "Energy"],
    contactPerson: "Adebayo Johnson",
    phone: "+234-801-234-5678",
    address: "123 Lagos Road, Ikeja, Lagos"
  },
  {
    id: "CUST002",
    name: "Abuja Central Wholesale",
    region: "Abuja",
    channel: "General Trade",
    customerType: "wholesaler",
    sizeTier: "gold",
    totalSales: 38000000,
    orderCount: 18,
    lastOrderDate: "2024-01-12",
    status: "active",
    avgOrderValue: 2111111,
    purchaseFrequency: 1.5,
    customerSince: "2019-08-20",
    categories: ["RGB", "PET", "Water"],
    contactPerson: "Fatima Ibrahim",
    phone: "+234-802-345-6789",
    address: "456 Abuja Street, Wuse 2, Abuja"
  },
  {
    id: "CUST003",
    name: "Kano Northern Hub",
    region: "Kano",
    channel: "General Trade",
    customerType: "distributor",
    sizeTier: "gold",
    totalSales: 32000000,
    orderCount: 20,
    lastOrderDate: "2024-01-10",
    status: "active",
    avgOrderValue: 1600000,
    purchaseFrequency: 1.7,
    customerSince: "2021-01-10",
    categories: ["RGB", "PET"],
    contactPerson: "Musa Abdullahi",
    phone: "+234-803-456-7890",
    address: "789 Kano Road, Kano State"
  },
  {
    id: "CUST004",
    name: "Port Harcourt Retail Chain",
    region: "Port Harcourt",
    channel: "Modern Trade",
    customerType: "retailer",
    sizeTier: "silver",
    totalSales: 25000000,
    orderCount: 15,
    lastOrderDate: "2024-01-08",
    status: "active",
    avgOrderValue: 1666667,
    purchaseFrequency: 1.3,
    customerSince: "2022-05-15",
    categories: ["PET", "Water", "Energy"],
    contactPerson: "Grace Okoro",
    phone: "+234-804-567-8901",
    address: "321 Port Harcourt Avenue, Rivers"
  },
  {
    id: "CUST005",
    name: "Ibadan Traditional Outlets",
    region: "Ibadan",
    channel: "General Trade",
    customerType: "retailer",
    sizeTier: "silver",
    totalSales: 18000000,
    orderCount: 12,
    lastOrderDate: "2024-01-05",
    status: "active",
    avgOrderValue: 1500000,
    purchaseFrequency: 1.0,
    customerSince: "2021-11-20",
    categories: ["RGB", "PET"],
    contactPerson: "Oluwaseun Adebayo",
    phone: "+234-805-678-9012",
    address: "654 Ibadan Street, Oyo State"
  },
  // New customers
  {
    id: "CUST006",
    name: "Kaduna Fresh Start",
    region: "Kaduna",
    channel: "General Trade",
    customerType: "wholesaler",
    sizeTier: "bronze",
    totalSales: 8500000,
    orderCount: 8,
    lastOrderDate: "2024-01-14",
    status: "new",
    avgOrderValue: 1062500,
    purchaseFrequency: 2.7,
    customerSince: "2024-01-01",
    categories: ["RGB", "PET"],
    contactPerson: "Aisha Mohammed",
    phone: "+234-806-789-0123",
    address: "987 Kaduna Road, Kaduna State"
  },
  {
    id: "CUST007",
    name: "Enugu Eastern Hub",
    region: "Enugu",
    channel: "Modern Trade",
    customerType: "distributor",
    sizeTier: "bronze",
    totalSales: 6200000,
    orderCount: 6,
    lastOrderDate: "2024-01-13",
    status: "new",
    avgOrderValue: 1033333,
    purchaseFrequency: 2.0,
    customerSince: "2024-01-15",
    categories: ["PET", "Water"],
    contactPerson: "Chinedu Okafor",
    phone: "+234-807-890-1234",
    address: "147 Enugu Street, Enugu State"
  },
  // At-risk customers
  {
    id: "CUST008",
    name: "Benin Legacy Stores",
    region: "Benin",
    channel: "General Trade",
    customerType: "retailer",
    sizeTier: "silver",
    totalSales: 12000000,
    orderCount: 4,
    lastOrderDate: "2023-12-20",
    status: "churn-risk",
    avgOrderValue: 3000000,
    purchaseFrequency: 0.3,
    customerSince: "2020-06-10",
    categories: ["RGB"],
    contactPerson: "Osas Egharevba",
    phone: "+234-808-901-2345",
    address: "258 Benin Road, Edo State"
  },
  {
    id: "CUST009",
    name: "Ilorin Corner Shop",
    region: "Ilorin",
    channel: "General Trade",
    customerType: "retailer",
    sizeTier: "bronze",
    totalSales: 4500000,
    orderCount: 2,
    lastOrderDate: "2023-11-15",
    status: "churn-risk",
    avgOrderValue: 2250000,
    purchaseFrequency: 0.2,
    customerSince: "2022-02-28",
    categories: ["RGB", "PET"],
    contactPerson: "Aminu Suleiman",
    phone: "+234-809-012-3456",
    address: "369 Ilorin Street, Kwara State"
  },
  // Inactive customers
  {
    id: "CUST010",
    name: "Aba Old Distributors",
    region: "Aba",
    channel: "General Trade",
    customerType: "distributor",
    sizeTier: "bronze",
    totalSales: 8000000,
    orderCount: 1,
    lastOrderDate: "2023-08-10",
    status: "inactive",
    avgOrderValue: 8000000,
    purchaseFrequency: 0.1,
    customerSince: "2019-12-01",
    categories: ["RGB"],
    contactPerson: "Ngozi Okonkwo",
    phone: "+234-810-123-4567",
    address: "741 Aba Road, Abia State"
  }
];

export const customerGrowthData: CustomerGrowthData[] = [
  { period: "Jan 2023", activeCustomers: 2800, newCustomers: 120, churnedCustomers: 80 },
  { period: "Feb 2023", activeCustomers: 2840, newCustomers: 140, churnedCustomers: 100 },
  { period: "Mar 2023", activeCustomers: 2880, newCustomers: 160, churnedCustomers: 120 },
  { period: "Apr 2023", activeCustomers: 2920, newCustomers: 180, churnedCustomers: 140 },
  { period: "May 2023", activeCustomers: 2960, newCustomers: 200, churnedCustomers: 160 },
  { period: "Jun 2023", activeCustomers: 3000, newCustomers: 220, churnedCustomers: 180 },
  { period: "Jul 2023", activeCustomers: 3040, newCustomers: 240, churnedCustomers: 200 },
  { period: "Aug 2023", activeCustomers: 3080, newCustomers: 260, churnedCustomers: 220 },
  { period: "Sep 2023", activeCustomers: 3120, newCustomers: 280, churnedCustomers: 240 },
  { period: "Oct 2023", activeCustomers: 3160, newCustomers: 300, churnedCustomers: 260 },
  { period: "Nov 2023", activeCustomers: 3200, newCustomers: 320, churnedCustomers: 280 },
  { period: "Dec 2023", activeCustomers: 3240, newCustomers: 340, churnedCustomers: 300 },
  { period: "Jan 2024", activeCustomers: 3280, newCustomers: 360, churnedCustomers: 320 },
  { period: "Feb 2024", activeCustomers: 3320, newCustomers: 380, churnedCustomers: 340 },
  { period: "Mar 2024", activeCustomers: 3360, newCustomers: 400, churnedCustomers: 360 },
  { period: "Apr 2024", activeCustomers: 3400, newCustomers: 420, churnedCustomers: 380 },
  { period: "May 2024", activeCustomers: 3440, newCustomers: 440, churnedCustomers: 400 },
  { period: "Jun 2024", activeCustomers: 3480, newCustomers: 460, churnedCustomers: 420 },
  { period: "Jul 2024", activeCustomers: 3520, newCustomers: 480, churnedCustomers: 440 },
  { period: "Aug 2024", activeCustomers: 3560, newCustomers: 500, churnedCustomers: 460 },
  { period: "Sep 2024", activeCustomers: 3600, newCustomers: 520, churnedCustomers: 480 },
  { period: "Oct 2024", activeCustomers: 3640, newCustomers: 540, churnedCustomers: 500 },
  { period: "Nov 2024", activeCustomers: 3680, newCustomers: 560, churnedCustomers: 520 },
  { period: "Dec 2024", activeCustomers: 3720, newCustomers: 580, churnedCustomers: 540 }
];

export const customerSegments: CustomerSegment[] = [
  // By Region
  { segment: "Ikeja", type: "region", count: 1240, percentage: 38.1, avgOrderValue: 1200000, totalSales: 1488000000 },
  { segment: "Abuja", type: "region", count: 680, percentage: 20.9, avgOrderValue: 1100000, totalSales: 748000000 },
  { segment: "Kano", type: "region", count: 420, percentage: 12.9, avgOrderValue: 950000, totalSales: 399000000 },
  { segment: "Kaduna", type: "region", count: 380, percentage: 11.7, avgOrderValue: 900000, totalSales: 342000000 },
  { segment: "Aba", type: "region", count: 350, percentage: 10.8, avgOrderValue: 850000, totalSales: 297500000 },
  { segment: "Enugu", type: "region", count: 320, percentage: 9.8, avgOrderValue: 920000, totalSales: 294400000 },
  { segment: "Benin", type: "region", count: 300, percentage: 9.2, avgOrderValue: 880000, totalSales: 264000000 },
  { segment: "Ibadan", type: "region", count: 388, percentage: 11.9, avgOrderValue: 1050000, totalSales: 407400000 },
  { segment: "Ilorin", type: "region", count: 280, percentage: 8.6, avgOrderValue: 800000, totalSales: 224000000 },

  // By Channel
  { segment: "General Trade", type: "channel", count: 1800, percentage: 55.4, avgOrderValue: 850000, totalSales: 1530000000 },
  { segment: "Modern Trade", type: "channel", count: 850, percentage: 26.2, avgOrderValue: 2500000, totalSales: 2125000000 },
  { segment: "HORECA", type: "channel", count: 598, percentage: 18.4, avgOrderValue: 1800000, totalSales: 1076400000 },

  // By Customer Type
  { segment: "Distributor", type: "customerType", count: 1200, percentage: 36.9, avgOrderValue: 2200000, totalSales: 2640000000 },
  { segment: "Wholesaler", type: "customerType", count: 950, percentage: 29.2, avgOrderValue: 1500000, totalSales: 1425000000 },
  { segment: "Retailer", type: "customerType", count: 898, percentage: 27.6, avgOrderValue: 1200000, totalSales: 1077600000 },
  { segment: "On-Premise", type: "customerType", count: 200, percentage: 6.2, avgOrderValue: 2000000, totalSales: 400000000 },

  // By Size Tier
  { segment: "Gold", type: "sizeTier", count: 450, percentage: 13.8, avgOrderValue: 3500000, totalSales: 1575000000 },
  { segment: "Silver", type: "sizeTier", count: 1200, percentage: 36.9, avgOrderValue: 1800000, totalSales: 2160000000 },
  { segment: "Bronze", type: "sizeTier", count: 1598, percentage: 49.2, avgOrderValue: 1200000, totalSales: 1917600000 }
];

export const customerInsights: CustomerInsight[] = [
  {
    type: 'positive',
    title: 'Strong Customer Growth in Kaduna',
    description: 'Kaduna region added 120 new outlets this quarter, representing the highest growth rate across all regions.',
    impact: '25% increase in regional customer base'
  },
  {
    type: 'positive',
    title: 'Modern Trade Channel Excellence',
    description: 'Modern Trade customers show significantly higher average order values (₦2.5M) compared to General Trade (₦850K).',
    impact: '3x higher AOV than General Trade'
  },
  {
    type: 'negative',
    title: 'General Trade Churn Concerns',
    description: 'General Trade customers show higher churn rate (18%) compared to Modern Trade (7%), indicating retention challenges.',
    impact: '₦180M revenue at risk'
  },
  {
    type: 'positive',
    title: 'Top Customer Concentration',
    description: 'Top 50 customers (1.5% of base) contribute 42.5% of total revenue, showing strong high-value customer relationships.',
    impact: 'High customer value concentration'
  },
  {
    type: 'neutral',
    title: 'Customer Penetration Opportunity',
    description: 'Only 35% of customers stock multiple categories. Cross-selling opportunities exist in RGB and Energy categories.',
    impact: 'Revenue expansion potential'
  }
];
