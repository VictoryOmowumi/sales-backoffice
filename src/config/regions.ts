// Nigerian regions and their territories
export const REGIONS_AND_TERRITORIES = {
  "Abuja": {
    name: "Abuja",
    state: "FCT",
    territories: [
      "Abuja Municipal",
      "Gwagwalada", 
      "Kuje",
      "Bwari",
      "Kwali",
      "Abaji"
    ]
  },
  "Kano": {
    name: "Kano", 
    state: "Kano",
    territories: [
      "Kano Municipal",
      "Nassarawa",
      "Fagge",
      "Dala",
      "Gwale",
      "Tarauni",
      "Ungogo",
      "Kumbotso"
    ]
  },
  "Kaduna": {
    name: "Kaduna",
    state: "Kaduna", 
    territories: [
      "Kaduna North",
      "Kaduna South",
      "Chikun",
      "Igabi",
      "Ikara",
      "Jaba",
      "Jema'a",
      "Kachia",
      "Kagarko",
      "Kajuru",
      "Kaura",
      "Kauru",
      "Kubau",
      "Kudan",
      "Lere",
      "Makarfi",
      "Sabon Gari",
      "Sanga",
      "Soba",
      "Zangon Kataf",
      "Zaria"
    ]
  },
  "Aba": {
    name: "Aba",
    state: "Abia",
    territories: [
      "Aba North",
      "Aba South", 
      "Arochukwu",
      "Bende",
      "Ikwuano",
      "Isiala Ngwa North",
      "Isiala Ngwa South",
      "Isuikwuato",
      "Obi Ngwa",
      "Ohafia",
      "Osisioma",
      "Ugwunagbo",
      "Ukwa East",
      "Ukwa West",
      "Umuahia North",
      "Umuahia South",
      "Umu Nneochi"
    ]
  },
  "Enugu": {
    name: "Enugu",
    state: "Enugu",
    territories: [
      "Enugu East",
      "Enugu North", 
      "Enugu South",
      "Aninri",
      "Awgu",
      "Ezeagu",
      "Igbo Etiti",
      "Igbo Eze North",
      "Igbo Eze South",
      "Isi Uzo",
      "Nkanu East",
      "Nkanu West",
      "Nsukka",
      "Oji River",
      "Udenu",
      "Udi",
      "Uzo Uwani"
    ]
  },
  "Benin": {
    name: "Benin",
    state: "Edo",
    territories: [
      "Oredo",
      "Egor",
      "Ikpoba Okha",
      "Ovia North East",
      "Ovia South West",
      "Orhionmwon",
      "Uhunmwonde",
      "Etsako Central",
      "Etsako East",
      "Etsako West",
      "Akoko Edo",
      "Owan East",
      "Owan West"
    ]
  },
  "Ibadan": {
    name: "Ibadan",
    state: "Oyo",
    territories: [
      "Ibadan North",
      "Ibadan North East",
      "Ibadan North West", 
      "Ibadan South East",
      "Ibadan South West",
      "Akinyele",
      "Egbeda",
      "Ido",
      "Lagelu",
      "Oluyole",
      "Ona Ara"
    ]
  },
  "Ilorin": {
    name: "Ilorin",
    state: "Kwara",
    territories: [
      "Ilorin East",
      "Ilorin South",
      "Ilorin West",
      "Asa",
      "Baruten",
      "Edu",
      "Ekiti",
      "Ifelodun",
      "Irepodun",
      "Isin",
      "Kaiama",
      "Moro",
      "Offa",
      "Oke Ero",
      "Oyun",
      "Pategi"
    ]
  },
  "Ikeja": {
    name: "Ikeja",
    state: "Lagos",
    territories: [
      "Ikeja",
      "Agege",
      "Alimosho",
      "Ifako-Ijaiye",
      "Kosofe",
      "Mushin",
      "Oshodi-Isolo",
      "Shomolu",
      "Surulere",
      "Ajeromi-Ifelodun",
      "Amuwo-Odofin",
      "Apapa",
      "Badagry",
      "Epe",
      "Eti-Osa",
      "Ibeju-Lekki",
      "Ifelodun",
      "Ikorodu",
      "Lagos Island",
      "Lagos Mainland"
    ]
  }
} as const;

export type RegionName = keyof typeof REGIONS_AND_TERRITORIES;
export type TerritoryName = typeof REGIONS_AND_TERRITORIES[RegionName]["territories"][number];

// Helper functions
export function getTerritoriesForRegion(region: RegionName): readonly string[] {
  return REGIONS_AND_TERRITORIES[region].territories;
}

export function getRegionForTerritory(territory: string): RegionName | null {
  for (const [regionName, regionData] of Object.entries(REGIONS_AND_TERRITORIES)) {
    if ((regionData.territories as readonly string[]).includes(territory)) {
      return regionName as RegionName;
    }
  }
  return null;
}

export function getAllRegions(): string[] {
  return Object.keys(REGIONS_AND_TERRITORIES);
}

export function getAllTerritories(): string[] {
  return Object.values(REGIONS_AND_TERRITORIES).flatMap(region => region.territories);
}
