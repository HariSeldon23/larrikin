import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/format';
import type { CrisisImpactResult } from '../../hooks/useCrisisImpact';
import type { PersonaKey } from '../../data/personas';

interface Props {
  impact: CrisisImpactResult;
  persona: PersonaKey;
}

export default function CrisisImpactDisplay({ impact, persona }: Props) {
  const isHousehold = persona === 'household';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border border-border bg-bg-card p-6 space-y-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-text-muted">
          Your Fuel Cost
        </h3>

        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Before the crisis:</span>
            <span className="text-text-primary">{formatCurrency(impact.annualCostBefore)} / year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Right now:</span>
            <span className="text-crisis-red font-bold">{formatCurrency(impact.annualCostNow)} / year</span>
          </div>
          <div className="border-t border-border my-2" />
          <div className="flex justify-between">
            <span className="text-crisis-red font-bold">THE CRISIS TAX:</span>
            <span className="text-crisis-red font-bold text-lg">
              {formatCurrency(impact.annualCrisisPremium)} / year
            </span>
          </div>
          <div className="flex justify-between">
            <span />
            <span className="text-crisis-red">
              {formatCurrency(impact.weeklyCrisisPremium)} / week
            </span>
          </div>
        </div>

        {isHousehold && (
          <div className="border-t border-border pt-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Grocery freight premium:</span>
              <span className="text-crisis-red">+{formatCurrency(impact.weeklyGroceryPremium)} / week</span>
            </div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between">
              <span className="text-crisis-red font-bold">TOTAL WEEKLY IMPACT:</span>
              <span className="text-crisis-red font-bold text-lg">
                {formatCurrency(impact.totalWeeklyImpact)} / week
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-text-muted pt-2">
          {isHousehold
            ? `That's ${formatCurrency(impact.totalWeeklyImpact)} a week leaving your household because of a war 12,000km away.`
            : `That's ${formatCurrency(impact.weeklyCrisisPremium)} a week leaving your wallet because of a war 12,000km away.`}
        </p>
      </div>
    </motion.div>
  );
}
