const Icon = ({ name, size = 20, stroke = 1.6, style }) => {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'search':      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'pin':         return <svg {...common}><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.4"/></svg>;
    case 'fuel':        return <svg {...common}><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M4 21h11"/><path d="M7 9h5"/><path d="M15 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-2.5-2.5"/></svg>;
    case 'close':       return <svg {...common}><path d="M6 6 18 18M18 6 6 18"/></svg>;
    case 'chevron-down':return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
    case 'chevron-right':return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chevron-left':return <svg {...common}><path d="m15 6-6 6 6 6"/></svg>;
    case 'star':        return <svg {...common}><path d="M12 3.5 14.5 9l6 .8-4.4 4.1 1.1 6L12 17.2 6.8 19.9l1.1-6L3.5 9.8 9.5 9Z"/></svg>;
    case 'star-fill':   return <svg {...common} fill="currentColor" stroke="none"><path d="M12 3.5 14.5 9l6 .8-4.4 4.1 1.1 6L12 17.2 6.8 19.9l1.1-6L3.5 9.8 9.5 9Z"/></svg>;
    case 'heart':       return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>;
    case 'heart-fill':  return <svg {...common} fill="currentColor" stroke="none"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>;
    case 'directions':  return <svg {...common}><path d="M12 2 22 12l-10 10L2 12Z"/><path d="M8 12h6v-2l3 3-3 3v-2H8Z" fill="currentColor" stroke="none"/></svg>;
    case 'share':       return <svg {...common}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8 11 8-4M8 13l8 4"/></svg>;
    case 'phone':       return <svg {...common}><path d="M4 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z"/></svg>;
    case 'clock':       return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'info':        return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>;
    case 'locate':      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>;
    case 'plus':        return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':       return <svg {...common}><path d="M5 12h14"/></svg>;
    case 'sliders':     return <svg {...common}><path d="M4 6h10M18 6h2"/><path d="M4 18h2M10 18h10"/><path d="M4 12h6M14 12h6"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="18" r="2"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'sun':         return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5 7 7M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5"/></svg>;
    case 'moon':        return <svg {...common}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>;
    case 'layers':      return <svg {...common}><path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/></svg>;
    case 'check':       return <svg {...common}><path d="m5 12 5 5 9-11"/></svg>;
    case 'toilet':      return <svg {...common}><path d="M7 3v4M17 3v4M5 7h4M15 7h4M7 7v6a2 2 0 0 0 2 2v6M17 7v6a2 2 0 0 1-2 2v6M12 3v18"/></svg>;
    case 'mart':        return <svg {...common}><path d="M3 6h18l-2 10H5Z"/><path d="M7 6V4h10v2"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>;
    case 'prayer':      return <svg {...common}><path d="M4 21V9c0-4 3.5-7 8-7s8 3 8 7v12"/><path d="M4 21h16"/><path d="M12 2v6"/></svg>;
    case 'cafe':        return <svg {...common}><path d="M4 8h12v6a5 5 0 0 1-10 0V8Z"/><path d="M16 10h2a3 3 0 0 1 0 6h-2"/><path d="M8 4v2M12 4v2"/></svg>;
    case 'wash':        return <svg {...common}><path d="M4 16h16"/><path d="M6 16V9l2-3h8l2 3v7"/><path d="M9 20v-2M12 20v-2M15 20v-2"/></svg>;
    case 'ev':          return <svg {...common}><rect x="3" y="7" width="12" height="10" rx="1.5"/><path d="M15 10h2a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0V9"/><path d="m9 9-2 4h3l-2 4"/></svg>;
    case 'atm':         return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>;
    case 'sparkle':     return <svg {...common}><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><path d="M7 7l2 2M15 15l2 2M7 17l2-2M15 9l2-2"/></svg>;
    case 'route':       return <svg {...common}><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V8a2 2 0 0 1 2-2h8"/><path d="M15 3l3 2-3 2"/></svg>;
    case 'x-circle':    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/></svg>;
    case 'compressed_air': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>;
    case 'globe':       return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'arrow-up-right': return <svg {...common}><path d="M7 17 17 7M9 7h8v8"/></svg>;
    case 'home': return <svg {...common}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21V12h6v9"/></svg>;
    default: return null;
  }
};

export const BrandChip = ({ brand, size = 28, brands }) => {
  const b = brands[brand];
  if (!b) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: b.color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, letterSpacing: 0.3,
      fontFamily: 'var(--font-mono)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset',
      flexShrink: 0,
    }}>{b.short}</div>
  );
};

export default Icon;
