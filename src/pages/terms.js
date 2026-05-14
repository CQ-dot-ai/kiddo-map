import ContentPage from '../components/ContentPage';
import { SITE_URL } from '../lib/site';

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="The terms that apply when you access or use Kiddo Map."
      path="/terms"
      eyebrow="Legal"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Terms of Use',
        url: `${SITE_URL}/terms`,
      }}
      >
      <section style={{ display: 'grid', gap: '8px' }}>
        <p style={{ margin: 0, lineHeight: 1.62 }}>These Terms of Use govern your access to and use of Kiddo Map. By accessing or using the site, you confirm that you have read, understood, and agree to be bound by these terms.</p>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.4, color: '#777', fontWeight: 700 }}>
          Effective date: May 13, 2026 · Last updated: May 13, 2026
        </p>
      </section>
      <Block title="Who runs the site" body="Kiddo Map is currently operated by an individual creator rather than a registered company. References in these terms to “Kiddo Map,” “we,” “us,” or “our” refer to that individual operator unless the site is later transferred to a different legal entity." />
      <Block title="Who may use the site" body="The site is intended for adults, parents, guardians, and other persons who are legally able to enter into online agreements in their jurisdiction." />
      <Block title="Editorial nature of the content" body="Kiddo Map provides curated informational content only. Recommendations are editorial in nature and are not guarantees of suitability, safety, availability, or fitness for any particular child, family, or circumstance." />
      <Block title="No guarantee of venue status" body="Venue details, including opening hours, ticket prices, queue conditions, parking, closures, and operating status, may change without notice. You are solely responsible for confirming current venue information before travelling or purchasing tickets." />
      <Block title="Use at your own judgment" body="You are responsible for your own decisions, including whether to travel, whether to buy tickets, and whether to rely on any venue detail displayed on the site. Kiddo Map does not provide medical, safety, legal, childcare, or parenting advice." />
      <Block title="External services" body="Kiddo Map may link to Google Maps, Waze, Grab, ticketing platforms, venue websites, and other third-party services. Those services are governed by their own terms, privacy policies, and operational rules. We do not control and are not responsible for their content, availability, or conduct." />
      <Block title="Intellectual property" body="Unless otherwise noted, the site design, text, branding, layout, and compiled content are owned by Kiddo Map. No part of the site may be copied, reproduced, republished, or redistributed in bulk without prior permission." />
      <Block title="Acceptable use" body="You must not misuse the site, interfere with its operation, attempt to bypass its controls, use automation in a manner that harms the service, or scrape content in a way that causes operational burden or commercial harm." />
      <Block title="No warranty" body="The site is provided on an “as is” and “as available” basis. We make no warranty that the site will be uninterrupted, timely, secure, error-free, or that any venue detail will remain accurate between updates." />
      <Block title="Limitation of liability" body="To the maximum extent permitted by applicable law, Kiddo Map and its operator will not be liable for any indirect, incidental, special, consequential, exemplary, or lost-profit damages, or for losses arising from reliance on venue data, third-party services, or service interruptions." />
      <Block title="Indemnity" body="To the extent permitted by law, you agree to indemnify and hold harmless Kiddo Map and its operator from claims, liabilities, damages, losses, and expenses arising out of your misuse of the site, your breach of these terms, or your reliance on third-party services linked from the site." />
      <Block title="Availability and modification" body="We may modify, suspend, restrict, or discontinue any feature or portion of the site at any time, with or without notice, while the product continues to evolve." />
      <Block title="Contact notice" body="If you contact Kiddo Map by WhatsApp, email, or feedback form, your message may be reviewed, stored, and used to respond to your enquiry, investigate issues, or improve the site." />
      <Block title="Changes to these terms" body="We may revise these terms at any time. The version published on this page controls, and your continued use of the site after an update constitutes acceptance of the revised terms." />
    </ContentPage>
  );
}

function Block({ title, body }) {
  return (
    <section style={{ display: 'grid', gap: '6px', paddingTop: '2px' }}>
      <h2 style={{ margin: 0, fontSize: '18px', lineHeight: 1.25, fontWeight: 900 }}>{title}</h2>
      <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#4f4f4f', maxWidth: '70ch' }}>{body}</div>
    </section>
  );
}
