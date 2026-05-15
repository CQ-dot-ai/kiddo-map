import GuideCollectionPage from '../../components/GuideCollectionPage';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().indoor;
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Indoor Places for Kids in Kuala Lumpur',
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
      name: 'What counts as an indoor place on Kiddomap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We treat a place as indoor if it is primarily sheltered, weather-safe, or practical for a rainy or hot Kuala Lumpur day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are these indoor places recommended here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They are chosen for age fit, low weather risk, and a better chance of being an easy family outing rather than a stressful one.',
      },
    },
  ],
};

export default function IndoorGuidePage() {
  return (
    <GuideCollectionPage
      title="Best Indoor Places for Kids in Kuala Lumpur"
      description="Rain-safe, air-conditioned, and easy-to-start family places in Kuala Lumpur when parents want a simpler indoor plan."
      path="/guides/best-indoor-places-kuala-lumpur"
      eyebrow="Guide"
      introTitle="Indoor places in KL that are worth the drive"
      introBody="Use this page when you want a family outing that stays sheltered, works on a hot day, and does not require a full weather strategy. Each pick is meant to be easy to scan and easy to trust."
      introNote="Open a card for the full place page, including age fit, time, drive check, and before-you-go notes."
      updateNote="Last reviewed: May 13, 2026"
      relatedLinks={[
        { href: '/guides/rainy-day-kid-activities-kuala-lumpur', label: 'Rainy day ideas', description: 'The same indoor logic, but optimized for wet weather.' },
        { href: '/guides/free-kid-friendly-places-kuala-lumpur', label: 'Free places', description: 'Indoor and outdoor options that do not need a big budget.' },
      ]}
      faqItems={[
        {
          question: 'What kind of places are included on this page?',
          answer: 'Mostly sheltered or weather-safe family places that make sense when Kuala Lumpur is hot, humid, or rainy.',
        },
        {
          question: 'How do you decide what ranks here?',
          answer: 'We look at indoor fit, age fit, time needed, parent effort, and whether the outing feels easy enough to start without overthinking.',
        },
      ]}
      structuredData={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Best Indoor Places for Kids in Kuala Lumpur',
          url: `${SITE_URL}/guides/best-indoor-places-kuala-lumpur`,
        },
        itemList,
        faq,
      ]}
      places={places}
    />
  );
}
