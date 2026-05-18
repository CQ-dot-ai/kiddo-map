export default function SavedListPanel({
  favorites = [],
  places = [],
  onClose,
  onSelectPlace,
  copy,
}) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.94)',
      borderRadius: '20px',
      padding: '14px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
      marginBottom: '16px',
      border: '1px solid rgba(255,255,255,0.8)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginBottom: '10px',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 900,
          color: '#999',
          textTransform: 'uppercase',
        }}>
          {copy.saved.title} {favorites.length > 0 ? `(${favorites.length})` : ''}
        </div>
        <button
          onClick={onClose}
          className="bouncy-button"
          style={{
            border: 'none',
            background: 'transparent',
            color: '#999',
            fontSize: '12px',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          {copy.saved.close}
        </button>
      </div>
      {favorites.length === 0 ? (
        <div style={{ fontSize: '13px', color: '#777', fontWeight: 700, lineHeight: 1.5 }}>
          {copy.saved.empty}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '220px',
          overflowY: 'auto',
        }}>
          {places.filter(p => favorites.includes(p.id)).map(place => (
            <button
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bouncy-button"
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                background: `linear-gradient(135deg, ${place.color.primary}22, ${place.color.light})`,
                color: 'var(--charcoal)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'Nunito, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{place.emoji}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {place.nameEn || place.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
