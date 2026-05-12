import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, MapPinned, Navigation, RefreshCcw } from 'lucide-react';
import { PLACES } from '../data/places';

const KiddoMap = dynamic(() => import('../components/KiddoMap'), { ssr: false });
const PlaceDetail = dynamic(() => import('../components/PlaceDetail'), { ssr: false });
const NavigationSheet = dynamic(() => import('../components/NavigationSheet'), { ssr: false });
const TipJarSheet = dynamic(() => import('../components/TipJarSheet'), { ssr: false });

const AGE_FILTERS = [
  { id: 'any', label: 'Any age' },
  { id: 'baby', label: '0-3' },
  { id: 'little', label: '4-7' },
  { id: 'big', label: '8+' },
];

const AREA_FILTERS = [
  { id: 'any', label: 'Anywhere' },
  { id: 'klcc', label: 'KLCC' },
  { id: 'pj', label: 'PJ' },
  { id: 'mont-kiara', label: 'Mont Kiara' },
  { id: 'bangsar', label: 'Bangsar' },
];

const AREA_COORDS = {
  klcc: { label: 'KLCC', coordinates: [101.7139, 3.1579] },
  pj: { label: 'PJ', coordinates: [101.6068, 3.1073] },
  'mont-kiara': { label: 'Mont Kiara', coordinates: [101.6523, 3.1696] },
  bangsar: { label: 'Bangsar', coordinates: [101.6715, 3.1296] },
};

const TIME_FILTERS = [
  { id: 'any', label: 'Any time' },
  { id: 'quick', label: '1-2h' },
  { id: 'easy', label: '2-3h' },
  { id: 'half-day', label: 'Half day' },
];

const ENERGY_FILTERS = [
  { id: 'any', label: 'Best answer' },
  { id: 'indoor', label: 'Rain-safe' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'budget', label: 'Budget' },
  { id: 'favorites', label: 'Saved' },
];

function maxDurationHours(duration) {
  const matches = String(duration).match(/\d+/g);
  if (!matches) return 99;
  return Math.max(...matches.map(Number));
}

function areaMatches(place, area) {
  if (area === 'any') return true;
  const haystack = `${place.area} ${place.address} ${place.name}`.toLowerCase();
  if (area === 'pj') return /petaling|pj|damansara|sunway|curve/.test(haystack);
  if (area === 'mont-kiara') return /mont kiara|publika|desa park/.test(haystack);
  return haystack.includes(area.replace('-', ' '));
}

function ageMatches(place, age) {
  if (age === 'any') return true;
  if (age === 'baby') return place.ageMin <= 3 && place.ageMax >= 0;
  if (age === 'little') return place.ageMin <= 7 && place.ageMax >= 4;
  if (age === 'big') return place.ageMax >= 8;
  return true;
}

function timeMatches(place, time) {
  if (time === 'quick') return maxDurationHours(place.durationHours) <= 2;
  if (time === 'easy') return maxDurationHours(place.durationHours) <= 3;
  if (time === 'half-day') return maxDurationHours(place.durationHours) >= 3;
  return true;
}

function parentEnergy(place) {
  const ease =
    place.facilities.stroller +
    place.facilities.diaper +
    place.facilities.food +
    place.facilities.restroom +
    place.facilities.aircon;

  if (place.indoor && ease >= 22) return {
    label: 'Easy mode',
    detail: 'A/C, toilets, food nearby. Parents can breathe.',
  };
  if (place.indoor) return {
    label: 'Medium easy',
    detail: 'Mostly sheltered, but expect some moving around.',
  };
  if (maxDurationHours(place.durationHours) <= 2) return {
    label: 'Light adventure',
    detail: 'Outdoor fun without turning the whole day into a mission.',
  };
  return {
    label: 'High energy',
    detail: 'Kids may love it, but parents should expect heat and walking.',
  };
}

function frictionNote(place) {
  if (place.indoor && place.cost > 70) return 'Book ahead if it is a busy weekend.';
  if (place.indoor) return 'Low weather risk, easy to start without overthinking.';
  if (place.cost === 0) return 'Free entry. Best before it gets too hot.';
  return 'Check the sky first, then go before peak afternoon heat.';
}

function weatherNote(place) {
  return place.weatherSafe
    ? 'Rain-safe indoor pick'
    : 'Best when the sky looks friendly';
}

