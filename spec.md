# THE FUEL CRISIS CALCULATOR — Full Build Specification
### Author: Justin Trollip | Open Source (MIT License)
### Version: 2.0 | Date: March 30, 2026

---

## The Thesis (One Paragraph)

Every Australian is paying more because of the Strait of Hormuz closure. How much more depends on what you drive, how far you drive, and where you live. This platform calculates YOUR specific cost, shows you YOUR best alternative (EV, LPG, hybrid, or simply the indirect grocery impact), compares them honestly — including upfront costs and payback timelines — and then gives you a one-click tool to demand action from YOUR federal MP.

---

## Why Fuel-Agnostic Wins

The LPG-only thesis was vulnerable to dismissal ("LPG is dead, EVs won"). The EV-only thesis was redundant ("everyone's already saying that"). The fuel-agnostic approach is undismissable because:

1. **It recommends different solutions for different people.** A commuter gets shown EVs. A tradie gets shown LPG conversion. A truckie gets shown LPG (because no electric prime mover exists). A nurse who won't change vehicles sees the indirect grocery/freight impact. Nobody gets told what to think — they get shown the maths for THEIR situation.

2. **The CTA demands a comprehensive policy package**, not a single technology bet. This makes it harder for any MP to deflect ("we're doing EV subsidies" doesn't cut it when the platform shows that doesn't help the trucking fleet).

3. **It positions the creator as analytically honest**, not ideologically captured. That's the credibility that gets media pickup and Grattan engagement.

---

## Live Context (As of March 30, 2026)

### The Crisis
- US-Israeli strikes killed Ayatollah Khamenei on Feb 28, 2026
- Strait of Hormuz closed to maritime traffic
- Melbourne terminal gate diesel: 165.6¢/L (Mar 3) → 295.1¢/L (Mar 24) — 78% increase in 21 days
- National average retail diesel (Mar 25): 303.5 cpl (capital cities), 307.6 cpl (regional)
- National average retail petrol (Mar 25): 252.2 cpl
- Sydney diesel: 322.8 cpl (Mar 29)
- ACCC received 3,000+ fuel-related consumer reports in March alone
- National Cabinet met; fuel excise halved for 3 months (announced Mar 30) — saves ~26.3 cpl

### Pre-Crisis Baseline (Feb 2026)
- Petrol: ~$1.57–$1.73/L (national average ~172.9 cpl, week ending Feb 22)
- Diesel: ~$1.80/L (national average ~180.3 cpl, week ending Feb 22)
- These are the "before" numbers for the delta calculation

### Australia's Structural Vulnerability
- 90%+ of refined fuel is imported
- Only 2 domestic refineries remain (Ampol Lytton, Viva Geelong)
- Diesel reserves: ~32–34 days (IEA minimum: 90 days, non-compliant since 2012)
- Petrol reserves: ~36 days
- Jet fuel reserves: ~29 days

### Alternative Fuel Landscape
**LPG/Autogas:**
- Wholesale: ~$0.59/L nationally
- Retail: $0.80/L (Melbourne) to $1.13/L (Sydney)
- Station count declining: <200 in NSW, 637 in VIC, 50 in WA
- Only ~51,000 LPG vehicles registered in Australia
- No new LPG cars sold since 2018; conversion only

**EVs:**
- Cheapest new EV: BYD Atto 1 from $23,990 (220km range)
- Cheapest practical commuter EV: BYD Dolphin from $29,990 (340–427km range)
- Cheapest EV ute: KGM Musso EV from $60,000
- No viable electric prime movers for commercial freight
- Home charging: ~$5–7/100km (grid), ~$0 with solar
- EV sales: 11.8% of new car sales in Feb 2026 (accelerating due to crisis)
- FBT exemption still active for EVs under $91,387 via novated lease
- Most state rebates have expired (QLD $6k closed Sep 2024, NSW closed Jan 2024)

---

## V1 Scope

