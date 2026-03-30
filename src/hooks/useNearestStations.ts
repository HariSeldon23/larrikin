import { useMemo } from 'react';
import stations from '../data/lpg-stations.json';

export interface Station {
  id: number;
  lat: number;
  lng: number;
  name: string;
  brand: string;
  address: string;
  postcode: string;
  state: string;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface StationWithDistance extends Station {
  distance: number;
}

export function useNearestStations(
  lat: number | null,
  lng: number | null,
  count: number = 5,
): StationWithDistance[] {
  return useMemo(() => {
    if (lat === null || lng === null) return [];

    const withDistance = (stations as Station[]).map((s) => ({
      ...s,
      distance: haversineKm(lat, lng, s.lat, s.lng),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);
    return withDistance.slice(0, count);
  }, [lat, lng, count]);
}

export function getAllStations(): Station[] {
  return stations as Station[];
}
