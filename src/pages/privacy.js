import ContentPage from '../components/ContentPage';
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER, whatsappUrl } from '../lib/site';

export default function PrivacyPage() {
  const contactTarget = WHATSAPP_NUMBER ? whatsappUrl('Hi Johnny, I have a privacy question about Kiddo Map.') : '';

  return (
    <ContentPage
      title="Privacy Policy"
      description="How Kiddo Map collects, uses, stores, and discloses information."
      path="/privacy"
      eyebrow="Legal"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy',
        url: `${SITE_URL}/privacy`,
      }}
      >
      <section style={{ display: 'grid', gap: '8px' }}>
        <p style={{ margin: 0, lineHeight: 1.62 }}>This Privacy Policy explains how Kiddo Map collects, uses, stores, and discloses information when you access or use the site. It is intended for adult users, parents, and guardians.</p>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.4, color: '#777', fontWeight: 700 }}>
        Effective date: May 13, 2026 · Last updated: May 13, 2026
        </p>
      </section>
      <Block title="Who operates this site" body="Kiddo Map is presently operated by an individual creator and not by a registered company. References in this policy to “Kiddo Map,” “we,” “us,” or “our” refer to that individual operator unless the site is later transferred to a different legal entity." />
      <Block title="Information we collect" body="Kiddo Map may collect limited technical and usage information through Vercel Web Analytics on an anonymous basis. Kiddo Map may also store saved places and basic interface preferences in your browser so the site can retain those settings on return visits." />
      <Block title="Information you submit" body="If you contact Kiddo Map through WhatsApp, email, or a feedback form, we will receive the information you choose to submit. This may include your name, contact details, message content, and any other information you provide voluntarily." />
      <Block title="Local storage" body="Saved places and certain interface preferences may be stored locally in your browser. That information remains on your device unless you clear it or reset your browser storage." />
      <Block title="Use of information" body="We use information to operate the site, maintain product functionality, understand page usage, respond to enquiries, improve recommendations, and reduce technical issues." />
      <Block title="What we do not do by default" body="Kiddo Map does not currently use advertising pixels, retargeting trackers, or third-party marketing profiles, and we do not sell personal data. If this position changes, this policy should be updated before the change takes effect." />
      <Block title="Disclosure to third parties" body="Kiddo Map links to Google Maps, Waze, Grab, ticketing platforms, and venue websites. Those services are operated by third parties and are subject to their own terms and privacy policies. We are not responsible for their practices, content, or availability." />
      <Block title="Children's privacy" body="Kiddo Map is intended for adults, parents, and guardians. We do not knowingly request personal information from children. If you believe a child has submitted information to us, please contact us so we can review the matter." />
      <Block title="Security and retention" body="We maintain reasonable administrative and technical safeguards, but no online service can guarantee absolute security. We retain contact messages and similar submissions only for as long as reasonably necessary for support, operational, legal, or recordkeeping purposes." />
      <Block title="Changes to this policy" body="We may update this policy from time to time. The version published on this page is the controlling version for site visitors." />
      <Block title="Contact notice" body="Messages sent by WhatsApp, email, or the feedback flow may be reviewed, stored, and used to respond to your enquiry, address product issues, or improve the site." />
      <Block title="Contact" body={<>For privacy questions, you may {contactTarget ? <a href={contactTarget}>contact us on WhatsApp</a> : 'contact us once the WhatsApp line is published'}. {CONTACT_EMAIL ? <>You may also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : null}</>} />
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
