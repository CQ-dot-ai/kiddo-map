import GuideCollectionPage from '../../components/GuideCollectionPage';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().free;
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Kid-Friendly Places in Kuala Lumpur',
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
      name: 'What does free mean on Kiddo Map?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It means the place does not require a clear admission fee for the core visit, although parking, food, or optional extras may still cost money.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why include hidden costs on free places?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A place can be free to enter but still expensive to use once parking, snacks, transport, or add-ons are included. We surface that risk so parents do not get surprised.',
      },
    },
  ],
};

export default function FreeGuidePage() {
  return (
    <GuideCollectionPage
      title="Free Kid-Friendly Places in Kuala Lumpur"
      description="Free and low-budget kid-friendly places in Kuala Lumpur, with a note on the hidden costs parents should expect."
      path="/guides/free-kid-friendly-places-kuala-lumpur"
      eyebrow="Guide"
      introTitle="Free places, but not blindly free"
      introBody="This list is for parents who want a lower-budget outing without wasting time on places that sound free but end up costing more than expected."
      introNote="Open a card to see what the place is good for, how long it usually takes, and whether there are likely hidden costs such as parking, food, or add-ons."
      updateNote="Last reviewed: May 13, 2026"
      relatedLinks={[
        { href: '/guides/rainy-day-kid-activities-kuala-lumpur', label: 'Rainy day ideas', description: 'Weather-safe outings that still feel worth it.' },
        { href: '/guides/best-indoor-places-kuala-lumpur', label: 'Indoor places in KL', description: 'Easy sheltered options for hot or rainy days.' },
      ]}
      faqItems={[
        {
          question: 'Is everything on this page truly free?',
          answer: 'The core entry or main visit is free, but some places may still involve parking, transport, food, or optional purchases.',
        },
        {
          question: 'Why should parents care about hidden costs?',
          answer: 'Because a “free” outing can still become a meaningful expense if the family needs to pay for parking, meals, or extras along the way.',
        },
      ]}
      structuredData={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Free Kid-Friendly Places in Kuala Lumpur',
          url: `${SITE_URL}/guides/free-kid-friendly-places-kuala-lumpur`,
        },
        itemList,
        faq,
      ]}
      places={places}
    />
  );
}
