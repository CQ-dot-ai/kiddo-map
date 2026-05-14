import GuideCollectionPage from '../../components/GuideCollectionPage';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().rainyDay;
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Rainy Day Kid Activities in Kuala Lumpur',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: places.length,
  itemListElement: places.map((place, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/places/${place.id}`,
    name: place.nameEn || place.name,
  })),
};

const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should I do with kids in Kuala Lumpur when it rains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with weather-safe indoor options that still feel like a real outing, such as aquariums, museums, indoor play spaces, or mall-based family stops.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you choose rainy day activities here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We prioritize shelter, age fit, low friction, and whether the outing is still worth leaving the house for when the weather turns unstable.',
      },
    },
  ],
};

export default function RainyDayGuidePage() {
  return (
    <GuideCollectionPage
      title="Rainy Day Kid Activities in Kuala Lumpur"
      description="Weather-safe indoor and low-friction family picks for rainy Kuala Lumpur days."
      path="/guides/rainy-day-kid-activities-kuala-lumpur"
      eyebrow="Guide"
      introTitle="Rainy-day ideas that still feel like a proper family plan"
      introBody="This page is for the days when the rain makes every outing feel more expensive in time and attention. The list leans weather-safe, indoor, and low-friction so you can make a faster call."
      introNote="Each card highlights the part that matters most on a rainy day: shelter, age fit, and whether the outing still feels worth it."
      updateNote="Last reviewed: May 13, 2026"
      relatedLinks={[
        { href: '/guides/best-indoor-places-kuala-lumpur', label: 'Indoor places in KL', description: 'A broader indoor list for hot or rainy days.' },
        { href: '/guides/free-kid-friendly-places-kuala-lumpur', label: 'Free places', description: 'Budget-friendly outings that still work when the weather is bad.' },
      ]}
      faqItems={[
        {
          question: 'Why is this page useful on a rainy day?',
          answer: 'It narrows the choice set to places that are more likely to stay comfortable, weather-safe, and simple enough to start quickly.',
        },
        {
          question: 'Does rainy-day-friendly mean free or cheap?',
          answer: 'Not necessarily. It means the outing is less likely to be ruined by rain, even if a ticket or small fee is still involved.',
        },
      ]}
      structuredData={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Rainy Day Kid Activities in Kuala Lumpur',
          url: `${SITE_URL}/guides/rainy-day-kid-activities-kuala-lumpur`,
        },
        itemList,
        faq,
      ]}
      places={places}
    />
  );
}
