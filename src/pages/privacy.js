import ContentPage from '../components/ContentPage';
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER, whatsappUrl } from '../lib/site';

export default function PrivacyPage() {
  const contactTarget = WHATSAPP_NUMBER ? whatsappUrl('Hi Johnny, I have a privacy question about Kiddo Map.') : '';

  return (
    <ContentPage
      title="Privacy Policy"
      description="How Kiddo Map handles analytics, local browser storage, feedback, and contact details."
      path="/privacy"
      eyebrow="Legal"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy',
        url: `${SITE_URL}/privacy`,
      }}
    >
      <p>This Privacy Policy explains what Kiddo Map collects, what it does not collect, and how data is used at the current stage of the product.</p>
      <h2>What we collect</h2>
      <p>Kiddo Map currently uses Vercel Web Analytics to understand page views and basic site usage. The product also stores some preferences such as saved places in your browser on your device.</p>
      <h2>What we do not currently do</h2>
      <p>Kiddo Map does not currently run third-party advertising trackers or retargeting pixels on the site. If that changes later, this policy should be updated before the change goes live.</p>
      <h2>Feedback and forms</h2>
      <p>If you submit feedback through the linked form, the information you choose to send is collected through that form provider and can be reviewed to improve the product.</p>
      <h2>Local storage</h2>
      <p>Saved places and lightweight product preferences may be stored in local browser storage so the experience works better on return visits. That data stays in your browser unless you clear it.</p>
      <h2>Third-party links</h2>
      <p>Kiddo Map links out to Google Maps, Waze, Grab, ticketing sites, and venue sites. Their privacy practices are separate from Kiddo Map.</p>
      <h2>Contact</h2>
      <p>
        For privacy questions, you can {contactTarget ? <a href={contactTarget}>contact us on WhatsApp</a> : 'contact us once the WhatsApp line is published'}.
        {CONTACT_EMAIL ? <> You can also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : null}
      </p>
      <p>Last updated: May 13, 2026.</p>
    </ContentPage>
  );
}
