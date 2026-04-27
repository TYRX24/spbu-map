import Icon from './Icon.jsx';
import { BrandChip } from './Icon.jsx';
import { BRANDS, FUELS, AMENITY_LABELS, I18N } from '../constants.js';

function fuelColor(fk) {
  const map = {
    pertalite:'#3aa556', pertamax:'#1f6fbf', pertamax_turbo:'#d13a3a',
    solar:'#6b5638', dexlite:'#c77a28',
    shell_super:'#f5a524', shell_vpower:'#e8352a', shell_diesel:'#1f6fbf',
    bp_90:'#4ca845', bp_92:'#2d8a3e', bp_95:'#c97a0c', bp_diesel:'#1f6fbf',
    vivo_89:'#1e90d7', vivo_92:'#1767a3', vivo_95:'#0d4a7a', vivo_diesel:'#1f6fbf',
    ev:'#6366f1',
  };
  return map[fk] || 'var(--fg-dim)';
}

function SectionTitle({ icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11, fontWeight:600, color:'var(--fg-dim)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:'var(--font-mono)' }}>
      <Icon name={icon} size={12}/>{label}
    </div>
  );
}

function StatusChip({ icon, label, value, color, customIcon }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px', background:'var(--bg)', border:'1px solid var(--line)', borderRadius:8, fontSize:12 }}>
      {customIcon ? customIcon : icon && <Icon name={icon} size={12} style={{ color: color || 'var(--fg-muted)' }}/>}
      <span style={{ color:'var(--fg)', fontWeight:500 }}>{label}</span>
      {value && <span style={{ color:'var(--fg-dim)', fontSize:11 }}>· {value}</span>}
    </div>
  );
}

function IconBtn({ icon, label, onClick, active }) {
  return (
    <button onClick={onClick} title={label} style={{
      width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center',
      borderRadius:8,
      background: active ? 'var(--accent-soft)' : 'var(--bg)',
      color: active ? 'var(--accent)' : 'var(--fg)',
      border: `1px solid ${active ? 'var(--accent-ring)' : 'var(--line)'}`,
      transition:'all 0.15s',
    }}>
      <Icon name={icon} size={16}/>
    </button>
  );
}

