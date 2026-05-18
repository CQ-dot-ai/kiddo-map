import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import DesktopHome from '../components/DesktopHome';
import MobileHome from '../components/MobileHome';
import { PLACES } from '../data/places';
import { trackEvent } from '../lib/analytics';
import { DEFAULT_LANGUAGE, getCopy } from '../lib/copy';
import { getSurface } from '../lib/surface';
import {
  getMapPlaces,
  getPicks,
  getRankedPlaces,
  getTodayContext,
} from '../lib/recommendation';

export default function Home() {
  const [age, setAge] = useState('any');
  const [area, setArea] = useState('any');
  const [time, setTime] = useState('any');
  const [energy, setEnergy] = useState('any');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [navPlace, setNavPlace] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showAllOnMap, setShowAllOnMap] = useState(true);
  const [showTweaks, setShowTweaks] = useState(false);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const [context, setContext] = useState({ isMorning: true, isAfternoon: false, isWeekend: false, hour: 9 });
  const [isDesktop, setIsDesktop] = useState(false);
  const favoritesLoaded = useRef(false);
  const languageLoaded = useRef(false);
  const copy = useMemo(() => getCopy(language), [language]);
  const surface = getSurface(isDesktop);

  useEffect(() => {
    setContext(getTodayContext());

    let saved = null;
    try {
      saved = localStorage.getItem('kiddo-favorites');
    } catch {
      saved = null;
    }
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        try {
          localStorage.removeItem('kiddo-favorites');
        } catch {}
      }
    }
    favoritesLoaded.current = true;

    let savedLanguage = null;
    try {
      savedLanguage = localStorage.getItem('kiddo-language');
    } catch {
      savedLanguage = null;
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    languageLoaded.current = true;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowInstallHint(true), 3000);
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 820);
    };
    window.addEventListener('resize', handleResize);
    setIsDesktop(window.innerWidth > 820);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!favoritesLoaded.current) return;
    try {
      localStorage.setItem('kiddo-favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    if (!languageLoaded.current) return;
    try {
      localStorage.setItem('kiddo-language', language);
    } catch {}
  }, [language]);

  const handleSelectPlace = (place, source = 'unknown') => {
    setSelectedPlace(place);
    if (place) {
      trackEvent('place_detail_open', {
        place_id: place.id,
        place_name: place.nameEn || place.name,
        source,
        surface,
      });
    }
  };

  const handleNavigatePlace = (place, source = 'unknown') => {
    setNavPlace(place);
    if (place) {
      trackEvent('take_me_there_click', {
        place_id: place.id,
        place_name: place.nameEn || place.name,
        source,
        surface,
      });
    }
  };

  const handleToggleFavorite = (placeId, source = 'detail') => {
    const place = PLACES.find(item => item.id === placeId);
    const isSaved = favorites.includes(placeId);
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
    if (place) {
      trackEvent('save_click', {
        action: isSaved ? 'remove' : 'save',
        place_id: place.id,
        place_name: place.nameEn || place.name,
        source,
        surface,
      });
    }
  };

  const handleSetAge = (next) => {
    if (next !== age) {
      trackEvent('filter_change', { filter: 'age', value: next, surface });
    }
    setAge(next);
  };

  const handleSetArea = (next) => {
    if (next !== area) {
      trackEvent('filter_change', { filter: 'area', value: next, surface });
    }
    setArea(next);
  };

  const handleSetTime = (next) => {
    if (next !== time) {
      trackEvent('filter_change', { filter: 'time', value: next, surface });
    }
    setTime(next);
  };

  const handleSetEnergy = (next) => {
    if (next !== energy) {
      trackEvent('filter_change', { filter: 'energy', value: next, surface });
    }
    setEnergy(next);
  };

  useEffect(() => {
    setRecommendationOffset(0);
  }, [age, area, time, energy]);

  useEffect(() => {
    if (isDesktop) setShowTweaks(true);
  }, [isDesktop]);

  const rankedPlaces = useMemo(() => {
    return getRankedPlaces(PLACES, { age, area, time, energy }, favorites, context);
  }, [age, area, time, energy, favorites, context]);

  const picks = useMemo(() => {
    return getPicks(rankedPlaces, recommendationOffset, 3);
  }, [rankedPlaces, recommendationOffset]);

  const mainPick = picks[0];
  const backupPicks = picks.slice(1, 3);
  const mapPlaces = getMapPlaces(showAllOnMap, rankedPlaces, PLACES, picks);

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <meta name="description" content={copy.pageDescription} />
      </Head>

      {isDesktop ? (
        <DesktopHome
          age={age}
          area={area}
          time={time}
          energy={energy}
          context={context}
          favorites={favorites}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          onToggleFavorite={handleToggleFavorite}
          onNavigate={handleNavigatePlace}
          navPlace={navPlace}
          onCloseNav={() => setNavPlace(null)}
          showInstallHint={showInstallHint}
          onCloseInstallHint={() => setShowInstallHint(false)}
          showSavedList={showSavedList}
          onToggleSavedList={() => setShowSavedList(prev => !prev)}
          onCloseSavedList={() => setShowSavedList(false)}
          onSetAge={handleSetAge}
          onSetArea={handleSetArea}
          onSetTime={handleSetTime}
          onSetEnergy={handleSetEnergy}
          showTweaks={showTweaks}
          onToggleTweaks={() => setShowTweaks(prev => !prev)}
          showAllOnMap={showAllOnMap}
          onToggleAllOnMap={() => setShowAllOnMap(prev => !prev)}
          onNextRecommendation={() => setRecommendationOffset(prev => prev + 1)}
          mainPick={mainPick}
          backupPicks={backupPicks}
          mapPlaces={mapPlaces}
          allPlaces={PLACES}
          language={language}
          copy={copy}
          onChangeLanguage={setLanguage}
        />
      ) : (
        <MobileHome
          age={age}
          area={area}
          time={time}
          energy={energy}
          context={context}
          favorites={favorites}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          onToggleFavorite={handleToggleFavorite}
          onNavigate={handleNavigatePlace}
          navPlace={navPlace}
          onCloseNav={() => setNavPlace(null)}
          showInstallHint={showInstallHint}
          onCloseInstallHint={() => setShowInstallHint(false)}
          showSavedList={showSavedList}
          onToggleSavedList={() => setShowSavedList(prev => !prev)}
          onCloseSavedList={() => setShowSavedList(false)}
          onSetAge={handleSetAge}
          onSetArea={handleSetArea}
          onSetTime={handleSetTime}
          onSetEnergy={handleSetEnergy}
          showTweaks={showTweaks}
          onToggleTweaks={() => setShowTweaks(prev => !prev)}
          showAllOnMap={showAllOnMap}
          onToggleAllOnMap={() => setShowAllOnMap(prev => !prev)}
          onNextRecommendation={() => setRecommendationOffset(prev => prev + 1)}
          mainPick={mainPick}
          backupPicks={backupPicks}
          mapPlaces={mapPlaces}
          allPlaces={PLACES}
          language={language}
          copy={copy}
          onChangeLanguage={setLanguage}
        />
      )}
    </>
  );
}
