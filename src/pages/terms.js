import ContentPage from '../components/ContentPage';
import { SITE_URL } from '../lib/site';

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="Basic terms for using Kiddo Map, including recommendation limitations and external links."
      path="/terms"
      eyebrow="Legal"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Terms of Use',
        url: `${SITE_URL}/terms`,
      }}
    >
      <p>Kiddo Map is an informational product designed to help families make faster outing decisions. By using the site, you agree to use the information at your own discretion.</p>
      <h2>No guarantee of venue status</h2>
      <p>Ticket prices, opening hours, queue conditions, and venue operations can change. Always check the official site or venue directly before making a final trip decision.</p>
      <h2>Recommendations are editorial</h2>
      <p>Recommendations are based on curated data and product logic. They are not guarantees that a place will fit every child, every family, or every day.</p>
      <h2>External services</h2>
      <p>Kiddo Map may link to maps apps, ticketing platforms, official venue sites, and other third-party services. Those services operate under their own terms.</p>
      <h2>Availability</h2>
      <p>The site may change, pause, or remove features at any time while the product is still evolving.</p>
      <p>Last updated: May 13, 2026.</p>
    </ContentPage>
  );
}
