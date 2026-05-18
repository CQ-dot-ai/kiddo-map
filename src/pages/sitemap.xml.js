import { getCoreSeoPlaceIds } from '../lib/place-seo';
import { SITE_URL } from '../lib/site';

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/guides/best-indoor-places-kuala-lumpur',
  '/guides/rainy-day-kid-activities-kuala-lumpur',
  '/guides/free-kid-friendly-places-kuala-lumpur',
];

export async function getServerSideProps({ res }) {
  const urls = [
    ...staticRoutes,
    ...getCoreSeoPlaceIds().map(id => `/places/${id}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `<url>
  <loc>${SITE_URL}${url}</loc>
  <changefreq>${url.startsWith('/places/') ? 'weekly' : 'monthly'}</changefreq>
  <priority>${url === '/' ? '1.0' : url.startsWith('/guides/') ? '0.9' : url.startsWith('/places/') ? '0.8' : '0.6'}</priority>
</url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