export default function StationDetail({ station, onClose, lang, side, isSaved, onToggleSave, onGetDirections, routing }) {
  if (!station) return null;
  const t = I18N[lang];
  const brand = BRANDS[station.brand];
  const amenityIcons = { atm:'atm', toilet:'toilet', mart:'mart', prayer:'prayer', cafe:'cafe', wash:'wash', ev:'ev', compressed_air:'compressed_air' };

  const validFuels = (station.fuels || []).filter(fk => FUELS[fk]);

  return (
    <div className="fade-in" style={{
      position:'absolute', inset:0,
      background:'var(--bg-elev)',
      borderLeft: side === 'left' ? '1px solid var(--line)' : 'none',
      borderRight: side === 'right' ? '1px solid var(--line)' : 'none',
      boxShadow: side === 'left' ? '8px 0 40px -20px rgba(0,0,0,0.4)' : '-8px 0 40px -20px rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column', zIndex: 35,
    }}>
      {/* Header */}
      <div style={{
        padding:'18px 20px 14px',
        background:`linear-gradient(180deg, ${brand.color}22 0%, transparent 100%)`,
        borderBottom:'1px solid var(--line)', position:'relative',
      }}>
        <button onClick={onClose} style={{
          position:'absolute', top:14, right:14, width:28, height:28, borderRadius:7,
          background:'var(--bg)', border:'1px solid var(--line)',
          display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg-muted)',
        }}><Icon name="close" size={14}/></button>

        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
          <BrandChip brand={station.brand} size={44} brands={BRANDS}/>
          <div style={{ flex:1, minWidth:0, paddingRight:32 }}>
            <div style={{ fontSize:11, color:'var(--fg-dim)', fontFamily:'var(--font-mono)', letterSpacing:'0.05em' }}>
              {brand.name.toUpperCase()}
            </div>
            <h2 style={{ margin:'4px 0 0', fontSize:18, fontWeight:600, letterSpacing:'-0.02em', lineHeight:1.2 }}>
              {station.name}
            </h2>
            <div style={{ fontSize:13, color:'var(--fg-muted)', marginTop:4 }}>{station.address}</div>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
          <StatusChip icon="clock" label={t.open} value={station.hours || '24 jam'} color="#34d399"/>
        </div>
      </div>

      {/* Street View Photo */}
      <div style={{ position:'relative', height:200, overflow:'hidden', borderBottom:'1px solid var(--line)' }}>
        <img
          src={`https://maps.googleapis.com/maps/api/streetview?size=600x200&location=${station.lat},${station.lng}&fov=90&key=AIzaSyDEQCZLyR_JBHM4umvBIjud3rA_XKww1Bg`}
          alt={station.name}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          onError={e => { e.target.parentElement.style.display = 'none'; }}
        />
        <div style={{
          position:'absolute', bottom:8, right:8,
          padding:'3px 8px', borderRadius:6,
          background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)',
          fontSize:10, color:'rgba(255,255,255,0.7)', fontFamily:'var(--font-mono)',
        }}>
          Google Street View
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding:'14px 20px', display:'grid', gridTemplateColumns:'1fr auto auto', gap:8, borderBottom:'1px solid var(--line)' }}>
        <button
          onClick={onGetDirections}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            padding:'10px 14px', background:'var(--accent)', color:'#0b0b0c',
            borderRadius:8, fontSize:13, fontWeight:600,
          }}
        >
          <Icon name="directions" size={16} stroke={2}/>
          {t.directions}
        </button>
        <IconBtn icon="share" label={t.share} onClick={() => {
          if (navigator.share) navigator.share({ title: station.name, text: station.address, url: `https://www.openstreetmap.org/node/${station.osm_id}` });
        }}/>
        <IconBtn icon={isSaved ? 'heart-fill' : 'heart'} label={isSaved ? t.saved : t.save} onClick={onToggleSave} active={isSaved}/>
      </div>

      {/* Routing result */}
      {routing && (routing.loading || routing.route || routing.error) && (
        <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--line)', background:'var(--bg-elev-2)' }}>
          {routing.loading && (
            <div style={{ fontSize:12, color:'var(--fg-muted)', display:'flex', alignItems:'center', gap:6 }}>
              <Icon name="route" size={13} style={{ color:'var(--accent)' }}/>{t.routing_loading}
            </div>
          )}
          {routing.error && (
            <div style={{ fontSize:12, color:'var(--err)', display:'flex', alignItems:'center', gap:6 }}>
              <Icon name="x-circle" size={13}/>{t.routing_error}
            </div>
          )}
          {routing.route && (
            <div style={{ display:'flex', gap:16 }}>
              <div>
                <div style={{ fontSize:10, color:'var(--fg-dim)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{t.routing_distance}</div>
                <div className="mono" style={{ fontSize:15, fontWeight:600, color:'var(--fg)', marginTop:2 }}>{routing.route.distance}</div>
              </div>
              <div>
                <div style={{ fontSize:10, color:'var(--fg-dim)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{t.routing_duration}</div>
                <div className="mono" style={{ fontSize:15, fontWeight:600, color:'var(--accent)', marginTop:2 }}>{routing.route.duration}</div>
              </div>
              <button onClick={routing.clearRoute} style={{ marginLeft:'auto', color:'var(--fg-dim)', display:'flex', alignItems:'center' }}>
                <Icon name="close" size={14}/>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="scroll" style={{ flex:1, overflowY:'auto' }}>
        {/* Fuels */}
        {validFuels.length > 0 && (
          <section style={{ padding:'16px 20px', borderBottom:'1px solid var(--line)' }}>
            <SectionTitle icon="fuel" label={t.fuel_available}/>
            <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:1, background:'var(--bg)', border:'1px solid var(--line)', borderRadius:10, overflow:'hidden' }}>
              {validFuels.map(fk => {
                const f = FUELS[fk];
                const isCheapest = f.price > 0 && f.price === Math.min(...validFuels.map(x => FUELS[x].price).filter(p => p > 0));
                return (
                  <div key={fk} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'var(--bg-elev)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:6, height:24, borderRadius:3, background:fuelColor(fk) }}/>
                      <div>
                        <div style={{ fontSize:13, fontWeight:500 }}>{f.name}</div>
                        <div className="mono" style={{ fontSize:10, color:'var(--fg-dim)', letterSpacing:'0.05em' }}>{f.ron}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                      {isCheapest && <span className="mono" style={{ fontSize:10, padding:'2px 6px', background:'var(--accent-soft)', color:'var(--accent)', borderRadius:10, fontWeight:600, letterSpacing:'0.05em' }}>BEST</span>}
                      {f.price > 0
                        ? <><span className="mono" style={{ fontSize:15, fontWeight:600, color:'var(--fg)' }}>Rp{f.price.toLocaleString('id-ID')}</span><span style={{ fontSize:10, color:'var(--fg-dim)' }}>/L</span></>
                        : <span style={{ fontSize:12, color:'var(--fg-dim)' }}>—</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Amenities */}
        {station.amenities?.length > 0 && (
          <section style={{ padding:'16px 20px', borderBottom:'1px solid var(--line)' }}>
            <SectionTitle icon="sparkle" label={t.amenities}/>
            <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {station.amenities.map(a => (
                <div key={a} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 10px', background:'var(--bg)', border:'1px solid var(--line)', borderRadius:8, fontSize:12, color:'var(--fg-muted)' }}>
                  <Icon name={amenityIcons[a] || 'info'} size={14} style={{ color:'var(--fg)' }}/>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {AMENITY_LABELS[a]?.[lang] || a}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hours */}
        <section style={{ padding:'16px 20px', borderBottom:'1px solid var(--line)' }}>
          <SectionTitle icon="clock" label={t.hours}/>
          <div style={{ marginTop:10, fontSize:13, color:'var(--fg)' }}>
            <span className="mono">{station.hours || '24 jam'}</span>
          </div>
        </section>

        {/* OSM link */}
        {station.osm_id && (
          <section style={{ padding:'16px 20px 24px' }}>
            <a
              href={`https://www.openstreetmap.org/${station.osm_id.startsWith('node') ? station.osm_id : 'way/' + station.osm_id.split('/').pop()}`}
              target="_blank" rel="noopener noreferrer"
              style={{ fontSize:12, color:'var(--accent)', display:'flex', alignItems:'center', gap:5 }}
            >
              <Icon name="globe" size={13}/> Lihat di OpenStreetMap
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
