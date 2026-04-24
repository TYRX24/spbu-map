import { useState } from 'react';
import Icon from './Icon.jsx';
import { BrandChip } from './Icon.jsx';
import { BRANDS, I18N } from '../constants.js';

const RADIUS_KM = 3;

export default function NearMeOverlay({
  stations,
  userLocation,
  onRequestLocation,
  onSelectStation,
  lang,
  theme,
  locating,
  active,
  onActivate,
  onDeactivate,
}) {
  const t = I18N[lang];
  const [expanded, setExpanded] = useState(true);

  const nearby = userLocation
    ? stations
        .filter(s => s.distance != null && s.distance <= RADIUS_KM)
        .sort((a, b) => a.distance - b.distance)
    : [];

  const handleClick = () => {
    if (active) {
      onDeactivate();
      setExpanded(true);
    } else {
      if (!userLocation) onRequestLocation();
      onActivate();
      setExpanded(true);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleClick}
        title="Cari SPBU terdekat"
        style={{
          position: 'absolute',
          bottom: 128,
          right: 16,
          zIndex: 400,
          width: 40,
          height: 40,
          borderRadius: 10,
          background: active ? 'var(--accent)' : 'var(--bg-elev)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
          boxShadow: 'var(--shadow-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? '#0b0b0c' : 'var(--fg)',
          transition: 'all 0.2s',
        }}
      >
        {locating
          ? <SpinnerIcon />
          : <Icon name="locate" size={17} />
        }
      </button>

      {/* Overlay panel — only shown when active */}
      {active && (
        <div
          className="fade-in"
          style={{
            position: 'absolute',
            bottom: 176,
            right: 16,
            zIndex: 400,
            width: 300,
            maxHeight: 420,
            background: 'var(--bg-elev)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-ring)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                <Icon name="locate" size={14} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>
                  {lang === 'id' ? 'SPBU Terdekat' : 'Nearby Stations'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--fg-dim)', fontFamily: 'var(--font-mono)' }}>
                  {lang === 'id' ? `Radius ${RADIUS_KM} km dari kamu` : `Within ${RADIUS_KM} km from you`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setExpanded(v => !v)}
                style={{ color: 'var(--fg-dim)', display: 'flex', padding: 4 }}
              >
                <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={14} />
              </button>
              <button
                onClick={onDeactivate}
                style={{ color: 'var(--fg-dim)', display: 'flex', padding: 4 }}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>

          {/* No location state */}
          {!userLocation && (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--fg-muted)', fontSize: 13, marginBottom: 12 }}>
                {lang === 'id' ? 'Lokasi belum dideteksi' : 'Location not detected'}
              </div>
              <button
                onClick={onRequestLocation}
                style={{
                  padding: '8px 16px', borderRadius: 8,
                  background: 'var(--accent)', color: '#0b0b0c',
                  fontSize: 12, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <Icon name="locate" size={13} stroke={2.2} />
                {lang === 'id' ? 'Izinkan Lokasi' : 'Allow Location'}
              </button>
            </div>
          )}

          {/* Locating spinner */}
          {locating && (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}>{lang === 'id' ? 'Mencari lokasi…' : 'Detecting location…'}</div>
            </div>
          )}

          {/* Station list */}
          {expanded && userLocation && !locating && (
            <div className="scroll" style={{ overflowY: 'auto', flex: 1 }}>
              {nearby.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>
                    {lang === 'id' ? `Tidak ada SPBU dalam ${RADIUS_KM} km` : `No stations within ${RADIUS_KM} km`}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginTop: 4 }}>
                    {lang === 'id' ? 'Pastikan lokasi sudah benar' : 'Make sure your location is correct'}
                  </div>
                </div>
              ) : (
                nearby.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStation(s.id)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      borderBottom: i < nearby.length - 1 ? '1px solid var(--line)' : 'none',
                      textAlign: 'left', background: 'transparent',
                      transition: 'background 0.12s', cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elev-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Rank badge */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: i === 0 ? 'var(--accent)' : 'var(--bg)',
                      border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--line)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: i === 0 ? '#0b0b0c' : 'var(--fg-dim)',
                      fontFamily: 'var(--font-mono)', flexShrink: 0,
                    }}>{i + 1}</div>

                    <BrandChip brand={s.brand} size={30} brands={BRANDS} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: 'var(--fg)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{s.name}</div>
                      <div style={{
                        fontSize: 11, color: 'var(--fg-dim)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginTop: 1,
                      }}>{s.address}</div>
                    </div>

                    {/* Distance */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div className="mono" style={{
                        fontSize: 12, fontWeight: 700,
                        color: i === 0 ? 'var(--accent)' : 'var(--fg)',
                      }}>
                        {s.distance < 1
                          ? `${Math.round(s.distance * 1000)} m`
                          : `${s.distance.toFixed(1)} km`}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 1 }}>
                        {lang === 'id' ? 'dari kamu' : 'away'}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Footer count */}
          {userLocation && !locating && nearby.length > 0 && (
            <div style={{
              padding: '8px 14px',
              borderTop: '1px solid var(--line)',
              fontSize: 11,
              color: 'var(--fg-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <Icon name="sparkle" size={11} style={{ color: 'var(--accent)' }} />
              <span className="mono" style={{ color: 'var(--fg)', fontWeight: 600 }}>{nearby.length}</span>
              <span>
                {lang === 'id' ? `SPBU dalam ${RADIUS_KM} km` : `stations within ${RADIUS_KM} km`}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SpinnerIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 3a9 9 0 1 0 9 9" style={{ animation: 'spin 0.8s linear infinite', transformOrigin: 'center' }} />
    </svg>
  );
}
