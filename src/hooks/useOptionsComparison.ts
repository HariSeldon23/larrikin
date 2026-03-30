import { useMemo } from 'react';
import {
  LPG_PRICE_RETAIL,
  LPG_EFFICIENCY_PENALTY,
  LPG_CONVERSION_CAR,
  LPG_CONVERSION_UTE,
  LPG_CONVERSION_PRIME_MOVER,
  EV_KWH_PER_100KM,
  EV_COST_PER_KWH_HOME,
  EV_PURCHASE_PRACTICAL,
  EV_PURCHASE_UTE,
  EV_HOME_CHARGER_INSTALL,
} from '../data/constants';
import type { PersonaKey, FuelType } from '../data/personas';

export interface OptionResult {
  key: string;
  label: string;
  upfrontCost: number;
  annualFuelCost: number;
  annualSaving: number;
  monthsToPayback: number;
  netPositionYear1: number;
  netPositionYear3: number;
  netPositionYear5: number;
  caveats: string[];
  color: string;
  monthlyData: { month: number; cumulative: number }[];
}

interface ComparisonInputs {
  kmPerYear: number;
  fuelEconomy: number;   // L/100km
  fuelType: FuelType;
  currentVehicleValue: number;
  persona: PersonaKey;
}

function buildMonthlyData(monthlySaving: number, upfrontCost: number, months: number) {
  return Array.from({ length: months }, (_, i) => ({
    month: i + 1,
    cumulative: monthlySaving * (i + 1) - upfrontCost,
  }));
}

const EV_CAVEATS = [
  'Range limitations for regional/rural driving',
  'Charging infrastructure gaps outside metro areas',
  'Higher upfront cost even with FBT exemption',
  'If financed, interest adds to payback time',
];

const LPG_CAVEATS = [
  'Station network is shrinking (<200 in NSW)',
  'LPG pricing tracks international benchmarks',
  'Second-hand value of converted vehicles is uncertain',
  'No new LPG vehicles sold — conversion only',
];

const STATUS_QUO_CAVEATS = [
  'If crisis persists 12–36 months, cumulative cost is enormous',
  'Every dollar spent on imported fuel at crisis prices leaves Australia',
];

export function useOptionsComparison(
  inputs: ComparisonInputs,
  crisisPetrolPrice: number,
  crisisDieselPrice: number,
): OptionResult[] {
  return useMemo(() => {
    const { kmPerYear, fuelEconomy, fuelType, currentVehicleValue, persona } = inputs;
    const litresPerYear = (kmPerYear / 100) * fuelEconomy;
    const crisisPrice = fuelType === 'petrol' ? crisisPetrolPrice : crisisDieselPrice;
    const statusQuoAnnualCost = litresPerYear * crisisPrice;

    const options: OptionResult[] = [];

    // --- Status Quo (always shown) ---
    options.push({
      key: 'status-quo',
      label: 'Do Nothing',
      upfrontCost: 0,
      annualFuelCost: statusQuoAnnualCost,
      annualSaving: 0,
      monthsToPayback: 0,
      netPositionYear1: 0,
      netPositionYear3: 0,
      netPositionYear5: 0,
      caveats: STATUS_QUO_CAVEATS,
      color: '#525252',
      monthlyData: Array.from({ length: 36 }, (_, i) => ({ month: i + 1, cumulative: 0 })),
    });

    // --- LPG Option ---
    const showLPG = persona !== 'household';
    if (showLPG) {
      const lpgConversionCost =
        persona === 'truckie' ? LPG_CONVERSION_PRIME_MOVER :
        persona === 'tradie' ? LPG_CONVERSION_UTE :
        LPG_CONVERSION_CAR;

      const lpgLitresPerYear = litresPerYear * LPG_EFFICIENCY_PENALTY;
      const lpgAnnualCost = lpgLitresPerYear * LPG_PRICE_RETAIL;
      const lpgAnnualSaving = statusQuoAnnualCost - lpgAnnualCost;
      const lpgMonthlySaving = lpgAnnualSaving / 12;
      const lpgMonthsPayback = lpgMonthlySaving > 0
        ? Math.ceil(lpgConversionCost / lpgMonthlySaving)
        : 0;

      options.push({
        key: 'lpg',
        label: persona === 'truckie' ? 'Convert to LPG ($20k)' :
               persona === 'tradie' ? 'Convert to LPG ($4k)' :
               'Convert to LPG ($2.5k)',
        upfrontCost: lpgConversionCost,
        annualFuelCost: lpgAnnualCost,
        annualSaving: lpgAnnualSaving,
        monthsToPayback: lpgMonthsPayback,
        netPositionYear1: lpgAnnualSaving - lpgConversionCost,
        netPositionYear3: lpgAnnualSaving * 3 - lpgConversionCost,
        netPositionYear5: lpgAnnualSaving * 5 - lpgConversionCost,
        caveats: LPG_CAVEATS,
        color: '#d97706',
        monthlyData: buildMonthlyData(lpgMonthlySaving, lpgConversionCost, 36),
      });
    }

    // --- EV Option ---
    const showEV = persona !== 'truckie'; // No electric prime movers
    if (showEV) {
      const evPurchasePrice = persona === 'tradie' ? EV_PURCHASE_UTE : EV_PURCHASE_PRACTICAL;
      const evUpfront = evPurchasePrice - currentVehicleValue + EV_HOME_CHARGER_INSTALL;
      const evAnnualFuelCost = (kmPerYear / 100) * EV_KWH_PER_100KM * EV_COST_PER_KWH_HOME;
      const evAnnualSaving = statusQuoAnnualCost - evAnnualFuelCost;
      const evMonthlySaving = evAnnualSaving / 12;
      const evMonthsPayback = evMonthlySaving > 0
        ? Math.ceil(evUpfront / evMonthlySaving)
        : 0;

      const evCaveatsForPersona = persona === 'tradie'
        ? [...EV_CAVEATS, 'No viable EV ute under $60k']
        : EV_CAVEATS;

      options.push({
        key: 'ev',
        label: persona === 'tradie'
          ? `Buy EV Ute ($${(evPurchasePrice / 1000).toFixed(0)}k)`
          : `Buy EV ($${(evPurchasePrice / 1000).toFixed(0)}k)`,
        upfrontCost: evUpfront,
        annualFuelCost: evAnnualFuelCost,
        annualSaving: evAnnualSaving,
        monthsToPayback: evMonthsPayback,
        netPositionYear1: evAnnualSaving - evUpfront,
        netPositionYear3: evAnnualSaving * 3 - evUpfront,
        netPositionYear5: evAnnualSaving * 5 - evUpfront,
        caveats: evCaveatsForPersona,
        color: '#2563eb',
        monthlyData: buildMonthlyData(evMonthlySaving, evUpfront, 36),
      });
    }

    return options;
  }, [inputs, crisisPetrolPrice, crisisDieselPrice]);
}
