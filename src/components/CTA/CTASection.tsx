import { useElectorate } from '../../hooks/useElectorate';
import { buildEmailUrl, type EmailClient } from '../../utils/mailto';
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

  const handleSend = (mp: MPData, client: EmailClient) => {
    const url = buildEmailUrl(client, mp, persona, crisisImpact, bestOption, postcode);
    window.open(url, '_blank', 'noopener');
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

            <p className="text-sm text-text-muted mb-3">
              Open in your email provider:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSend(selectedMP, 'gmail')}
                className="flex-1 px-6 py-4 bg-crisis-red text-white font-heading
                  text-lg font-bold uppercase tracking-wider hover:bg-red-700 transition-colors
                  flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                </svg>
                Gmail
              </button>
              <button
                onClick={() => handleSend(selectedMP, 'outlook')}
                className="flex-1 px-6 py-4 bg-[#0078d4] text-white font-heading
                  text-lg font-bold uppercase tracking-wider hover:bg-[#106ebe] transition-colors
                  flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H7V7h4v10zm6 0h-4V7h4v10z"/>
                </svg>
                Outlook
              </button>
            </div>

            <p className="text-xs text-text-muted mt-4 max-w-md">
              Opens a new tab with your email pre-filled. You can edit it before sending.
              No data is stored or transmitted by this website.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
