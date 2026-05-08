import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Coffee } from 'lucide-react';
import { PLACES, FILTERS } from '../data/places';

// Mapbox must render on the client.
const KiddoMap = dynamic(() => import('../components/KiddoMap'), { ssr: false });
const PlaceDetail = dynamic(() => import('../components/PlaceDetail'), { ssr: false });
const NavigationSheet = dynamic(() => import('../components/NavigationSheet'), { ssr: false });
const FeedbackSheet = dynamic(() => import('../components/FeedbackSheet'), { ssr: false });
const TipJarSheet = dynamic(() => import('../components/TipJarSheet'), { ssr: false });

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
    if (filter === 'indoor') return PLACES.filter(p => p.indoor);
    if (filter === 'outdoor') return PLACES.filter(p => !p.indoor);
    if (filter === 'favorites') return PLACES.filter(p => favorites.includes(p.id));
    return PLACES;
  }, [filter, favorites]);

  return (
    <>
      <Head>
        <title>Kiddo Map · KL family fun map</title>
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
                  KL family fun · {filteredPlaces.length} places
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

        {/* Top filters */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, delay: 0.2 }}
          style={{
            position: 'absolute',
            top: 'max(86px, calc(env(safe-area-inset-top) + 86px))',
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
            {FILTERS.map(f => {
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
