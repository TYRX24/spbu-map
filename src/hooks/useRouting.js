import { useState, useCallback } from 'react';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

function formatDuration(seconds) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} menit`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h} jam ${rem} menit` : `${h} jam`;
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function useRouting() {
  const [route, setRoute] = useState(null);   // { coords, distance, duration, geojson }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoute = useCallback(async (fromLat, fromLng, toLat, toLng) => {
    setLoading(true);
    setError(null);
    setRoute(null);
    try {
      const url = `${OSRM_BASE}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route found');
      const r = data.routes[0];
      setRoute({
        coords: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distanceRaw: r.distance,
        durationRaw: r.duration,
        distance: formatDistance(r.distance),
        duration: formatDuration(r.duration),
      });
    } catch (e) {
      setError(e.message || 'Route error');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  return { route, loading, error, fetchRoute, clearRoute };
}
