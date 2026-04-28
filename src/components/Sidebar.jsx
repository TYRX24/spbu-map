import { useState } from 'react';
import Icon from './Icon.jsx';
import { BrandChip } from './Icon.jsx';
import { BRANDS, FUELS, I18N } from '../constants.js';


function QueueBars({ level }) {
  const count = level === 'low' ? 1 : level === 'medium' ? 2 : 3;
  const color = { low:'#34d399', medium:'#fb923c', high:'#f87171' }[level] || '#34d399';
  return (
    <span style={{ display:'inline-flex', alignItems:'flex-end', gap:1.5 }}>
      {[1,2,3].map(i => (
        <span key={i} style={{ width:3, height:3+i*2, background: i<=count ? color : 'var(--line-2)', borderRadius:1 }}/>
      ))}
    </span>
  );
}

const pillStyle = {
  display:'inline-flex', alignItems:'center', gap:6, padding:'6px 10px',
  borderRadius:20, border:'1px solid var(--line)', fontSize:12, fontWeight:500, transition:'all 0.15s',
};

function StationRow({ station, isSelected, isHovered, onSelect, onHover, lang, isSaved, onToggleSave }) {
  const t = I18N[lang];
  const brand = BRANDS[station.brand];
  const validFuels = (station.fuels || []).filter(fk => FUELS[fk] && FUELS[fk].price > 0);
  const cheapest = validFuels.length
    ? validFuels.reduce((min, fk) => FUELS[fk].price < min.price ? { key:fk, price:FUELS[fk].price, name:FUELS[fk].name } : min, { key:null, price:Infinity, name:'' })
    : null;

  return (
    <div
      role="button" tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); onSelect(); } }}
      onMouseEnter={() => onHover(station.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        width:'100%', padding:'14px 20px', borderBottom:'1px solid var(--line)',
        display:'flex', gap:12, alignItems:'flex-start', textAlign:'left',
        background: isSelected ? 'var(--accent-soft)' : isHovered ? 'var(--bg-elev-2)' : 'transparent',
        borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
        transition:'background 0.12s', cursor:'pointer', position:'relative',
      }}
    >
      <BrandChip brand={station.brand} size={38} brands={BRANDS}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8 }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:'var(--fg)', letterSpacing:'-0.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {station.name}
          </div>
          {station.distance != null && (
            <div className="mono" style={{ fontSize:11, color:'var(--fg-dim)', flexShrink:0 }}>
              {station.distance < 10 ? station.distance.toFixed(1) : Math.round(station.distance)} km
            </div>
          )}
        </div>
        <div style={{ fontSize:12, color:'var(--fg-muted)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {station.address}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#34d399' }}/>
            <span style={{ color:'var(--fg)', fontWeight:500 }}>{t.open}</span>
          </div>
        </div>
        {cheapest?.key && (
          <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'4px 8px', background:'var(--bg)', border:'1px solid var(--line)', borderRadius:6, fontSize:11 }}>
            <span style={{ color:'var(--fg-dim)' }}>{cheapest.name}</span>
            <span className="mono" style={{ color:'var(--fg)', fontWeight:600 }}>Rp{cheapest.price.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>
      <div onClick={e => { e.stopPropagation(); onToggleSave(e); }} style={{ color: isSaved ? 'var(--accent)' : 'var(--fg-dim)', padding:4, alignSelf:'flex-start', cursor:'pointer', display:'flex' }}>
        <Icon name={isSaved ? 'heart-fill' : 'heart'} size={16}/>
      </div>
    </div>
  );
}

