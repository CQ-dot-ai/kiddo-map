import Link from 'next/link';
import ContentPage from '../../components/ContentPage';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().free;

export default function FreeGuidePage() {
  return (
    <ContentPage
      title="Free Kid-Friendly Places in Kuala Lumpur"
      description="Low-budget Kuala Lumpur ideas for parents who want easier family outings without paying for every stop."
      path="/guides/free-kid-friendly-places-kuala-lumpur"
      eyebrow="Guide"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Free Kid-Friendly Places in Kuala Lumpur',
        url: `${SITE_URL}/guides/free-kid-friendly-places-kuala-lumpur`,
      }}
    >
      <p>Budget matters, especially when you just want one solid family plan without turning it into a high-cost day.</p>
      {places.map(place => (
        <section key={place.id} style={{ display: 'grid', gap: '8px', padding: '18px', borderRadius: '22px', background: '#fff', boxShadow: '0 10px 30px rgba(34,34,34,0.06)' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>{place.nameEn}</h2>
          <p style={{ margin: 0 }}>{place.description}</p>
          <p style={{ margin: 0, color: '#555' }}>{place.costLabel} · {place.durationHours}h · Age {place.ageMin}-{place.ageMax}</p>
          <Link href={`/places/${place.id}`} style={{ color: '#ff8a65', fontWeight: 800, textDecoration: 'none' }}>
            View place page
          </Link>
        </section>
      ))}
    </ContentPage>
  );
}