function distanceKm(from, to) {
  const toRad = value => (value * Math.PI) / 180;
  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  const earthKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function driveEstimate(place, area) {
  if (!AREA_COORDS[area]) {
    return {
      label: 'Drive',
      value: 'Pick your start area',
      detail: 'Add an area to see a rough drive time.',
    };
  }

  const km = distanceKm(AREA_COORDS[area].coordinates, place.coordinates);
  const minutes = Math.max(8, Math.round((km / 24) * 60 + 8));
  return {
    label: 'Drive',
    value: `~${minutes} min from ${AREA_COORDS[area].label}`,
    detail: `Rough estimate based on distance, not live traffic.`,
  };
}

function todayContext() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  return {
    hour,
    isMorning: hour < 12,
    isAfternoon: hour >= 12 && hour < 18,
    isWeekend: day === 0 || day === 6,
  };
}

function todayReasons(place, area, context) {
  const energy = parentEnergy(place);
  const drive = driveEstimate(place, area);
  const weather =
    place.weatherSafe
      ? context.isAfternoon
        ? 'A/C cover if KL turns hot or rainy.'
        : 'Rain-safe, no sky-check needed.'
      : context.isMorning
        ? 'Better before the day gets hot.'
        : 'Go only if the sky still looks friendly.';
  const time =
    maxDurationHours(place.durationHours) <= 2
      ? `${place.durationHours}h, easy to fit between meals.`
      : `${place.durationHours}h, more like a half-day plan.`;
  const parent =
    context.isWeekend
      ? `${energy.label}: weekend-friendly, lower planning load.`
      : `${energy.label}: ${energy.detail}`;

  return [
    ['☔', 'Why today', weather],
    ['👶', 'Kid fit', `Best for age ${place.ageMin}-${place.ageMax}.`],
    ['⏱️', 'Time', time],
    ['☕', 'Parent energy', parent],
    ['🚗', drive.label, drive.value],
  ];
}

// Contrast reasons for backup picks - fixed labels by position
function getBackupContrastReason(backupIndex) {
  const contrastReasons = [
    { icon: '😌', text: 'Less effort', label: 'Easier on everyone' },       // first backup
    { icon: '🕐', text: 'Stay longer', label: 'Longer to explore' },        // second backup
    { icon: '📍', text: 'Closer to you', label: 'Better location' },        // third backup (if exists)
  ];
  return contrastReasons[backupIndex] || contrastReasons[0];
}

function decisionScore(place, age, area, time, energy, favorites, context) {
  const energyLabel = parentEnergy(place).label;
  const ease = energyLabel === 'Easy mode' ? 10 : energyLabel === 'Medium easy' ? 6 : 2;
  const weather = place.weatherSafe ? 10 : 3;
  const dayFit =
    context?.isMorning && !place.indoor
      ? 8
      : context?.isAfternoon && place.indoor
        ? 8
        : 0;
  const weekendFit = context?.isWeekend && ease >= 6 ? 6 : 0;
  const ageFit = ageMatches(place, age) ? 12 : -18;
  const timeFit =
    time === 'quick'
      ? maxDurationHours(place.durationHours) <= 2 ? 12 : -8
      : time === 'easy'
        ? maxDurationHours(place.durationHours) <= 3 ? 8 : -4
        : time === 'half-day'
        ? maxDurationHours(place.durationHours) >= 3 ? 10 : 1
        : 0;
  const areaFit = areaMatches(place, area) ? 8 : -6;
  const energyFit =
    energy === 'indoor'
      ? place.indoor ? 10 : -10
      : energy === 'outdoor'
        ? !place.indoor ? 10 : -5
        : energy === 'budget'
          ? place.cost <= 50 ? 10 : -8
          : energy === 'favorites'
            ? favorites.includes(place.id) ? 14 : -20
            : 0;
  const budget = place.cost <= 50 ? 4 : 0;

  return place.ourRating * 10 + ease + weather + dayFit + weekendFit + ageFit + timeFit + areaFit + energyFit + budget;
}