export default function Sidebar({ stations, filtered, selectedId, hoveredId, onSelect, onHover, query, setQuery, filters, setFilters, sort, setSort, lang, setLang, onOpenDetail, side, saved, toggleSave, currentTheme, onToggleTheme }) {
  const t = I18N[lang];
  const [showFilters, setShowFilters] = useState(false);

  const fuelOptions = [
    { id:'pertalite', label:'Pertalite' }, { id:'pertamax', label:'Pertamax' },
    { id:'pertamax_turbo', label:'Pertamax Turbo' }, { id:'solar', label:'Bio Solar' },
    { id:'dexlite', label:'Dexlite' }, { id:'shell_super', label:'Shell Super' },
    { id:'shell_vpower', label:'V-Power' }, { id:'bp_92', label:'BP 92' },
    { id:'bp_95', label:'BP 95' }, { id:'vivo_89', label:'Revvo 89' },
    { id:'vivo_92', label:'Revvo 92' },
  ];

  const toggleBrand  = b   => setFilters(f => ({ ...f, brands: f.brands.includes(b)   ? f.brands.filter(x=>x!==b)   : [...f.brands, b] }));
  const toggleFuel   = fId => setFilters(f => ({ ...f, fuels:  f.fuels.includes(fId)  ? f.fuels.filter(x=>x!==fId)  : [...f.fuels, fId] }));
  const activeFilterCount = filters.brands.length + filters.fuels.length;

  return (
    <aside style={{
      width:380, background:'var(--bg-elev)',
      borderRight: side==='left'  ? '1px solid var(--line)' : 'none',
      borderLeft:  side==='right' ? '1px solid var(--line)' : 'none',
      height:'100%', display:'flex', flexDirection:'column', zIndex:40, flexShrink:0,
    }}>
      {/* Header */}
      <div style={{ padding:'18px 20px 12px', borderBottom:'1px solid var(--line)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>

            {/* Home button */}
            <a href="/" title="Home" style={{
              width:28, height:28, borderRadius:7,
              background:'var(--bg)', border:'1px solid var(--line)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'var(--fg-muted)', flexShrink:0,
            }}>
              <Icon name="home" size={14}/>
            </a>

            {/* Logo */}
            <div style={{ width:28, height:28, borderRadius:7, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0b0b0c' }}>
              <Icon name="fuel" size={18} stroke={2.2}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1.15 }}>
              <div style={{ fontSize:14, fontWeight:600, letterSpacing:'-0.01em' }}>SPBU</div>
              <div style={{ fontSize:11, color:'var(--fg-dim)', fontFamily:'var(--font-mono)' }}>{t.west_java.toUpperCase()}</div>
            </div>
          </div>
          {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              title="Toggle theme"
              style={{
                width:32, height:32, borderRadius:7,
                background:'var(--bg)', border:'1px solid var(--line)',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', fontSize:15,
              }}
            >
              {currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
          <div style={{ display:'flex', gap:2, padding:2, background:'var(--bg)', borderRadius:7, border:'1px solid var(--line)' }}>
            {['id','en'].map(L => (
              <button key={L} onClick={() => setLang(L)} style={{
                padding:'4px 9px', fontSize:11, fontWeight:600, borderRadius:5,
                background: lang===L ? 'var(--bg-elev)' : 'transparent',
                color: lang===L ? 'var(--fg)' : 'var(--fg-dim)',
                boxShadow: lang===L ? '0 0 0 1px var(--line)' : 'none',
                textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:'var(--font-mono)',
              }}>{L}</button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'var(--bg)', border:'1px solid var(--line)', borderRadius:10 }}>
          <Icon name="search" size={16} style={{ color:'var(--fg-dim)' }}/>
          <input
            type="text" placeholder={t.search} value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex:1, background:'transparent', border:0, outline:0, fontSize:13, color:'var(--fg)' }}
          />
          {query && <button onClick={() => setQuery('')} style={{ color:'var(--fg-dim)', display:'flex' }}><Icon name="close" size={14}/></button>}
        </div>

        {/* Filter pills */}
        <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
          <button onClick={() => setShowFilters(v => !v)} style={{
            ...pillStyle,
            background: showFilters || activeFilterCount>0 ? 'var(--accent-soft)' : 'var(--bg)',
            color: showFilters || activeFilterCount>0 ? 'var(--accent)' : 'var(--fg-muted)',
            borderColor: showFilters || activeFilterCount>0 ? 'var(--accent-ring)' : 'var(--line)',
          }}>
            <Icon name="sliders" size={13}/>
            {t.filters}
            {activeFilterCount>0 && <span className="mono" style={{ marginLeft:2, fontSize:10, padding:'1px 5px', background:'var(--accent)', color:'#0b0b0c', borderRadius:10, fontWeight:700 }}>{activeFilterCount}</span>}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="fade-in" style={{ marginTop:14, paddingTop:14, borderTop:'1px dashed var(--line)' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, fontFamily:'var(--font-mono)' }}>{t.brand}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
              {Object.entries(BRANDS).map(([k, b]) => {
                const active = filters.brands.includes(k);
                return (
                  <button key={k} onClick={() => toggleBrand(k)} style={{
                    display:'flex', alignItems:'center', gap:6, padding:'5px 10px 5px 6px', borderRadius:16,
                    border: `1px solid ${active ? b.color : 'var(--line)'}`,
                    background: active ? `${b.color}22` : 'var(--bg)',
                    color: active ? 'var(--fg)' : 'var(--fg-muted)',
                    fontSize:12, fontWeight:500,
                  }}>
                    <span style={{ width:14, height:14, borderRadius:3, background:b.color, display:'inline-block' }}/>
                    {b.name}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-dim)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, fontFamily:'var(--font-mono)' }}>{t.fuel}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {fuelOptions.map(f => {
                const active = filters.fuels.includes(f.id);
                return (
                  <button key={f.id} onClick={() => toggleFuel(f.id)} style={{
                    padding:'5px 10px', borderRadius:16,
                    border: `1px solid ${active ? 'var(--accent-ring)' : 'var(--line)'}`,
                    background: active ? 'var(--accent-soft)' : 'var(--bg)',
                    color: active ? 'var(--accent)' : 'var(--fg-muted)',
                    fontSize:12, fontWeight:500,
                  }}>{f.label}</button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sort + count */}
      <div style={{ padding:'10px 20px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:12, color:'var(--fg-muted)' }}>
          <span className="mono" style={{ color:'var(--fg)', fontWeight:600 }}>{filtered.length}</span> {t.results}
        </div>
        <div style={{ display:'flex', gap:2, padding:2, background:'var(--bg)', borderRadius:7, border:'1px solid var(--line)' }}>
          {[{k:'name',label:'A–Z'},{k:'brand',label:t.brand},{k:'distance',label:t.sort_distance}].map(s => (
            <button key={s.k} onClick={() => setSort(s.k)} style={{
              padding:'4px 8px', fontSize:11, fontWeight:500, borderRadius:5,
              background: sort===s.k ? 'var(--bg-elev)' : 'transparent',
              color: sort===s.k ? 'var(--fg)' : 'var(--fg-dim)',
              boxShadow: sort===s.k ? '0 0 0 1px var(--line)' : 'none',
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Station list */}
      <div className="scroll" style={{ flex:1, overflowY:'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--fg-dim)' }}>
            <div style={{ fontSize:14, color:'var(--fg-muted)', marginBottom:4 }}>{t.no_results}</div>
            <div style={{ fontSize:12 }}>{t.no_results_sub}</div>
          </div>
        ) : filtered.map(s => (
          <StationRow
            key={s.id} station={s}
            isSelected={selectedId===s.id}
            isHovered={hoveredId===s.id}
            onSelect={() => { onSelect(s.id); onOpenDetail(); }}
            onHover={onHover}
            lang={lang}
            isSaved={saved.includes(s.id)}
            onToggleSave={() => toggleSave(s.id)}
          />
        ))}
      </div>
    </aside>
  );
}
