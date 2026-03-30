import { personas, type PersonaKey } from '../../data/personas';

interface Props {
  selected: PersonaKey;
  onChange: (key: PersonaKey) => void;
}

const personalKeys: PersonaKey[] = ['commuter', 'household'];
const commercialKeys: PersonaKey[] = ['tradie', 'truckie', 'construction', 'agriculture', 'courier'];

export default function PersonaSelector({ selected, onChange }: Props) {
  const renderButton = (key: PersonaKey) => {
    const p = personas[key];
    const isActive = selected === key;
    return (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`px-4 py-4 border text-left transition-all ${
          isActive
            ? 'border-crisis-red bg-crisis-red/10 text-text-primary'
            : 'border-border bg-bg-card text-text-muted hover:border-text-muted'
        }`}
      >
        <span className="text-2xl block mb-1">{p.icon}</span>
        <div className="font-heading text-sm font-bold uppercase">{p.label}</div>
        <div className="text-xs text-text-muted mt-1 hidden sm:block">{p.subtitle}</div>
      </button>
    );
  };

  return (
    <div className="mb-8 space-y-2">
      <div className="text-xs uppercase tracking-widest text-text-muted mb-1">Personal</div>
      <div className="grid grid-cols-2 gap-3">
        {personalKeys.map(renderButton)}
      </div>
      <div className="text-xs uppercase tracking-widest text-text-muted mb-1 pt-3">Commercial / Fleet</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {commercialKeys.map(renderButton)}
      </div>
    </div>
  );
}
