import { useMemo } from 'react';
import {
  PETROL_PRICE_BASELINE,
  DIESEL_PRICE_BASELINE,
  FREIGHT_COST_PERCENT_OF_GROCERY,
  AVERAGE_WEEKLY_GROCERY,
} from '../data/constants';
import type { FuelType } from '../data/personas';

export interface CrisisInputs {
  kmPerYear: number;
  fuelEconomy: number;   // L/100km
  fuelType: FuelType;
}

export interface CrisisImpactResult {
  litresPerYear: number;
  annualCostBefore: number;
  annualCostNow: number;
  annualCrisisPremium: number;
  weeklyCrisisPremium: number;
  // Household indirect
  weeklyGroceryPremium: number;
  totalWeeklyImpact: number;
}

export function useCrisisImpact(
  inputs: CrisisInputs,
  crisisPetrolPrice: number,
  crisisDieselPrice: number,
): CrisisImpactResult {
  return useMemo(() => {
    const { kmPerYear, fuelEconomy, fuelType } = inputs;

    const litresPerYear = (kmPerYear / 100) * fuelEconomy;
    const baseline = fuelType === 'petrol' ? PETROL_PRICE_BASELINE : DIESEL_PRICE_BASELINE;
    const crisisPrice = fuelType === 'petrol' ? crisisPetrolPrice : crisisDieselPrice;

    const annualCostBefore = litresPerYear * baseline;
    const annualCostNow = litresPerYear * crisisPrice;
    const annualCrisisPremium = annualCostNow - annualCostBefore;
    const weeklyCrisisPremium = annualCrisisPremium / 52;

    // Grocery freight premium: diesel price increase ratio × freight share of grocery
    const dieselRatio = (crisisDieselPrice - DIESEL_PRICE_BASELINE) / DIESEL_PRICE_BASELINE;
    const weeklyGroceryPremium = AVERAGE_WEEKLY_GROCERY * FREIGHT_COST_PERCENT_OF_GROCERY * dieselRatio;
    const totalWeeklyImpact = weeklyCrisisPremium + weeklyGroceryPremium;

    return {
      litresPerYear,
      annualCostBefore,
      annualCostNow,
      annualCrisisPremium,
      weeklyCrisisPremium,
      weeklyGroceryPremium,
      totalWeeklyImpact,
    };
  }, [inputs, crisisPetrolPrice, crisisDieselPrice]);
}
