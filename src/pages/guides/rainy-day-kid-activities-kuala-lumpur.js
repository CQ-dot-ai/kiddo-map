import Link from 'next/link';
import ContentPage from '../../components/ContentPage';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().rainyDay;

export default function RainyDayGuidePage() {
  return (
    <ContentPage
      title="Rainy Day Kid Activities in Kuala Lumpur"
      description="Quick indoor and low-friction family picks for rainy Kuala Lumpur days."
      path="/guides/rainy-day-kid-activities-kuala-lumpur"
      eyebrow="Guide"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Rainy Day Kid Activities in Kuala Lumpur',
        url: `${SITE_URL}/guides/rainy-day-kid-activities-kuala-lumpur`,
      }}
    >
      <p>Rain is one of the biggest decision blockers for KL parents. These places are safer when the sky is unstable and you still want a real outing.</p>
      {places.map(place => (
        <section key={place.id} style={{ display: 'grid', gap: '8px', padding: '18px', borderRadius: '22px', background: '#fff', boxShadow: '0 10px 30px rgba(34,34,34,0.06)' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>{place.nameEn}</h2>
          <p style={{ margin: 0 }}>{place.tagline}</p>
          <p style={{ margin: 0 }}>{place.highlights[0]?.detail}</p>
          <Link href={`/places/${place.id}`} style={{ color: '#ff8a65', fontWeight: 800, textDecoration: 'none' }}>
            View place page
          </Link>
        </section>
      ))}
    </ContentPage>
  );
}
