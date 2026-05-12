export default function FilterChipsGroup({
  label,
  items,
  value,
  onChange,
  buttonPadding = '9px 12px',
}) {
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <div style={{ fontSize: '11px', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div className="hide-scrollbar" style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }}>
        {items.map(item => {
          const active = value === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="bouncy-button"
              style={{
                flexShrink: 0,
                border: 'none',
                borderRadius: '999px',
                padding: buttonPadding,
                background: active ? 'linear-gradient(135deg, #FF8A65, #FFD54F)' : 'white',
                color: active ? 'white' : '#555',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: active ? '0 7px 18px rgba(255,138,101,0.26)' : '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
