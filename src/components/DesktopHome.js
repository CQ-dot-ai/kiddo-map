import { motion, AnimatePresence } from 'framer-motion';
import { MapPinned, X } from 'lucide-react';
import KiddoMap from './KiddoMap';
import PlaceDetail from './PlaceDetail';
import SiteFooter from './SiteFooter';
import PickCard from './PickCard';
import NavigationSheet from './NavigationSheet';
import TipJarSheet from './TipJarSheet';
import HomeHeader from './home/HomeHeader';
import SavedListPanel from './home/SavedListPanel';
import { getBackupContrastReason, AREA_COORDS, driveEstimate } from '../lib/recommendation';

export default function DesktopHome({
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
  onNextRecommendation,
  mainPick,
  backupPicks,
  mapPlaces,
  allPlaces,
}) {
  return (
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
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: '18px',
            paddingTop: 'max(18px, env(safe-area-inset-top))',
            paddingBottom: 'max(18px, env(safe-area-inset-bottom))',
            background: 'linear-gradient(180deg, rgba(255,248,231,0.98), rgba(255,255,255,0.94))',
            boxShadow: '14px 0 36px rgba(34,34,34,0.08)',
          }}
        >
            <HomeHeader
              compact={false}
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

          <section style={{ marginBottom: '16px' }}>
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
                      ['Kid age', age, onSetAge, [
                        { id: 'any', label: 'Any age' },
                        { id: 'baby', label: '0-3' },
                        { id: 'little', label: '4-7' },
                        { id: 'big', label: '8+' },
                      ]],
                      ['Starting area', area, onSetArea, [
                        { id: 'any', label: 'Anywhere' },
                        { id: 'klcc', label: 'KLCC' },
                        { id: 'pj', label: 'PJ' },
                        { id: 'mont-kiara', label: 'Mont Kiara' },
                        { id: 'bangsar', label: 'Bangsar' },
                      ]],
                      ['Time today', time, onSetTime, [
                        { id: 'any', label: 'Any time' },
                        { id: 'quick', label: '1-2h' },
                        { id: 'easy', label: '2-3h' },
                        { id: 'half-day', label: 'Half day' },
                      ]],
                      ["Today's energy", energy, onSetEnergy, [
                        { id: 'any', label: 'Best answer' },
                        { id: 'indoor', label: 'Rain-safe' },
                        { id: 'outdoor', label: 'Outdoor' },
                        { id: 'budget', label: 'Budget' },
                      ]],
                    ].map(([label, value, setter, items]) => (
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

        <aside style={{
          position: 'relative',
          minWidth: 0,
        }}>
            <KiddoMap
              places={mapPlaces}
              selectedPlace={selectedPlace}
              onPinClick={(place) => onSelectPlace(place, 'map_pin')}
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

          {selectedPlace && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', damping: 24 }}
              style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                bottom: '18px',
                width: 'min(520px, 42vw)',
                zIndex: 8,
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
              }}
            >
              <PlaceDetail
                place={selectedPlace}
                isFavorite={favorites.includes(selectedPlace.id)}
                onToggleFavorite={() => onToggleFavorite(selectedPlace.id, 'detail')}
                onClose={() => onSelectPlace(null)}
                onNavigate={() => onNavigate(selectedPlace, 'detail')}
                driveText={driveEstimate(selectedPlace, area).value}
                variant="sidebar"
              />
            </motion.div>
          )}
        </aside>

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
      </div>
    </div>
  );
}