### Priority Order
1. **"What It's Costing You" Crisis Calculator** — The emotional hook
2. **"What Are Your Options" Comparison Engine** — EV vs LPG vs Status Quo
3. **Postcode MP Lookup + Dynamic CTA Email** — The political action
4. **Scenario Toggle** — Oil price sensitivity
5. ~~Particle Map~~ — V2

### What V1 Delivers
A single-page React app. Dark, editorial aesthetic. Four interactive sections. Zero backend. Deploys to Vercel for $0/month. Open source on GitHub from day one.

---

## Tech Stack

| Layer | Tool | Reason |
|-------|------|--------|
| Framework | Vite + React + TypeScript | Fast, lean, no SSR needed |
| Styling | Tailwind CSS | Rapid, responsive, mobile-first |
| Charts | Recharts | J-Curve visualisation, integrates cleanly with React |
| Animation | Framer Motion | Scroll reveals, bar growth. Lighter than GSAP for V1 |
| Data | Static JSON + constants.ts | Electorates, MP data, fuel pricing |
| Deployment | Vercel (free tier) | Push to GitHub → live in 90 seconds |

---

## Data Constants

```typescript
// ============================================================
// FUEL CRISIS CALCULATOR — CORE CONSTANTS
// Every value MUST carry a source citation in the UI
// ============================================================

// === PRE-CRISIS BASELINE (February 2026) ===
// Source: AIP Weekly Report, week ending Feb 22, 2026
const PETROL_PRICE_BASELINE = 1.73;      // $/L national avg ULP
const DIESEL_PRICE_BASELINE = 1.80;      // $/L national avg diesel

// === CURRENT CRISIS PRICES (Updated weekly from ACCC) ===
// Source: ACCC Weekly Fuel Monitoring, March 27, 2026
const PETROL_PRICE_CRISIS = 2.52;        // $/L 5 largest cities avg
const DIESEL_PRICE_CRISIS = 3.04;        // $/L 5 largest cities avg
const DIESEL_PRICE_REGIONAL = 3.08;      // $/L 190+ regional locations

// === LPG PRICES ===
// Source: GlobalPetrolPrices.com (wholesale), FuelPrice.io (retail)
const LPG_PRICE_RETAIL = 0.95;           // $/L conservative national avg
const LPG_EFFICIENCY_PENALTY = 1.30;     // 30% more LPG per km vs petrol
// Source: FuelRadar AU, NRMA — LPG has ~30% less energy per litre

// === EV CHARGING COSTS ===
// Source: EVSE Australia, Solar Choice, National Cover Insurance
const EV_COST_PER_100KM_HOME = 5.04;     // $ at avg $0.28/kWh
const EV_COST_PER_100KM_OFFPEAK = 2.00;  // $ at ~$0.11/kWh off-peak
const EV_COST_PER_100KM_SOLAR = 0.50;    // $ near-zero with solar
const EV_COST_PER_100KM_PUBLIC = 12.00;  // $ at ~$0.65/kWh DC fast

// === CONVERSION / PURCHASE COSTS ===
const LPG_CONVERSION_UTE = 4000;         // $ dual-fuel conversion
const LPG_CONVERSION_PRIME_MOVER = 20000;
const LPG_CONVERSION_CAR = 2500;
const EV_PURCHASE_CHEAPEST = 23990;      // BYD Atto 1 (220km range)
const EV_PURCHASE_PRACTICAL = 32000;     // BYD Dolphin driveaway (~400km)
const EV_PURCHASE_UTE = 60000;           // KGM Musso EV
const EV_HOME_CHARGER_INSTALL = 1750;    // $ avg installed

// === VEHICLE DEFAULTS BY PERSONA ===
const PERSONAS = {
  commuter: {
    label: "Commuter",
    subtitle: "Hatchback or sedan, daily driving",
    kmPerYear: 15000,
    fuelEconomy: 8,        // L/100km (petrol)
    fuelType: 'petrol',
    currentVehicleValue: 15000,  // Estimated trade-in
  },
  tradie: {
    label: "Tradie",
    subtitle: "HiLux / Ranger, work + personal",
    kmPerYear: 25000,
    fuelEconomy: 11,       // L/100km (diesel ute)
    fuelType: 'diesel',
    currentVehicleValue: 25000,
  },
  truckie: {
    label: "Truckie",
    subtitle: "Owner-operator, prime mover",
    kmPerYear: 120000,
    fuelEconomy: 40,       // L/100km (prime mover loaded)
    fuelType: 'diesel',
    currentVehicleValue: 0, // Not replacing — converting
  },
  household: {
    label: "Household",
    subtitle: "Not changing vehicle — show me indirect impact",
    kmPerYear: 15000,
    fuelEconomy: 8,
    fuelType: 'petrol',
    currentVehicleValue: 0,
  },
};

// === SCENARIO DEFINITIONS ===
const SCENARIOS = {
  recovery: {
    label: "Recovery",
    description: "Hormuz reopens within 3 months. Prices normalise by late 2026.",
    petrolPrice: 1.90,
    dieselPrice: 2.00,
  },
  prolonged: {
    label: "Prolonged",
    description: "Current trajectory continues 12–36 months. ACCC's base case.",
    petrolPrice: 2.52,
    dieselPrice: 3.04,
  },
  escalation: {
    label: "Escalation",
    description: "Conflict widens. Supply rationing. Prices breach $4/L.",
    petrolPrice: 3.50,
    dieselPrice: 4.50,
  },
};

// === MACRO CONTEXT ===
const FUEL_IMPORT_PERCENT = 90;
const DOMESTIC_REFINERIES = 2;
const DIESEL_RESERVE_DAYS = 32;
const IEA_MINIMUM_DAYS = 90;
const FREIGHT_COST_PERCENT_OF_GROCERY = 0.10; // ~10% of grocery basket
```

