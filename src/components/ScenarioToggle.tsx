import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenarios, scenarioOrder, type ScenarioKey } from '../data/scenarios';

interface Props {
  selected: ScenarioKey;
  onChange: (key: ScenarioKey) => void;
}

export default function ScenarioToggle({ selected, onChange }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky when the original section scrolls out of view
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Original inline toggle */}
      <section className="px-6 py-12 md:px-12" ref={sectionRef}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
            Choose a Scenario
          </h2>

          <ScenarioButtons selected={selected} onChange={onChange} compact={false} />

          <p className="text-xs text-text-muted mt-4">
            On March 25, average diesel was $3.03/L. "Prolonged" is already conservative.
            Source: ACCC.
          </p>
        </div>
      </section>

      {/* Sticky compact toggle */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border"
          >
            <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
              <span className="text-xs text-text-muted font-heading uppercase tracking-wider hidden sm:block">
                Scenario
              </span>
              <ScenarioButtons selected={selected} onChange={onChange} compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ScenarioButtons({
  selected,
  onChange,
  compact,
}: {
  selected: ScenarioKey;
  onChange: (key: ScenarioKey) => void;
  compact: boolean;
}) {
  return (
    <div className={`flex gap-2 ${compact ? 'flex-1' : 'flex-col sm:flex-row'}`}>
      {scenarioOrder.map((key) => {
        const s = scenarios[key];
        const isActive = selected === key;

        if (compact) {
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex-1 px-3 py-1.5 border text-xs font-heading uppercase font-bold transition-all ${
                isActive
                  ? 'border-crisis-red bg-crisis-red/10 text-text-primary'
                  : 'border-border bg-bg-card text-text-muted hover:border-text-muted'
              }`}
            >
              {s.label}
              <span className="font-mono font-normal ml-1.5 hidden sm:inline">
                ${s.dieselPrice.toFixed(2)}
              </span>
            </button>
          );
        }

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
              <span className="font-heading text-lg font-bold uppercase">{s.label}</span>
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
  );
}
