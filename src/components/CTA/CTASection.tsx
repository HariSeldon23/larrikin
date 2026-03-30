import { useElectorate } from '../../hooks/useElectorate';
import { buildMailtoUrl } from '../../utils/mailto';
import type { CrisisImpactResult } from '../../hooks/useCrisisImpact';
import type { OptionResult } from '../../hooks/useOptionsComparison';
import type { PersonaKey } from '../../data/personas';
import type { MPData } from '../../utils/mailto';
import PostcodeLookup from './PostcodeLookup';
import MPCard from './MPCard';

interface Props {
  persona: PersonaKey;
  crisisImpact: CrisisImpactResult;
  bestOption: OptionResult | null;
}

export default function CTASection({ persona, crisisImpact, bestOption }: Props) {
  const { postcode, results, selectedMP, error, lookup, setSelectedMP } = useElectorate();

  const handleSend = (mp: MPData) => {
    const url = buildMailtoUrl(mp, persona, crisisImpact, bestOption, postcode);
    window.location.href = url;
  };

  return (
    <section className="px-6 py-12 md:px-12" id="cta">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
          Demand Action From Your MP
        </h2>
        <p className="text-text-muted mb-8">
          Enter your postcode to find your federal member. We'll generate a personalised
          email based on your numbers above.
        </p>

        <PostcodeLookup postcode={postcode} onPostcodeChange={lookup} error={error} />

        {results && results.length > 1 && !selectedMP && (
          <div className="mb-6">
            <p className="text-sm text-text-muted mb-3">
              Your postcode covers multiple electorates. Which is yours?
            </p>
            <div className="flex flex-col gap-2">
              {results.map((mp) => (
                <button
                  key={mp.electorate}
                  onClick={() => setSelectedMP(mp)}
                  className="px-4 py-3 border border-border bg-bg-card text-left hover:border-crisis-red transition-colors"
                >
                  <span className="font-heading font-bold">{mp.electorate}</span>
                  <span className="text-text-muted ml-2">— {mp.mp} ({mp.party})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedMP && (
          <>
            <MPCard mp={selectedMP} />

            <button
              onClick={() => handleSend(selectedMP)}
              className="w-full sm:w-auto px-8 py-4 bg-crisis-red text-white font-heading
                text-lg font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Email Your MP Now
            </button>

            <p className="text-xs text-text-muted mt-4 max-w-md">
              This opens your email app with a pre-written message based on your numbers.
              You can edit it before sending. No data is stored or transmitted by this website.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
