import { motion } from 'framer-motion';
import { X, Heart, Navigation, Clock, Users, DollarSign, MapPin, ExternalLink, Star } from 'lucide-react';


function getParentQuote(place) {
  if (place.facilities.aircon >= 4 && place.indoor) return 'Parents like: cool indoors when KL gets hot.';
  if (place.facilities.stroller >= 4) return 'Parents like: stroller-friendly paths.';
  if (place.facilities.restroom >= 4) return 'Parents like: toilets are easy to find.';
  if (place.facilities.food >= 4) return 'Parents like: food nearby.';
  return `Parents like: ${place.tagline.toLowerCase()}.`;
}

function getTicketGuide(place) {
  if (place.cost === 0) {
    return {
      title: 'No ticket needed',
      option: 'Just check opening conditions',
      note: 'Free places are fastest when weather and timing match.',
      url: null,
    };
  }
  if (place.ticketRequired === false && !place.ticketNote && !place.ticketUrl) {
    return {
      title: 'Check before you go',
      option: 'Walk-in usually works',
      note: 'Some places still change rates or entry rules without much notice.',
      url: place.officialUrl || null,
    };
  }
  if (place.ticketRequired || place.ticketNote || place.ticketUrl || place.officialUrl) {
    return {
      title: place.ticketTitle || 'Buy ticket before you go',
      option:
        place.ticketOption ||
        (place.ticketChannel === 'official'
          ? 'Official site first'
          : place.ticketChannel === 'walk-in'
            ? 'Walk-in available'
            : 'Check the official site first'),
      note: place.ticketNote || 'Check the official site before you go.',
      url: place.ticketUrl || place.officialUrl || null,
    };
  }
  return {
    title: 'Check tickets before you go',
    option: 'Official site first',
    note: 'If official tickets exist, use them before Klook or Traveloka.',
    url: null,
  };
}

