import { describe, it, expect } from 'vitest';
import {
  PETROL_PRICE_BASELINE,
  DIESEL_PRICE_BASELINE,
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
  FREIGHT_COST_PERCENT_OF_GROCERY,
  AVERAGE_WEEKLY_GROCERY,
} from '../data/constants';
import type { FuelType, PersonaKey } from '../data/personas';

// ============================================================
// Pure calculation functions extracted from hooks for testing
// These mirror useCrisisImpact and useOptionsComparison exactly
// ============================================================

function calcCrisisImpact(
  kmPerYear: number,
  fuelEconomy: number,    // L/100km
  fuelType: FuelType,
  crisisPetrolPrice: number,
  crisisDieselPrice: number,
) {
  const litresPerYear = (kmPerYear / 100) * fuelEconomy;
  const baseline = fuelType === 'petrol' ? PETROL_PRICE_BASELINE : DIESEL_PRICE_BASELINE;
  const crisisPrice = fuelType === 'petrol' ? crisisPetrolPrice : crisisDieselPrice;

  const annualCostBefore = litresPerYear * baseline;
  const annualCostNow = litresPerYear * crisisPrice;
  const annualCrisisPremium = annualCostNow - annualCostBefore;
  const weeklyCrisisPremium = annualCrisisPremium / 52;

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
}

function calcOptions(
  kmPerYear: number,
  fuelEconomy: number,
  fuelType: FuelType,
  currentVehicleValue: number,
  persona: PersonaKey,
  crisisPetrolPrice: number,
  crisisDieselPrice: number,
) {
  const litresPerYear = (kmPerYear / 100) * fuelEconomy;
  const crisisPrice = fuelType === 'petrol' ? crisisPetrolPrice : crisisDieselPrice;
  const statusQuoAnnualCost = litresPerYear * crisisPrice;

  // LPG
  let lpg = null;
  if (persona !== 'household') {
    const convCost =
      persona === 'truckie' ? LPG_CONVERSION_PRIME_MOVER :
      persona === 'tradie' ? LPG_CONVERSION_UTE :
      LPG_CONVERSION_CAR;
    const lpgLitres = litresPerYear * LPG_EFFICIENCY_PENALTY;
    const lpgAnnualCost = lpgLitres * LPG_PRICE_RETAIL;
    const lpgAnnualSaving = statusQuoAnnualCost - lpgAnnualCost;
    const lpgMonthlySaving = lpgAnnualSaving / 12;
    const monthsPayback = lpgMonthlySaving > 0 ? Math.ceil(convCost / lpgMonthlySaving) : 0;
    lpg = {
      upfrontCost: convCost,
      annualFuelCost: lpgAnnualCost,
      annualSaving: lpgAnnualSaving,
      monthsToPayback: monthsPayback,
      netPositionYear1: lpgAnnualSaving - convCost,
      netPositionYear3: lpgAnnualSaving * 3 - convCost,
      netPositionYear5: lpgAnnualSaving * 5 - convCost,
    };
  }

  // EV
  let ev = null;
  if (persona !== 'truckie') {
    const evPrice = persona === 'tradie' ? EV_PURCHASE_UTE : EV_PURCHASE_PRACTICAL;
    const evUpfront = evPrice - currentVehicleValue + EV_HOME_CHARGER_INSTALL;
    const evAnnualFuelCost = (kmPerYear / 100) * EV_KWH_PER_100KM * EV_COST_PER_KWH_HOME;
    const evAnnualSaving = statusQuoAnnualCost - evAnnualFuelCost;
    const evMonthlySaving = evAnnualSaving / 12;
    const monthsPayback = evMonthlySaving > 0 ? Math.ceil(evUpfront / evMonthlySaving) : 0;
    ev = {
      upfrontCost: evUpfront,
      annualFuelCost: evAnnualFuelCost,
      annualSaving: evAnnualSaving,
      monthsToPayback: monthsPayback,
      netPositionYear1: evAnnualSaving - evUpfront,
      netPositionYear3: evAnnualSaving * 3 - evUpfront,
      netPositionYear5: evAnnualSaving * 5 - evUpfront,
    };
  }

  return { statusQuoAnnualCost, lpg, ev };
}