---

## Section 1: Hero — "The Crisis in 10 Seconds"

```
AUSTRALIA'S FUEL CRISIS

Diesel has risen 78% in 21 days.
Petrol is up $0.80/L since February.

We import 90% of our fuel.
We hold 32 days of diesel.
The international minimum is 90.

This calculator shows what it's costing YOU,
what your options are,
and how to make your MP act.

↓ Start
```

Design: Near-black background (#0a0a0a). White condensed type. Key numbers in red (#dc2626) for crisis figures. One scroll-triggered counter animation — the 78% counting up from 0 on entry. Nothing else moves. The numbers do the work.

---

## Section 2: "What It's Costing You" — The Crisis Impact Calculator

### Purpose
Before showing solutions, SHOW THE WOUND. The user needs to feel the personal cost of the crisis before they'll care about alternatives.

### UX Flow

**Step 1: Pick your persona** (4 cards, click to select)
- 🚗 Commuter — "Hatchback or sedan"
- 🛻 Tradie — "Ute, work and personal"
- 🚛 Truckie — "Owner-operator"
- 🏠 Household — "I'm not changing vehicle"

**Step 2: Adjust your numbers** (sliders with pre-filled defaults)
- Annual kilometres: [slider, 5,000–200,000]
- Fuel economy: [slider, L/100km, 4–60]
- Fuel type: [toggle, Petrol / Diesel]

**Step 3: See the damage** (instant recalculation)

```typescript
function crisisImpact(km: number, fuelEconomyL100: number, fuelType: 'petrol' | 'diesel') {
  const litresPerYear = (km / 100) * fuelEconomyL100;
  const baseline = fuelType === 'petrol' ? PETROL_PRICE_BASELINE : DIESEL_PRICE_BASELINE;
  const crisis = fuelType === 'petrol' ? PETROL_PRICE_CRISIS : DIESEL_PRICE_CRISIS;

  const annualCostBefore = litresPerYear * baseline;
  const annualCostNow = litresPerYear * crisis;
  const annualCrisisPremium = annualCostNow - annualCostBefore;
  const weeklyCrisisPremium = annualCrisisPremium / 52;

  return { annualCostBefore, annualCostNow, annualCrisisPremium, weeklyCrisisPremium };
}
```

### Output Display

Big, stark numbers:

```
YOUR FUEL COST

Before the crisis:    $3,110 / year
Right now:            $4,536 / year
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE CRISIS TAX:       $1,426 / year
                      $27.42 / week

That's $27 a week leaving your wallet
because of a war 12,000km away.
```

For the **Household** persona (not changing vehicle), show the INDIRECT impact instead:
- Their direct fuel cost increase
- PLUS the estimated grocery freight premium: weekly grocery spend × FREIGHT_COST_PERCENT × diesel price increase ratio
- PLUS note the RBA rate rise (4.10% cash rate, Mar 2026) partly driven by fuel inflation

---

## Section 3: "What Are Your Options" — The Comparison Engine

### Purpose
Now that the user feels the pain, show the escape routes — honestly, with upfront costs and payback timelines.

### Logic: Which Options to Show Per Persona

| Persona | Option A | Option B | Option C |
|---------|----------|----------|----------|
| Commuter | Buy cheapest EV ($24-32k) | LPG conversion ($2,500) | Do nothing (show ongoing cost) |
| Tradie | LPG conversion ($4,000) | EV ute ($60,000) | Do nothing |
| Truckie | LPG conversion ($20,000) | No EV option exists | Do nothing |
| Household | Buy EV (if replacing soon) | No conversion option | Indirect savings if fleet converts |

### The Comparison Table (Dynamic)

For each viable option, calculate and display:

```typescript
interface OptionResult {
  label: string;                // "Buy a BYD Dolphin" / "Convert to LPG"
  upfrontCost: number;          // $32,000 / $4,000 / $0
  annualFuelCost: number;       // New running cost
  annualSaving: number;         // vs crisis-price status quo
  monthsToPayback: number;      // Upfront cost / monthly saving
  netPositionYear1: number;     // Saving minus upfront cost
  netPositionYear3: number;
  netPositionYear5: number;
  caveats: string[];            // Honest limitations
}
```

**EV calculation:**
```typescript
const evAnnualFuelCost = (km / 100) * 18 * 0.28;  // 18kWh/100km × $0.28/kWh
// 18kWh/100km is avg EV consumption (Source: EVSE Australia)
const evUpfront = EV_PURCHASE_PRACTICAL - currentVehicleTradeIn + EV_HOME_CHARGER_INSTALL;
```

**LPG calculation:**
```typescript
const lpgLitresPerYear = litresPerYear * LPG_EFFICIENCY_PENALTY;
const lpgAnnualCost = lpgLitresPerYear * LPG_PRICE_RETAIL;
const lpgUpfront = LPG_CONVERSION_COST; // varies by persona
```

**Status quo:**
```typescript
const statusQuoAnnualCost = litresPerYear * crisisPrice;
// No upfront cost, but ongoing bleeding
```

### The J-Curve Chart

Recharts `<BarChart>` showing cumulative net position over 36 months for EACH option, overlaid:
- **Red line:** Status quo (flat at $0 — this is the baseline, everything else is relative)
- **Gold line:** LPG option (dips from conversion cost, then climbs as savings accumulate)
- **Blue line:** EV option (deep dip from purchase, slow climb — payback in 2-4 years typically)

The crossover point for each option is highlighted and labelled: "LPG pays for itself in Month 5" / "EV pays for itself in Month 28"

### Honest Caveats (Display per option)

**EV caveats:**
- Range anxiety for regional/rural users
- Charging infrastructure gaps outside metro
- Higher upfront cost even with FBT exemption
- If financed, interest adds to payback time
- No viable EV ute under $60k; no EV prime mover at all

**LPG caveats:**
- Station network is shrinking (<200 in NSW)
- LPG pricing tracks international benchmarks, not purely domestic
- Second-hand value of LPG-converted vehicles is uncertain
- No new LPG vehicles sold; conversion is the only path

**Status quo caveats:**
- If crisis persists 12-36 months (Treasurer's flagged planning horizon), cumulative cost is enormous
- Every dollar spent on imported fuel at crisis prices leaves Australia permanently

---

## Section 4: Scenario Toggle

Three buttons that change the crisis fuel price used in ALL calculations:

| Scenario | Petrol | Diesel | Framing |
|----------|--------|--------|---------|
| **Recovery** | $1.90/L | $2.00/L | Hormuz reopens. Prices normalise over 6 months. |
| **Prolonged** ← default | $2.52/L | $3.04/L | Current trajectory. 12–36 month planning horizon. |
| **Escalation** | $3.50/L | $4.50/L | Conflict widens. Rationing possible. |

Changing the scenario instantly recalculates everything — the crisis cost, the comparison, the J-curve, AND the email body.

Below the toggle: "On March 25, average diesel was $3.03/L. 'Prolonged' is already conservative. Source: ACCC."

---

## Section 5: Postcode MP Lookup + Dynamic CTA

### Postcode Resolution

Same architecture as V1 spec — one-to-many mapping, disambiguation for split postcodes.

### The Email — Now Multi-Option

The email body changes based on which persona the user selected AND which option the calculator recommended:

```typescript
function generateEmail(mp, persona, crisisImpact, bestOption, scenario) {

  const policyDemands = [];

  // Universal demands
  policyDemands.push("Extend the fuel excise reduction beyond the current 3-month window");
  policyDemands.push("Mandate 90-day fuel reserve compliance — Australia has been non-compliant since 2012");

  // Persona-specific demands
  if (persona === 'truckie' || persona === 'tradie') {
    policyDemands.push("Emergency LPG conversion rebates for commercial vehicles — there is no electric alternative for freight");
    policyDemands.push("Federal investment in Autogas refuelling infrastructure");
  }
  if (persona === 'commuter') {
    policyDemands.push("Reinstate EV purchase rebates — every state has let theirs expire");
    policyDemands.push("Accelerate regional EV charging infrastructure");
  }
  // All personas
  policyDemands.push("A domestic fuel reservation policy on new gas extraction");

  const demandsFormatted = policyDemands.map((d, i) => `${i + 1}. ${d}`).join('\n');

  const body = `Dear ${mp.mp},

I am a constituent in ${mp.electorate} (postcode ${postcode}).

The current fuel crisis is costing me an additional $${crisisImpact.annualCrisisPremium.toFixed(0)} per year — that is $${crisisImpact.weeklyCrisisPremium.toFixed(0)} every week that I did not pay before February.

I have calculated that ${bestOption.description}, which would save me $${bestOption.annualSaving.toFixed(0)} per year and pay for itself in ${bestOption.monthsToPayback} months under current pricing.

I am asking you to support the following in Parliament:

${demandsFormatted}

Australia imports over 90% of its refined fuel and holds only ${DIESEL_RESERVE_DAYS} days of diesel reserves. The IEA minimum is 90 days. We have been non-compliant for 14 years.

I did these calculations myself using publicly sourced data from the ACCC and AIP. I expect my representative to act on this.

Regards,
[Your name]
[Your address in ${postcode}]`;

  return { subject: `Fuel crisis: $${crisisImpact.weeklyCrisisPremium.toFixed(0)}/week impact on ${mp.electorate}`, body };
}
```

### Key Design Detail

The email subject line now includes the WEEKLY COST. When a staffer sees 200 emails and the subjects read "$27/week impact on McPherson", "$52/week impact on McPherson", "$41/week impact on McPherson" — each with different dollar figures — it's immediately obvious these aren't copy-paste spam. Every email is a unique financial grievance.

---

## Section 6: Sources, About, Open Source

### Sources Section
Every constant cited with:
- Source name
- Date of data
- Link to original source
- Note on update frequency

### About Page

```
ABOUT THIS SITE

Built by Justin Trollip. Software engineer. Gold Coast, QLD.

I built this because I got angry at my fuel bill and did the maths.
Then I built a calculator so everyone else could do the maths too.

This site:
- Is open source: [GitHub link]
- Is not affiliated with any political party
- Stores no personal data
- Sends no emails — it opens YOUR email app with YOUR numbers
- Uses real data from the ACCC, AIP, and ABS

Economic modelling: [validated by / pending validation by Grattan Institute]

If my numbers are wrong, open an issue on GitHub.
If you can improve the code, submit a pull request.
If you're a journalist, the data sources are all cited below.
```

---

## Design Direction

### Aesthetic: Crisis Editorial
The Economist's data pages meets a government emergency dashboard. This isn't playful. The country is in a fuel crisis. The design should feel urgent, authoritative, and trustworthy.

### Typography
- **Headlines:** Barlow Condensed (Google Fonts) — tall, tight, high-impact
- **Body:** Source Sans 3 — clean, readable at all sizes
- **Data/Numbers:** JetBrains Mono — monospace for calculator outputs

### Colour System
```css
:root {
  --bg-primary: #0a0a0a;
  --bg-card: #141414;
  --text-primary: #f5f5f5;
  --text-muted: #a3a3a3;

  --crisis-red: #dc2626;        /* Fuel costs, losses, crisis data */
  --lpg-gold: #d97706;          /* LPG option */
  --ev-blue: #2563eb;           /* EV option */
  --savings-green: #16a34a;     /* Net positive, savings */
  --neutral-grey: #525252;      /* Status quo, borders */

  --border: #262626;
}
```

### Mobile-First
Target device: a tradie's phone. 375px width minimum. Fat touch targets on sliders. Charts readable without zoom. The CTA button is impossible to miss.

---

## Component Architecture

```
src/
├── App.tsx
├── components/
│   ├── Hero.tsx
│   ├── CrisisCalculator/
│   │   ├── PersonaSelector.tsx      # 4 cards: commuter/tradie/truckie/household
│   │   ├── InputSliders.tsx         # km, fuel economy, fuel type
│   │   └── CrisisImpactDisplay.tsx  # The big red numbers
│   ├── OptionsComparison/
│   │   ├── OptionCard.tsx           # EV / LPG / Status Quo card
│   │   ├── JCurveChart.tsx          # Recharts multi-line chart
│   │   ├── ComparisonTable.tsx      # Side-by-side numbers
│   │   └── CaveatsList.tsx          # Honest limitations per option
│   ├── ScenarioToggle.tsx
│   ├── CTA/
│   │   ├── PostcodeLookup.tsx
│   │   ├── MPCard.tsx
│   │   ├── EmailPreview.tsx
│   │   └── SendButton.tsx
│   ├── Sources.tsx
│   └── About.tsx
├── data/
│   ├── constants.ts                 # All pricing with source citations
│   ├── scenarios.ts
│   ├── personas.ts
│   └── electorates.json             # Postcode → MP mapping
├── hooks/
│   ├── useCrisisImpact.ts           # "What it's costing you" math
│   ├── useOptionsComparison.ts      # EV vs LPG vs status quo math
│   └── useElectorate.ts             # Postcode resolution
└── utils/
    ├── mailto.ts
    └── format.ts                    # Currency, number formatting
```

---

## Build Sequence (2-Week Sprint)

### Week 1: The Calculator Engine

| Day | Task |
|-----|------|
| 1 | Vite + React + TS + Tailwind scaffold. Deploy empty shell to Vercel. |
| 1 | Build `constants.ts` with all data + source comments. Build `useCrisisImpact` hook. Test math. |
| 2 | `PersonaSelector` + `InputSliders` + `CrisisImpactDisplay` — the "what it's costing you" section |
| 3 | Build `useOptionsComparison` hook — EV vs LPG vs status quo logic per persona |
| 4 | `OptionCard` + `ComparisonTable` + `CaveatsList` — the options comparison section |
| 5 | `JCurveChart` with Recharts — multi-line 36-month payback chart |
| 5 | `ScenarioToggle` — wire to React context so it recalculates everything |

### Week 2: CTA + Polish + Launch

| Day | Task |
|-----|------|
| 6 | Build `electorates.json` — scrape AEC + aph.gov.au for 48th Parliament |
| 7 | `PostcodeLookup` + `MPCard` + `EmailPreview` + `SendButton` |
| 8 | `Hero` + `About` + `Sources` sections. Responsive pass. |
| 9 | Mobile testing across devices. Lighthouse audit. Fix issues. |
| 10 | README.md. Push to public GitHub. Final Vercel deploy. Tweet it. |

---

## The Grattan Engagement — Updated Questions

The fuel-agnostic approach changes what you're asking Grattan to validate:

1. **LPG conversion economics:** Real-world efficiency penalty (is 1.3 right?), realistic conversion costs by vehicle class, LPG price under scaled demand
2. **EV total cost of ownership:** Is the payback model accurate when including finance costs, insurance differential, and depreciation?
3. **Freight-to-grocery transmission:** If diesel drops X%, what's the real impact on grocery prices? Is 10% freight-as-percent-of-basket correct?
4. **Domestic LPG availability:** How much LPG byproduct could realistically be retained domestically given export contracts?
5. **EV infrastructure gap:** What's the realistic timeline for regional charging coverage to support mass adoption outside metro?
6. **Policy feasibility:** Are reinstated EV rebates and emergency LPG conversion subsidies constitutionally and fiscally viable simultaneously?

### Framing to Grattan
"I'm building an open-source fuel crisis calculator. It compares EV, LPG, and status quo for different vehicle types using ACCC data. Before I launch it, I want the modelling reviewed by someone credible. I'd rather you tell me where I'm wrong before 100,000 people use it."

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Numbers are wrong | Medium | Fatal | Grattan validation. Open source. Cite every constant. |
| "Just another EV calculator" | Medium | High | LPG + freight persona + postcode CTA differentiates it |
| Postcode data stale | Medium | Medium | lastUpdated field. GitHub issues for corrections. |
| Crisis resolves quickly | Low | Medium | Scenario toggle. Structural 32-day reserve argument persists. |
| Scope creep (too many options) | High | Medium | Strict 4 personas. Max 3 options per persona. Disciplined UI. |
| Demiton conflict | High | High | Don't start until Assignar go-live is stable. |
| LPG price rises under demand | Medium | Medium | Acknowledged in caveats. Model the range. |
| EV purchase prices change | Low | Low | Constants file easy to update. Prices are dropping. |
| Accused of astroturfing | Medium | Medium | Open source. Named author. No party affiliation. |

---

## Domain Recommendations

| Domain | Pros | Cons |
|--------|------|------|
| **whatitscosting.com.au** | Emotional, action-oriented, fuel-agnostic | Long |
| **fuelcrisis.com.au** | Direct, searchable, memorable | Might already be taken |
| **thecrisistax.com.au** | Punchy, implies unfairness | Slightly partisan feel |
| **crisismath.com.au** | Larrikin, implies honesty | Niche |
| **fuelcalc.com.au** | Short, functional | Generic |

Register 2-3 before building. Check .com.au availability — you'll need an ABN (which you have via Demiton/Ortege).

---

## What This Is NOT

- Not a petition (petitions are ignored)
- Not a news site (no editorial, just data)
- Not affiliated with any political party
- Not selling anything
- Not storing any user data
- Not sending emails on behalf of users (it opens THEIR mail app)
- Not claiming any single fuel is "the answer" — it shows the maths and lets people decide

---

## Success Metrics

| Metric | How to Measure |
|--------|---------------|
| Total calculator uses | Privacy-respecting analytics (Plausible/Fathom) |
| Emails generated (proxy: CTA button clicks) | Event tracking on mailto: click |
| Media mentions | Google Alerts on domain name + "Justin Trollip" |
| GitHub stars / forks | GitHub |
| Grattan engagement | Did they respond? |
| MP office responses | Anecdotal — ask users to share responses |
| Electorates targeted | If analytics shows postcode distribution |