import { useMemo } from 'react';
import { useOptionsComparison } from '../../hooks/useOptionsComparison';
import type { PersonaKey, FuelType } from '../../data/personas';
import OptionCard from './OptionCard';
import JCurveChart from './JCurveChart';

interface Props {
  kmPerYear: number;
  fuelEconomy: number;
  fuelType: FuelType;
  currentVehicleValue: number;
  persona: PersonaKey;
  petrolPrice: number;
  dieselPrice: number;
}

export default function OptionsComparison({
  kmPerYear, fuelEconomy, fuelType, currentVehicleValue, persona,
  petrolPrice, dieselPrice,
}: Props) {
  const options = useOptionsComparison(
    { kmPerYear, fuelEconomy, fuelType, currentVehicleValue, persona },
    petrolPrice,
    dieselPrice,
  );

  const statusQuo = options.find((o) => o.key === 'status-quo');
  const statusQuoAnnualCost = statusQuo?.annualFuelCost ?? 0;
  const nonStatusQuoOptions = options.filter((o) => o.key !== 'status-quo');

  // Find the best option (best 3-year net position among viable)
  const bestOptionKey = useMemo(() => {
    const viable = nonStatusQuoOptions.filter((o) => o.annualSaving > 0);
    if (viable.length === 0) return null;
    return viable.reduce((a, b) => (a.netPositionYear3 > b.netPositionYear3 ? a : b)).key;
  }, [nonStatusQuoOptions]);

  return (
    <section className="px-6 py-12 md:px-12" id="options">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
          What Are Your Options?
        </h2>
        <p className="text-text-muted mb-8">
          Every option compared honestly — upfront costs, running costs, payback timeline, and caveats.
        </p>

        {/* Option cards */}
        <div className={`grid gap-5 mb-8 pt-2 ${
          options.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          options.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1'
        }`}>
          {options.map((opt, i) => (
            <OptionCard
              key={opt.key}
              option={opt}
              statusQuoAnnualCost={statusQuoAnnualCost}
              isBest={opt.key === bestOptionKey}
              index={i}
            />
          ))}
        </div>

        {/* J-Curve chart — breaks out of container for full width */}
        {nonStatusQuoOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-1">
              36-Month Net Position
            </h3>
            <p className="text-xs text-text-muted mb-2">
              Cumulative savings vs status quo. Above $0 = you're ahead.
            </p>
            <JCurveChart options={options} />
          </div>
        )}
      </div>
    </section>
  );
}
