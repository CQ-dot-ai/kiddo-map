import { SITE_URL } from '../lib/site';

export async function getServerSideProps({ res }) {
  const body = `User-Agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Robots() {
  return null;
}