export default function PlaceDetail({
  place,
  isFavorite,
  onToggleFavorite,
  onClose,
  onNavigate,
  driveText = 'Pick your start area',
  variant = 'modal', // 'modal' for mobile, 'sidebar' for desktop
}) {
  const parentQuote = getParentQuote(place);
  const ticket = getTicketGuide(place);
  const isSidebar = variant === 'sidebar';

  return (
    <>
      {/* Backdrop only for modal variant (mobile) */}
      {!isSidebar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.42)',
            zIndex: 50,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        />
      )}

      <motion.div
        className={`place-detail-shell ${isSidebar ? 'place-detail-sidebar' : ''}`}
        initial={isSidebar ? { opacity: 0 } : { y: '100%' }}
        animate={isSidebar ? { opacity: 1 } : { y: 0 }}
        exit={isSidebar ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      >
        <div className="place-detail-card">
          <div className="place-hero" style={{ background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})` }}>
            <img
              src={place.image}
              alt={place.nameEn || place.name}
              className="place-hero-image"
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
            <div className="place-hero-overlay" />

            <div className="place-top-actions">
              <div className="place-pill" style={{ color: place.color.dark }}>
                {place.emoji} {place.category}
              </div>
              <button onClick={onClose} className="round-button bouncy-button" aria-label="Close">
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="place-title">
              <div className="place-tagline">{place.tagline}</div>
              <h2>{place.nameEn || place.name}</h2>
            </div>
          </div>

          <div className="place-content">
            {/* 1. Should we go? */}
            <div className="decision-card" style={{ borderColor: `${place.color.primary}33` }}>
              <div className="section-eyebrow" style={{ color: place.color.dark }}>Should we go?</div>
              <h3>Good choice if you want {place.indoor ? 'a low-weather-risk plan.' : 'fresh air before it gets hot.'}</h3>
              <p>{place.description}</p>

              <div className="parent-quote">
                <Star size={14} fill={place.color.dark} color={place.color.dark} />
                <span>
                  <strong>{place.googleRating}</strong> · {place.googleReviewCount > 1000 ? `${(place.googleReviewCount / 1000).toFixed(1)}k` : place.googleReviewCount} reviews — {parentQuote}
                </span>
              </div>

              <div className="metric-grid">
                <InfoChip icon={<DollarSign size={14} />} label="Cost" value={place.costLabel} color={place.color.dark} />
                <InfoChip icon={<Clock size={14} />} label="Time" value={`${place.durationHours}h`} color={place.color.dark} />
                <InfoChip icon={<Users size={14} />} label="Age" value={`${place.ageMin}-${place.ageMax}`} color={place.color.dark} />
              </div>
            </div>

            {/* 2. Drive check */}
            <div className="drive-card" style={{ background: place.color.light }}>
              <MapPin size={18} color={place.color.dark} />
              <div>
                <div className="mini-label" style={{ color: place.color.dark }}>Drive check</div>
                <strong>{driveText}</strong>
                <span>{place.address}</span>
              </div>
            </div>

            {/* 3. Before you go */}
            <div className="before-card">
              <div className="before-head">
                <div className="section-title">Before you go</div>
                <img
                  src={place.image}
                  alt=""
                  className="before-thumb"
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                />
              </div>
<BeforeItem label={ticket.title} value={ticket.option} note={ticket.note} />
{place.openingHoursNote && (
<BeforeItem
label="Opening hours"
value={place.openingHoursNote}
note={place.ticketRequired === false ? 'Still worth checking holidays or special closures.' : 'Check the official site on the day you go.'}
/>
)}
<BeforeItem
label="Best timing"
value={place.bestTimeNote || (place.indoor ? 'Book earlier, go before lunch' : 'Go morning or late afternoon')}
note={place.indoor ? 'Less queueing, less tired kids.' : 'Better weather and fewer meltdowns.'}
/>
{place.watchOutNote && (
<BeforeItem
label="Watch out"
value={place.watchOutNote}
note="This is the part that helps you avoid surprises."
/>
)}
{place.packingTips && place.packingTips.length > 0 && (
<BeforeItem
label="What to pack"
                  value={place.packingTips[0]}
                  note={place.packingTips.length > 1 ? place.packingTips.slice(1).join(' · ') : ''}
                />
              )}
              {ticket.url && (
                <a className="ticket-link bouncy-button" href={ticket.url} target="_blank" rel="noreferrer">
                  Open ticket site
                  <ExternalLink size={15} strokeWidth={3} />
                </a>
              )}
            </div>
          </div>

          <div className="bottom-actions">
            <div className="bottom-actions-inner">
              <button onClick={onToggleFavorite} className="save-button bouncy-button" aria-label="Save place">
                <Heart
                  size={22}
                  fill={isFavorite ? '#FF6B6B' : 'transparent'}
                  color={isFavorite ? '#FF6B6B' : '#999'}
                  strokeWidth={2.5}
                />
              </button>
              <button
                onClick={onNavigate}
                className="navigate-button bouncy-button"
                style={{ background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`, boxShadow: `0 8px 20px ${place.color.primary}55` }}
              >
                <Navigation size={18} strokeWidth={3} />
                Take me there
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .place-detail-shell {
          position: fixed;
          inset: 4vh 18px 18px;
          z-index: 60;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        /* Sidebar variant: relative positioning, flows within main section */
        .place-detail-shell.place-detail-sidebar {
          position: relative;
          inset: unset;
          z-index: auto;
          display: block;
          pointer-events: auto;
          width: 100%;
          max-height: none;
          padding: 0;
        }

        .place-detail-card {
          width: min(760px, 100%);
          max-height: 92vh;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
          pointer-events: auto;
        }

        /* Sidebar variant: adjust card styling */
        .place-detail-shell.place-detail-sidebar .place-detail-card {
          width: 100%;
          max-height: none;
          max-height: calc(100vh - 80px);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .place-hero {
          position: relative;
          height: 230px;
          flex-shrink: 0;
        }

        .place-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.86;
        }

        .place-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.62) 100%);
        }

        .place-top-actions {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .place-pill,
        .round-button {
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .place-pill {
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
        }

        .round-button {
          border: none;
          border-radius: 999px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--charcoal);
        }

        .place-title {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 22px;
          color: white;
        }

        .place-tagline {
          font-size: 11px;
          font-weight: 900;
          opacity: 0.92;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .place-detail-card h2 {
          font-family: Fredoka, sans-serif;
          font-size: 31px;
          line-height: 1.05;
          font-weight: 900;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.28);
        }

        .place-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          padding-bottom: 108px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #fffdf8;
        }

        .decision-card,
        .before-card {
          background: white;
          border: 2px solid #eef2f7;
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(34, 34, 34, 0.05);
        }

        .decision-card {
          border-width: 3px;
        }

        .section-eyebrow,
        .section-title,
        .mini-label {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .section-title {
          color: #888;
        }

        .place-detail-card h3 {
          font-family: Fredoka, sans-serif;
          font-size: 24px;
          line-height: 1.1;
          margin: 6px 0 10px;
          color: var(--charcoal);
        }

        .place-detail-card p {
          margin: 0 0 12px;
          color: #555;
          font-size: 14px;
          line-height: 1.55;
          font-weight: 700;
        }

        .parent-quote {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          background: var(--cream);
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 14px;
          font-size: 12px;
          line-height: 1.4;
          color: #555;
          font-weight: 700;
        }

        .parent-quote strong {
          color: var(--charcoal);
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .drive-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 16px;
          border-radius: 18px;
        }

        .drive-card strong,
        .drive-card span {
          display: block;
        }

        .drive-card strong {
          color: var(--charcoal);
          font-size: 15px;
          margin: 4px 0 2px;
          font-weight: 900;
        }

        .drive-card span {
          color: #666;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 700;
        }

        .before-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .before-thumb {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          object-fit: cover;
        }

        .before-item {
          display: grid;
          gap: 3px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f1f1;
        }

        .before-item:last-of-type {
          border-bottom: none;
        }

        .before-item span {
          color: #666;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 700;
        }

        .before-item strong {
          color: var(--charcoal);
          font-size: 14px;
        }

        .ticket-link {
          margin-top: 12px;
          border: none;
          border-radius: 15px;
          min-height: 44px;
          background: var(--charcoal);
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 900;
          font-size: 13px;
        }

        .bottom-actions {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.96);
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 14px 20px;
          padding-bottom: max(14px, env(safe-area-inset-bottom));
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        /* Sidebar variant: static positioning for actions */
        .place-detail-shell.place-detail-sidebar .bottom-actions {
          position: relative;
          padding: 14px 20px;
          padding-bottom: 14px;
        }

        .bottom-actions-inner {
          display: grid;
          grid-template-columns: 58px minmax(0, 360px);
          gap: 10px;
          width: 100%;
          max-width: 480px;
        }

        .save-button,
        .navigate-button {
          border: none;
          border-radius: 18px;
          height: 54px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .save-button {
          background: var(--cream);
        }

        .navigate-button {
          color: white;
          font-size: 15px;
          font-weight: 900;
          font-family: Nunito, sans-serif;
          gap: 8px;
        }

        @media (max-width: 820px) {
          .place-detail-shell {
            inset: auto 0 0;
          }

          .place-detail-card {
            width: 100%;
            max-height: 84vh;
            border-radius: 32px 32px 0 0;
          }

          .place-hero {
            height: 168px;
          }

          .place-content {
            padding: 14px;
            padding-bottom: 104px;
            gap: 10px;
          }

          .place-detail-card h2 {
            font-size: 24px;
          }

          .place-detail-card h3 {
            font-size: 20px;
          }

          .place-tagline,
          .section-eyebrow,
          .section-title,
          .mini-label {
            font-size: 10px;
          }

          .decision-card,
          .before-card {
            padding: 14px;
            border-radius: 18px;
          }

          .parent-quote {
            padding: 8px 10px;
            margin-bottom: 10px;
            font-size: 11px;
          }

          .metric-grid {
            gap: 7px;
          }

          .drive-card {
            padding: 12px 14px;
            border-radius: 16px;
          }

          .drive-card strong {
            font-size: 14px;
          }

          .drive-card span,
          .before-item span {
            font-size: 11px;
          }

          .before-thumb {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }

          .before-item {
            padding: 8px 0;
          }

          .before-item strong {
            font-size: 13px;
          }

          .bottom-actions {
            padding: 10px 14px;
            padding-bottom: max(10px, env(safe-area-inset-bottom));
          }

          .bottom-actions-inner {
            grid-template-columns: 52px minmax(0, 1fr);
            gap: 8px;
          }

          .save-button,
          .navigate-button {
            height: 50px;
            border-radius: 16px;
          }
        }
      `}</style>
    </>
  );
}

function BeforeItem({ label, value, note }) {
  return (
    <div className="before-item">
      <span>{label}</span>
      <strong>{value}</strong>
      <span>{note}</span>
    </div>
  );
}

function InfoChip({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'white',
      border: '2px solid var(--soft-gray)',
      borderRadius: '14px',
      padding: '10px',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color, marginBottom: '2px' }}>
        {icon}
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#666' }}>{label}</span>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--charcoal)' }}>
        {value}
      </div>
    </div>
  );
}
