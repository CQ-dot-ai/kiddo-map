import { Navigation, RefreshCcw } from 'lucide-react';
import { frictionNote, todayReasons, weatherNote } from '../lib/recommendation';

export default function PickCard({
  place,
  rank,
  variant = 'primary',
  area,
  context,
  onDetails,
  onNavigate,
  onChangeAnswer,
  onViewMap,
  tweaksOpen = false,
  areaLabel = 'Area',
  copy,
  language = 'en',
}) {
  const isPrimary = variant === 'primary';
  const reasons = todayReasons(place, area, context, language);

  return (
    <div style={{
      background: isPrimary ? 'white' : 'rgba(255,255,255,0.88)',
      borderRadius: isPrimary ? '22px' : '18px',
      border: `2px solid ${isPrimary ? `${place.color.primary}33` : 'rgba(255,255,255,0.72)'}`,
      boxShadow: isPrimary ? '0 16px 40px rgba(34,34,34,0.12)' : '0 8px 22px rgba(34,34,34,0.08)',
      overflow: 'hidden',
    }}>
      <button
        onClick={onDetails}
        className="bouncy-button"
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          padding: isPrimary ? '14px' : '12px',
          textAlign: 'left',
          cursor: 'pointer',
          color: 'var(--charcoal)',
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: isPrimary ? '64px 1fr' : '48px 1fr',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div style={{
            width: isPrimary ? '64px' : '48px',
            height: isPrimary ? '64px' : '48px',
            borderRadius: isPrimary ? '20px' : '16px',
            background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isPrimary ? '32px' : '24px',
            boxShadow: `0 8px 20px ${place.color.primary}55`,
          }}>
            {place.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '11px',
              color: place.color.dark,
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}>
              {rank}
            </div>
            <div style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: isPrimary ? '21px' : '16px',
              fontWeight: 800,
              lineHeight: 1.05,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {place.nameEn || place.name}
            </div>
            <div style={{
              display: 'flex',
              gap: '7px',
              flexWrap: 'wrap',
              color: '#777',
              fontSize: '12px',
              fontWeight: 800,
              marginTop: '6px',
            }}>
              <span>{weatherNote(place, language)}</span>
              <span>·</span>
              <span>{copy.recommendation.ageRange(place.ageMin, place.ageMax)}</span>
              <span>·</span>
              <span>{copy.recommendation.durationHours(place.durationHours)}</span>
            </div>
          </div>
        </div>

        {isPrimary && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '14px',
          }}>
            {[
              ...reasons.slice(0, 4),
            ].map(([emoji, label, value]) => (
              <div key={label} style={{
                background: place.color.light,
                borderRadius: '14px',
                padding: '10px',
                minHeight: '58px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 900, color: place.color.dark }}>
                  {emoji} {label}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#555', marginTop: '3px', lineHeight: 1.25 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: isPrimary ? '12px' : '8px',
          color: '#555',
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: 1.35,
        }}>
          <strong style={{ color: 'var(--charcoal)' }}>{copy.card.driveCheck}:</strong> {reasons[4][2]}
        </div>
        <div style={{
          marginTop: '6px',
          color: '#777',
          fontSize: '12px',
          fontWeight: 700,
          lineHeight: 1.35,
        }}>
          {frictionNote(place, language)}
        </div>
      </button>

      <div style={{ padding: isPrimary ? '0 14px 14px' : '0 12px 12px' }}>
        {isPrimary ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
            <button
              onClick={onNavigate}
              className="bouncy-button"
              style={{
                border: 'none',
                borderRadius: '16px',
                padding: '14px',
                background: 'linear-gradient(135deg, #43A047, #2E7D32)',
                color: 'white',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(67,160,71,0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Navigation size={17} strokeWidth={3} />
              {copy.card.takeMeThere}
            </button>
            <button
              onClick={onChangeAnswer}
              className="bouncy-button"
              style={{
                border: 'none',
                borderRadius: '16px',
                padding: '0 14px',
                background: 'var(--cream)',
                color: 'var(--charcoal)',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
              }}
            >
              <RefreshCcw size={18} strokeWidth={3} />
              {tweaksOpen ? copy.card.hideOptions : copy.card.showMore}
            </button>
          </div>
        ) : (
          <button
            onClick={onNavigate}
            className="bouncy-button"
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '14px',
              padding: '10px',
              background: place.color.light,
              color: place.color.dark,
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            {copy.card.takeThisOne}
          </button>
        )}
      </div>

      {onViewMap && (
        <button
          onClick={() => onViewMap(place)}
          aria-label={`Explore area for ${place.nameEn || place.name}`}
          title={`Explore area for ${place.nameEn || place.name}`}
          className="bouncy-button"
          style={{
            width: '100%',
            border: 'none',
            borderRadius: '0',
            padding: '12px 14px',
            background: `linear-gradient(135deg, ${place.color.light}, ${place.color.light}dd)`,
            borderTop: `1px solid ${place.color.primary}33`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            color: place.color.dark,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗺️</span>
            <span>{copy.card.area}</span>
          </div>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>{copy.card.tapToExplore}</span>
        </button>
      )}
    </div>
  );
}