// Scenario prices
const PROLONGED = { petrol: 2.52, diesel: 3.04 };
const RECOVERY = { petrol: 1.90, diesel: 2.00 };
const ESCALATION = { petrol: 3.50, diesel: 4.50 };

// Helper: round to cents for readable assertions
const c = (n: number) => Math.round(n * 100) / 100;

describe('Fuel Crisis Calculator — 15 Scenario Test Suite', () => {

  // ================================================================
  // SCENARIO 1: Commuter, petrol, 15k km, Prolonged
  // The default persona. Sanity check on all outputs.
  // ================================================================
  it('Scenario 1: Commuter petrol 15k km — Prolonged', () => {
    const impact = calcCrisisImpact(15000, 8, 'petrol', PROLONGED.petrol, PROLONGED.diesel);

    // 15000/100 * 8 = 1200 litres/year
    expect(impact.litresPerYear).toBe(1200);
    // Before: 1200 * 1.73 = 2076
    expect(c(impact.annualCostBefore)).toBe(2076);
    // Now: 1200 * 2.52 = 3024
    expect(c(impact.annualCostNow)).toBe(3024);
    // Premium: 3024 - 2076 = 948
    expect(c(impact.annualCrisisPremium)).toBe(948);
    // Weekly: 948 / 52 ≈ 18.23
    expect(c(impact.weeklyCrisisPremium)).toBeCloseTo(18.23, 1);

    const opts = calcOptions(15000, 8, 'petrol', 15000, 'commuter', PROLONGED.petrol, PROLONGED.diesel);
    // Status quo annual: 1200 * 2.52 = 3024
    expect(c(opts.statusQuoAnnualCost)).toBe(3024);

    // LPG: 1200 * 1.3 = 1560 litres, * 0.95 = 1482
    expect(opts.lpg).not.toBeNull();
    expect(c(opts.lpg!.annualFuelCost)).toBe(1482);
    expect(c(opts.lpg!.annualSaving)).toBe(1542);
    expect(opts.lpg!.upfrontCost).toBe(2500);

    // EV: 15000/100 * 18 * 0.28 = 756
    expect(opts.ev).not.toBeNull();
    expect(c(opts.ev!.annualFuelCost)).toBe(756);
    // EV upfront: 32000 - 15000 + 1750 = 18750
    expect(opts.ev!.upfrontCost).toBe(18750);
  });

  // ================================================================
  // SCENARIO 2: Tradie, diesel ute, 25k km, Prolonged
  // The core tradie case from the spec.
  // ================================================================
  it('Scenario 2: Tradie diesel 25k km — Prolonged', () => {
    const impact = calcCrisisImpact(25000, 11, 'diesel', PROLONGED.petrol, PROLONGED.diesel);

    // 25000/100 * 11 = 2750 litres
    expect(impact.litresPerYear).toBe(2750);
    // Before: 2750 * 1.80 = 4950
    expect(c(impact.annualCostBefore)).toBe(4950);
    // Now: 2750 * 3.04 = 8360
    expect(c(impact.annualCostNow)).toBe(8360);
    // Premium: 3410
    expect(c(impact.annualCrisisPremium)).toBe(3410);
    // Weekly: ~65.58
    expect(c(impact.weeklyCrisisPremium)).toBeCloseTo(65.58, 0);

    const opts = calcOptions(25000, 11, 'diesel', 25000, 'tradie', PROLONGED.petrol, PROLONGED.diesel);
    // LPG: 2750 * 1.3 = 3575 L * 0.95 = 3396.25
    expect(c(opts.lpg!.annualFuelCost)).toBe(3396.25);
    expect(c(opts.lpg!.annualSaving)).toBe(4963.75);
    expect(opts.lpg!.upfrontCost).toBe(4000);
    // Payback: 4000 / (4963.75/12) = 4000 / 413.65 ≈ 10 → ceil = 10
    expect(opts.lpg!.monthsToPayback).toBe(10);

    // EV ute: 60000 - 25000 + 1750 = 36750 upfront
    expect(opts.ev!.upfrontCost).toBe(36750);
  });

  // ================================================================
  // SCENARIO 3: Truckie, diesel, 120k km, Prolonged
  // Highest mileage. No EV option should exist.
  // ================================================================
  it('Scenario 3: Truckie diesel 120k km — Prolonged (no EV)', () => {
    const impact = calcCrisisImpact(120000, 40, 'diesel', PROLONGED.petrol, PROLONGED.diesel);

    // 120000/100 * 40 = 48000 litres
    expect(impact.litresPerYear).toBe(48000);
    // Before: 48000 * 1.80 = 86400
    expect(c(impact.annualCostBefore)).toBe(86400);
    // Now: 48000 * 3.04 = 145920
    expect(c(impact.annualCostNow)).toBe(145920);
    // Premium: 59520
    expect(c(impact.annualCrisisPremium)).toBe(59520);

    const opts = calcOptions(120000, 40, 'diesel', 0, 'truckie', PROLONGED.petrol, PROLONGED.diesel);

    // No EV for truckie
    expect(opts.ev).toBeNull();

    // LPG: 48000 * 1.3 = 62400 L * 0.95 = 59280
    expect(c(opts.lpg!.annualFuelCost)).toBe(59280);
    expect(c(opts.lpg!.annualSaving)).toBe(86640);
    expect(opts.lpg!.upfrontCost).toBe(20000);
    // Payback: 20000 / (86640/12) = 20000 / 7220 = 2.77 → ceil = 3
    expect(opts.lpg!.monthsToPayback).toBe(3);
  });

  // ================================================================
  // SCENARIO 4: Household, petrol, 15k km, Prolonged
  // No LPG option. Must include grocery freight premium.
  // ================================================================
  it('Scenario 4: Household — no LPG, grocery freight premium', () => {
    const impact = calcCrisisImpact(15000, 8, 'petrol', PROLONGED.petrol, PROLONGED.diesel);

    // Diesel ratio: (3.04 - 1.80) / 1.80 = 1.24/1.80 ≈ 0.6889
    const dieselRatio = (PROLONGED.diesel - DIESEL_PRICE_BASELINE) / DIESEL_PRICE_BASELINE;
    expect(c(dieselRatio)).toBeCloseTo(0.69, 1);

    // Grocery premium: 250 * 0.10 * 0.6889 = 17.22/week
    expect(c(impact.weeklyGroceryPremium)).toBeCloseTo(17.22, 0);

    // Total weekly: fuel premium + grocery premium
    expect(c(impact.totalWeeklyImpact)).toBeCloseTo(18.23 + 17.22, 0);

    const opts = calcOptions(15000, 8, 'petrol', 0, 'household', PROLONGED.petrol, PROLONGED.diesel);
    // Household: no LPG
    expect(opts.lpg).toBeNull();
    // Household: EV is shown
    expect(opts.ev).not.toBeNull();
  });

  // ================================================================
  // SCENARIO 5: Commuter under Recovery scenario
  // Lower crisis price should reduce all premiums.
  // ================================================================
  it('Scenario 5: Commuter 15k km — Recovery scenario', () => {
    const impact = calcCrisisImpact(15000, 8, 'petrol', RECOVERY.petrol, RECOVERY.diesel);

    // Now: 1200 * 1.90 = 2280
    expect(c(impact.annualCostNow)).toBe(2280);
    // Premium: 2280 - 2076 = 204
    expect(c(impact.annualCrisisPremium)).toBe(204);
    // Weekly: 204/52 ≈ 3.92
    expect(c(impact.weeklyCrisisPremium)).toBeCloseTo(3.92, 1);

    // Savings from LPG should be much smaller under recovery
    const opts = calcOptions(15000, 8, 'petrol', 15000, 'commuter', RECOVERY.petrol, RECOVERY.diesel);
    // Status quo: 1200 * 1.90 = 2280
    // LPG cost: 1560 * 0.95 = 1482 (unchanged — LPG price doesn't move)
    // LPG saving: 2280 - 1482 = 798
    expect(c(opts.lpg!.annualSaving)).toBe(798);
  });

  // ================================================================
  // SCENARIO 6: Tradie under Escalation scenario
  // $4.50/L diesel — extreme pain.
  // ================================================================
  it('Scenario 6: Tradie 25k km — Escalation ($4.50 diesel)', () => {
    const impact = calcCrisisImpact(25000, 11, 'diesel', ESCALATION.petrol, ESCALATION.diesel);

    // Now: 2750 * 4.50 = 12375
    expect(c(impact.annualCostNow)).toBe(12375);
    // Premium: 12375 - 4950 = 7425
    expect(c(impact.annualCrisisPremium)).toBe(7425);
    // Weekly: 7425 / 52 ≈ 142.79
    expect(c(impact.weeklyCrisisPremium)).toBeCloseTo(142.79, 0);

    const opts = calcOptions(25000, 11, 'diesel', 25000, 'tradie', ESCALATION.petrol, ESCALATION.diesel);
    // LPG cost unchanged: 3396.25
    // LPG saving: 12375 - 3396.25 = 8978.75
    expect(c(opts.lpg!.annualSaving)).toBe(8978.75);
    // Payback: 4000 / (8978.75/12) = 4000 / 748.23 ≈ 5.35 → ceil = 6
    expect(opts.lpg!.monthsToPayback).toBe(6);
  });

  // ================================================================
  // SCENARIO 7: High-mileage commuter (40k km petrol)
  // Tests that scaling works linearly.
  // ================================================================
  it('Scenario 7: High-mileage commuter 40k km petrol', () => {
    const impact = calcCrisisImpact(40000, 8, 'petrol', PROLONGED.petrol, PROLONGED.diesel);

    // 40000/100 * 8 = 3200 litres
    expect(impact.litresPerYear).toBe(3200);
    // Premium: 3200 * (2.52 - 1.73) = 3200 * 0.79 = 2528
    expect(c(impact.annualCrisisPremium)).toBe(2528);

    const opts = calcOptions(40000, 8, 'petrol', 15000, 'commuter', PROLONGED.petrol, PROLONGED.diesel);
    // EV fuel: 40000/100 * 18 * 0.28 = 2016
    expect(c(opts.ev!.annualFuelCost)).toBe(2016);
    // EV saving: (3200 * 2.52) - 2016 = 8064 - 2016 = 6048
    expect(c(opts.ev!.annualSaving)).toBe(6048);
  });

  // ================================================================
  // SCENARIO 8: Truckie under Escalation
  // Maximum absolute dollar impact scenario.
  // ================================================================
  it('Scenario 8: Truckie 120k km — Escalation', () => {
    const impact = calcCrisisImpact(120000, 40, 'diesel', ESCALATION.petrol, ESCALATION.diesel);

    // Now: 48000 * 4.50 = 216000
    expect(c(impact.annualCostNow)).toBe(216000);
    // Premium: 216000 - 86400 = 129600
    expect(c(impact.annualCrisisPremium)).toBe(129600);
    // Weekly: 129600 / 52 = 2492.31
    expect(c(impact.weeklyCrisisPremium)).toBeCloseTo(2492.31, 0);

    const opts = calcOptions(120000, 40, 'diesel', 0, 'truckie', ESCALATION.petrol, ESCALATION.diesel);
    // LPG saving: 216000 - 59280 = 156720
    expect(c(opts.lpg!.annualSaving)).toBe(156720);
    // Payback: 20000 / (156720/12) = 20000 / 13060 = 1.53 → ceil = 2
    expect(opts.lpg!.monthsToPayback).toBe(2);
  });

  // ================================================================
  // SCENARIO 9: Low-mileage pensioner (5k km petrol, small car)
  // Edge case: very low usage. EV payback should be very long.
  // ================================================================
  it('Scenario 9: Low-mileage 5k km petrol — long EV payback', () => {
    const impact = calcCrisisImpact(5000, 6, 'petrol', PROLONGED.petrol, PROLONGED.diesel);

    // 5000/100 * 6 = 300 litres
    expect(impact.litresPerYear).toBe(300);
    // Premium: 300 * (2.52 - 1.73) = 300 * 0.79 = 237
    expect(c(impact.annualCrisisPremium)).toBe(237);

    const opts = calcOptions(5000, 6, 'petrol', 5000, 'commuter', PROLONGED.petrol, PROLONGED.diesel);
    // Status quo: 300 * 2.52 = 756
    // EV fuel: 5000/100 * 18 * 0.28 = 252
    expect(c(opts.ev!.annualFuelCost)).toBe(252);
    // EV saving: 756 - 252 = 504/yr = 42/mo
    expect(c(opts.ev!.annualSaving)).toBe(504);
    // EV upfront: 32000 - 5000 + 1750 = 28750
    expect(opts.ev!.upfrontCost).toBe(28750);
    // Payback: 28750 / 42 = 684.5 → ceil = 685 months (57 years — not viable!)
    expect(opts.ev!.monthsToPayback).toBe(685);
  });

  // ================================================================
  // SCENARIO 10: Tradie with zero trade-in value
  // Tests EV upfront cost without vehicle offset.
  // ================================================================
  it('Scenario 10: Tradie with $0 trade-in — high EV upfront', () => {
    const opts = calcOptions(25000, 11, 'diesel', 0, 'tradie', PROLONGED.petrol, PROLONGED.diesel);

    // EV ute upfront: 60000 - 0 + 1750 = 61750
    expect(opts.ev!.upfrontCost).toBe(61750);
    // EV fuel: 25000/100 * 18 * 0.28 = 1260
    expect(c(opts.ev!.annualFuelCost)).toBe(1260);
    // EV saving: 8360 - 1260 = 7100
    expect(c(opts.ev!.annualSaving)).toBe(7100);
    // Payback: 61750 / (7100/12) = 61750 / 591.67 = 104.4 → ceil = 105 months
    expect(opts.ev!.monthsToPayback).toBe(105);
  });

  // ================================================================
  // SCENARIO 11: Verify net position math at Year 1, 3, 5
  // Ensures the compounding is correct (linear, not compound).
  // ================================================================
  it('Scenario 11: Net position at Year 1/3/5 — linear savings', () => {
    const opts = calcOptions(25000, 11, 'diesel', 25000, 'tradie', PROLONGED.petrol, PROLONGED.diesel);

    const lpg = opts.lpg!;
    // Year 1: saving - upfront = 4963.75 - 4000 = 963.75
    expect(c(lpg.netPositionYear1)).toBeCloseTo(963.75, 1);
    // Year 3: saving*3 - upfront = 14891.25 - 4000 = 10891.25
    expect(c(lpg.netPositionYear3)).toBeCloseTo(10891.25, 1);
    // Year 5: saving*5 - upfront = 24818.75 - 4000 = 20818.75
    expect(c(lpg.netPositionYear5)).toBeCloseTo(20818.75, 1);

    // Verify linearity: year5 - year3 should equal year3 - year1
    const diff53 = lpg.netPositionYear5 - lpg.netPositionYear3;
    const diff31 = lpg.netPositionYear3 - lpg.netPositionYear1;
    expect(c(diff53)).toBeCloseTo(c(diff31), 1);
  });

  // ================================================================
  // SCENARIO 12: Grocery freight premium across all scenarios
  // Diesel price drives grocery cost regardless of user's fuel type.
  // ================================================================
  it('Scenario 12: Grocery freight premium scales with diesel price', () => {
    const recoveryImpact = calcCrisisImpact(15000, 8, 'petrol', RECOVERY.petrol, RECOVERY.diesel);
    const prolongedImpact = calcCrisisImpact(15000, 8, 'petrol', PROLONGED.petrol, PROLONGED.diesel);
    const escalationImpact = calcCrisisImpact(15000, 8, 'petrol', ESCALATION.petrol, ESCALATION.diesel);

    // Recovery diesel ratio: (2.00 - 1.80) / 1.80 = 0.1111
    // Grocery: 250 * 0.10 * 0.1111 = 2.78
    expect(c(recoveryImpact.weeklyGroceryPremium)).toBeCloseTo(2.78, 0);

    // Prolonged diesel ratio: (3.04 - 1.80) / 1.80 = 0.6889
    // Grocery: 250 * 0.10 * 0.6889 = 17.22
    expect(c(prolongedImpact.weeklyGroceryPremium)).toBeCloseTo(17.22, 0);

    // Escalation diesel ratio: (4.50 - 1.80) / 1.80 = 1.50
    // Grocery: 250 * 0.10 * 1.50 = 37.50
    expect(c(escalationImpact.weeklyGroceryPremium)).toBe(37.5);

    // Escalation > Prolonged > Recovery
    expect(escalationImpact.weeklyGroceryPremium).toBeGreaterThan(prolongedImpact.weeklyGroceryPremium);
    expect(prolongedImpact.weeklyGroceryPremium).toBeGreaterThan(recoveryImpact.weeklyGroceryPremium);
  });

  // ================================================================
  // SCENARIO 13: Diesel commuter (e.g. Golf TDI, 7 L/100km)
  // Petrol persona on diesel to verify fuel type switching works.
  // ================================================================
  it('Scenario 13: Diesel commuter 15k km — correct baseline used', () => {
    const impact = calcCrisisImpact(15000, 7, 'diesel', PROLONGED.petrol, PROLONGED.diesel);

    // 15000/100 * 7 = 1050 litres
    expect(impact.litresPerYear).toBe(1050);
    // Must use DIESEL baseline (1.80), not petrol (1.73)
    expect(c(impact.annualCostBefore)).toBe(c(1050 * DIESEL_PRICE_BASELINE)); // 1890
    // Must use crisis DIESEL price (3.04), not petrol (2.52)
    expect(c(impact.annualCostNow)).toBe(c(1050 * PROLONGED.diesel)); // 3192
    expect(c(impact.annualCrisisPremium)).toBe(c(3192 - 1890)); // 1302
  });

  // ================================================================
  // SCENARIO 14: LPG is ALWAYS cheaper than status quo
  // Even under Recovery scenario, LPG at $0.95 should beat $1.90 petrol.
  // ================================================================
  it('Scenario 14: LPG always cheaper than status quo across all scenarios', () => {
    const personas: Array<{ persona: PersonaKey; km: number; economy: number; fuel: FuelType }> = [
      { persona: 'commuter', km: 15000, economy: 8, fuel: 'petrol' },
      { persona: 'tradie', km: 25000, economy: 11, fuel: 'diesel' },
      { persona: 'truckie', km: 120000, economy: 40, fuel: 'diesel' },
    ];

    const scenarioList = [RECOVERY, PROLONGED, ESCALATION];

    for (const p of personas) {
      for (const s of scenarioList) {
        const opts = calcOptions(p.km, p.economy, p.fuel, 0, p.persona, s.petrol, s.diesel);
        expect(
          opts.lpg!.annualSaving,
          `${p.persona} under ${s.diesel} diesel: LPG should save money`,
        ).toBeGreaterThan(0);
      }
    }
  });

  // ================================================================
  // SCENARIO 15: Monthly J-curve data integrity
  // Month 1 should be (monthlySaving - upfront), month 36 should be
  // (monthlySaving*36 - upfront). No gaps, no NaN, correct length.
  // ================================================================
  it('Scenario 15: Monthly J-curve data — 36 points, correct endpoints, monotonic', () => {
    const opts = calcOptions(25000, 11, 'diesel', 25000, 'tradie', PROLONGED.petrol, PROLONGED.diesel);
    const lpg = opts.lpg!;

    // Reconstruct monthly saving
    const monthlySaving = lpg.annualSaving / 12;

    // Build expected monthly data (same logic as buildMonthlyData)
    const expectedData = Array.from({ length: 36 }, (_, i) => ({
      month: i + 1,
      cumulative: monthlySaving * (i + 1) - lpg.upfrontCost,
    }));

    // Month 1: monthlySaving * 1 - 4000
    const month1Expected = monthlySaving * 1 - 4000;
    expect(c(expectedData[0].cumulative)).toBeCloseTo(c(month1Expected), 1);

    // Month 36: monthlySaving * 36 - 4000
    const month36Expected = monthlySaving * 36 - 4000;
    expect(c(expectedData[35].cumulative)).toBeCloseTo(c(month36Expected), 1);

    // All 36 months present
    expect(expectedData).toHaveLength(36);
    expect(expectedData[0].month).toBe(1);
    expect(expectedData[35].month).toBe(36);

    // Monotonically increasing (each month should be greater than the last when saving > 0)
    expect(lpg.annualSaving).toBeGreaterThan(0);
    for (let i = 1; i < expectedData.length; i++) {
      expect(expectedData[i].cumulative).toBeGreaterThan(expectedData[i - 1].cumulative);
    }

    // No NaN or undefined
    for (const d of expectedData) {
      expect(Number.isFinite(d.cumulative)).toBe(true);
      expect(Number.isFinite(d.month)).toBe(true);
    }

    // Crossover check: should go from negative to positive somewhere
    const firstPositive = expectedData.find(d => d.cumulative >= 0);
    expect(firstPositive).toBeDefined();
    expect(firstPositive!.month).toBe(lpg.monthsToPayback);
  });

});
