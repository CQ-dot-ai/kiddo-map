import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Coffee } from 'lucide-react';
import { PLACES } from '../data/places';

// Mapbox must render on the client.
const KiddoMap = dynamic(() => import('../components/KiddoMap'), { ssr: false });
const PlaceDetail = dynamic(() => import('../components/PlaceDetail'), { ssr: false });
const NavigationSheet = dynamic(() => import('../components/NavigationSheet'), { ssr: false });
const FeedbackSheet = dynamic(() => import('../components/FeedbackSheet'), { ssr: false });
const TipJarSheet = dynamic(() => import('../components/TipJarSheet'), { ssr: false });

const QUICK_FILTERS = [
  { id: 'all', label: 'All', emoji: '🗺️' },
  { id: 'toddler', label: '0-4', emoji: '🧸' },
  { id: 'kids', label: '5-9', emoji: '🛝' },
  { id: 'short', label: '1-2h', emoji: '⏱️' },
  { id: 'indoor', label: 'Indoor', emoji: '❄️' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌳' },
  { id: 'budget', label: 'Budget', emoji: '💰' },
  { id: 'favorites', label: 'Saved', emoji: '❤️' },
];

function maxDurationHours(duration) {
  const matches = String(duration).match(/\d+/g);
  if (!matches) return 99;
  return Math.max(...matches.map(Number));
}

function decisionScore(place) {
  const parentEase =
    place.facilities.stroller +
    place.facilities.diaper +
    place.facilities.food +
    place.facilities.restroom;

  return (
    place.ourRating * 10 +
    parentEase +
    (place.weatherSafe ? 8 : 0) +
    (maxDurationHours(place.durationHours) <= 3 ? 5 : 0) +
    (place.cost <= 50 ? 3 : 0)
  );
}

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [navPlace, setNavPlace] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTipJar, setShowTipJar] = useState(false);
  const [showFeedbackNudge, setShowFeedbackNudge] = useState(false);
  const [feedbackNudgeDismissed, setFeedbackNudgeDismissed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [recommendationIndex, setRecommendationIndex] = useState(0);

  // Load saved favorites.
  useEffect(() => {
    const saved = localStorage.getItem('kiddo-favorites');
    if (saved) setFavorites(JSON.parse(saved));
    
    // Show the install hint on iOS Safari when not already installed.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowInstallHint(true), 3000);
    }
  }, []);

  // Save favorites locally.
  useEffect(() => {
    localStorage.setItem('kiddo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setRecommendationIndex(0);
  }, [filter]);

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

  // Filter places.
  const filteredPlaces = useMemo(() => {
    if (filter === 'all') return PLACES;
    if (filter === 'toddler') return PLACES.filter(p => p.ageMin <= 4 && p.ageMax >= 1);
    if (filter === 'kids') return PLACES.filter(p => p.ageMin <= 9 && p.ageMax >= 5);
    if (filter === 'short') return PLACES.filter(p => maxDurationHours(p.durationHours) <= 2);
    if (filter === 'indoor') return PLACES.filter(p => p.indoor);
    if (filter === 'outdoor') return PLACES.filter(p => !p.indoor);
    if (filter === 'budget') return PLACES.filter(p => p.cost <= 50);
    if (filter === 'favorites') return PLACES.filter(p => favorites.includes(p.id));
    return PLACES;
  }, [filter, favorites]);

  const recommendedPlaces = useMemo(() => {
    const candidates = filteredPlaces.length ? filteredPlaces : PLACES;
    return [...candidates].sort((a, b) => decisionScore(b) - decisionScore(a));
  }, [filteredPlaces]);

  const todayPick = recommendedPlaces[recommendationIndex % recommendedPlaces.length] || PLACES[0];
  const activeHighlight = todayPick?.highlights?.[recommendationIndex % todayPick.highlights.length];

  return (
    <>
      <Head>
        <title>Kiddo Map · Decide in 3 minutes</title>
        <meta name="description" content="Pick a kid-friendly KL place in 3 minutes." />
      </Head>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--cream)',
        overflow: 'hidden',
      }}>
        {/* Map background */}
        <KiddoMap
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onPinClick={setSelectedPlace}
        />

        {/* Top brand and actions */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '14px 16px',
            paddingTop: 'max(14px, env(safe-area-inset-top))',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '10px 14px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-soft)',
              pointerEvents: 'auto',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #FF8A65 0%, #FFD54F 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 4px 12px rgba(255, 138, 101, 0.3)',
              }}>
                🗺️
              </div>
              <div>
                <div style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 600,
                  fontSize: '17px',
                  color: 'var(--charcoal)',
                  lineHeight: 1,
                }}>
                  Kiddo Map
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '3px',
                }}>
                  Decide in 3 minutes
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              pointerEvents: 'auto',
            }}>
              <button
                onClick={() => setShowTipJar(true)}
                className="bouncy-button"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  color: 'var(--charcoal)',
                  fontSize: '13px',
                  fontWeight: 800,
                  fontFamily: 'Nunito, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Coffee size={14} strokeWidth={3} />
                Support
              </button>

              <button
                onClick={() => setShowFeedback(true)}
                className="bouncy-button"
                style={{
                  background: 'linear-gradient(135deg, #FF8A65, #FFD54F)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'Nunito, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 12px rgba(255, 138, 101, 0.3)',
                }}
              >
                <MessageSquare size={14} strokeWidth={3} />
                Feedback
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decision hero */}
        {todayPick && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, delay: 0.12 }}
            style={{
              position: 'absolute',
              top: 'max(92px, calc(env(safe-area-inset-top) + 92px))',
              left: '16px',
              right: '16px',
              zIndex: 12,
              pointerEvents: 'auto',
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.96)',
              borderRadius: '24px',
              boxShadow: '0 16px 44px rgba(34, 34, 34, 0.14)',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.7)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}>
              <div style={{ padding: '16px 16px 14px' }}>
                <div style={{
                  fontSize: '11px',
                  color: '#FF8A65',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  Today's pick
                </div>
                <div style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '25px',
                  lineHeight: 1.05,
                  color: 'var(--charcoal)',
                  fontWeight: 800,
                  marginBottom: '10px',
                }}>
                  3 minutes to decide where to take your kid today.
                </div>
                <button
                  onClick={() => setSelectedPlace(todayPick)}
                  className="bouncy-button"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '18px',
                    padding: '12px',
                    background: todayPick.color.light,
                    color: 'var(--charcoal)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    background: `linear-gradient(135deg, ${todayPick.color.primary}, ${todayPick.color.dark})`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: `0 8px 18px ${todayPick.color.primary}55`,
                  }}>
                    {todayPick.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '11px',
                      color: todayPick.color.dark,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      marginBottom: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {todayPick.tagline}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 900,
                      fontFamily: 'Fredoka, sans-serif',
                      color: 'var(--charcoal)',
                      marginBottom: '5px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {todayPick.nameEn || todayPick.name}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      color: '#777',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexWrap: 'wrap',
                    }}>
                      <span>{todayPick.indoor ? 'Indoor' : 'Outdoor'}</span>
                      <span>·</span>
                      <span>{todayPick.durationHours}h</span>
                      <span>·</span>
                      <span>Age {todayPick.ageMin}-{todayPick.ageMax}</span>
                    </div>
                  </div>
                </button>

                {activeHighlight && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr',
                    gap: '8px',
                    alignItems: 'start',
                    marginTop: '12px',
                    color: '#555',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: 1.35,
                  }}>
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>{activeHighlight.emoji}</span>
                    <span>
                      <strong style={{ color: 'var(--charcoal)' }}>{activeHighlight.text}:</strong>{' '}
                      {activeHighlight.detail}
                    </span>
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 112px',
                  gap: '10px',
                  marginTop: '14px',
                }}>
                  <button
                    onClick={() => setNavPlace(todayPick)}
                    className="bouncy-button"
                    style={{
                      border: 'none',
                      borderRadius: '16px',
                      padding: '12px 10px',
                      background: 'linear-gradient(135deg, #43A047, #2E7D32)',
                      color: 'white',
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '14px',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    Take me there
                  </button>
                  <button
                    onClick={() => setRecommendationIndex(prev => prev + 1)}
                    className="bouncy-button"
                    style={{
                      border: 'none',
                      borderRadius: '16px',
                      padding: '12px 10px',
                      background: 'var(--cream)',
                      color: 'var(--charcoal)',
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '14px',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    Try another
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top filters */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, delay: 0.2 }}
          style={{
            position: 'absolute',
            top: 'max(360px, calc(env(safe-area-inset-top) + 360px))',
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '0 16px',
          }}
        >
          <div
            className="hide-scrollbar"
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}
          >
            {QUICK_FILTERS.map(f => {
              const isActive = filter === f.id;
              const count = f.id === 'favorites' ? favorites.length : '';
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="bouncy-button"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive 
                      ? 'linear-gradient(135deg, #FF8A65, #FFD54F)' 
                      : 'rgba(255, 255, 255, 0.95)',
                    color: isActive ? 'white' : 'var(--charcoal)',
                    fontWeight: 700,
                    fontSize: '17px',
                    fontFamily: 'Nunito, sans-serif',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: isActive 
                      ? '0 6px 20px rgba(255, 138, 101, 0.4)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                  {count !== '' && count > 0 && (
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.3)' : '#FF8A65',
                      color: 'white',
                      borderRadius: '999px',
                      padding: '1px 7px',
                      fontSize: '11px',
                      fontWeight: 800,
                      marginLeft: '2px',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* iOS install hint */}
        <AnimatePresence>
          {showInstallHint && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              style={{
                position: 'absolute',
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

        {/* Place detail */}
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

        {/* Detail feedback nudge */}
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

        {/* Navigation choices */}
        <AnimatePresence>
          {navPlace && (
            <NavigationSheet
              place={navPlace}
              onClose={() => setNavPlace(null)}
            />
          )}
        </AnimatePresence>

        {/* Feedback form */}
        <AnimatePresence>
          {showFeedback && (
            <FeedbackSheet onClose={() => setShowFeedback(false)} />
          )}
        </AnimatePresence>

        {/* Tip jar */}
        <AnimatePresence>
          {showTipJar && (
            <TipJarSheet onClose={() => setShowTipJar(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
