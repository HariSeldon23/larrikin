import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/format';
import { useCountUp } from '../../hooks/useCountUp';
import type { CrisisImpactResult } from '../../hooks/useCrisisImpact';
import type { PersonaKey } from '../../data/personas';

interface Props {
  impact: CrisisImpactResult;
  persona: PersonaKey;
}

export default function CrisisImpactDisplay({ impact, persona }: Props) {
  const isHousehold = persona === 'household';
  const isFleet = ['construction', 'agriculture', 'courier'].includes(persona);
  const weeklyAmount = isHousehold ? impact.totalWeeklyImpact : impact.weeklyCrisisPremium;
  const weeklyCounter = useCountUp(Math.round(weeklyAmount), 1200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={`${persona}-${Math.round(weeklyAmount)}`}
    >
      {/* The giant number */}
      <div className="text-center py-8 mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-text-muted mb-3">
          {isHousehold ? 'Your total weekly crisis impact' : isFleet ? 'The crisis is costing your fleet' : 'The crisis is costing you'}
        </div>
        <div
          ref={weeklyCounter.ref as React.RefObject<HTMLDivElement>}
          className="font-heading text-7xl sm:text-8xl md:text-9xl font-extrabold text-crisis-red tabular-nums leading-none"
        >
          ${weeklyCounter.value}
        </div>
        <div className="text-xl text-crisis-red/70 font-heading font-bold mt-2">
          every week
        </div>
        <p className="text-sm text-text-muted mt-4 max-w-md mx-auto">
          {isFleet
            ? 'Extra fleet fuel cost since February. Every dollar comes off your margin.'
            : 'That you didn\'t pay before February. Because of a war 12,000km away.'}
        </p>
      </div>

      {/* Supporting breakdown */}
      <div className="border border-border bg-bg-card p-5">
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <div className="text-xs text-text-muted uppercase mb-1">Before the crisis</div>
            <div className="text-text-primary text-lg">{formatCurrency(impact.annualCostBefore)}<span className="text-xs text-text-muted"> /yr</span></div>
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase mb-1">Right now</div>
            <div className="text-crisis-red text-lg font-bold">{formatCurrency(impact.annualCostNow)}<span className="text-xs text-crisis-red/60"> /yr</span></div>
          </div>
        </div>

        <div className="border-t border-border mt-4 pt-4 flex justify-between items-baseline font-mono">
          <span className="text-sm text-text-muted">Annual crisis premium</span>
          <span className="text-crisis-red font-bold text-lg">{formatCurrency(impact.annualCrisisPremium)}</span>
        </div>

        {isHousehold && (
          <div className="border-t border-border mt-3 pt-3 flex justify-between items-baseline font-mono">
            <span className="text-sm text-text-muted">+ Grocery freight premium</span>
            <span className="text-crisis-red">{formatCurrency(impact.weeklyGroceryPremium)}<span className="text-xs text-text-muted"> /wk</span></span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
