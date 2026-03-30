import { formatNumber } from '../../utils/format';
import type { FuelType } from '../../data/personas';

interface Props {
  kmPerYear: number;
  fuelEconomy: number;
  fuelType: FuelType;
  onKmChange: (v: number) => void;
  onEconomyChange: (v: number) => void;
  onFuelTypeChange: (v: FuelType) => void;
}

export default function InputSliders({
  kmPerYear, fuelEconomy, fuelType,
  onKmChange, onEconomyChange, onFuelTypeChange,
}: Props) {
  return (
    <div className="space-y-5 mb-8">
      {/* Km slider */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-sm text-text-muted">Annual kilometres</label>
          <span className="font-mono text-sm text-text-primary">{formatNumber(kmPerYear)} km</span>
        </div>
        <input
          type="range"
          min={5000} max={200000} step={1000}
          value={kmPerYear}
          onChange={(e) => onKmChange(Number(e.target.value))}
          className="w-full h-2 bg-bg-card appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-crisis-red [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Fuel economy slider */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-sm text-text-muted">Fuel economy</label>
          <span className="font-mono text-sm text-text-primary">{fuelEconomy.toFixed(1)} L/100km</span>
        </div>
        <input
          type="range"
          min={4} max={60} step={0.5}
          value={fuelEconomy}
          onChange={(e) => onEconomyChange(Number(e.target.value))}
          className="w-full h-2 bg-bg-card appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-crisis-red [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Fuel type toggle */}
      <div>
        <label className="text-sm text-text-muted block mb-2">Fuel type</label>
        <div className="flex gap-2">
          {(['petrol', 'diesel'] as FuelType[]).map((ft) => (
            <button
              key={ft}
              onClick={() => onFuelTypeChange(ft)}
              className={`px-4 py-2 border text-sm font-heading uppercase transition-all ${
                fuelType === ft
                  ? 'border-crisis-red bg-crisis-red/10 text-text-primary'
                  : 'border-border bg-bg-card text-text-muted hover:border-text-muted'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
