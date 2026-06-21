import Link from 'next/link';
import { useEffect } from 'react';
import SiteHead from './SiteHead';
import SiteFooter from './SiteFooter';
import { getCopy } from '../lib/copy';

export default function ContentPage({
  title,
  description,
  path,
  eyebrow,
  structuredData,
  children,
  maxWidth = '860px',
  copy = getCopy(),
  backLabel = '返回 Kiddomap',
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const html = document.documentElement;
    const body = document.body;
    const nextRoot = document.getElementById('__next');

    const prev = {
      htmlOverflow: html.style.overflow,
      htmlOverflowY: html.style.overflowY,
      htmlOverscrollBehaviorY: html.style.overscrollBehaviorY,
      htmlTouchAction: html.style.touchAction,
      bodyOverflow: body.style.overflow,
      bodyOverflowX: body.style.overflowX,
      bodyOverflowY: body.style.overflowY,
      bodyOverscrollBehaviorY: body.style.overscrollBehaviorY,
      bodyTouchAction: body.style.touchAction,
      bodyWebkitOverflowScrolling: body.style.WebkitOverflowScrolling,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
      nextOverflow: nextRoot ? nextRoot.style.overflow : '',
      nextOverflowY: nextRoot ? nextRoot.style.overflowY : '',
      nextOverscrollBehaviorY: nextRoot ? nextRoot.style.overscrollBehaviorY : '',
      nextTouchAction: nextRoot ? nextRoot.style.touchAction : '',
      nextWebkitOverflowScrolling: nextRoot ? nextRoot.style.WebkitOverflowScrolling : '',
      nextHeight: nextRoot ? nextRoot.style.height : '',
      nextMinHeight: nextRoot ? nextRoot.style.minHeight : '',
    };

    html.style.overflow = 'auto';
    html.style.overflowY = 'auto';
    html.style.overscrollBehaviorY = 'auto';
    html.style.touchAction = 'pan-y';

    body.style.overflow = 'auto';
    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
    body.style.overscrollBehaviorY = 'auto';
    body.style.touchAction = 'pan-y';
    body.style.WebkitOverflowScrolling = 'touch';
    body.style.height = 'auto';
    body.style.minHeight = '100dvh';

    if (nextRoot) {
      nextRoot.style.overflow = 'visible';
      nextRoot.style.overflowY = 'visible';
      nextRoot.style.overscrollBehaviorY = 'auto';
      nextRoot.style.touchAction = 'pan-y';
      nextRoot.style.WebkitOverflowScrolling = 'touch';
      nextRoot.style.height = 'auto';
      nextRoot.style.minHeight = '100dvh';
    }

    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.overflowY = prev.htmlOverflowY;
      html.style.overscrollBehaviorY = prev.htmlOverscrollBehaviorY;
      html.style.touchAction = prev.htmlTouchAction;

      body.style.overflow = prev.bodyOverflow;
      body.style.overflowX = prev.bodyOverflowX;
      body.style.overflowY = prev.bodyOverflowY;
      body.style.overscrollBehaviorY = prev.bodyOverscrollBehaviorY;
      body.style.touchAction = prev.bodyTouchAction;
      body.style.WebkitOverflowScrolling = prev.bodyWebkitOverflowScrolling;
      body.style.height = prev.bodyHeight;
      body.style.minHeight = prev.bodyMinHeight;

      if (nextRoot) {
        nextRoot.style.overflow = prev.nextOverflow;
        nextRoot.style.overflowY = prev.nextOverflowY;
        nextRoot.style.overscrollBehaviorY = prev.nextOverscrollBehaviorY;
        nextRoot.style.touchAction = prev.nextTouchAction;
        nextRoot.style.WebkitOverflowScrolling = prev.nextWebkitOverflowScrolling;
        nextRoot.style.height = prev.nextHeight;
        nextRoot.style.minHeight = prev.nextMinHeight;
      }
    };
  }, []);

  return (
    <>
      <SiteHead title={title} description={description} path={path} structuredData={structuredData} />
      <div
        style={{
          minHeight: '100dvh',
          overflowY: 'auto',
          overscrollBehaviorY: 'auto',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(180deg, #fffaf2 0%, #ffffff 100%)',
          color: '#2b2b2b',
        }}
      >
        <main
          style={{
            maxWidth,
            margin: '0 auto',
            padding: '32px 20px 48px',
            display: 'grid',
            gap: '20px',
          }}
        >
          <Link href="/" style={{ color: '#666', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            ← {backLabel}
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
          <SiteFooter copy={copy} />
        </main>
      </div>
    </>
  );
}
