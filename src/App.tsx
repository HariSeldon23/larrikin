import { useState, useMemo } from 'react';
import Hero from './components/Hero';
import ScenarioToggle from './components/ScenarioToggle';
import CrisisCalculator from './components/CrisisCalculator/CrisisCalculator';
import OptionsComparison from './components/OptionsComparison/OptionsComparison';
import CTASection from './components/CTA/CTASection';
import SourcesCitations from './components/SourcesCitations';
import About from './components/About';
import { scenarios, DEFAULT_SCENARIO, type ScenarioKey } from './data/scenarios';
import { personas, type PersonaKey, type FuelType } from './data/personas';
import { useCrisisImpact } from './hooks/useCrisisImpact';
import { useOptionsComparison } from './hooks/useOptionsComparison';

interface UserInputs {
  kmPerYear: number;
  fuelEconomy: number;
  fuelType: FuelType;
  persona: PersonaKey;
  currentVehicleValue: number;
}

function App() {
  const [scenario, setScenario] = useState<ScenarioKey>(DEFAULT_SCENARIO);
  const { petrolPrice, dieselPrice } = scenarios[scenario];

  const defaultP = personas.commuter;
  const [userInputs, setUserInputs] = useState<UserInputs>({
    kmPerYear: defaultP.kmPerYear,
    fuelEconomy: defaultP.fuelEconomy,
    fuelType: defaultP.fuelType,
    persona: 'commuter',
    currentVehicleValue: defaultP.currentVehicleValue,
  });

  const crisisImpact = useCrisisImpact(
    { kmPerYear: userInputs.kmPerYear, fuelEconomy: userInputs.fuelEconomy, fuelType: userInputs.fuelType },
    petrolPrice,
    dieselPrice,
  );

  const options = useOptionsComparison(
    {
      kmPerYear: userInputs.kmPerYear,
      fuelEconomy: userInputs.fuelEconomy,
      fuelType: userInputs.fuelType,
      currentVehicleValue: userInputs.currentVehicleValue,
      persona: userInputs.persona,
    },
    petrolPrice,
    dieselPrice,
  );

  // Best non-status-quo option (highest annual saving)
  const bestOption = useMemo(() => {
    const viable = options.filter((o) => o.key !== 'status-quo' && o.annualSaving > 0);
    if (viable.length === 0) return null;
    return viable.reduce((a, b) => (a.annualSaving > b.annualSaving ? a : b));
  }, [options]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Hero />

      <div className="border-t border-border">
        <CrisisCalculator
          petrolPrice={petrolPrice}
          dieselPrice={dieselPrice}
          onInputsChange={setUserInputs}
        />
      </div>

      <div className="border-t border-border">
        <OptionsComparison
          kmPerYear={userInputs.kmPerYear}
          fuelEconomy={userInputs.fuelEconomy}
          fuelType={userInputs.fuelType}
          currentVehicleValue={userInputs.currentVehicleValue}
          persona={userInputs.persona}
          petrolPrice={petrolPrice}
          dieselPrice={dieselPrice}
        />
      </div>

      <div className="border-t border-border">
        <ScenarioToggle selected={scenario} onChange={setScenario} />
      </div>

      <div className="border-t border-border">
        <CTASection
          persona={userInputs.persona}
          crisisImpact={crisisImpact}
          bestOption={bestOption}
        />
      </div>

      <SourcesCitations />
      <About />

      <footer className="px-6 py-6 border-t border-border text-center text-xs text-text-muted">
        <p>
          Fuel Crisis Calculator — Open Source (MIT License) —{' '}
          <a href="#" className="text-crisis-red hover:text-red-400">GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
