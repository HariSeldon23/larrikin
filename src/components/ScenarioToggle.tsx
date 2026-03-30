import { scenarios, scenarioOrder, type ScenarioKey } from '../data/scenarios';

interface Props {
  selected: ScenarioKey;
  onChange: (key: ScenarioKey) => void;
}

export default function ScenarioToggle({ selected, onChange }: Props) {
  return (
    <section className="px-6 py-12 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
          Choose a Scenario
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {scenarioOrder.map((key) => {
            const s = scenarios[key];
            const isActive = selected === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={`flex-1 px-4 py-4 border text-left transition-all ${
                  isActive
                    ? 'border-crisis-red bg-crisis-red/10 text-text-primary'
                    : 'border-border bg-bg-card text-text-muted hover:border-text-muted'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-heading text-lg font-bold uppercase">
                    {s.label}
                  </span>
                </div>
                <div className="font-mono text-xs space-y-0.5 mb-2">
                  <div>Petrol: ${s.petrolPrice.toFixed(2)}/L</div>
                  <div>Diesel: ${s.dieselPrice.toFixed(2)}/L</div>
                </div>
                <p className="text-xs text-text-muted">{s.description}</p>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-text-muted mt-4">
          On March 25, average diesel was $3.03/L. "Prolonged" is already conservative.
          Source: ACCC.
        </p>
      </div>
    </section>
  );
}
