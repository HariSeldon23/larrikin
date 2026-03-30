import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  petrolConversionSteps,
  dieselConversionSteps,
  costEstimates,
  vehicleYearGuide,
  installers,
  type ConversionType,
} from '../../data/conversion-guide';
import { formatCurrency } from '../../utils/format';

export default function ConversionGuide() {
  const [fuelTab, setFuelTab] = useState<ConversionType>('petrol');
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [installerFilter, setInstallerFilter] = useState('all');

  const steps = fuelTab === 'petrol' ? petrolConversionSteps : dieselConversionSteps;
  const states = ['all', ...Array.from(new Set(installers.map((i) => i.state)))];
  const filteredInstallers =
    installerFilter === 'all' ? installers : installers.filter((i) => i.state === installerFilter);

  return (
    <section className="px-6 py-12 md:px-12" id="conversion-guide">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
          How LPG Conversion Works
        </h2>
        <p className="text-text-muted mb-8">
          A step-by-step guide to converting your vehicle. What's involved, what it
          costs, and who can do it.
        </p>

        {/* ============ FUEL TYPE TAB ============ */}
        <div className="flex gap-2 mb-8">
          {(['petrol', 'diesel'] as ConversionType[]).map((ft) => (
            <button
              key={ft}
              onClick={() => {
                setFuelTab(ft);
                setExpandedStep(0);
              }}
              className={`flex-1 px-4 py-3 border font-heading text-sm font-bold uppercase tracking-wider transition-all ${
                fuelTab === ft
                  ? 'border-lpg-gold bg-lpg-gold/10 text-text-primary'
                  : 'border-border bg-bg-card text-text-muted hover:border-text-muted'
              }`}
            >
              {ft === 'petrol' ? '⛽ Petrol → Dual-Fuel LPG' : '🛢️ Diesel → LPG Fumigation'}
            </button>
          ))}
        </div>

        {/* Key difference callout */}
        <div className={`border p-4 mb-8 text-sm ${
          fuelTab === 'petrol'
            ? 'border-lpg-gold/30 bg-lpg-gold/5'
            : 'border-crisis-red/30 bg-crisis-red/5'
        }`}>
          {fuelTab === 'petrol' ? (
            <p>
              <strong className="text-lpg-gold">Petrol dual-fuel</strong> means your car runs on
              either petrol or LPG — you choose with a dash switch. The engine starts on petrol and
              auto-switches to LPG once warm. Nothing is removed; LPG is added as a parallel fuel
              system. ~90% of petrol cars can be converted.
            </p>
          ) : (
            <p>
              <strong className="text-crisis-red">Diesel fumigation</strong> is different — diesel
              engines can't run on LPG alone (no spark plugs). Instead, LPG is injected alongside
              diesel, replacing 20–50% of diesel consumption. The engine always needs some diesel.
              This is a specialist conversion — ensure your installer has diesel fumigation experience.
            </p>
          )}
        </div>

        {/* ============ STEP-BY-STEP ============ */}
        <div className="space-y-2 mb-12">
          {steps.map((step, i) => (
            <div key={step.title} className="border border-border">
              <button
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-bg-card/50 transition-colors"
              >
                <span className="font-heading text-sm font-bold uppercase">{step.title}</span>
                <span className={`text-text-muted transition-transform ${expandedStep === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              <AnimatePresence>
                {expandedStep === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ============ VEHICLE YEAR COMPATIBILITY ============ */}
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-4">
          Is My Car Compatible?
        </h3>
        <div className="space-y-3 mb-12">
          {vehicleYearGuide.map((v) => (
            <div key={v.era} className="border border-border bg-bg-card p-4 flex gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  v.difficulty === 'easy' ? 'bg-savings-green' :
                  v.difficulty === 'medium' ? 'bg-lpg-gold' :
                  'bg-crisis-red'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-heading text-sm font-bold">{v.era}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 ${
                    v.compatibility === 'Highly compatible' ? 'text-savings-green bg-savings-green/10' :
                    v.compatibility === 'Compatible' ? 'text-lpg-gold bg-lpg-gold/10' :
                    v.compatibility === 'Limited' ? 'text-crisis-red bg-crisis-red/10' :
                    'text-text-muted bg-bg-primary'
                  }`}>
                    {v.compatibility}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{v.notes}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============ COST ESTIMATES ============ */}
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-4">
          Approximate Costs by Vehicle Type
        </h3>
        <div className="space-y-2 mb-12">
          {costEstimates.map((c) => (
            <div key={c.vehicleType} className="border border-border bg-bg-card p-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-heading text-sm font-bold">{c.vehicleType}</span>
                <span className="font-mono text-sm text-lpg-gold font-bold">
                  {formatCurrency(c.costRange[0])}–{formatCurrency(c.costRange[1])}
                </span>
              </div>
              <div className="text-xs text-text-muted">
                <span className="text-text-muted/60">{c.examples}</span>
                <span className="mx-2">·</span>
                {c.notes}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mb-12 -mt-8">
          Prices are estimates as of March 2026. Always get a quote from a certified installer for
          your specific vehicle. Costs vary by location, system brand (Prins, STAG, Lovato), and
          tank configuration.
        </p>

        {/* ============ FIND AN INSTALLER ============ */}
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-2">
          Find a Conversion Specialist
        </h3>
        <p className="text-text-muted text-sm mb-4">
          These are known LPG conversion specialists across Australia. Always confirm they're
          accredited in your state and experienced with your vehicle type.
        </p>

        {/* State filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setInstallerFilter(s)}
              className={`px-3 py-1 text-xs font-heading uppercase border transition-all ${
                installerFilter === s
                  ? 'border-lpg-gold bg-lpg-gold/10 text-text-primary'
                  : 'border-border bg-bg-card text-text-muted hover:border-text-muted'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          {filteredInstallers.map((inst) => (
            <div key={inst.name} className="border border-border bg-bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-sm font-bold">{inst.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {inst.location}
                    {inst.phone && (
                      <>
                        <span className="mx-2">·</span>
                        <a href={`tel:${inst.phone.replace(/\s/g, '')}`} className="text-lpg-gold hover:text-amber-400">
                          {inst.phone}
                        </a>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-text-muted/70 mt-1">{inst.notes}</div>
                </div>
                {inst.website && (
                  <a
                    href={inst.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-3 py-1.5 border border-lpg-gold/30 text-lpg-gold text-xs
                      font-heading uppercase hover:bg-lpg-gold/10 transition-colors"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border bg-bg-card p-4 text-xs text-text-muted space-y-2">
          <p>
            <strong className="text-text-primary">Before you book:</strong> Ask your installer about
            their accreditation (AAFRB in VIC, SafeWork in NSW/QLD), warranty on parts and labour,
            and whether they have experience with your specific make and model.
          </p>
          <p>
            Know a specialist not listed here?{' '}
            <a href="#" className="text-lpg-gold hover:text-amber-400">
              Submit it on GitHub
            </a>{' '}
            and we'll add them.
          </p>
        </div>
      </div>
    </section>
  );
}
