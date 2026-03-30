export type PersonaKey = 'commuter' | 'tradie' | 'truckie' | 'household';
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

export const personaOrder: PersonaKey[] = ['commuter', 'tradie', 'truckie', 'household'];
