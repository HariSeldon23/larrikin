export type ConversionType = 'petrol' | 'diesel';

export interface ConversionStep {
  title: string;
  description: string;
}

export interface CostEstimate {
  vehicleType: string;
  examples: string;
  costRange: [number, number];
  notes: string;
}

export interface Installer {
  name: string;
  location: string;
  state: string;
  phone: string;
  website: string;
  notes: string;
}

export const petrolConversionSteps: ConversionStep[] = [
  {
    title: '1. Assessment & Quote',
    description:
      'A certified installer inspects your vehicle, checks engine compatibility, and discusses tank placement options (boot-mount or underslung). Most petrol cars post-1990 with EFI (electronic fuel injection) are compatible. Carburettor vehicles (pre-1990) can also be converted but with older mixer-type systems.',
  },
  {
    title: '2. LPG Tank Installation',
    description:
      'A toroidal (donut-shaped) tank is fitted in the spare wheel well, or a cylindrical tank is mounted in the boot or under the chassis. Tank size is typically 50–80 litres, giving 400–600km range on LPG depending on vehicle economy.',
  },
  {
    title: '3. Fuel System & Injectors',
    description:
      'Dedicated LPG injectors are installed on the intake manifold, alongside new fuel lines running from the tank. A vapouriser/regulator converts liquid LPG to gas before injection. The system runs parallel to your existing petrol system — nothing is removed.',
  },
  {
    title: '4. ECU & Switch',
    description:
      'An LPG ECU (electronic control unit) is wired into the vehicle, reading signals from the existing engine sensors. A dash-mounted switch lets you toggle between petrol and LPG. Most systems start on petrol and auto-switch to LPG once the engine warms up.',
  },
  {
    title: '5. Tuning & Certification',
    description:
      'The installer tunes the LPG system for optimal air-fuel ratio, then issues a compliance certificate. In most states, an engineer\'s report or gas installation certificate is required before registration. Total install time: 1–2 days.',
  },
];

export const dieselConversionSteps: ConversionStep[] = [
  {
    title: '1. Assessment & Feasibility',
    description:
      'Diesel-LPG conversion (called "fumigation" or "dual-fuel") is more complex than petrol. Diesel engines use compression ignition — they have no spark plugs. LPG is injected alongside diesel, substituting 20–50% of diesel consumption. Not all diesel engines are suitable; turbocharged common-rail diesels (most modern utes and trucks) require specialist systems.',
  },
  {
    title: '2. LPG Tank Installation',
    description:
      'Similar to petrol conversion — a toroidal or cylindrical tank is fitted. For trucks and utes doing high mileage, larger tanks (80–120L) are common to maximise range between LPG refills.',
  },
  {
    title: '3. Fumigation System',
    description:
      'An LPG fumigation kit is installed on the intake manifold. Unlike petrol dual-fuel, the diesel engine ALWAYS runs on diesel — LPG is added as a supplementary fuel that displaces a portion of diesel. The diesel injectors remain active at all times.',
  },
  {
    title: '4. ECU & Diesel Substitution Rate',
    description:
      'A dedicated ECU controls the LPG injection rate based on engine load, RPM, and throttle position. The substitution rate varies: typically 20–30% around town, up to 40–50% on highway cruise. The system must be carefully tuned to avoid knock and maintain emissions compliance.',
  },
  {
    title: '5. Tuning, Testing & Certification',
    description:
      'Diesel fumigation requires more extensive tuning and dyno testing than petrol conversion. Exhaust gas temperatures must be monitored to prevent engine damage. Installation takes 2–4 days. Ensure your installer is specifically experienced with diesel fumigation — it\'s a specialist skill.',
  },
];

export const costEstimates: CostEstimate[] = [
  {
    vehicleType: 'Small car (petrol)',
    examples: 'Corolla, Mazda3, i30, Golf',
    costRange: [2000, 3000],
    notes: 'Most straightforward conversion. Boot-mount toroidal tank in spare wheel well.',
  },
  {
    vehicleType: 'Large car / SUV (petrol)',
    examples: 'Camry, Commodore, Kluger, Territory',
    costRange: [2500, 3500],
    notes: 'Larger engine may need higher-capacity vapouriser. Bigger tank recommended.',
  },
  {
    vehicleType: 'Ute (petrol)',
    examples: 'HiLux petrol, Ranger petrol, Navara petrol',
    costRange: [3000, 4500],
    notes: 'Underslung tank option keeps tray space free. 4WD models may cost more.',
  },
  {
    vehicleType: 'Ute (diesel dual-fuel)',
    examples: 'HiLux D4D, Ranger TDCi, BT-50',
    costRange: [3500, 5500],
    notes: 'Fumigation system. Substitutes 20–40% of diesel. Specialist installer required.',
  },
  {
    vehicleType: 'Prime mover (diesel)',
    examples: 'Kenworth, Volvo, Scania, Freightliner',
    costRange: [15000, 25000],
    notes: 'High-volume fumigation. 30–50% diesel substitution. Payback in 2–5 months at current prices.',
  },
  {
    vehicleType: 'Pre-2000 carburettor vehicle',
    examples: 'Older Commodores, Falcons, Corollas',
    costRange: [1500, 2500],
    notes: 'Simpler mixer-type system. Fewer electronic components. Check installer availability.',
  },
];

