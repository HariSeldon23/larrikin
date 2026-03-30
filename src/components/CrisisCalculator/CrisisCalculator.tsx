import { useState } from 'react';
import PersonaSelector from './PersonaSelector';
import InputSliders from './InputSliders';
import CrisisImpactDisplay from './CrisisImpactDisplay';
import { useCrisisImpact, type CrisisInputs } from '../../hooks/useCrisisImpact';
import { personas, type PersonaKey, type FuelType } from '../../data/personas';

interface Props {
  petrolPrice: number;
  dieselPrice: number;
  onInputsChange: (inputs: CrisisInputs & { persona: PersonaKey; currentVehicleValue: number }) => void;
}

export default function CrisisCalculator({ petrolPrice, dieselPrice, onInputsChange }: Props) {
  const [persona, setPersona] = useState<PersonaKey>('commuter');
  const p = personas[persona];

  const [kmPerYear, setKmPerYear] = useState(p.kmPerYear);
  const [fuelEconomy, setFuelEconomy] = useState(p.fuelEconomy);
  const [fuelType, setFuelType] = useState<FuelType>(p.fuelType);

  const impact = useCrisisImpact({ kmPerYear, fuelEconomy, fuelType }, petrolPrice, dieselPrice);

  const handlePersonaChange = (key: PersonaKey) => {
    const newP = personas[key];
    setPersona(key);
    setKmPerYear(newP.kmPerYear);
    setFuelEconomy(newP.fuelEconomy);
    setFuelType(newP.fuelType);
    onInputsChange({
      kmPerYear: newP.kmPerYear,
      fuelEconomy: newP.fuelEconomy,
      fuelType: newP.fuelType,
      persona: key,
      currentVehicleValue: newP.currentVehicleValue,
    });
  };

  const updateAndNotify = (updates: Partial<CrisisInputs>) => {
    const newInputs = { kmPerYear, fuelEconomy, fuelType, ...updates };
    if (updates.kmPerYear !== undefined) setKmPerYear(updates.kmPerYear);
    if (updates.fuelEconomy !== undefined) setFuelEconomy(updates.fuelEconomy);
    if (updates.fuelType !== undefined) setFuelType(updates.fuelType);
    onInputsChange({
      ...newInputs,
      persona,
      currentVehicleValue: personas[persona].currentVehicleValue,
    });
  };

  return (
    <section className="px-6 py-12 md:px-12" id="crisis-calculator">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
          What It's Costing You
        </h2>
        <p className="text-text-muted mb-8">
          Pick your situation. Adjust the numbers. See the damage.
        </p>

        <PersonaSelector selected={persona} onChange={handlePersonaChange} />
        <InputSliders
          kmPerYear={kmPerYear}
          fuelEconomy={fuelEconomy}
          fuelType={fuelType}
          onKmChange={(v) => updateAndNotify({ kmPerYear: v })}
          onEconomyChange={(v) => updateAndNotify({ fuelEconomy: v })}
          onFuelTypeChange={(v) => updateAndNotify({ fuelType: v })}
        />
        <CrisisImpactDisplay impact={impact} persona={persona} />
      </div>
    </section>
  );
}
