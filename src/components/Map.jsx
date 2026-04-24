import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BRANDS, I18N } from '../constants.js';

const NEAR_RADIUS_M = 3000;
const TILE_LAYERS = {
  standard: {
    dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attr:  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    dark:  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr:  'Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
  },
  minimal: {
    dark:  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attr:  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
};

// Create custom pin HTML for each brand
function createPinHTML(brand, isActive, theme) {
  const b = BRANDS[brand];
  const size = isActive ? 44 : 36;
  return `
    <div style="
      width:${size}px; height:${size}px;
      border-radius: 50% 50% 50% 4px;
      transform: rotate(-45deg);
      background: ${b.color};
      box-shadow: ${isActive
        ? `0 0 0 3px ${theme==='dark'?'#0b0b0c':'#fff'}, 0 0 0 5px ${b.color}, 0 12px 24px -6px rgba(0,0,0,0.5)`
        : `0 0 0 2px ${theme==='dark'?'#0b0b0c':'#fff'}, 0 6px 14px -4px rgba(0,0,0,0.5)`};
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    ">
      <div style="transform:rotate(45deg); color:#fff; font-size:${isActive?14:11}px; font-weight:700; font-family:monospace;">
        ${b.short}
      </div>
    </div>
  `;
}

function createMarkerIcon(brand, isActive, theme) {
  const size = isActive ? 44 : 36;
  return L.divIcon({
    html: createPinHTML(brand, isActive, theme),
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export default function MapView({ stations, selectedId, hoveredId, onSelect, onHover, mapStyle, theme, lang, userLocation, route, nearMeActive }) {
  const t = I18N[lang];
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef({});
  const tileLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  // Init map
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = L.map(containerRef.current, {
      center: [-6.9, 107.6], // West Java center
      zoom: 9,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Update tile layer on mapStyle/theme change
  useEffect(() => {
    if (!mapRef.current) return;
    const cfg = TILE_LAYERS[mapStyle] || TILE_LAYERS.standard;
    const url = theme === 'dark' ? cfg.dark : cfg.light;
    if (tileLayerRef.current) { tileLayerRef.current.remove(); }
    tileLayerRef.current = L.tileLayer(url, { attribution: cfg.attr, maxZoom: 19 });
    tileLayerRef.current.addTo(mapRef.current);
  }, [mapStyle, theme]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const existing = markersRef.current;
    const stationIds = new Set(stations.map(s => s.id));

    // Remove old markers
    Object.entries(existing).forEach(([id, marker]) => {
      if (!stationIds.has(id)) { marker.remove(); delete existing[id]; }
    });

    // Add/update markers
    stations.forEach((s, i) => {
      const isActive = selectedId === s.id || hoveredId === s.id;
      const icon = createMarkerIcon(s.brand, isActive, theme);

      if (existing[s.id]) {
        existing[s.id].setIcon(icon);
      } else {
        const marker = L.marker([s.lat, s.lng], { icon })
          .on('click', () => onSelect(s.id))
          .on('mouseover', () => onHover(s.id))
          .on('mouseout', () => onHover(null));
        marker.addTo(map);
        existing[s.id] = marker;
      }
    });
    markersRef.current = existing;
  }, [stations, selectedId, hoveredId, theme]);

  // Fly to selected station
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const s = stations.find(st => st.id === selectedId);
    if (s) mapRef.current.flyTo([s.lat, s.lng], Math.max(mapRef.current.getZoom(), 14), { duration: 0.8 });
  }, [selectedId]);

  // User location marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
    if (!userLocation) return;
    const icon = L.divIcon({
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.25);"></div>`,
      className: '', iconSize: [16,16], iconAnchor: [8,8],
    });
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon, zIndexOffset: 1000 })
      .addTo(mapRef.current);
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (radiusCircleRef.current) { radiusCircleRef.current.remove(); radiusCircleRef.current = null; }
    if (!userLocation || !nearMeActive) return;
    const accentColor = theme === 'dark' ? '#f5a524' : '#c97a0c';
    radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
      radius: NEAR_RADIUS_M, color: accentColor, weight: 2, opacity: 0.7,
      fillColor: accentColor, fillOpacity: 0.07, Array: '6 4',
    }).addTo(mapRef.current);
    mapRef.current.fitBounds(radiusCircleRef.current.getBounds(), { padding: [40, 40], maxZoom: 14 });
  }, [userLocation, nearMeActive, theme]);

  // Route polyline
  useEffect(() => {
    if (!mapRef.current) return;
    if (routeLayerRef.current) { routeLayerRef.current.remove(); routeLayerRef.current = null; }
    if (!route?.coords?.length) return;
    routeLayerRef.current = L.polyline(route.coords, {
      color: '#f5a524', weight: 5, opacity: 0.85, dashArray: null,
      lineJoin: 'round', lineCap: 'round',
    }).addTo(mapRef.current);
    mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] });
  }, [route]);

  return (
    <div style={{ position:'absolute', inset:0 }}>
      <div ref={containerRef} style={{ width:'100%', height:'100%' }}/>

      {/* Top badge */}
      <div style={{
        position:'absolute', top:16, left:16, zIndex:400,
        display:'flex', alignItems:'center', gap:8, padding:'8px 14px',
        background:'var(--bg-elev)', border:'1px solid var(--line)',
        borderRadius:999, boxShadow:'var(--shadow-2)', fontSize:12, pointerEvents:'none',
      }}>
        <span style={{ color:'var(--accent)', fontSize:14 }}>📍</span>
        <span style={{ fontWeight:600 }}>{t.west_java}</span>
        <span style={{ color:'var(--fg-dim)' }}>·</span>
        <span className="mono" style={{ color:'var(--fg-muted)' }}>{stations.length} {t.stations}</span>
      </div>
    </div>
  );
}
