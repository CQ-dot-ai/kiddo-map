import Link from 'next/link';
import SiteHead from './SiteHead';
import SiteFooter from './SiteFooter';

export default function ContentPage({
  title,
  description,
  path,
  eyebrow,
  structuredData,
  children,
}) {
  return (
    <>
      <SiteHead title={title} description={description} path={path} structuredData={structuredData} />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #fffaf2 0%, #ffffff 100%)',
          color: '#2b2b2b',
        }}
      >
        <main
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '32px 20px 48px',
            display: 'grid',
            gap: '20px',
          }}
        >
          <Link href="/" style={{ color: '#666', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            ← Back to Kiddo Map
          </Link>
          {eyebrow ? (
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ff8a65' }}>
              {eyebrow}
            </div>
          ) : null}
          <header style={{ display: 'grid', gap: '10px' }}>
            <h1 style={{ margin: 0, fontFamily: 'Fredoka, sans-serif', fontSize: 'clamp(32px, 6vw, 48px)', lineHeight: 1.02 }}>
              {title}
            </h1>
            <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.6, color: '#555' }}>{description}</p>
          </header>
          <div style={{ display: 'grid', gap: '18px', fontSize: '16px', lineHeight: 1.7 }}>
            {children}
          </div>
          <SiteFooter />
        </main>
      </div>
    </>
  );
}
