import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import ContentPage from './ContentPage';

function MetaChip({ label, value }) {
  return (
    <div style={{
      borderRadius: '14px',
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.9)',
      border: '1px solid rgba(34,34,34,0.06)',
      minWidth: 0,
    }}>
      <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#8b8b8b', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ marginTop: '3px', fontSize: '13px', fontWeight: 800, color: 'var(--charcoal)', lineHeight: 1.25 }}>
        {value}
      </div>
    </div>
  );
}

function GuidePlaceCard({ place }) {
  const highlights = (place.highlights || []).slice(0, 2);

  return (
    <article
      style={{
        borderRadius: '22px',
        padding: '18px',
        background: 'white',
        border: `1px solid ${place.color.primary}22`,
        boxShadow: '0 10px 28px rgba(34,34,34,0.06)',
        display: 'grid',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '26px',
          boxShadow: `0 10px 22px ${place.color.primary}33`,
          flexShrink: 0,
        }}>
          {place.emoji}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '999px',
            background: place.color.light,
            color: place.color.dark,
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            marginBottom: '8px',
          }}>
            {place.tagline}
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '20px',
            lineHeight: 1.08,
            color: 'var(--charcoal)',
          }}>
            {place.nameEn || place.name}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#666', lineHeight: 1.55, fontSize: '14px', fontWeight: 700 }}>
            {place.description}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '8px',
      }}>
        <MetaChip label="Age" value={`${place.ageMin}-${place.ageMax}`} />
        <MetaChip label="Time" value={place.durationHours} />
        <MetaChip label="Cost" value={place.costLabel} />
      </div>

      <div style={{
        borderRadius: '18px',
        padding: '14px',
        background: place.color.light,
        display: 'grid',
        gap: '10px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: place.color.dark }}>
          Quick note
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {highlights.length > 0 ? highlights.map(highlight => (
            <div key={`${place.id}-${highlight.text}`} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#555', fontSize: '13px', lineHeight: 1.45, fontWeight: 700 }}>
              <span aria-hidden="true">{highlight.emoji}</span>
              <span>{highlight.detail}</span>
            </div>
          )) : (
            <div style={{ color: '#555', fontSize: '13px', lineHeight: 1.5, fontWeight: 700 }}>
              A simple place card to help parents decide faster.
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/places/${place.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '16px',
          background: 'var(--cream)',
          color: 'var(--charcoal)',
          textDecoration: 'none',
          fontWeight: 900,
          fontSize: '14px',
        }}
      >
        Open full place page
        <ArrowRight size={16} strokeWidth={3} />
      </Link>
    </article>
  );
}

function SeoPillLink({ href, label, description }) {
  return (
    <Link
      href={href}
      style={{
        display: 'grid',
        gap: '4px',
        padding: '14px 16px',
        borderRadius: '16px',
        background: 'white',
        border: '1px solid rgba(34,34,34,0.06)',
        textDecoration: 'none',
        color: 'var(--charcoal)',
        boxShadow: '0 8px 24px rgba(34,34,34,0.04)',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 900, lineHeight: 1.3 }}>{label}</div>
      {description ? (
        <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#777', fontWeight: 700 }}>{description}</div>
      ) : null}
    </Link>
  );
}

function PlaceClusterLink({ href, place }) {
  return (
    <Link
      href={href}
      style={{
        display: 'grid',
        gap: '6px',
        padding: '14px 16px',
        borderRadius: '18px',
        background: 'white',
        border: `1px solid ${place.color.primary}22`,
        boxShadow: '0 8px 24px rgba(34,34,34,0.04)',
        textDecoration: 'none',
        color: 'var(--charcoal)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          flexShrink: 0,
        }}>
          {place.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 900, lineHeight: 1.25 }}>{place.nameEn || place.name}</div>
          <div style={{ fontSize: '11px', color: place.color.dark, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: '2px' }}>
            {place.tagline}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#777', fontWeight: 700 }}>
        Age {place.ageMin}-{place.ageMax} · {place.durationHours}h · {place.costLabel}
      </div>
    </Link>
  );
}

function FaqItem({ question, answer }) {
  return (
    <section
      style={{
        borderRadius: '18px',
        padding: '16px 18px',
        background: 'white',
        border: '1px solid rgba(34,34,34,0.06)',
        boxShadow: '0 8px 24px rgba(34,34,34,0.04)',
        display: 'grid',
        gap: '8px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '16px', lineHeight: 1.35, fontWeight: 900, color: 'var(--charcoal)' }}>
        {question}
      </h3>
      <div style={{ fontSize: '14px', lineHeight: 1.65, color: '#555', fontWeight: 700 }}>
        {answer}
      </div>
    </section>
  );
}

export default function GuideCollectionPage({
  title,
  description,
  path,
  eyebrow = 'Guide',
  structuredData,
  introTitle,
  introBody,
  introNote,
  updateNote,
  relatedLinks = [],
  faqItems = [],
  places,
}) {
  const featuredPlaces = places.slice(0, 4);

  return (
    <>
      {/* This component is intentionally thin: guide pages keep the ContentPage shell,
          but their internal layout gets a wider, card-based treatment. */}
      <ContentPage
        title={title}
        description={description}
        path={path}
        eyebrow={eyebrow}
        structuredData={structuredData}
        maxWidth="1080px"
      >
        <section
          style={{
            borderRadius: '22px',
            padding: '18px',
            background: 'rgba(255, 248, 231, 0.92)',
            border: '1px solid rgba(255, 138, 101, 0.16)',
            display: 'grid',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, color: 'var(--charcoal)' }}>
            <Sparkles size={18} color="#ff8a65" />
            {introTitle}
          </div>
          <div style={{ fontSize: '15px', lineHeight: 1.65, color: '#555', fontWeight: 700 }}>
            {introBody}
          </div>
          {introNote ? (
            <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#777' }}>
              {introNote}
            </div>
          ) : null}
          {updateNote ? (
            <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#8b8b8b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {updateNote}
            </div>
          ) : null}
        </section>

        {featuredPlaces.length > 0 ? (
          <section
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b8b8b' }}>
              Key places in this guide
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {featuredPlaces.map(place => (
                <PlaceClusterLink key={place.id} href={`/places/${place.id}`} place={place} />
              ))}
            </div>
          </section>
        ) : null}

        {relatedLinks.length > 0 ? (
          <section
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b8b8b' }}>
              Related guides
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {relatedLinks.map(link => (
                <SeoPillLink key={link.href} {...link} />
              ))}
            </div>
          </section>
        ) : null}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {places.map(place => (
            <GuidePlaceCard key={place.id} place={place} />
          ))}
        </section>

        {faqItems.length > 0 ? (
          <section style={{ display: 'grid', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b8b8b' }}>
              FAQ
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {faqItems.map(item => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>
        ) : null}
      </ContentPage>
    </>
  );
}
