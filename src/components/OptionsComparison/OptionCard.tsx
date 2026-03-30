import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/format';
import type { OptionResult } from '../../hooks/useOptionsComparison';

interface Props {
  option: OptionResult;
  statusQuoAnnualCost: number;
  isBest: boolean;
  index: number;
}

export default function OptionCard({ option, statusQuoAnnualCost, isBest, index }: Props) {
  const isStatusQuo = option.key === 'status-quo';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative border flex flex-col ${
        isStatusQuo
          ? 'bg-gradient-to-b from-crisis-red/8 to-crisis-red/3 border-crisis-red/30'
          : isBest
            ? 'bg-bg-card border-savings-green'
            : 'bg-bg-card border-border'
      }`}
      style={!isStatusQuo && !isBest ? { borderColor: option.color + '40' } : undefined}
    >
      {/* Best badge */}
      {isBest && (
        <div className="absolute -top-3 left-4 px-3 py-0.5 bg-savings-green text-bg-primary text-xs font-heading font-bold uppercase tracking-wider">
          Best for you
        </div>
      )}

      {/* Status quo warning */}
      {isStatusQuo && (
        <div className="absolute -top-3 left-4 px-3 py-0.5 bg-crisis-red text-white text-xs font-heading font-bold uppercase tracking-wider">
          Doing nothing
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: option.color }} />
          <h4 className="font-heading text-base font-bold uppercase">{option.label}</h4>
        </div>

        <div className="space-y-2 font-mono text-sm flex-1">
          {!isStatusQuo && (
            <div className="flex justify-between">
              <span className="text-text-muted">Upfront cost:</span>
              <span className="text-text-primary">{formatCurrency(option.upfrontCost)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-muted">Annual fuel:</span>
            <span className={isStatusQuo ? 'text-crisis-red font-bold' : 'text-text-primary'}>
              {formatCurrency(isStatusQuo ? statusQuoAnnualCost : option.annualFuelCost)}
            </span>
          </div>
          {!isStatusQuo && (
            <>
              <div className="flex justify-between">
                <span className="text-text-muted">Annual saving:</span>
                <span className="text-savings-green font-bold">{formatCurrency(option.annualSaving)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payback:</span>
                <span className={`font-bold ${isBest ? 'text-savings-green' : 'text-text-primary'}`}>
                  {option.monthsToPayback > 0 ? `${option.monthsToPayback} months` : 'Immediate'}
                </span>
              </div>
            </>
          )}

          {/* Status quo: show the bleeding */}
          {isStatusQuo && (
            <div className="pt-2 border-t border-crisis-red/20 mt-2">
              <div className="flex justify-between">
                <span className="text-crisis-red/70">3-year bleed:</span>
                <span className="text-crisis-red font-bold">{formatCurrency(statusQuoAnnualCost * 3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crisis-red/70">5-year bleed:</span>
                <span className="text-crisis-red font-bold">{formatCurrency(statusQuoAnnualCost * 5)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Net position at milestones */}
        {!isStatusQuo && (
          <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Year 1', value: option.netPositionYear1 },
              { label: 'Year 3', value: option.netPositionYear3 },
              { label: 'Year 5', value: option.netPositionYear5 },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-xs text-text-muted">{m.label}</div>
                <div className={`font-mono text-xs font-bold ${m.value >= 0 ? 'text-savings-green' : 'text-crisis-red'}`}>
                  {m.value >= 0 ? '+' : ''}{formatCurrency(m.value)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Caveats */}
        <div className="mt-4 pt-3 border-t border-border">
          <ul className="space-y-1">
            {option.caveats.map((c) => (
              <li key={c} className="text-xs text-text-muted flex gap-1.5">
                <span className={isStatusQuo ? 'text-crisis-red/50' : 'text-text-muted/50'}>•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
