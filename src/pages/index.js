import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import DesktopHome from '../components/DesktopHome';
import MobileHome from '../components/MobileHome';
import { PLACES } from '../data/places';
import { trackEvent } from '../lib/analytics';
import {
  getMapPlaces,
  getPicks,
  getRankedPlaces,
  getTodayContext,
} from '../lib/recommendation';

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

const ENERGY_FILTERS = [
  { id: 'any', label: 'Best answer' },
  { id: 'indoor', label: 'Rain-safe' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'budget', label: 'Budget' },
];

export default function Home() {
  const [age, setAge] = useState('any');
  const [area, setArea] = useState('any');
  const [time, setTime] = useState('any');
  const [energy, setEnergy] = useState('any');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [navPlace, setNavPlace] = useState(null);
  const [showTipJar, setShowTipJar] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showAllOnMap, setShowAllOnMap] = useState(true);
  const [showTweaks, setShowTweaks] = useState(false);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const [context, setContext] = useState({ isMorning: true, isAfternoon: false, isWeekend: false, hour: 9 });
  const [isDesktop, setIsDesktop] = useState(false);
  const favoritesLoaded = useRef(false);

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

  const handleSelectPlace = (place, source = 'unknown') => {
    setSelectedPlace(place);
    if (place) {
      trackEvent('place_detail_open', {
        place_id: place.id,
        place_name: place.nameEn || place.name,
        source,
        surface: isDesktop ? 'desktop' : 'mobile',
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
        surface: isDesktop ? 'desktop' : 'mobile',
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
        surface: isDesktop ? 'desktop' : 'mobile',
      });
    }
  };

  const handleShowTipJar = (source = 'header') => {
    setShowTipJar(true);
    trackEvent('support_click', {
      source,
      surface: isDesktop ? 'desktop' : 'mobile',
    });
  };

  const handleSetAge = (next) => {
    if (next !== age) {
      trackEvent('filter_change', { filter: 'age', value: next, surface: isDesktop ? 'desktop' : 'mobile' });
    }
    setAge(next);
  };

  const handleSetArea = (next) => {
    if (next !== area) {
      trackEvent('filter_change', { filter: 'area', value: next, surface: isDesktop ? 'desktop' : 'mobile' });
    }
    setArea(next);
  };

  const handleSetTime = (next) => {
    if (next !== time) {
      trackEvent('filter_change', { filter: 'time', value: next, surface: isDesktop ? 'desktop' : 'mobile' });
    }
    setTime(next);
  };

  const handleSetEnergy = (next) => {
    if (next !== energy) {
      trackEvent('filter_change', { filter: 'energy', value: next, surface: isDesktop ? 'desktop' : 'mobile' });
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
        <title>Kiddomap · Decide in 3 minutes</title>
        <meta name="description" content="Pick a kid-friendly Kuala Lumpur place in 3 minutes." />
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
          showTipJar={showTipJar}
          onShowTipJar={() => handleShowTipJar('header')}
          onCloseTipJar={() => setShowTipJar(false)}
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
          showTipJar={showTipJar}
          onShowTipJar={() => handleShowTipJar('header')}
          onCloseTipJar={() => setShowTipJar(false)}
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
        />
      )}
    </>
  );
}
