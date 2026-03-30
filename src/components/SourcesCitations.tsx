import { useState } from 'react';

const sources = [
  { name: 'ACCC Weekly Fuel Price Monitoring', detail: 'March 27, 2026 — diesel, petrol averages', date: 'Updated weekly' },
  { name: 'Australian Institute of Petroleum', detail: 'Terminal Gate Prices, pre-crisis baselines', date: 'Week ending Feb 22, 2026' },
  { name: 'GlobalPetrolPrices.com', detail: 'LPG wholesale price data', date: 'March 2026' },
  { name: 'FuelPrice.io / FuelRadar Australia', detail: 'LPG retail pricing, station count, efficiency data', date: 'March 2026' },
  { name: 'EVSE Australia / Solar Choice', detail: 'EV charging costs (home, off-peak, solar, public DC)', date: 'March 2026' },
  { name: 'Bureau of Infrastructure and Transport', detail: 'LPG vehicle registrations (51,000 nationally)', date: '2025 data' },
  { name: 'Australian Electoral Commission', detail: 'Electorate and postcode mapping data', date: '48th Parliament' },
  { name: 'International Energy Agency', detail: '90-day reserve compliance data', date: 'Non-compliant since 2012' },
  { name: 'Grattan Institute', detail: 'Economic modelling validation', date: 'Pending engagement' },
];

export default function SourcesCitations() {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-6 py-12 md:px-12 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
          <span className="font-heading text-lg font-bold uppercase">
            Sources & Citations
          </span>
        </button>

        {open && (
          <div className="mt-6 space-y-3">
            {sources.map((s) => (
              <div key={s.name} className="border-l-2 border-border pl-4">
                <div className="text-sm font-semibold text-text-primary">{s.name}</div>
                <div className="text-xs text-text-muted">{s.detail}</div>
                <div className="text-xs text-text-muted/60">{s.date}</div>
              </div>
            ))}
            <p className="text-xs text-text-muted mt-6">
              Every number on this platform is sourced. If you find an error, open an issue on GitHub.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
