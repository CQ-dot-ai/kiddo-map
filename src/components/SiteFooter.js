import Link from 'next/link';

const groups = [
  {
    title: 'Explore',
    links: [
      { href: '/guides/best-indoor-places-kuala-lumpur', label: 'Indoor places in KL' },
      { href: '/guides/rainy-day-kid-activities-kuala-lumpur', label: 'Rainy day ideas' },
      { href: '/guides/free-kid-friendly-places-kuala-lumpur', label: 'Free places' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Use' },
    ],
  },
];

export default function SiteFooter({ compact = false }) {
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
        Kiddomap helps Kuala Lumpur families create easier, happier weekends. We curate kid-friendly places and practical notes so parents can spend less time deciding and more time enjoying the day.
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
