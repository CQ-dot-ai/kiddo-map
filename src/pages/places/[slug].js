import Link from 'next/link';
import ContentPage from '../../components/ContentPage';
import {
  getAllPlaceIds,
  getPlaceById,
  getPlaceSeoDescription,
  getPlaceSeoTitle,
  getRelatedGuidesForPlace,
  getRelatedPlaces,
  placeStructuredData,
} from '../../lib/place-seo';

export default function PlacePage({ place }) {
  if (!place) return null;
  const relatedGuides = getRelatedGuidesForPlace(place);
  const relatedPlaces = getRelatedPlaces(place);

  return (
    <ContentPage
      title={getPlaceSeoTitle(place)}
      description={getPlaceSeoDescription(place)}
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '52px',
            padding: '12px 18px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #43A047, #2E7D32)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 900,
            boxShadow: '0 10px 24px rgba(67,160,71,0.28)',
          }}
        >
          Take me there
        </a>
        <Link href="/" style={{ color: '#ff8a65', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          Open the decision tool
        </Link>
      </div>
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
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '52px',
            padding: '12px 18px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #43A047, #2E7D32)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 900,
            boxShadow: '0 10px 24px rgba(67,160,71,0.28)',
            width: 'fit-content',
          }}
        >
          Take me there
        </a>
      </section>

      {relatedGuides.length > 0 ? (
        <section style={{ display: 'grid', gap: '10px' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>Related guides</h2>
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {relatedGuides.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'grid',
                  gap: '4px',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  background: '#fff',
                  boxShadow: '0 8px 24px rgba(34,34,34,0.06)',
                  color: 'var(--charcoal)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '14px' }}>{link.label}</div>
                <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#777', fontWeight: 700 }}>{link.description}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedPlaces.length > 0 ? (
        <section style={{ display: 'grid', gap: '10px' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif' }}>More places nearby</h2>
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {relatedPlaces.map(item => (
              <Link
                key={item.id}
                href={`/places/${item.id}`}
                style={{
                  display: 'grid',
                  gap: '4px',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  background: '#fff',
                  boxShadow: '0 8px 24px rgba(34,34,34,0.06)',
                  color: 'var(--charcoal)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '14px' }}>{item.nameEn || item.name}</div>
                <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#777', fontWeight: 700 }}>
                  {item.tagline} · {item.costLabel} · {item.durationHours}h
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
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