function PickCard({ place, rank, variant = 'primary', area, context, onDetails, onNavigate, onChangeAnswer, onViewMap, isPreview = false, compact = false }) {
  const isPrimary = variant === 'primary';
  const reasons = todayReasons(place, area, context);
  const showDetails = isPrimary && !isPreview;
  const compactChangeLabel = compact ? 'Change' : 'Change answer';

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
          gridTemplateColumns: isPreview ? '1fr' : (isPrimary ? '64px 1fr' : '48px 1fr'),
          gap: '12px',
          alignItems: 'center',
          justifyContent: isPreview ? 'center' : 'flex-start',
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
            margin: isPreview ? '0 auto' : '0',
          }}>
            {place.emoji}
          </div>
          {!isPreview && (
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
                whiteSpace: 'normal',
                overflow: 'visible',
                display: '-webkit-box',
                WebkitLineClamp: isPrimary ? 2 : 1,
                WebkitBoxOrient: 'vertical',
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
                <span>{weatherNote(place)}</span>
                <span>·</span>
                <span>Age {place.ageMin}-{place.ageMax}</span>
                <span>·</span>
                <span>{place.durationHours}h</span>
              </div>
            </div>
          )}
        </div>

        {showDetails && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: compact ? '12px' : '14px',
          }}>
            {[
              ...reasons.slice(0, 4),
            ].map(([emoji, label, value]) => (
              <div key={label} style={{
                background: place.color.light,
                borderRadius: '14px',
                padding: compact ? '9px' : '10px',
                minHeight: compact ? '54px' : '58px',
              }}>
                <div style={{ fontSize: compact ? '12px' : '13px', fontWeight: 900, color: place.color.dark }}>
                  {emoji} {label}
                </div>
                <div style={{ fontSize: compact ? '11px' : '12px', fontWeight: 800, color: '#555', marginTop: '3px', lineHeight: 1.22 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetails && (
          <>
            <div style={{
              marginTop: isPrimary ? (compact ? '10px' : '12px') : '8px',
              color: '#555',
              fontSize: compact ? '12px' : '13px',
              fontWeight: 700,
              lineHeight: 1.35,
            }}>
              <strong style={{ color: 'var(--charcoal)' }}>Drive check:</strong> {reasons[4][2]}
            </div>
            {!compact && (
              <div style={{
                marginTop: '6px',
                color: '#777',
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: 1.35,
              }}>
                {frictionNote(place)}
              </div>
            )}
          </>
        )}
      </button>

      <div style={{ padding: isPrimary ? '0 14px 14px' : '0 12px 12px' }}>
        {isPrimary ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: showDetails ? '1fr auto' : '1fr',
              gap: '10px',
            }}
          >
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
              Take me there
            </button>
            {showDetails && (
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
                {compactChangeLabel}
              </button>
            )}
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
            Take this one
          </button>
        )}
      </div>

      {/* Mini map preview at bottom */}
      {onViewMap && showDetails && !compact && (
        <button
          onClick={() => onViewMap(place)}
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
            <span>{AREA_COORDS[area]?.label || 'Area'}</span>
          </div>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>Tap to explore</span>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const [age, setAge] = useState('any');
  const [area, setArea] = useState('any');
  const [time, setTime] = useState('any');
  const [energy, setEnergy] = useState('any');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [navPlace, setNavPlace] = useState(null);
  const [showTipJar, setShowTipJar] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showAllOnMap, setShowAllOnMap] = useState(false);
  const [showTweaks, setShowTweaks] = useState(false);
  const [showMapFullscreen, setShowMapFullscreen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapModalPlace, setMapModalPlace] = useState(null);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const [context, setContext] = useState({ isMorning: true, isAfternoon: false, isWeekend: false, hour: 9 });
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth > 820 : false);
  const isMobile = !isDesktop;

  useEffect(() => {
    setContext(todayContext());

    const saved = localStorage.getItem('kiddo-favorites');
    if (saved) setFavorites(JSON.parse(saved));

    // Track viewport size for desktop PlaceDetail layout
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 820);
    };
    window.addEventListener('resize', handleResize);
    setIsDesktop(window.innerWidth > 820);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('kiddo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (placeId) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  useEffect(() => {
    setRecommendationOffset(0);
  }, [age, area, time, energy]);

  const filteredPlaces = useMemo(() => {
    return PLACES.filter(place => {
      if (!ageMatches(place, age)) return false;
      if (!timeMatches(place, time)) return false;
      if (energy === 'indoor' && !place.indoor) return false;
      if (energy === 'outdoor' && place.indoor) return false;
      if (energy === 'budget' && place.cost > 50) return false;
      if (energy === 'favorites' && !favorites.includes(place.id)) return false;
      return true;
    });
  }, [age, time, energy, favorites]);

  const rankedPlaces = useMemo(() => {
    const candidates = filteredPlaces.length ? filteredPlaces : PLACES;
    return [...candidates]
      .sort((a, b) => decisionScore(b, age, area, time, energy, favorites, context) - decisionScore(a, age, area, time, energy, favorites, context));
  }, [filteredPlaces, age, area, time, energy, favorites, context]);

  const picks = useMemo(() => {
    const safeOffset = rankedPlaces.length ? recommendationOffset % rankedPlaces.length : 0;
    return [...rankedPlaces.slice(safeOffset), ...rankedPlaces.slice(0, safeOffset)].slice(0, 3);
  }, [rankedPlaces, recommendationOffset]);

  const mainPick = picks[0];
  const backupPicks = picks.slice(1, 3);
  const mapPlaces = showAllOnMap ? (filteredPlaces.length ? filteredPlaces : PLACES) : picks;

  return (
    <>
      <Head>
        <title>Kiddo Map · Decide in 3 minutes</title>
        <meta name="description" content="Pick a kid-friendly Kuala Lumpur place in 3 minutes." />
      </Head>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--cream)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(390px, 460px) 1fr',
          height: '100%',
        }} className={showMapFullscreen ? 'map-fullscreen' : ''} data-map-fullscreen={showMapFullscreen}>
          <motion.main
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 24 }}
            style={{
              display: showMapFullscreen ? 'none' : 'block',
              position: 'relative',
              zIndex: 8,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              padding: '18px',
              paddingTop: 'max(18px, env(safe-area-inset-top))',
              paddingBottom: 'max(18px, env(safe-area-inset-bottom))',
              background: 'linear-gradient(180deg, rgba(255,248,231,0.98), rgba(255,255,255,0.94))',
              boxShadow: '14px 0 36px rgba(34,34,34,0.08)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #FF8A65 0%, #FFD54F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 6px 16px rgba(255, 138, 101, 0.3)',
                }}>
                  🗺️
                </div>
                <div>
                  <div style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: 800 }}>
                    Kiddo Map
                  </div>
                  <div style={{ fontSize: '11px', color: '#999', fontWeight: 800 }}>
                    Kuala Lumpur family decisions
                  </div>
                </div>
              </div>
            </div>

            <section style={{ marginBottom: '16px' }}>
              <h1 style={{
                margin: 0,
                fontFamily: 'Fredoka, sans-serif',
                fontSize: isMobile ? '34px' : '40px',
                lineHeight: isMobile ? 1.03 : 1.02,
                color: 'var(--charcoal)',
                letterSpacing: 0,
              }}>
                Decide where to take your kid in 3 minutes.
              </h1>
            </section>

            {mainPick && (
              <>
                {/* Desktop: Two-column layout with card list + detail. Mobile: Single column card flow */}
                <section style={{
                  display: 'grid',
                  gridTemplateColumns: isDesktop && selectedPlace ? '35% 65%' : '1fr',
                  gap: isDesktop && selectedPlace ? '14px' : '12px',
                }}>
                  {/* Card flow - always visible */}
                  <section style={{ display: 'grid', gap: '12px' }}>
                    <PickCard
                      place={mainPick}
                      rank="Best pick right now"
                      area={area}
                      context={context}
                      onDetails={() => setSelectedPlace(mainPick)}
                      onNavigate={() => setNavPlace(mainPick)}
                      onChangeAnswer={() => setShowTweaks(prev => !prev)}
                      onViewMap={!isDesktop ? (place) => {
                        setMapModalPlace(place);
                        setShowMapModal(true);
                      } : undefined}
                      isPreview={isDesktop && selectedPlace ? true : false}
                      compact={isMobile}
                    />

                    <AnimatePresence initial={false}>
                      {showTweaks && !selectedPlace && (
                        <motion.section
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', damping: 24 }}
                          style={{
                            display: 'grid',
                            gap: '9px',
                            background: 'rgba(255,255,255,0.72)',
                            borderRadius: '20px',
                            padding: '12px',
                            boxShadow: '0 8px 24px rgba(34,34,34,0.06)',
                            overflow: 'hidden',
                          }}
                        >
                          {[
                            ['Kid age', AGE_FILTERS, age, setAge],
                            ['Starting area', AREA_FILTERS, area, setArea],
                            ['Time today', TIME_FILTERS, time, setTime],
                            ["Today's energy", ENERGY_FILTERS, energy, setEnergy],
                          ].map(([label, items, value, setter]) => (
                            <div key={label} style={{ display: 'grid', gap: '6px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
                                {label}
                              </div>
                              <div className="hide-scrollbar" style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }}>
                                {items.map(item => {
                                  const active = value === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => setter(item.id)}
                                      className="bouncy-button"
                                      style={{
                                        flexShrink: 0,
                                        border: 'none',
                                        borderRadius: '999px',
                                        padding: '8px 11px',
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
                          ))}
                          <button
                            onClick={() => setRecommendationOffset(prev => prev + 1)}
                            className="bouncy-button"
                            style={{
                              border: 'none',
                              borderRadius: '14px',
                              padding: '11px 12px',
                              background: 'var(--charcoal)',
                              color: 'white',
                              fontFamily: 'Nunito, sans-serif',
                              fontSize: '13px',
                              fontWeight: 900,
                              cursor: 'pointer',
                            }}
                          >
                            Change answer again
                          </button>

                          <div style={{ display: 'grid', gap: '10px', paddingTop: '2px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
                              Two backup picks
                            </div>
                            {backupPicks.map((place, index) => {
                              const contrastReason = getBackupContrastReason(index);
                              return (
                                <PickCard
                                  key={place.id}
                                  place={place}
                                  rank={`${contrastReason.icon} ${contrastReason.text}`}
                                  variant="backup"
                                  area={area}
                                  context={context}
                                  onDetails={() => setSelectedPlace(place)}
                                  onNavigate={() => setNavPlace(place)}
                                  onViewMap={!isDesktop ? (place) => {
                                    setMapModalPlace(place);
                                    setShowMapModal(true);
                                  } : undefined}
                                />
                              );
                            })}
                          </div>

                          <button
                            onClick={() => setShowAllOnMap(prev => !prev)}
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
                            <MapPinned size={17} strokeWidth={3} />
                            {showAllOnMap ? 'Show only these 3 picks' : 'Explore full map'}
                          </button>
                        </motion.section>
                      )}
                    </AnimatePresence>
                  </section>

                  {/* PlaceDetail sidebar - only on desktop when selected */}
                  {isDesktop && selectedPlace && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring', damping: 24 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                      }}
                    >
                      <PlaceDetail
                        place={selectedPlace}
                        isFavorite={favorites.includes(selectedPlace.id)}
                        onToggleFavorite={() => toggleFavorite(selectedPlace.id)}
                        onClose={() => setSelectedPlace(null)}
                        onNavigate={() => setNavPlace(selectedPlace)}
                        driveText={driveEstimate(selectedPlace, area).value}
                        variant="sidebar"
                      />
                    </motion.div>
                  )}
                </section>
              </>
            )}
          </motion.main>

          <aside style={{
            position: 'relative',
            minWidth: 0,
          }}>
            <KiddoMap
              places={mapPlaces}
              selectedPlace={selectedPlace}
              onPinClick={setSelectedPlace}
            />
            <div
              onClick={() => setShowMapFullscreen(prev => !prev)}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 5,
                cursor: 'pointer',
                display: 'none',
              }}
              className="map-toggle-overlay"
            />
            {/* Map info label */}
            <div style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              zIndex: 6,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '18px',
              padding: '12px 14px',
              boxShadow: '0 8px 24px rgba(34,34,34,0.12)',
              maxWidth: '260px',
              pointerEvents: 'none',
            }}>
              <div style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--charcoal)',
                marginBottom: '4px',
              }}>
                Map is optional
              </div>
              <div style={{
                fontSize: '12px',
                lineHeight: 1.35,
                fontWeight: 800,
                color: '#777',
              }}>
                Showing {showAllOnMap ? 'all matching places' : 'the main pick and 2 backups'}.
              </div>
            </div>

            {/* Right sidebar: Tip Jar + Saved Spots */}
            {isDesktop && (
              <div style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                zIndex: 7,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '280px',
                pointerEvents: 'auto',
              }}>
              {/* Tip Jar Button */}
              <button
                onClick={() => setShowTipJar(true)}
                className="bouncy-button"
                style={{
                  border: 'none',
                  borderRadius: '18px',
                  padding: '14px',
                  background: 'white',
                  color: 'var(--charcoal)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '13px',
                  fontWeight: 900,
                }}
              >
                <Coffee size={18} strokeWidth={3} />
                Support us
              </button>

              {/* Saved Spots Section */}
              {favorites.length > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    color: '#999',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}>
                    Saved spots ({favorites.length})
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}>
                    {PLACES.filter(p => favorites.includes(p.id)).map(place => (
                      <button
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className="bouncy-button"
                        style={{
                          border: 'none',
                          borderRadius: '12px',
                          padding: '10px',
                          background: 'linear-gradient(135deg, ' + place.color.primary + '22, ' + place.color.light + ')',
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
                </div>
              )}
              </div>
            )}
          </aside>
        </div>

        <AnimatePresence>
          {showInstallHint && isDesktop && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              style={{
                position: 'fixed',
                bottom: '100px',
                left: '16px',
                right: '16px',
                zIndex: 20,
                background: 'linear-gradient(135deg, #FF8A65, #FFD54F)',
                color: 'white',
                padding: '14px 18px',
                borderRadius: '20px',
                boxShadow: '0 12px 40px rgba(255, 138, 101, 0.4)',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '24px' }}>📱</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, marginBottom: '2px' }}>Add to Home Screen</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  Safari → Share → "Add to Home Screen"
                </div>
              </div>
              <button
                onClick={() => setShowInstallHint(false)}
                className="bouncy-button"
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  border: 'none',
                  borderRadius: '999px',
                  width: '28px',
                  height: '28px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={14} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: Show PlaceDetail as bottom sheet on mobile only (≤820px) */}
        <AnimatePresence>
          {selectedPlace && !isDesktop && (
            <PlaceDetail
              place={selectedPlace}
              isFavorite={favorites.includes(selectedPlace.id)}
              onToggleFavorite={() => toggleFavorite(selectedPlace.id)}
              onClose={() => setSelectedPlace(null)}
              onNavigate={() => setNavPlace(selectedPlace)}
              driveText={driveEstimate(selectedPlace, area).value}
              variant="modal"
            />
          )}
        </AnimatePresence>

        {/* Full-screen Map Modal for mini map preview */}
        <AnimatePresence>
          {showMapModal && mapModalPlace && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMapModal(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 100,
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26 }}
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '90vh',
                }}
              >
                <div style={{
                  width: '100%',
                  background: 'white',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--charcoal)' }}>
                    {mapModalPlace.nameEn || mapModalPlace.name}
                  </div>
                  <button
                    onClick={() => setShowMapModal(false)}
                    className="bouncy-button"
                    style={{
                      background: 'var(--cream)',
                      border: 'none',
                      borderRadius: '999px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={18} strokeWidth={2.5} color="#999" />
                  </button>
                </div>
                <div style={{
                  flex: 1,
                  position: 'relative',
                  minHeight: '400px',
                  width: '100%',
                }}>
                  <KiddoMap
                    places={[mapModalPlace]}
                    selectedPlace={mapModalPlace}
                    onPinClick={() => {}}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {navPlace && (
            <NavigationSheet
              place={navPlace}
              onClose={() => setNavPlace(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTipJar && (
            <TipJarSheet onClose={() => setShowTipJar(false)} />
          )}
        </AnimatePresence>

        <style jsx>{`
          @media (max-width: 820px) {
            div[data-map-fullscreen='false'] {
              display: block !important;
            }

            div[data-map-fullscreen='true'] main {
              display: none !important;
            }

            div[data-map-fullscreen='true'] aside {
              opacity: 1 !important;
              pointer-events: auto !important;
            }

            div[data-map-fullscreen='true'] .map-toggle-overlay {
              display: none !important;
            }

            .map-toggle-overlay {
              display: none !important;
            }

            main {
              width: auto !important;
              height: 100% !important;
              padding: 12px !important;
              padding-top: max(12px, env(safe-area-inset-top)) !important;
              padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
              transition: opacity 0.2s ease !important;
            }

            aside {
              position: fixed !important;
              inset: 0 !important;
              z-index: 1 !important;
              opacity: 0.14 !important;
              pointer-events: none !important;
              transition: opacity 0.2s ease !important;
            }

            aside > div[style*='Map is optional'] {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
