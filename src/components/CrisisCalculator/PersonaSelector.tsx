import { personas, personaOrder, type PersonaKey } from '../../data/personas';

interface Props {
  selected: PersonaKey;
  onChange: (key: PersonaKey) => void;
}

export default function PersonaSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {personaOrder.map((key) => {
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
      })}
    </div>
  );
}
