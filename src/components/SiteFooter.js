import Link from 'next/link';
import { getCopy } from '../lib/copy';

export default function SiteFooter({ compact = false, copy = getCopy() }) {
  const groups = [
    {
      title: copy.footer.explore,
      links: [
        { href: '/guides/best-indoor-places-kuala-lumpur', label: copy.footer.links.indoor },
        { href: '/guides/rainy-day-kid-activities-kuala-lumpur', label: copy.footer.links.rainy },
        { href: '/guides/free-kid-friendly-places-kuala-lumpur', label: copy.footer.links.free },
      ],
    },
    {
      title: copy.footer.about,
      links: [
        { href: '/about', label: copy.footer.links.about },
        { href: '/contact', label: copy.footer.links.contact },
        { href: '/privacy', label: copy.footer.links.privacy },
        { href: '/terms', label: copy.footer.links.terms },
      ],
    },
  ];
  return (
    <footer
      style={{
        marginTop: compact ? '18px' : '32px',
        paddingTop: compact ? '14px' : '24px',
        borderTop: '1px solid rgba(34,34,34,0.08)',
        color: '#666',
        display: 'grid',
        gap: compact ? '14px' : '18px',
      }}
    >
      <div style={{ fontSize: compact ? '12px' : '13px', lineHeight: 1.5 }}>
        {copy.footer.summary}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : 'repeat(2, minmax(0, 1fr))',
          gap: '16px',
        }}
      >
        {groups.map(group => (
          <div key={group.title} style={{ display: 'grid', gap: '8px' }}>
            <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {group.title}
            </div>
            {group.links.map(link => (
              <Link key={link.href} href={link.href} style={{ color: 'inherit', textDecoration: 'none', fontSize: compact ? '13px' : '14px' }}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
