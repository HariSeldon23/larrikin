import { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllStations, useNearestStations, type Station, type StationWithDistance } from '../../hooks/useNearestStations';

// Fix default marker icons in bundled builds
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#fff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#fff"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const stationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28">
      <path d="M10 0C4.5 0 0 4.5 0 10c0 7.5 10 18 10 18s10-10.5 10-18C20 4.5 15.5 0 10 0z" fill="#d97706"/>
      <circle cx="10" cy="10" r="5" fill="#fff"/>
      <text x="10" y="13" text-anchor="middle" font-size="9" font-weight="bold" fill="#d97706">G</text>
    </svg>
  `),
  iconSize: [20, 28],
  iconAnchor: [10, 28],
  popupAnchor: [0, -28],
});

const AUSTRALIA_CENTER: [number, number] = [-25.5, 134.5];
const AUSTRALIA_ZOOM = 4;

// Component to recenter map when user searches
function MapRecenter({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], 11, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

export default function StationMap() {
  const [searchInput, setSearchInput] = useState('');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const allStations = useRef(getAllStations());
  const nearest = useNearestStations(userLat, userLng, 5);

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    setSearching(true);
    setSearchError(null);

    try {
      const query = `${searchInput.trim()}, Australia`;
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=au`,
        { headers: { 'User-Agent': 'FuelCrisisCalculator/1.0' } },
      );
      const results = await resp.json();

      if (results.length === 0) {
        setSearchError('Location not found. Try a suburb name or postcode.');
        setSearching(false);
        return;
      }

      setUserLat(parseFloat(results[0].lat));
      setUserLng(parseFloat(results[0].lon));
    } catch {
      setSearchError('Search failed. Please try again.');
    }
    setSearching(false);
  }, [searchInput]);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation not supported by your browser.');
      return;
    }
    setSearching(true);
    setSearchError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setSearching(false);
      },
      () => {
        setSearchError('Could not get your location. Try searching instead.');
        setSearching(false);
      },
    );
  }, []);

  return (
    <section className="px-6 py-12 md:px-12" id="station-map">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
          Find LPG Stations Near You
        </h2>
        <p className="text-text-muted mb-6">
          {allStations.current.length} Autogas stations across Australia.
          Enter your address or postcode to find the nearest ones.
        </p>

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Suburb, address, or postcode"
            className="flex-1 px-4 py-3 bg-bg-card border border-border text-text-primary
              font-mono text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-lpg-gold"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-5 py-3 bg-lpg-gold text-bg-primary font-heading text-sm font-bold
              uppercase tracking-wider hover:bg-amber-500 transition-colors disabled:opacity-50"
          >
            {searching ? '...' : 'Search'}
          </button>
          <button
            onClick={handleUseLocation}
            disabled={searching}
            className="px-3 py-3 border border-border bg-bg-card text-text-muted
              hover:border-text-muted transition-colors disabled:opacity-50"
            title="Use my location"
          >
            📍
          </button>
        </div>

        {searchError && <p className="text-crisis-red text-sm mb-4">{searchError}</p>}

        {/* Nearest stations list */}
        {nearest.length > 0 && (
          <div className="mb-4 space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-text-muted font-heading font-bold">
              Nearest 5 Stations
            </h3>
            {nearest.map((s, i) => (
              <NearestStationRow key={s.id} station={s} rank={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Map — full width breakout */}
      <div className="-mx-6 md:-mx-12 lg:-mx-24 mt-6">
        <div className="h-96 md:h-[500px] relative z-0">
          <MapContainer
            center={AUSTRALIA_CENTER}
            zoom={AUSTRALIA_ZOOM}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter lat={userLat} lng={userLng} />

            {/* User location marker */}
            {userLat !== null && userLng !== null && (
              <Marker position={[userLat, userLng]} icon={userIcon}>
                <Popup>
                  <strong>Your location</strong>
                </Popup>
              </Marker>
            )}

            {/* Station markers */}
            {allStations.current.map((s: Station) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={stationIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong>{s.name}</strong>
                    {s.brand && <div className="text-gray-500">{s.brand}</div>}
                    {s.address && <div className="text-gray-500">{s.address}</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-4">
        <p className="text-xs text-text-muted">
          Station data from OpenStreetMap (fuel:lpg=yes). Last updated: March 30, 2026.
          Station availability may vary — confirm before travelling.
        </p>
      </div>
    </section>
  );
}

function NearestStationRow({ station, rank }: { station: StationWithDistance; rank: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border border-border bg-bg-card">
      <span className="font-heading text-lg font-bold text-lpg-gold w-6">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-text-primary truncate">{station.name}</div>
        <div className="text-xs text-text-muted truncate">
          {station.address || station.brand || 'LPG Station'}
        </div>
      </div>
      <div className="font-mono text-sm text-lpg-gold font-bold whitespace-nowrap">
        {station.distance < 1
          ? `${Math.round(station.distance * 1000)}m`
          : `${station.distance.toFixed(1)}km`}
      </div>
    </div>
  );
}
