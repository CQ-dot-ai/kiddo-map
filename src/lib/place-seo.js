import { PLACES } from '../data/places';

function normalizeLabel(value) {
  return String(value || '')
    .replace(/[·|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getPlaceById(id) {
  return PLACES.find(place => place.id === id) || null;
}

export function getAllPlaceIds() {
  return PLACES.map(place => place.id);
}

export function getTopSeoPlaces(limit = 5) {
  return [...PLACES]
    .sort((a, b) => (b.googleReviewCount || 0) - (a.googleReviewCount || 0))
    .slice(0, limit);
}

export function getGuideCollections() {
  const byReview = [...PLACES].sort((a, b) => (b.googleReviewCount || 0) - (a.googleReviewCount || 0));

  return {
    indoor: byReview.filter(place => place.indoor).slice(0, 6),
    rainyDay: byReview.filter(place => place.weatherSafe).slice(0, 6),
    free: byReview.filter(place => place.cost === 0).slice(0, 6),
  };
}

export function getRelatedPlaces(place, limit = 4) {
  if (!place) return [];

  const sameArea = [...PLACES]
    .filter(item => item.id !== place.id && item.area && item.area === place.area)
    .sort((a, b) => (b.googleReviewCount || 0) - (a.googleReviewCount || 0));

  const sameCategory = [...PLACES]
    .filter(item => item.id !== place.id && item.category === place.category)
    .sort((a, b) => (b.googleReviewCount || 0) - (a.googleReviewCount || 0));

  const combined = [...sameArea, ...sameCategory].filter((item, index, arr) => arr.findIndex(candidate => candidate.id === item.id) === index);

  return combined.slice(0, limit);
}

export function getRelatedGuidesForPlace(place) {
  if (!place) return [];

  const guides = [];

  if (place.indoor) {
    guides.push({
      href: '/guides/best-indoor-places-kuala-lumpur',
      label: 'Indoor places in KL',
      description: 'More sheltered options for hot or rainy days.',
    });
  }

  if (place.weatherSafe) {
    guides.push({
      href: '/guides/rainy-day-kid-activities-kuala-lumpur',
      label: 'Rainy day ideas',
      description: 'Weather-safe backups that still feel worth leaving home for.',
    });
  }

  if (place.cost === 0) {
    guides.push({
      href: '/guides/free-kid-friendly-places-kuala-lumpur',
      label: 'Free places',
      description: 'Lower-budget family outings with a clearer cost note.',
    });
  }

  return guides;
}

export function placeStructuredData(place) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.nameEn || place.name,
    description: place.description,
    url: `https://www.kiddomap.ai/places/${place.id}`,
    image: place.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressLocality: 'Kuala Lumpur',
      addressCountry: 'MY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.coordinates[1],
      longitude: place.coordinates[0],
    },
    aggregateRating: place.googleRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: place.googleRating,
          reviewCount: place.googleReviewCount,
        }
      : undefined,
    isAccessibleForFree: place.cost === 0,
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: place.ageMin,
      suggestedMaxAge: place.ageMax,
    },
    touristType: 'Families with kids',
  };
}

export function getPlaceSeoTitle(place) {
  const name = place.nameEn || place.name;
  return `${name} in Kuala Lumpur: Tickets, Hours & Kid-Friendly Tips`;
}

export function getPlaceSeoDescription(place) {
  const name = place.nameEn || place.name;
  const category = normalizeLabel(place.category || 'family place');
  const area = normalizeLabel(place.area || 'Kuala Lumpur');
  const tagline = normalizeLabel(place.tagline);
  const duration = normalizeLabel(place.durationHours);
  const hours = normalizeLabel(place.openingHoursNote);
  const ticket = normalizeLabel(place.ticketNote);
  const lines = [
    `${name} is a kid-friendly ${category.toLowerCase()} in ${area}.`,
    tagline ? `${tagline}.` : null,
    `Age ${place.ageMin}-${place.ageMax}, ${duration}h, ${place.costLabel}.`,
    hours ? `Hours: ${hours}.` : null,
    ticket ? `Ticket note: ${ticket}` : null,
  ].filter(Boolean);

  return lines.join(' ');
}