export const vehicleYearGuide = [
  {
    era: 'Pre-1990 (Carburettor)',
    compatibility: 'Compatible',
    notes: 'Uses older mixer-type LPG system. Simpler but less efficient than modern sequential injection. Parts becoming harder to source.',
    difficulty: 'medium' as const,
  },
  {
    era: '1990–2005 (Early EFI)',
    compatibility: 'Highly compatible',
    notes: 'Sweet spot for conversion. Simpler engine management systems. Most conversion kits are designed for this era. Wide installer experience.',
    difficulty: 'easy' as const,
  },
  {
    era: '2005–2015 (Modern EFI)',
    compatibility: 'Compatible',
    notes: 'More complex ECU integration needed. Sequential injection systems handle this well. May need vehicle-specific calibration files.',
    difficulty: 'easy' as const,
  },
  {
    era: '2015–2026 (Direct Injection / Turbo)',
    compatibility: 'Limited',
    notes: 'Direct-injection petrol engines (GDI/FSI) are harder to convert — LPG must be port-injected alongside the existing DI system. Turbo petrols possible but need specialist tuning. Always check with installer first.',
    difficulty: 'hard' as const,
  },
  {
    era: 'Diesel (any year)',
    compatibility: 'Fumigation only',
    notes: 'Diesel engines cannot run on LPG alone — they need diesel for compression ignition. LPG fumigation supplements diesel by 20–50%. Common-rail diesels (2005+) need specialist kits.',
    difficulty: 'hard' as const,
  },
];

export const installers: Installer[] = [
  // VIC
  {
    name: 'AG Autogas & Mechanical',
    location: 'Lilydale, Melbourne',
    state: 'VIC',
    phone: '(03) 9735 3400',
    website: 'https://www.agautogas.com.au/',
    notes: 'One of Melbourne\'s most established LPG specialists. Petrol and diesel conversions.',
  },
  {
    name: 'A1 Gas & Mechanical',
    location: 'Hallam, Melbourne',
    state: 'VIC',
    phone: '0437 522 193',
    website: 'https://www.a1mechanicalhallam.com.au/',
    notes: 'AAFRB accredited. Full conversion, service, and repair.',
  },
  {
    name: 'LPG Auto Power',
    location: 'Melbourne',
    state: 'VIC',
    phone: '',
    website: 'https://lpgautopower.com.au/',
    notes: 'LPG conversion, installation, testing, tuning and maintenance.',
  },
  {
    name: 'Western Auto Services',
    location: 'West Melbourne',
    state: 'VIC',
    phone: '',
    website: 'https://westernauto.net.au/lpg-conversions/',
    notes: 'LPG conversion kits and installation.',
  },
  {
    name: 'Frankston Gas & Automotive',
    location: 'Frankston, Melbourne',
    state: 'VIC',
    phone: '',
    website: 'https://www.frankstongasconversions.com.au/',
    notes: 'Specialises in gas conversions with detailed cost breakdowns.',
  },
  // SA
  {
    name: 'Pro Gas Conversions',
    location: 'Tea Tree Gully, Adelaide',
    state: 'SA',
    phone: '',
    website: 'https://www.progassa.com/',
    notes: 'Family-owned, 25+ years experience. Petrol and diesel conversions.',
  },
  {
    name: 'S.A. Autogas',
    location: 'Adelaide',
    state: 'SA',
    phone: '',
    website: '',
    notes: 'RAA-approved LPG installer.',
  },
  // QLD
  {
    name: 'Mosley\'s Automotive',
    location: 'Slacks Creek, Brisbane',
    state: 'QLD',
    phone: '',
    website: 'https://mosleysautomotive.com.au/',
    notes: 'Fully licensed LPG installation, repair and service centre.',
  },
  // WA
  {
    name: 'Liberty Autogas Conversions',
    location: 'Rockingham, Perth',
    state: 'WA',
    phone: '',
    website: 'https://www.libertyautogas.com.au/',
    notes: 'Operating since 1984. Experienced with all vehicle types.',
  },
  // NSW
  {
    name: 'AGA Automotive',
    location: 'Sydney',
    state: 'NSW',
    phone: '',
    website: 'https://www.agaautomotive.com.au/',
    notes: 'LPG conversions, servicing and repairs.',
  },
  // National supplier
  {
    name: 'Prins LPG Australia',
    location: 'National (supplier)',
    state: 'National',
    phone: '',
    website: 'https://prinslpg.com.au/',
    notes: 'Supplies Prins LPG conversion kits across Australia. Can refer you to local accredited installers.',
  },
];
