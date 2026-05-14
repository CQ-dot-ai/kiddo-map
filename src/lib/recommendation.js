import { PLACES } from '../data/places';

const AREA_COORDS = {
  klcc: { label: 'KLCC', coordinates: [101.7139, 3.1579] },
  pj: { label: 'PJ', coordinates: [101.6068, 3.1073] },
  'mont-kiara': { label: 'Mont Kiara', coordinates: [101.6523, 3.1696] },
  bangsar: { label: 'Bangsar', coordinates: [101.6715, 3.1296] },
};

function maxDurationHours(duration) {
  const matches = String(duration).match(/\d+/g);
  if (!matches) return 99;
  return Math.max(...matches.map(Number));
}

function areaMatches(place, area) {
  if (area === 'any') return true;
  const haystack = `${place.area} ${place.address} ${place.name}`.toLowerCase();
  if (area === 'pj') return /petaling|pj|damansara|sunway|curve|subang/.test(haystack);
  if (area === 'mont-kiara') return /mont kiara|publika|desa park|ttdi|bukit kiara|dutamas/.test(haystack);
  if (area === 'bangsar') return /bangsar|bukit damansara|mid valley|tasik perdana/.test(haystack);
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

function getBackupContrastReason(mainPick, backup) {
  if (backup.cost === 0 && mainPick.cost > 0)
    return { icon: '🆓', text: 'Free entry', label: 'No ticket needed' };
  if (backup.cost < mainPick.cost && mainPick.cost - backup.cost >= 20)
    return { icon: '💰', text: 'Budget pick', label: 'Easier on the wallet' };
  if (backup.indoor && !mainPick.indoor)
    return { icon: '☔', text: 'Rain-safe', label: 'Covered whatever the weather' };
  if (!backup.indoor && mainPick.indoor)
    return { icon: '🌿', text: 'Outdoor pick', label: 'Fresh air and open space' };
  if (parentEnergy(backup).label === 'Easy mode' && parentEnergy(mainPick).label !== 'Easy mode')
    return { icon: '😌', text: 'Less effort', label: 'Easier on everyone' };
  if (maxDurationHours(backup.durationHours) < maxDurationHours(mainPick.durationHours))
    return { icon: '⚡', text: 'Quicker trip', label: 'Fits a shorter window' };
  if (maxDurationHours(backup.durationHours) > maxDurationHours(mainPick.durationHours))
    return { icon: '🕐', text: 'Stay longer', label: 'More to explore' };
  return { icon: '📍', text: 'Another pick', label: 'Different vibe' };
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

export {
  AREA_COORDS,
  ageMatches,
  areaMatches,
  decisionScore,
  distanceKm,
  driveEstimate,
  frictionNote,
  getBackupContrastReason,
  maxDurationHours,
  parentEnergy,
  timeMatches,
  todayReasons,
  weatherNote,
};

export function getTodayContext(date = new Date()) {
  const hour = date.getHours();
  const day = date.getDay();
  return {
    hour,
    isMorning: hour < 12,
    isAfternoon: hour >= 12 && hour < 18,
    isWeekend: day === 0 || day === 6,
  };
}

export function getRankedPlaces(places, filters, favorites = [], context = getTodayContext()) {
  const { age, area, time, energy } = filters;
  const filteredPlaces = places.filter(place => {
    if (!ageMatches(place, age)) return false;
    if (!timeMatches(place, time)) return false;
    if (energy === 'indoor' && !place.indoor) return false;
    if (energy === 'outdoor' && place.indoor) return false;
    if (energy === 'budget' && place.cost > 50) return false;
    if (energy === 'favorites' && !favorites.includes(place.id)) return false;
    return true;
  });

  const candidates = filteredPlaces.length ? filteredPlaces : places;
  return [...candidates].sort(
    (a, b) => decisionScore(b, age, area, time, energy, favorites, context) - decisionScore(a, age, area, time, energy, favorites, context)
  );
}

export function getPicks(rankedPlaces, recommendationOffset = 0, limit = 3) {
  const safeOffset = rankedPlaces.length ? recommendationOffset % rankedPlaces.length : 0;
  return [...rankedPlaces.slice(safeOffset), ...rankedPlaces.slice(0, safeOffset)].slice(0, limit);
}

export function getMapPlaces(showAllOnMap, filteredPlaces, places, picks) {
  return showAllOnMap ? (filteredPlaces.length ? filteredPlaces : places) : picks;
}

