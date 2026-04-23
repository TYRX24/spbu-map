import Icon from './Icon.jsx';
import { I18N } from '../constants.js';

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex' }}>{children}</div>
    </div>
  );
}

export default function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const t = I18N[tweaks.lang];

  const opt = (label, value, current, onClick) => (
    <button onClick={onClick}
      style={{
        flex: 1, padding: '7px 10px', borderRadius: 6,
        background: current === value ? 'var(--bg-elev-2)' : 'transparent',
        color: current === value ? 'var(--fg)' : 'var(--fg-dim)',
        boxShadow: current === value ? '0 0 0 1px var(--line)' : 'none',
        fontSize: 12, fontWeight: 500, transition: 'all 0.15s',
      }}>{label}</button>
  );

  return (
    <div className="fade-in" style={{
      position: 'fixed', right: 20, bottom: 20, width: 280,
      background: 'var(--bg-elev)', border: '1px solid var(--line)',
      borderRadius: 14, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
      padding: 14, zIndex: 100, backdropFilter: 'blur(20px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="sliders" size={14} style={{ color: 'var(--accent)' }}/>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Tweaks</span>
        </div>
        <button onClick={() => setTweaks({ _close: true })} style={{ color: 'var(--fg-dim)', display: 'flex' }}>
          <Icon name="close" size={14}/>
        </button>
      </div>

      <Row label={t.theme}>
        <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg)', borderRadius: 7, border: '1px solid var(--line)', flex: 1 }}>
          {opt(<span style={{ display:'flex',alignItems:'center',gap:4,justifyContent:'center' }}><Icon name="sun" size={12}/>{t.light}</span>, 'light', tweaks.theme, () => setTweaks({ theme: 'light' }))}
          {opt(<span style={{ display:'flex',alignItems:'center',gap:4,justifyContent:'center' }}><Icon name="moon" size={12}/>{t.dark}</span>,  'dark',  tweaks.theme, () => setTweaks({ theme: 'dark'  }))}
        </div>
      </Row>

      <Row label={t.sidebar_side}>
        <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg)', borderRadius: 7, border: '1px solid var(--line)', flex: 1 }}>
          {opt(t.left,  'left',  tweaks.sidebarSide, () => setTweaks({ sidebarSide: 'left'  }))}
          {opt(t.right, 'right', tweaks.sidebarSide, () => setTweaks({ sidebarSide: 'right' }))}
        </div>
      </Row>

      <Row label={t.map_style}>
        <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg)', borderRadius: 7, border: '1px solid var(--line)', flex: 1 }}>
          {opt(t.standard,  'standard',  tweaks.mapStyle, () => setTweaks({ mapStyle: 'standard'  }))}
          {opt(t.satellite, 'satellite', tweaks.mapStyle, () => setTweaks({ mapStyle: 'satellite' }))}
          {opt(t.minimal,   'minimal',   tweaks.mapStyle, () => setTweaks({ mapStyle: 'minimal'   }))}
        </div>
      </Row>
    </div>
  );
}
