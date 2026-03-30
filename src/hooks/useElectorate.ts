import { useState, useCallback } from 'react';
import electorateData from '../data/electorates.json';
import type { MPData } from '../utils/mailto';

interface ElectorateEntry {
  electorates: MPData[];
}

type ElectorateMap = Record<string, ElectorateEntry>;

const data = electorateData as unknown as ElectorateMap & { _meta: unknown };

export function useElectorate() {
  const [postcode, setPostcode] = useState('');
  const [results, setResults] = useState<MPData[] | null>(null);
  const [selectedMP, setSelectedMP] = useState<MPData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback((pc: string) => {
    setPostcode(pc);
    setSelectedMP(null);
    setError(null);

    if (pc.length !== 4 || !/^\d{4}$/.test(pc)) {
      setResults(null);
      setError(pc.length === 4 ? 'Invalid postcode format' : null);
      return;
    }

    const entry = data[pc];
    if (!entry || !entry.electorates) {
      setResults(null);
      setError(`Postcode ${pc} not found. This is a seed dataset — full coverage coming soon.`);
      return;
    }

    setResults(entry.electorates);
    if (entry.electorates.length === 1) {
      setSelectedMP(entry.electorates[0]);
    }
  }, []);

  return { postcode, results, selectedMP, error, lookup, setSelectedMP };
}
