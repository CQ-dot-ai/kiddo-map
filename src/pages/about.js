import Link from 'next/link';
import ContentPage from '../components/ContentPage';
import { SITE_URL } from '../lib/site';

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Kiddo Map',
    url: `${SITE_URL}/about`,
    description: 'Why Kiddo Map exists and how it helps Kuala Lumpur families create easier, happier weekends.',
  };

  return (
    <ContentPage
      title="About Kiddo Map"
      description="A short overview of Kiddo Map, who it is for, and how the recommendations are put together."
      path="/about"
      eyebrow="About"
      structuredData={structuredData}
    >
      <section style={{
        borderRadius: '22px',
        padding: '18px',
        background: 'rgba(255, 248, 231, 0.92)',
        border: '1px solid rgba(255, 138, 101, 0.16)',
        display: 'grid',
        gap: '10px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ff8a65' }}>
          What Kiddo Map is
        </div>
        <div style={{ fontSize: '16px', lineHeight: 1.7, fontWeight: 700, color: '#4d4d4d' }}>
          Kiddo Map helps Kuala Lumpur families create easier, happier weekends. It curates kid-friendly places and practical notes so parents can spend less time deciding and more time enjoying the day.
        </div>
        <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#8b8b8b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Last reviewed: May 13, 2026
        </div>
      </section>

      <section style={{
        display: 'grid',
        gap: '22px',
        paddingTop: '4px',
      }}>
        <AboutBlock
          title="How we work"
          body="We look at age fit, indoor or outdoor fit, time needed, parent effort, and practical notes. The result is meant to be useful at decision time, not just nice to browse."
        />
        <AboutBlock
          title="What it is not"
          body="Kiddo Map is not an official venue source. Hours, ticket rules, and on-the-ground conditions can change. Always double-check before you leave."
        />
        <AboutBlock
          title="How we improve"
          body="Recommendations come from place data, family-fit heuristics, and editorial review. If a detail is wrong or outdated, we want to hear about it."
        />
        <AboutBlock
          title="Talk to us"
          body={
            <>
              Use the contact page or the in-product feedback flow if you spot a broken detail, want to suggest a place, or want to share a better family note.{' '}
              <Link href="/contact" style={{ color: '#ff8a65', fontWeight: 900, textDecoration: 'none' }}>Contact Kiddo Map</Link>
            </>
          }
        />
      </section>
    </ContentPage>
  );
}

function AboutBlock({ title, body }) {
  return (
    <section style={{
      display: 'grid',
      gap: '10px',
      paddingTop: '18px',
      borderTop: '1px solid rgba(34,34,34,0.08)',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ff8a65' }}>
        {title}
      </div>
      <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#555', fontWeight: 700, maxWidth: '68ch' }}>
        {body}
      </div>
    </section>
  );
}
