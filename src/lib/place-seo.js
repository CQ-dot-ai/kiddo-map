import { PLACES } from '../data/places';

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
