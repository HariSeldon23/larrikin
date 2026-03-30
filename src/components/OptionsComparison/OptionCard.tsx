import { formatCurrency } from '../../utils/format';
import type { OptionResult } from '../../hooks/useOptionsComparison';

interface Props {
  option: OptionResult;
  statusQuoAnnualCost: number;
}

export default function OptionCard({ option, statusQuoAnnualCost }: Props) {
  const isStatusQuo = option.key === 'status-quo';

  return (
    <div
      className="border bg-bg-card p-5 flex flex-col"
      style={{ borderColor: option.color + '40' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }} />
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
          <span className={isStatusQuo ? 'text-crisis-red' : 'text-text-primary'}>
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
              <span className="text-text-primary">
                {option.monthsToPayback > 0 ? `${option.monthsToPayback} months` : 'Immediate'}
              </span>
            </div>
          </>
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
              <span className="text-text-muted/50">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
