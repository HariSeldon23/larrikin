export type PersonaKey = 'commuter' | 'tradie' | 'truckie' | 'construction' | 'agriculture' | 'courier' | 'household';
export type FuelType = 'petrol' | 'diesel';

export interface PersonaDefaults {
  key: PersonaKey;
  label: string;
  subtitle: string;
  icon: string;
  kmPerYear: number;
  fuelEconomy: number;    // L/100km
  fuelType: FuelType;
  currentVehicleValue: number;
}

export const personas: Record<PersonaKey, PersonaDefaults> = {
  commuter: {
    key: 'commuter',
    label: 'Commuter',
    subtitle: 'Hatchback or sedan, daily driving',
    icon: '🚗',
    kmPerYear: 15000,
    fuelEconomy: 8,
    fuelType: 'petrol',
    currentVehicleValue: 15000,
  },
  tradie: {
    key: 'tradie',
    label: 'Tradie',
    subtitle: 'HiLux / Ranger, work + personal',
    icon: '🛻',
    kmPerYear: 25000,
    fuelEconomy: 11,
    fuelType: 'diesel',
    currentVehicleValue: 25000,
  },
  truckie: {
    key: 'truckie',
    label: 'Truckie',
    subtitle: 'Owner-operator, prime mover',
    icon: '🚛',
    kmPerYear: 120000,
    fuelEconomy: 40,
    fuelType: 'diesel',
    currentVehicleValue: 0,
  },
  construction: {
    key: 'construction',
    label: 'Construction',
    subtitle: '5-ute fleet, diesel, site-to-site',
    icon: '🏗️',
    kmPerYear: 150000,    // 5 utes × 30,000 km/yr
    fuelEconomy: 12,      // L/100km — loaded utes, stop-start site driving
    fuelType: 'diesel',
    currentVehicleValue: 125000,  // 5 utes avg $25k each
  },
  agriculture: {
    key: 'agriculture',
    label: 'Farmer',
    subtitle: '2 utes + tractor & machinery diesel',
    icon: '🌾',
    kmPerYear: 60000,       // 2 utes × 25k km + ~10k km-equivalent machinery hours
    fuelEconomy: 14,        // L/100km — utes on dirt roads + heavy equipment blended
    fuelType: 'diesel',
    currentVehicleValue: 60000,   // 2 utes avg $30k each
  },
  courier: {
    key: 'courier',
    label: 'Courier',
    subtitle: '3-van delivery fleet, metro routes',
    icon: '📦',
    kmPerYear: 120000,      // 3 vans × 40,000 km/yr — last-mile delivery
    fuelEconomy: 10,        // L/100km — loaded vans, constant stop-start
    fuelType: 'petrol',
    currentVehicleValue: 45000,   // 3 vans avg $15k each
  },
  household: {
    key: 'household',
    label: 'Household',
    subtitle: 'Not changing vehicle — show indirect impact',
    icon: '🏠',
    kmPerYear: 15000,
    fuelEconomy: 8,
    fuelType: 'petrol',
    currentVehicleValue: 0,
  },
};

export const personaOrder: PersonaKey[] = ['commuter', 'tradie', 'truckie', 'construction', 'agriculture', 'courier', 'household'];
