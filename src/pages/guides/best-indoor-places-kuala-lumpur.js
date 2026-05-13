import Link from 'next/link';
import ContentPage from '../../components/ContentPage';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().indoor;

export default function IndoorGuidePage() {
  return (
    <ContentPage
      title="Best Indoor Places for Kids in Kuala Lumpur"
      description="Rain-safe kid-friendly places in Kuala Lumpur when parents need an easier indoor plan."
      path="/guides/best-indoor-places-kuala-lumpur"
      eyebrow="Guide"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Best Indoor Places for Kids in Kuala Lumpur',
        url: `${SITE_URL}/guides/best-indoor-places-kuala-lumpur`,
      }}
    >
      <p>Indoor picks work best when Kuala Lumpur turns hot, rainy, or simply too uncertain for a relaxed family outing.</p>
      {places.map(place => (
        <section key={place.id} style={{ display: 'grid', gap: '8px', padding: '18px', borderRadius: '22px', background: '#fff', boxShadow: '0 10px 30px rgba(34,34,34,0.06)' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>{place.nameEn}</h2>
          <p style={{ margin: 0 }}>{place.description}</p>
          <p style={{ margin: 0, color: '#555' }}>
            Best for age {place.ageMin}-{place.ageMax} · {place.durationHours}h · {place.costLabel}
          </p>
          <Link href={`/places/${place.id}`} style={{ color: '#ff8a65', fontWeight: 800, textDecoration: 'none' }}>
            View place page
          </Link>
        </section>
      ))}
    </ContentPage>
  );
}
