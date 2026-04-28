import { useState, useEffect } from 'react';

const BRANDS = [
  { name: 'Pertamina', color: '#e8352a', count: 381, short: 'PTM' },
  { name: 'Shell',     color: '#f5a524', count: 43,  short: 'SHL' },
  { name: 'Vivo',      color: '#1e90d7', count: 14,  short: 'VV'  },
  { name: 'BP',        color: '#4ca845', count: 9,   short: 'BP'  },
];

const FEATURES = [
  { icon: '🗺️', id: 'Peta Interaktif',  en: 'Interactive Map',   desc_id: 'Navigasi peta Jawa Barat dengan marker SPBU per brand.',          desc_en: 'Navigate West Java with clickable brand markers.' },
  { icon: '🔍', id: 'Cari & Filter',     en: 'Search & Filter',   desc_id: 'Filter berdasarkan brand atau jenis bahan bakar.',                 desc_en: 'Filter by brand or fuel type.' },
  { icon: '🧭', id: 'Petunjuk Arah',     en: 'Get Directions',    desc_id: 'Routing dari lokasi kamu ke SPBU pilihan via OSRM.',              desc_en: 'Route from your location to chosen station via OSRM.' },
  { icon: '📍', id: 'SPBU Terdekat',     en: 'Nearby Stations',   desc_id: 'Tampilkan SPBU dalam radius 3 km dari posisimu.',                 desc_en: 'Show stations within 3 km of your position.' },
  { icon: '⛽', id: 'Harga BBM',         en: 'Fuel Prices',       desc_id: 'Informasi harga terkini untuk setiap jenis bahan bakar.',          desc_en: 'Current pricing for every fuel type.' },
  { icon: '🌙', id: 'Dark / Light Mode', en: 'Dark / Light Mode', desc_id: 'Tiga gaya peta dan dua tema tampilan yang bisa disesuaikan.',     desc_en: 'Three map styles and two display themes.' },
];

