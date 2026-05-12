import FilterChipsGroup from './FilterChipsGroup';

export default function TweakPanelContent({
  filterGroups,
  filterButtonPadding = '9px 12px',
  onShuffle,
  shuffleLabel = 'Change answer again',
  backupPicks,
  renderBackupPick,
  onToggleMap,
  mapButtonLabel,
}) {
  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      {filterGroups.map(group => (
        <FilterChipsGroup
          key={group.label}
          label={group.label}
          items={group.items}
          value={group.value}
          onChange={group.onChange}
          buttonPadding={filterButtonPadding}
        />
      ))}

      <button
        onClick={onShuffle}
        className="bouncy-button"
        style={{
          border: 'none',
          borderRadius: '14px',
          padding: '12px',
          background: 'var(--charcoal)',
          color: 'white',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '13px',
          fontWeight: 900,
          cursor: 'pointer',
        }}
      >
        {shuffleLabel}
      </button>

      <div style={{ display: 'grid', gap: '10px', paddingTop: '2px' }}>
        <div style={{ fontSize: '12px', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
          Two backup picks
        </div>
        {backupPicks.map(renderBackupPick)}
      </div>

      <button
        onClick={onToggleMap}
        className="bouncy-button"
        style={{
          border: 'none',
          borderRadius: '16px',
          padding: '13px',
          background: 'white',
          color: 'var(--charcoal)',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '14px',
          fontWeight: 900,
          cursor: 'pointer',
          boxShadow: '0 5px 16px rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {mapButtonLabel.icon}
        {mapButtonLabel.text}
      </button>
    </div>
  );
}
