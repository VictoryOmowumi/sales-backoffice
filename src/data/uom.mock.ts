export type UOMData = {
  uom: string;
  category: string;
  brand: string;
  variant: string;
  region: string;
  uomSize: 'small' | 'medium' | 'large';
  currentPeriod: {
    volume: number; // cases
    value: number; // NGN
    units: number; // individual units
  };
  previousPeriod: {
    volume: number;
    value: number;
    units: number;
  };
  lastYear: {
    volume: number;
    value: number;
    units: number;
  };
  avgPricePerCase: number;
  shareOfMix: number; // percentage
  growthVsPP: number; // percentage
  growthVsLY: number; // percentage
  channelMix: {
    modernTrade: number;
    traditional: number;
    horca: number;
    ecommerce: number;
  };
};

export const uomData: UOMData[] = [
  // PET Category
  {
    uom: "PET 50cl",
    category: "PET",
    brand: "Pepsi",
    variant: "Regular",
    region: "Lagos",
    uomSize: "medium",
    currentPeriod: { volume: 125000, value: 187500000, units: 1500000 },
    previousPeriod: { volume: 118000, value: 177000000, units: 1416000 },
    lastYear: { volume: 110000, value: 165000000, units: 1320000 },
    avgPricePerCase: 1500,
    shareOfMix: 28.5,
    growthVsPP: 5.9,
    growthVsLY: 13.6,
    channelMix: { modernTrade: 45, traditional: 35, horca: 15, ecommerce: 5 }
  },
  {
    uom: "PET 50cl",
    category: "PET",
    brand: "Mirinda",
    variant: "Orange",
    region: "Abuja",
    uomSize: "medium",
    currentPeriod: { volume: 85000, value: 127500000, units: 1020000 },
    previousPeriod: { volume: 82000, value: 123000000, units: 984000 },
    lastYear: { volume: 78000, value: 117000000, units: 936000 },
    avgPricePerCase: 1500,
    shareOfMix: 19.4,
    growthVsPP: 3.7,
    growthVsLY: 9.0,
    channelMix: { modernTrade: 40, traditional: 40, horca: 15, ecommerce: 5 }
  },
  {
    uom: "PET 1L",
    category: "PET",
    brand: "Pepsi",
    variant: "Regular",
    region: "Lagos",
    uomSize: "large",
    currentPeriod: { volume: 45000, value: 112500000, units: 540000 },
    previousPeriod: { volume: 42000, value: 105000000, units: 504000 },
    lastYear: { volume: 38000, value: 95000000, units: 456000 },
    avgPricePerCase: 2500,
    shareOfMix: 12.8,
    growthVsPP: 7.1,
    growthVsLY: 18.4,
    channelMix: { modernTrade: 60, traditional: 25, horca: 10, ecommerce: 5 }
  },
  {
    uom: "PET 1.5L",
    category: "PET",
    brand: "Pepsi",
    variant: "Regular",
    region: "Port Harcourt",
    uomSize: "large",
    currentPeriod: { volume: 32000, value: 96000000, units: 480000 },
    previousPeriod: { volume: 30000, value: 90000000, units: 450000 },
    lastYear: { volume: 28000, value: 84000000, units: 420000 },
    avgPricePerCase: 3000,
    shareOfMix: 9.1,
    growthVsPP: 6.7,
    growthVsLY: 14.3,
    channelMix: { modernTrade: 70, traditional: 20, horca: 5, ecommerce: 5 }
  },

  // RGB Category
  {
    uom: "RGB 35cl",
    category: "RGB",
    brand: "Pepsi",
    variant: "Regular",
    region: "Lagos",
    uomSize: "small",
    currentPeriod: { volume: 180000, value: 144000000, units: 2160000 },
    previousPeriod: { volume: 175000, value: 140000000, units: 2100000 },
    lastYear: { volume: 170000, value: 136000000, units: 2040000 },
    avgPricePerCase: 800,
    shareOfMix: 20.5,
    growthVsPP: 2.9,
    growthVsLY: 5.9,
    channelMix: { modernTrade: 20, traditional: 60, horca: 15, ecommerce: 5 }
  },
  {
    uom: "RGB 35cl",
    category: "RGB",
    brand: "Mirinda",
    variant: "Orange",
    region: "Abuja",
    uomSize: "small",
    currentPeriod: { volume: 120000, value: 96000000, units: 1440000 },
    previousPeriod: { volume: 125000, value: 100000000, units: 1500000 },
    lastYear: { volume: 130000, value: 104000000, units: 1560000 },
    avgPricePerCase: 800,
    shareOfMix: 13.7,
    growthVsPP: -4.0,
    growthVsLY: -7.7,
    channelMix: { modernTrade: 15, traditional: 65, horca: 15, ecommerce: 5 }
  },

  // Water Category
  {
    uom: "PET 50cl",
    category: "Water",
    brand: "Aquafina",
    variant: "Still",
    region: "Lagos",
    uomSize: "medium",
    currentPeriod: { volume: 95000, value: 142500000, units: 1140000 },
    previousPeriod: { volume: 90000, value: 135000000, units: 1080000 },
    lastYear: { volume: 85000, value: 127500000, units: 1020000 },
    avgPricePerCase: 1500,
    shareOfMix: 16.2,
    growthVsPP: 5.6,
    growthVsLY: 11.8,
    channelMix: { modernTrade: 50, traditional: 30, horca: 15, ecommerce: 5 }
  },
  {
    uom: "PET 1L",
    category: "Water",
    brand: "Aquafina",
    variant: "Still",
    region: "Port Harcourt",
    uomSize: "large",
    currentPeriod: { volume: 38000, value: 95000000, units: 456000 },
    previousPeriod: { volume: 35000, value: 87500000, units: 420000 },
    lastYear: { volume: 32000, value: 80000000, units: 384000 },
    avgPricePerCase: 2500,
    shareOfMix: 10.8,
    growthVsPP: 8.6,
    growthVsLY: 18.8,
    channelMix: { modernTrade: 65, traditional: 20, horca: 10, ecommerce: 5 }
  },

  // Energy Category
  {
    uom: "PET 25cl",
    category: "Energy",
    brand: "Sting",
    variant: "Red",
    region: "Abuja",
    uomSize: "small",
    currentPeriod: { volume: 25000, value: 62500000, units: 300000 },
    previousPeriod: { volume: 22000, value: 55000000, units: 264000 },
    lastYear: { volume: 20000, value: 50000000, units: 240000 },
    avgPricePerCase: 2500,
    shareOfMix: 5.7,
    growthVsPP: 13.6,
    growthVsLY: 25.0,
    channelMix: { modernTrade: 55, traditional: 30, horca: 10, ecommerce: 5 }
  },
  {
    uom: "PET 50cl",
    category: "Energy",
    brand: "Sting",
    variant: "Red",
    region: "Lagos",
    uomSize: "medium",
    currentPeriod: { volume: 15000, value: 37500000, units: 180000 },
    previousPeriod: { volume: 14000, value: 35000000, units: 168000 },
    lastYear: { volume: 12000, value: 30000000, units: 144000 },
    avgPricePerCase: 2500,
    shareOfMix: 3.4,
    growthVsPP: 7.1,
    growthVsLY: 25.0,
    channelMix: { modernTrade: 60, traditional: 25, horca: 10, ecommerce: 5 }
  }
];

export type UOMSummary = {
  totalVolume: number;
  totalValue: number;
  totalUnits: number;
  avgGrowthVsPP: number;
  avgGrowthVsLY: number;
  topPerformingUOM: string;
  topDecliningUOM: string;
  channelInsights: {
    modernTrade: { volume: number; share: number };
    traditional: { volume: number; share: number };
    horca: { volume: number; share: number };
    ecommerce: { volume: number; share: number };
  };
};

export const uomSummary: UOMSummary = {
  totalVolume: 756000,
  totalValue: 1134000000,
  totalUnits: 9072000,
  avgGrowthVsPP: 5.2,
  avgGrowthVsLY: 12.1,
  topPerformingUOM: "PET 25cl (Sting Red)",
  topDecliningUOM: "RGB 35cl (Mirinda Orange)",
  channelInsights: {
    modernTrade: { volume: 302400, share: 40.0 },
    traditional: { volume: 302400, share: 40.0 },
    horca: { volume: 113400, share: 15.0 },
    ecommerce: { volume: 37800, share: 5.0 }
  }
};
