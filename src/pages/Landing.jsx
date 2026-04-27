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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const APP = '/map';
  const isId = lang === 'id';

  return (
    <div style={{ fontFamily: "'Geist', -apple-system, system-ui, sans-serif", background: '#0d0d0f', color: '#f4f4f5', minHeight: '100vh' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
        @keyframes fadein { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .lp-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; font-size:14px; font-weight:600; font-family:inherit; cursor:pointer; border:none; transition:all 0.2s; }
        .lp-btn-primary { background:#f5a524; color:#0d0d0f; }
        .lp-btn-primary:hover { background:#f5b84a; transform:translateY(-1px); }
        .lp-btn-ghost { background:transparent; color:#f4f4f5; border:1px solid #2a2a2e; }
        .lp-btn-ghost:hover { background:#141416; }
        .lp-nav-link { font-size:14px; color:#71717a; font-weight:500; transition:color 0.2s; }
        .lp-nav-link:hover { color:#f4f4f5; }
        .lp-card { background:#0f0f11; border:1px solid #1a1a1e; border-radius:14px; padding:24px; transition:border-color 0.2s; }
        .lp-card:hover { border-color:#2a2a2e; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(13,13,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1a1e' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5a524', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>⛽</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>SPBU</div>
            <div style={{ fontSize: 9, color: '#52525b', fontFamily: 'monospace', letterSpacing: '0.1em' }}>JAWA BARAT</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#" className="lp-nav-link">Home</a>
          <a href="#features" className="lp-nav-link">{isId ? 'Fitur' : 'Features'}</a>
          <a href="#preview"  className="lp-nav-link">Preview</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 2, padding: 3, background: '#0f0f11', borderRadius: 7, border: '1px solid #1a1a1e' }}>
            {['id', 'en'].map(L => (
              <button key={L} onClick={() => setLang(L)} style={{
                padding: '3px 9px', fontSize: 10, fontWeight: 700, borderRadius: 5,
                border: 'none', cursor: 'pointer', fontFamily: 'monospace',
                textTransform: 'uppercase', letterSpacing: '0.06em', transition: 'all 0.15s',
                background: lang === L ? '#1a1a1e' : 'transparent',
                color: lang === L ? '#f4f4f5' : '#52525b',
              }}>{L}</button>
            ))}
          </div>
          <a href={APP} className="lp-btn lp-btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
            {isId ? 'Buka Aplikasi' : 'Open App'} →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 40px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
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

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24 }}>
            <span style={{ display: 'block' }}>{isId ? 'Temukan SPBU' : 'Find the Nearest'}</span>
            <span style={{ display: 'block' }}>{isId ? 'Terdekat di' : 'Gas Station in'}</span>
            <span style={{ display: 'block', color: '#f5a524' }}>{isId ? 'Jawa Barat' : 'West Java'}</span>
          </h1>

          <p style={{ fontSize: 17, color: '#71717a', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
            {isId
              ? 'Peta interaktif 447 SPBU Jawa Barat — lengkap dengan harga BBM, fasilitas, dan petunjuk arah.'
              : 'Interactive map of 447 gas stations in West Java — with fuel prices, amenities, and directions.'}
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP} className="lp-btn lp-btn-primary">
              📍 {isId ? 'Buka Peta' : 'Open Map'}
            </a>
            <a href="#features" className="lp-btn lp-btn-ghost">
              {isId ? 'Lihat Fitur' : 'See Features'}
            </a>
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
                <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 500 }}>{b.name}</span>
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
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            {isId ? 'Semua yang Kamu Butuhkan' : 'Everything You Need'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="lp-card">
              <div style={{ fontSize: 26, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{isId ? f.id : f.en}</h3>
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65 }}>{isId ? f.desc_id : f.desc_en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f5a524', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>Preview</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            {isId ? 'Lihat Aplikasinya' : 'See It in Action'}
          </h2>
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #1a1a1e', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.7)' }}>
          <div style={{ background: '#0f0f11', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #1a1a1e' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
            </div>
            <div style={{ flex: 1, background: '#0d0d0f', borderRadius: 5, padding: '4px 10px', fontSize: 11, color: '#52525b', fontFamily: 'monospace' }}>
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
      <footer style={{ borderTop: '1px solid #1a1a1e', padding: '28px 40px', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#52525b' }}>
            {isId ? 'Tugas Besar TPBW · Teknik Komputer · Telkom University' : 'TPBW Final Project · Computer Engineering · Telkom University'}
          </div>
          <div style={{ fontSize: 12, color: '#52525b', display: 'flex', gap: 12, alignItems: 'center' }}>
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