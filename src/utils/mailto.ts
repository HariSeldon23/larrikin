import type { CrisisImpactResult } from '../hooks/useCrisisImpact';
import type { OptionResult } from '../hooks/useOptionsComparison';
import type { PersonaKey } from '../data/personas';
import { DIESEL_RESERVE_DAYS } from '../data/constants';

export interface MPData {
  electorate: string;
  mp: string;
  party: string;
  email: string;
}

export function generateEmail(
  mp: MPData,
  persona: PersonaKey,
  crisisImpact: CrisisImpactResult,
  bestOption: OptionResult | null,
  postcode: string,
): { subject: string; body: string } {
  const policyDemands: string[] = [];

  // Universal demands
  policyDemands.push('Extend the fuel excise reduction beyond the current 3-month window');
  policyDemands.push(`Mandate 90-day fuel reserve compliance — Australia has been non-compliant since 2012`);

  // Persona-specific demands
  if (persona === 'truckie' || persona === 'tradie') {
    policyDemands.push('Emergency LPG conversion rebates for commercial vehicles — there is no electric alternative for freight');
    policyDemands.push('Federal investment in Autogas refuelling infrastructure');
  }
  if (persona === 'commuter' || persona === 'household') {
    policyDemands.push('Reinstate EV purchase rebates — every state has let theirs expire');
    policyDemands.push('Accelerate regional EV charging infrastructure');
  }
  // All personas
  policyDemands.push('A domestic fuel reservation policy on new gas extraction');

  const demandsFormatted = policyDemands.map((d, i) => `${i + 1}. ${d}`).join('\n');

  const optionLine = bestOption && bestOption.key !== 'status-quo'
    ? `\nI have calculated that ${bestOption.label.toLowerCase()}, which would save me $${bestOption.annualSaving.toFixed(0)} per year and pay for itself in ${bestOption.monthsToPayback} months under current pricing.\n`
    : '';

  const body = `Dear ${mp.mp},

I am a constituent in ${mp.electorate} (postcode ${postcode}).

The current fuel crisis is costing me an additional $${crisisImpact.annualCrisisPremium.toFixed(0)} per year — that is $${crisisImpact.weeklyCrisisPremium.toFixed(0)} every week that I did not pay before February.
${optionLine}
I am asking you to support the following in Parliament:

${demandsFormatted}

Australia imports over 90% of its refined fuel and holds only ${DIESEL_RESERVE_DAYS} days of diesel reserves. The IEA minimum is 90 days. We have been non-compliant for 14 years.

I did these calculations myself using publicly sourced data from the ACCC and AIP. I expect my representative to act on this.

Regards,
[Your name]
[Your address in ${postcode}]`;

  const subject = `Fuel crisis: $${crisisImpact.weeklyCrisisPremium.toFixed(0)}/week impact on ${mp.electorate}`;

  return { subject, body };
}

export function buildMailtoUrl(
  mp: MPData,
  persona: PersonaKey,
  crisisImpact: CrisisImpactResult,
  bestOption: OptionResult | null,
  postcode: string,
): string {
  const { subject, body } = generateEmail(mp, persona, crisisImpact, bestOption, postcode);
  return `mailto:${mp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
