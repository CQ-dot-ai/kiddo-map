import { Coffee } from 'lucide-react';
import { SITE_NAME, SITE_TAGLINE } from '../../lib/site';

export default function HomeHeader({
  favoritesCount = 0,
  onToggleSavedList,
  onShowTipJar,
  compact = false,
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '12px',
      alignItems: 'center',
      marginBottom: compact ? '16px' : '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: compact ? '40px' : '44px',
          height: compact ? '40px' : '44px',
          borderRadius: '15px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(255, 138, 101, 0.3)',
          overflow: 'hidden',
        }}>
          <img
            src="/logo.png"
            alt={SITE_NAME}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        <div>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontSize: compact ? '16px' : '18px', fontWeight: 800 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: compact ? '10px' : '11px', color: '#999', fontWeight: 800 }}>
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '10px',
        flexWrap: 'nowrap',
        minWidth: compact ? '176px' : '220px',
      }}>
        <button
          onClick={onToggleSavedList}
          className="bouncy-button"
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: compact ? '9px 12px' : '11px 14px',
            background: 'linear-gradient(180deg, #fff, #fff8ef)',
            color: 'var(--charcoal)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            minWidth: compact ? '80px' : '96px',
            fontFamily: 'Nunito, sans-serif',
            fontSize: compact ? '11px' : '12px',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: compact ? '14px' : '16px' }}>🤍</span>
          Saved {favoritesCount > 0 ? `(${favoritesCount})` : ''}
        </button>
        <button
          onClick={onShowTipJar}
          className="bouncy-button"
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: compact ? '9px 12px' : '11px 14px',
            background: 'linear-gradient(180deg, #fff, #fffef9)',
            color: 'var(--charcoal)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            minWidth: compact ? '92px' : '108px',
            fontFamily: 'Nunito, sans-serif',
            fontSize: compact ? '11px' : '12px',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}
        >
          <Coffee size={16} strokeWidth={3} />
          Support us
        </button>
      </div>
    </div>
  );
}
