import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/Map.jsx';
import StationDetail from './components/StationDetail.jsx';
import TweaksPanel from './components/TweaksPanel.jsx';
import Icon from './components/Icon.jsx';
import { I18N, FUELS } from './constants.js';
import { useRouting } from './hooks/useRouting.js';
import rawStations from './data/spbu.json';
import NearMeOverlay from './components/NearMeOverlay.jsx';

const DEFAULTS = {
  theme: 'dark',
  sidebarSide: 'left',
  mapStyle: 'standard',
  lang: 'id',
};

// Haversine distance in km
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function App() {
  const [tweaks, setTweaksRaw] = useState(DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useState(false);

  const setTweaks = patch => setTweaksRaw(t => {
    if (patch._close) { setTweaksVisible(false); return t; }
    return { ...t, ...patch };
  });

  // Apply theme
  useEffect(() => { document.body.dataset.theme = tweaks.theme; }, [tweaks.theme]);

  // Keyboard shortcut: T to toggle tweaks
  useEffect(() => {
    const handler = e => { if (e.key === 't' && !e.target.matches('input')) setTweaksVisible(v => !v); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // State
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ brands: [], fuels: [], openOnly: false });
  const [sort, setSort] = useState('name');
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saved, setSaved] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [nearMeActive, setNearMeActive] = useState(false);

  // Routing
  const { route, loading: routeLoading, error: routeError, fetchRoute, clearRoute } = useRouting();

  // Geolocation
  const requestLocation = useCallback(() => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      pos => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => { requestLocation(); }, []);

  const toggleSave = id => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  // Enrich stations with distance if user location available
  const stations = useMemo(() => {
    return rawStations.map(s => ({
      ...s,
      distance: userLocation ? haversine(userLocation.lat, userLocation.lng, s.lat, s.lng) : null,
    }));
  }, [userLocation]);

  // Filter + sort
  const filtered = useMemo(() => {
    let arr = stations.filter(s => {
      if (filters.brands.length && !filters.brands.includes(s.brand)) return false;
      if (filters.fuels.length && !s.fuels.some(f => filters.fuels.includes(f))) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return s.name.toLowerCase().includes(q)
          || (s.area || '').toLowerCase().includes(q)
          || (s.address || '').toLowerCase().includes(q);
      }
      return true;
    });

    arr.sort((a, b) => {
      if (sort === 'distance' && a.distance != null && b.distance != null) return a.distance - b.distance;
      if (sort === 'brand') return a.brand.localeCompare(b.brand);
      return a.name.localeCompare(b.name);
    });
    return arr;
  }, [stations, query, filters, sort]);

  const selected = stations.find(s => s.id === selectedId) || null;

  useEffect(() => { if (!selectedId) { setDetailOpen(false); clearRoute(); } }, [selectedId]);

  const handleGetDirections = useCallback(() => {
    if (!userLocation) { alert(I18N[tweaks.lang].no_location); return; }
    if (!selected) return;
    fetchRoute(userLocation.lat, userLocation.lng, selected.lat, selected.lng);
  }, [userLocation, selected, fetchRoute, tweaks.lang]);

  return (
    <div style={{
      display:'flex',
      flexDirection: tweaks.sidebarSide === 'right' ? 'row-reverse' : 'row',
      height:'100%', width:'100%', background:'var(--bg)',
    }}>
      <Sidebar
        stations={stations}
        filtered={filtered}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={setSelectedId}
        onHover={setHoveredId}
        query={query} setQuery={setQuery}
        filters={filters} setFilters={setFilters}
        sort={sort} setSort={setSort}
        lang={tweaks.lang} setLang={l => setTweaks({ lang: l })}
        onOpenDetail={() => setDetailOpen(true)}
        side={tweaks.sidebarSide}
        saved={saved} toggleSave={toggleSave}
      />

      <main style={{ flex:1, position:'relative' }}>
        <MapView
          stations={filtered}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={id => { setSelectedId(id); setDetailOpen(true); }}
          onHover={setHoveredId}
          mapStyle={tweaks.mapStyle}
          theme={tweaks.theme}
          lang={tweaks.lang}
          userLocation={userLocation}
          route={route}
          nearMeActive={nearMeActive}
        />

        {/* Detail panel */}
        {selected && detailOpen && (
          <div style={{
            position:'absolute', top:0, bottom:0,
            [tweaks.sidebarSide === 'left' ? 'left' : 'right']: 0,
            width:400, zIndex:500,
          }}>
            <StationDetail
              station={selected}
              onClose={() => { setDetailOpen(false); clearRoute(); }}
              lang={tweaks.lang}
              side={tweaks.sidebarSide}
              isSaved={saved.includes(selected.id)}
              onToggleSave={() => toggleSave(selected.id)}
              onGetDirections={handleGetDirections}
              routing={{ route, loading: routeLoading, error: routeError, clearRoute }}
            />
          </div>
        )}

        <NearMeOverlay
          stations={stations}
          userLocation={userLocation}
          onRequestLocation={requestLocation}
          onSelectStation={id => { setSelectedId(id); setDetailOpen(true); }}
          lang={tweaks.lang}
          theme={tweaks.theme}
          locating={locating}
          active={nearMeActive}
          onActivate={() => setNearMeActive(true)}
          onDeactivate={() => setNearMeActive(false)}
        />

        {/* Tweaks toggle button */}
        <button
          onClick={() => setTweaksVisible(v => !v)}
          title="Tweaks (T)"
          style={{
            position:'absolute', bottom:80, right:16, zIndex:400,
            width:40, height:40, borderRadius:10,
            background:'var(--bg-elev)', border:'1px solid var(--line)',
            boxShadow:'var(--shadow-2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: tweaksVisible ? 'var(--accent)' : 'var(--fg)',
          }}
        >
          <Icon name="sliders" size={16}/>
        </button>
      </main>

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible}/>
    </div>
  );
}
