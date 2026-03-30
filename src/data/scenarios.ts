export type ScenarioKey = 'recovery' | 'prolonged' | 'escalation';

export interface Scenario {
  key: ScenarioKey;
  label: string;
  description: string;
  petrolPrice: number;
  dieselPrice: number;
}

export const scenarios: Record<ScenarioKey, Scenario> = {
  recovery: {
    key: 'recovery',
    label: 'Recovery',
    description: 'Hormuz reopens within 3 months. Prices normalise by late 2026.',
    petrolPrice: 1.90,
    dieselPrice: 2.00,
  },
  prolonged: {
    key: 'prolonged',
    label: 'Prolonged',
    description: "Current trajectory continues 12–36 months. ACCC's base case.",
    petrolPrice: 2.52,
    dieselPrice: 3.04,
  },
  escalation: {
    key: 'escalation',
    label: 'Escalation',
    description: 'Conflict widens. Supply rationing. Prices breach $4/L.',
    petrolPrice: 3.50,
    dieselPrice: 4.50,
  },
};

export const DEFAULT_SCENARIO: ScenarioKey = 'prolonged';
export const scenarioOrder: ScenarioKey[] = ['recovery', 'prolonged', 'escalation'];
