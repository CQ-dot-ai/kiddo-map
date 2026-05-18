import { SITE_NAME } from '../../lib/site';
import { LANGUAGE_OPTIONS } from '../../lib/copy';

export default function HomeHeader({
  favoritesCount = 0,
  onToggleSavedList,
  language = 'zh',
  copy,
  onChangeLanguage,
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
            {copy.tagline}
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.82)',
          borderRadius: '999px',
          padding: '4px',
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
        }}>
          {LANGUAGE_OPTIONS.map(option => {
            const active = option.id === language;
            return (
              <button
                key={option.id}
                onClick={() => onChangeLanguage(option.id)}
                className="bouncy-button"
                style={{
                  border: 'none',
                  borderRadius: '999px',
                  padding: compact ? '7px 10px' : '8px 11px',
                  background: active ? 'linear-gradient(135deg, #FF8A65, #FFD54F)' : 'transparent',
                  color: active ? 'white' : '#666',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: compact ? '11px' : '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  minWidth: compact ? '40px' : '44px',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
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
          {copy.saved.button} {favoritesCount > 0 ? `(${favoritesCount})` : ''}
        </button>
      </div>
    </div>
  );
}
