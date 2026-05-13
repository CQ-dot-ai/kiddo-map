import Link from 'next/link';
import ContentPage from '../../components/ContentPage';
import { getAllPlaceIds, getPlaceById, placeStructuredData } from '../../lib/place-seo';

export default function PlacePage({ place }) {
  if (!place) return null;

  return (
    <ContentPage
      title={`${place.nameEn} with Kids in Kuala Lumpur`}
      description={`${place.tagline}. Age ${place.ageMin}-${place.ageMax}, ${place.durationHours}h, ${place.costLabel}.`}
      path={`/places/${place.id}`}
      eyebrow={place.category}
      structuredData={placeStructuredData(place)}
    >
      <img
        src={place.image}
        alt={`${place.nameEn} in Kuala Lumpur`}
        style={{ width: '100%', borderRadius: '28px', aspectRatio: '16 / 9', objectFit: 'cover', boxShadow: '0 18px 40px rgba(34,34,34,0.12)' }}
      />
      <p>{place.description}</p>
      <section style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <Metric label="Age fit" value={`${place.ageMin}-${place.ageMax}`} />
        <Metric label="Time" value={`${place.durationHours}h`} />
        <Metric label="Budget" value={place.costLabel} />
        <Metric label="Google rating" value={`${place.googleRating} (${place.googleReviewCount.toLocaleString()})`} />
      </section>
      <section style={{ display: 'grid', gap: '10px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>Why families pick it</h2>
        {place.highlights.map(item => (
          <div key={item.text} style={{ padding: '16px 18px', borderRadius: '18px', background: '#fff', boxShadow: '0 8px 24px rgba(34,34,34,0.06)' }}>
            <strong>{item.emoji} {item.text}</strong>
            <div>{item.detail}</div>
          </div>
        ))}
      </section>
      <section style={{ display: 'grid', gap: '10px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>Before you go</h2>
        <p style={{ margin: 0 }}>Address: {place.address}</p>
        <p style={{ margin: 0 }}>Indoor / weather-safe: {place.indoor ? 'Indoor' : 'Outdoor'} / {place.weatherSafe ? 'Rain-safe' : 'Weather dependent'}</p>
        <p style={{ margin: 0 }}>This page is editorial. Check the venue directly before a final trip, especially for hours and ticket rules.</p>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`} style={{ color: '#ff8a65', fontWeight: 800, textDecoration: 'none' }}>
          Open in Google Maps
        </a>
      </section>
      <Link href="/" style={{ color: '#ff8a65', fontWeight: 800, textDecoration: 'none' }}>
        Open the decision tool
      </Link>
    </ContentPage>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ padding: '16px 18px', borderRadius: '18px', background: '#fff', boxShadow: '0 8px 24px rgba(34,34,34,0.06)' }}>
      <div style={{ fontSize: '12px', color: '#777', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '6px' }}>{value}</div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: getAllPlaceIds().map(id => ({ params: { slug: id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      place: getPlaceById(params.slug),
    },
  };
}
