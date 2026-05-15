import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPinned, X } from 'lucide-react';
import KiddoMap from './KiddoMap';
import PlaceDetail from './PlaceDetail';
import SiteFooter from './SiteFooter';
import PickCard from './PickCard';
import HomeHeader from './home/HomeHeader';
import SavedListPanel from './home/SavedListPanel';
import NavigationSheet from './NavigationSheet';
import TipJarSheet from './TipJarSheet';
import { AREA_COORDS, getBackupContrastReason, driveEstimate } from '../lib/recommendation';

export default function MobileHome({
  age,
  area,
  time,
  energy,
  context,
  favorites,
  selectedPlace,
  onSelectPlace,
  onToggleFavorite,
  onNavigate,
  navPlace,
  onCloseNav,
  showTipJar,
  onShowTipJar,
  onCloseTipJar,
  showInstallHint,
  onCloseInstallHint,
  showSavedList,
  onToggleSavedList,
  onCloseSavedList,
  onSetAge,
  onSetArea,
  onSetTime,
  onSetEnergy,
  showTweaks,
  onToggleTweaks,
  showAllOnMap,
  onToggleAllOnMap,
  recommendationOffset,
  onNextRecommendation,
  mainPick,
  backupPicks,
  mapPlaces,
  allPlaces,
}) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapModalPlace, setMapModalPlace] = useState(null);

  useEffect(() => {
    if (!showMapModal) {
      setMapModalPlace(null);
    }
  }, [showMapModal]);

  return (
    <div style={{
      height: '100dvh',
      background: 'var(--cream)',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'hidden',
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.22,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <KiddoMap
          places={mapPlaces}
          selectedPlace={selectedPlace}
          onPinClick={(place) => onSelectPlace(place, 'map_pin')}
        />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '14px',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
          height: '100dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          background: 'linear-gradient(180deg, rgba(255,248,231,0.94), rgba(255,255,255,0.92))',
        }}
      >
          <HomeHeader
            compact
            favoritesCount={favorites.length}
            onToggleSavedList={onToggleSavedList}
            onShowTipJar={() => onShowTipJar('header')}
          />

        {showSavedList && (
          <SavedListPanel
            favorites={favorites}
            places={allPlaces}
            onClose={onCloseSavedList}
            onSelectPlace={(place) => onSelectPlace(place, 'saved_list')}
          />
        )}

        <section style={{ marginBottom: '14px' }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '38px',
            lineHeight: 1.02,
            color: 'var(--charcoal)',
            letterSpacing: 0,
          }}>
            Decide where to take your kid in 3 minutes.
          </h1>
        </section>

        {mainPick && (
          <section style={{ display: 'grid', gap: '12px' }}>
            <PickCard
              place={mainPick}
              rank="Best pick right now"
              area={area}
              context={context}
              areaLabel={AREA_COORDS[area]?.label || 'Area'}
              tweaksOpen={showTweaks}
              onDetails={() => onSelectPlace(mainPick, 'main_pick')}
              onNavigate={() => onNavigate(mainPick, 'main_pick')}
              onChangeAnswer={onToggleTweaks}
              onViewMap={(place) => {
                setMapModalPlace(place);
                setShowMapModal(true);
              }}
            />

            <AnimatePresence initial={false}>
              {showTweaks && (
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
                    ['Kid age', [
                      { id: 'any', label: 'Any age' },
                      { id: 'baby', label: '0-3' },
                      { id: 'little', label: '4-7' },
                      { id: 'big', label: '8+' },
                    ], age, onSetAge],
                    ['Starting area', [
                      { id: 'any', label: 'Anywhere' },
                      { id: 'klcc', label: 'KLCC' },
                      { id: 'pj', label: 'PJ' },
                      { id: 'mont-kiara', label: 'Mont Kiara' },
                      { id: 'bangsar', label: 'Bangsar' },
                    ], area, onSetArea],
                    ['Time today', [
                      { id: 'any', label: 'Any time' },
                      { id: 'quick', label: '1-2h' },
                      { id: 'easy', label: '2-3h' },
                      { id: 'half-day', label: 'Half day' },
                    ], time, onSetTime],
                    ["Today's energy", [
                      { id: 'any', label: 'Best answer' },
                      { id: 'indoor', label: 'Rain-safe' },
                      { id: 'outdoor', label: 'Outdoor' },
                      { id: 'budget', label: 'Budget' },
                    ], energy, onSetEnergy],
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
                    onClick={onNextRecommendation}
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
                    Show me another good spot
                  </button>

                  <div style={{ display: 'grid', gap: '10px', paddingTop: '2px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
                      Two backup picks
                    </div>
                    {backupPicks.map((place) => {
                      const contrastReason = getBackupContrastReason(mainPick, place);
                      return (
                        <PickCard
                          key={place.id}
                          place={place}
                          rank={`${contrastReason.icon} ${contrastReason.text}`}
                          variant="backup"
                          area={area}
                          context={context}
                          areaLabel={AREA_COORDS[area]?.label || 'Area'}
                          onDetails={() => onSelectPlace(place, 'backup_pick')}
                          onNavigate={() => onNavigate(place, 'backup_pick')}
                          onViewMap={(spot) => {
                            setMapModalPlace(spot);
                            setShowMapModal(true);
                          }}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={onToggleAllOnMap}
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
        )}

        <SiteFooter compact />
      </motion.main>

      <AnimatePresence>
        {selectedPlace && (
            <PlaceDetail
              place={selectedPlace}
              isFavorite={favorites.includes(selectedPlace.id)}
              onToggleFavorite={() => onToggleFavorite(selectedPlace.id, 'detail')}
              onClose={() => onSelectPlace(null)}
              onNavigate={() => onNavigate(selectedPlace, 'detail')}
              driveText={driveEstimate(selectedPlace, area).value}
              variant="modal"
            />
        )}
      </AnimatePresence>

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
            onClose={onCloseNav}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTipJar && (
          <TipJarSheet onClose={onCloseTipJar} />
        )}
      </AnimatePresence>

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
              onClick={onCloseInstallHint}
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
    </div>
  );
}
