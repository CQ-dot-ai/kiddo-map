import Head from 'next/head';
import { SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from '../lib/site';

export default function SiteHead({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  image = '/logo.png',
  type = 'website',
  structuredData = [],
}) {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image);
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const data = Array.isArray(structuredData) ? structuredData : [structuredData];

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {data.filter(Boolean).map((item, index) => (
        <script
          key={`${canonical}-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
}