export default function Landing() {
  const [lang, setLang] = useState('id');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.background = isDark ? '#0d0d0f' : '#f4f4f0';
    document.body.style.color = isDark ? '#f4f4f5' : '#18181b';
  }, [theme]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const APP = '/map';
  const isId = lang === 'id';

  const c = {
    bg:       isDark ? '#0d0d0f' : '#f4f4f0',
    bgElev:   isDark ? '#0f0f11' : '#ffffff',
    bgElev2:  isDark ? '#141416' : '#f0f0ec',
    border:   isDark ? '#1a1a1e' : '#e0e0dc',
    border2:  isDark ? '#2a2a2e' : '#d0d0cc',
    fg:       isDark ? '#f4f4f5' : '#18181b',
    fgMuted:  isDark ? '#a1a1aa' : '#52525b',
    fgDim:    isDark ? '#71717a' : '#71717a',
    navBg:    isDark ? 'rgba(13,13,15,0.92)' : 'rgba(244,244,240,0.92)',
  };

  return (
    <div style={{ fontFamily: "'Geist', -apple-system, system-ui, sans-serif", background: c.bg, color: c.fg, minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
        @keyframes fadein { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .lp-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; font-size:14px; font-weight:600; font-family:inherit; cursor:pointer; border:none; transition:all 0.2s; }
        .lp-btn-primary { background:#f5a524; color:#0d0d0f; }
        .lp-btn-primary:hover { background:#f5b84a; transform:translateY(-1px); }
        .lp-nav-link { font-size:14px; font-weight:500; transition:color 0.2s; cursor:pointer; background:none; border:none; font-family:inherit; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? c.navBg : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${c.border}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5a524', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>⛽</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: c.fg }}>SPBU</div>
            <div style={{ fontSize: 9, color: c.fgDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>JAWA BARAT</div>
          </div>
        </a>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            { label: 'Home',                            id: 'hero'     },
            { label: isId ? 'Fitur' : 'Features',       id: 'features' },
            { label: 'Preview',                          id: 'preview'  },
          ].map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className="lp-nav-link"
              style={{ color: c.fgDim }}
              onMouseEnter={e => e.currentTarget.style.color = c.fg}
              onMouseLeave={e => e.currentTarget.style.color = c.fgDim}
            >{n.label}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme toggle */}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1px solid ${c.border2}`,
            background: c.bgElev, color: c.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 15,
          }}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Lang toggle */}
          <div style={{ display: 'flex', gap: 2, padding: 3, background: c.bgElev, borderRadius: 7, border: `1px solid ${c.border}` }}>
            {['id', 'en'].map(L => (
              <button key={L} onClick={() => setLang(L)} style={{
                padding: '3px 9px', fontSize: 10, fontWeight: 700, borderRadius: 5,
                border: 'none', cursor: 'pointer', fontFamily: 'monospace',
                textTransform: 'uppercase', letterSpacing: '0.06em', transition: 'all 0.15s',
                background: lang === L ? c.bgElev2 : 'transparent',
                color: lang === L ? c.fg : c.fgDim,
              }}>{L}</button>
            ))}
          </div>

          <a href={APP} className="lp-btn lp-btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
            {isId ? 'Buka Aplikasi' : 'Open App'} →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 40px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}/>
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,165,36,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, animation: 'fadein 0.7s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 999, marginBottom: 32,
            background: 'rgba(245,165,36,0.08)', border: '1px solid rgba(245,165,36,0.18)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a524', display: 'inline-block' }}/>
            <span style={{ fontSize: 12, color: '#f5a524', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
              {isId ? 'Berbasis Data OpenStreetMap' : 'Powered by OpenStreetMap'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24, color: c.fg }}>
            <span style={{ display: 'block' }}>{isId ? 'Temukan SPBU' : 'Find the Nearest'}</span>
            <span style={{ display: 'block' }}>{isId ? 'Terdekat di' : 'Gas Station in'}</span>
            <span style={{ display: 'block', color: '#f5a524' }}>{isId ? 'Jawa Barat' : 'West Java'}</span>
          </h1>

          <p style={{ fontSize: 17, color: c.fgDim, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
            {isId
              ? 'Peta interaktif 447 SPBU Jawa Barat — lengkap dengan harga BBM, fasilitas, dan petunjuk arah.'
              : 'Interactive map of 447 gas stations in West Java — with fuel prices, amenities, and directions.'}
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP} className="lp-btn lp-btn-primary">
              📍 {isId ? 'Buka Peta' : 'Open Map'}
            </a>
            <button onClick={() => scrollTo('features')} className="lp-btn" style={{
              background: 'transparent', color: c.fg,
              border: `1px solid ${c.border2}`,
            }}>
              {isId ? 'Lihat Fitur' : 'See Features'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
            {BRANDS.map(b => (
              <div key={b.name} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 12px 6px 8px', borderRadius: 999,
                background: `${b.color}10`, border: `1px solid ${b.color}28`,
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{b.short}</span>
                </div>
                <span style={{ fontSize: 12, color: c.fgMuted, fontWeight: 500 }}>{b.name}</span>
                <span style={{ fontSize: 11, color: b.color, fontWeight: 700, fontFamily: 'monospace' }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f5a524', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>
            {isId ? 'Fitur' : 'Features'}
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', color: c.fg }}>
            {isId ? 'Semua yang Kamu Butuhkan' : 'Everything You Need'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: 24, borderRadius: 14,
              background: c.bgElev, border: `1px solid ${c.border}`,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.border2; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 26, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em', color: c.fg }}>{isId ? f.id : f.en}</h3>
              <p style={{ fontSize: 13, color: c.fgDim, lineHeight: 1.65 }}>{isId ? f.desc_id : f.desc_en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f5a524', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>Preview</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', color: c.fg }}>
            {isId ? 'Lihat Aplikasinya' : 'See It in Action'}
          </h2>
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${c.border}`, boxShadow: isDark ? '0 32px 64px -16px rgba(0,0,0,0.7)' : '0 32px 64px -16px rgba(0,0,0,0.15)' }}>
          <div style={{ background: c.bgElev, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(col => <div key={col} style={{ width: 10, height: 10, borderRadius: '50%', background: col }}/>)}
            </div>
            <div style={{ flex: 1, background: c.bg, borderRadius: 5, padding: '4px 10px', fontSize: 11, color: c.fgDim, fontFamily: 'monospace' }}>
              spbu-map.vercel.app
            </div>
          </div>
          <img src="/preview.png" alt="SPBU Map Preview" style={{ width: '100%', display: 'block' }}/>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href={APP} className="lp-btn lp-btn-primary">
            {isId ? 'Buka Aplikasi' : 'Open App'} →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${c.border}`, padding: '28px 40px', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: c.fgDim }}>
            {isId ? 'Tugas Besar TPBW · Teknik Komputer · Telkom University' : 'TPBW Final Project · Computer Engineering · Telkom University'}
          </div>
          <div style={{ fontSize: 12, color: c.fgDim, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>React + Leaflet</span>
            <span>·</span>
            <span>OpenStreetMap</span>
            <span>·</span>
            <a href={APP} style={{ color: '#f5a524', fontWeight: 600 }}>Open App →</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
