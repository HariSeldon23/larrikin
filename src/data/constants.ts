// ============================================================
// FUEL CRISIS CALCULATOR — CORE CONSTANTS
// Every value MUST carry a source citation in the UI
// ============================================================

// === PRE-CRISIS BASELINE (February 2026) ===
// Source: AIP Weekly Report, week ending Feb 22, 2026
export const PETROL_PRICE_BASELINE = 1.73;   // $/L national avg ULP
export const DIESEL_PRICE_BASELINE = 1.80;   // $/L national avg diesel

// === CURRENT CRISIS PRICES (Updated weekly from ACCC) ===
// Source: ACCC Weekly Fuel Monitoring, March 27, 2026
export const PETROL_PRICE_CRISIS = 2.52;     // $/L 5 largest cities avg
export const DIESEL_PRICE_CRISIS = 3.04;     // $/L 5 largest cities avg
export const DIESEL_PRICE_REGIONAL = 3.08;   // $/L 190+ regional locations

// === LPG PRICES ===
// Source: GlobalPetrolPrices.com (wholesale), FuelPrice.io (retail)
export const LPG_PRICE_RETAIL = 0.95;        // $/L conservative national avg
export const LPG_EFFICIENCY_PENALTY = 1.30;  // 30% more LPG per km vs petrol
// Source: FuelRadar AU, NRMA — LPG has ~30% less energy per litre

// === EV CHARGING COSTS ===
// Source: EVSE Australia, Solar Choice, National Cover Insurance
export const EV_KWH_PER_100KM = 18;          // kWh/100km average EV consumption
export const EV_COST_PER_KWH_HOME = 0.28;    // $ grid average
export const EV_COST_PER_100KM_HOME = 5.04;  // $ at avg $0.28/kWh
export const EV_COST_PER_100KM_OFFPEAK = 2.00;
export const EV_COST_PER_100KM_SOLAR = 0.50;
export const EV_COST_PER_100KM_PUBLIC = 12.00;

// === CONVERSION / PURCHASE COSTS ===
export const LPG_CONVERSION_UTE = 4000;
export const LPG_CONVERSION_PRIME_MOVER = 20000;
export const LPG_CONVERSION_CAR = 2500;
export const LPG_CONVERSION_FLEET_5_UTES = 20000;  // 5 × $4k each
export const LPG_CONVERSION_FARM_FLEET = 8000;     // 2 utes × $4k each
export const LPG_CONVERSION_COURIER_FLEET = 7500;  // 3 vans × $2.5k each
export const EV_PURCHASE_CHEAPEST = 23990;   // BYD Atto 1 (220km range)
export const EV_PURCHASE_PRACTICAL = 32000;  // BYD Dolphin driveaway (~400km)
export const EV_PURCHASE_UTE = 60000;        // KGM Musso EV
export const EV_HOME_CHARGER_INSTALL = 1750; // $ avg installed

// === MACRO CONTEXT ===
export const FUEL_IMPORT_PERCENT = 90;
export const DOMESTIC_REFINERIES = 2;
export const DIESEL_RESERVE_DAYS = 32;
export const IEA_MINIMUM_DAYS = 90;
export const FREIGHT_COST_PERCENT_OF_GROCERY = 0.10;
export const AVERAGE_WEEKLY_GROCERY = 250;
