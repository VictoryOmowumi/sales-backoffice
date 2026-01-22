// src/data/mockDealers.ts

export type DealerRow = {
  id: string;
  regionId: string;
  tdmName: string;
  salesmanName: string;
  dealerType: "Distributor" | "Wholesaler" | "Retailer";
  bc2: string;      // territory / BC2
  dealerNo: string;
  dealerName: string;
};

const makeDealer = (
  id: string,
  regionId: string,
  tdmName: string,
  salesmanName: string,
  dealerType: DealerRow["dealerType"],
  bc2: string,
  dealerNo: string,
  dealerName: string
): DealerRow => ({
  id,
  regionId,
  tdmName,
  salesmanName,
  dealerType,
  bc2,
  dealerNo,
  dealerName,
});

// For now we hard-code a few per region – you can expand or replace with faker.
export const MOCK_DEALERS: DealerRow[] = [
  // ENUGU region – includes your sample row
  makeDealer(
    "dealer-enugu-1",
    "region-enugu",
    "CHIMA ONU (STDM)",
    "PROMISE CHIGBU",
    "Distributor",
    "UYO",
    "1003003",
    "Tobros Nig Ltd"
  ),
  makeDealer(
    "dealer-enugu-2",
    "region-enugu",
    "CHIMA ONU (STDM)",
    "UWEMEDIMO EDEM",
    "Distributor",
    "EKET",
    "1003005",
    "Zeglo Ventures"
  ),
  makeDealer(
    "dealer-enugu-3",
    "region-enugu",
    "CHIMA ONU (STDM)",
    "AMAKA OKAFOR",
    "Wholesaler",
    "NSUKKA",
    "1003010",
    "Nsukka Wholesale Stores"
  ),
  makeDealer(
    "dealer-enugu-4",
    "region-enugu",
    "CHIMA ONU (STDM)",
    "KELVIN EZE",
    "Retailer",
    "ENUGU",
    "1003015",
    "Kelvin Supermart"
  ),
  // You can add similar sets for other regions if you like
];

export function getDealersForRegion(regionId: string, regionName?: string): DealerRow[] {
  // Try to match by ID first, then by name if provided
  if (regionName) {
    const nameMap: Record<string, string> = {
      "Enugu": "region-enugu",
      "Abuja": "region-abuja",
      "Kano": "region-kano",
      "Kaduna": "region-kaduna",
      "Aba": "region-aba",
      "Benin": "region-benin",
      "Ibadan": "region-ibadan",
      "Ilorin": "region-ilorin",
      "Ikeja": "region-ikeja",
    };
    const mappedId = nameMap[regionName];
    if (mappedId) {
      return MOCK_DEALERS.filter((d) => d.regionId === mappedId);
    }
  }
  return MOCK_DEALERS.filter((d) => d.regionId === regionId);
}

