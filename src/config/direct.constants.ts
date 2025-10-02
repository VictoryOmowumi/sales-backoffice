export const REGIONS = [
    "Abuja","Kano","Kaduna","Aba","Enugu","Benin","Ibadan","Ilorin","Ikeja",
  ] as const;
  
  export const CHANNELS = [
    "Modern Trade","General Trade","HORECA","E-Commerce",
  ] as const;
  
  export const CATEGORIES = ["RGB","PET","Water","Energy"] as const;
  
  export const BRANDS = [
    "Pepsi","Mirinda","Teem","Aquafina","Lipton Ice Tea","Supa Komando","Rockstar",
  ] as const;
  
  export type Region = typeof REGIONS[number];
  export type Channel = typeof CHANNELS[number];
  export type Category = typeof CATEGORIES[number];
  export type Brand = typeof BRANDS[number];
  
  