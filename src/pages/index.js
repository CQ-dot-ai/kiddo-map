import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Coffee, MapPinned, Navigation, RefreshCcw } from 'lucide-react';
import { PLACES } from '../data/places';

const KiddoMap = dynamic(() => import('../components/KiddoMap'), { ssr: false });
const PlaceDetail = dynamic(() => import('../components/PlaceDetail'), { ssr: false });
const NavigationSheet = dynamic(() => import('../components/NavigationSheet'), { ssr: false });
const FeedbackSheet = dynamic(() => import('../components/FeedbackSheet'), { ssr: false });
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

const TIME_FILTERS = [
  { id: 'any', label: 'Any time' },
  { id: 'quick', label: '1-2h' },
  { id: 'easy', label: '2-3h' },
  { id: 'half-day', label: 'Half day' },
];

const MOOD_FILTERS = [
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

function decisionScore(place, age, area, time, mood, favorites) {
  const ease = parentEnergy(place).label === 'Easy mode' ? 10 : parentEnergy(place).label === 'Medium easy' ? 6 : 2;
  const weather = place.weatherSafe ? 10 : 3;
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
  const moodFit =
    mood === 'indoor'
      ? place.indoor ? 10 : -10
      : mood === 'outdoor'
        ? !place.indoor ? 10 : -5
        : mood === 'budget'
          ? place.cost <= 50 ? 10 : -8
          : mood === 'favorites'
            ? favorites.includes(place.id) ? 14 : -20
            : 0;
  const budget = place.cost <= 50 ? 4 : 0;

  return place.ourRating * 10 + ease + weather + ageFit + timeFit + areaFit + moodFit + budget;
}

function PickCard({ place, rank, variant = 'primary', onDetails, onNavigate, onTryAnother }) {
  const energy = parentEnergy(place);
  const isPrimary = variant === 'primary';

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
              <span>{weatherNote(place)}</span>
              <span>·</span>
              <span>Age {place.ageMin}-{place.ageMax}</span>
              <span>·</span>
              <span>{place.durationHours}h</span>
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
              ['☔', 'Weather', weatherNote(place)],
              ['👶', 'Kid fit', `Best for age ${place.ageMin}-${place.ageMax}`],
              ['⏱️', 'Play time', `${place.durationHours} hours`],
              ['☕', 'Parent energy', energy.label],
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
          <strong style={{ color: 'var(--charcoal)' }}>{energy.label}:</strong> {energy.detail}
        </div>
        <div style={{
          marginTop: '6px',
          color: '#777',
          fontSize: '12px',
          fontWeight: 700,
          lineHeight: 1.35,
        }}>
          {frictionNote(place)}
        </div>
      </button>

      <div style={{ padding: isPrimary ? '0 14px 14px' : '0 12px 12px' }}>
        {isPrimary ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
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
            <button
              onClick={onTryAnother}
              className="bouncy-button"
              style={{
                border: 'none',
                borderRadius: '16px',
                width: '52px',
                background: 'var(--cream)',
                color: 'var(--charcoal)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Try another pick"
            >
              <RefreshCcw size={18} strokeWidth={3} />
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
            Take this one
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [age, setAge] = useState('any');
  const [area, setArea] = useState('any');
  const [time, setTime] = useState('any');
  const [mood, setMood] = useState('any');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [navPlace, setNavPlace] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTipJar, setShowTipJar] = useState(false);
  const [showFeedbackNudge, setShowFeedbackNudge] = useState(false);
  const [feedbackNudgeDismissed, setFeedbackNudgeDismissed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showAllOnMap, setShowAllOnMap] = useState(false);
  const [recommendationOffset, setRecommendationOffset] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('kiddo-favorites');
    if (saved) setFavorites(JSON.parse(saved));

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowInstallHint(true), 3000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kiddo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setShowFeedbackNudge(false);

    if (!selectedPlace || showFeedback || feedbackNudgeDismissed) return;

    const timer = setTimeout(() => {
      setShowFeedbackNudge(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [selectedPlace, showFeedback, feedbackNudgeDismissed]);

  const toggleFavorite = (placeId) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  useEffect(() => {
    setRecommendationOffset(0);
  }, [age, area, time, mood]);

  const filteredPlaces = useMemo(() => {
    return PLACES.filter(place => {
      if (!ageMatches(place, age)) return false;
      if (!timeMatches(place, time)) return false;
      if (mood === 'indoor' && !place.indoor) return false;
      if (mood === 'outdoor' && place.indoor) return false;
      if (mood === 'budget' && place.cost > 50) return false;
      if (mood === 'favorites' && !favorites.includes(place.id)) return false;
      return true;
    });
  }, [age, time, mood, favorites]);

  const rankedPlaces = useMemo(() => {
    const candidates = filteredPlaces.length ? filteredPlaces : PLACES;
    return [...candidates]
      .sort((a, b) => decisionScore(b, age, area, time, mood, favorites) - decisionScore(a, age, area, time, mood, favorites));
  }, [filteredPlaces, age, area, time, mood, favorites]);

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
        }}>
          <motion.main
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 24 }}
            style={{
              position: 'relative',
              zIndex: 8,
              overflowY: 'auto',
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

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowTipJar(true)}
                  className="bouncy-button"
                  style={{
                    border: 'none',
                    borderRadius: '14px',
                    padding: '10px',
                    background: 'white',
                    color: 'var(--charcoal)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                  }}
                  aria-label="Support"
                >
                  <Coffee size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={() => setShowFeedback(true)}
                  className="bouncy-button"
                  style={{
                    border: 'none',
                    borderRadius: '14px',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #FF8A65, #FFD54F)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(255,138,101,0.28)',
                    cursor: 'pointer',
                  }}
                  aria-label="Feedback"
                >
                  <MessageSquare size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            <section style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '11px',
                color: '#FF8A65',
                fontWeight: 900,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                3-minute decision tool
              </div>
              <h1 style={{
                margin: 0,
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '40px',
                lineHeight: 1.02,
                color: 'var(--charcoal)',
                letterSpacing: 0,
              }}>
                Decide where to take your kid in 3 minutes.
              </h1>
              <p style={{
                margin: '10px 0 0',
                color: '#666',
                fontSize: '15px',
                lineHeight: 1.45,
                fontWeight: 700,
              }}>
                Kiddo Map gives you one strong answer first, then two backups. No map homework before coffee.
              </p>
            </section>

            <section style={{
              display: 'grid',
              gap: '9px',
              marginBottom: '14px',
              background: 'rgba(255,255,255,0.72)',
              borderRadius: '20px',
              padding: '12px',
              boxShadow: '0 8px 24px rgba(34,34,34,0.06)',
            }}>
              {[
                ['Kid age', AGE_FILTERS, age, setAge],
                ['Starting area', AREA_FILTERS, area, setArea],
                ['Time today', TIME_FILTERS, time, setTime],
                ['Today feels like', MOOD_FILTERS, mood, setMood],
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
            </section>

            {mainPick && (
              <section style={{ display: 'grid', gap: '12px' }}>
                <PickCard
                  place={mainPick}
                  rank="Best pick right now"
                  onDetails={() => setSelectedPlace(mainPick)}
                  onNavigate={() => setNavPlace(mainPick)}
                  onTryAnother={() => setRecommendationOffset(prev => prev + 1)}
                />

                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
                    Two backup picks
                  </div>
                  {backupPicks.map((place, index) => (
                    <PickCard
                      key={place.id}
                      place={place}
                      rank={index === 0 ? 'Good backup' : 'Another safe bet'}
                      variant="backup"
                      onDetails={() => setSelectedPlace(place)}
                      onNavigate={() => setNavPlace(place)}
                    />
                  ))}
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
              </section>
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
          </aside>
        </div>

        <AnimatePresence>
          {showInstallHint && (
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

        <AnimatePresence>
          {selectedPlace && (
            <PlaceDetail
              place={selectedPlace}
              isFavorite={favorites.includes(selectedPlace.id)}
              onToggleFavorite={() => toggleFavorite(selectedPlace.id)}
              onClose={() => setSelectedPlace(null)}
              onNavigate={() => setNavPlace(selectedPlace)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFeedbackNudge && selectedPlace && !showFeedback && (
            <motion.button
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              onClick={() => {
                setFeedbackNudgeDismissed(true);
                setShowFeedbackNudge(false);
                setShowFeedback(true);
              }}
              className="bouncy-button"
              style={{
                position: 'fixed',
                left: '18px',
                right: '18px',
                bottom: 'max(18px, env(safe-area-inset-bottom))',
                zIndex: 75,
                border: 'none',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #FF8A65, #FFD54F)',
                color: 'white',
                boxShadow: '0 12px 32px rgba(255, 138, 101, 0.35)',
                padding: '13px 16px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <MessageSquare size={16} strokeWidth={3} />
              Was this useful? Tell us →
            </motion.button>
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
          {showFeedback && (
            <FeedbackSheet onClose={() => setShowFeedback(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTipJar && (
            <TipJarSheet onClose={() => setShowTipJar(false)} />
          )}
        </AnimatePresence>

        <style jsx>{`
          @media (max-width: 820px) {
            div[style*='grid-template-columns: minmax(390px, 460px) 1fr'] {
              display: block !important;
            }

            main {
              width: auto !important;
              height: 100% !important;
              padding: 14px !important;
              padding-top: max(14px, env(safe-area-inset-top)) !important;
            }

            aside {
              position: fixed !important;
              inset: 0 !important;
              z-index: 1 !important;
              opacity: 0.22 !important;
              pointer-events: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
