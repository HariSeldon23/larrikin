import type { MPData } from '../../utils/mailto';

interface Props {
  mp: MPData;
}

const partyColors: Record<string, string> = {
  ALP: 'text-red-400',
  LNP: 'text-blue-400',
  LIB: 'text-blue-400',
  NAT: 'text-green-400',
  GRN: 'text-green-500',
  IND: 'text-purple-400',
};

export default function MPCard({ mp }: Props) {
  return (
    <div className="border border-border bg-bg-card p-6 mb-6">
      <div className="text-xs text-text-muted uppercase tracking-wider mb-2">
        Your Federal Member
      </div>
      <div className="font-heading text-2xl font-bold">{mp.mp}</div>
      <div className="flex gap-3 mt-2 text-sm">
        <span className={partyColors[mp.party] ?? 'text-text-muted'}>
          {mp.party}
        </span>
        <span className="text-text-muted">·</span>
        <span className="text-text-muted">{mp.electorate}</span>
      </div>
      <div className="font-mono text-xs text-text-muted mt-3">{mp.email}</div>
    </div>
  );
}
