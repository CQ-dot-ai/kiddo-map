import ContentPage from '../components/ContentPage';
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER, whatsappUrl } from '../lib/site';

export default function ContactPage() {
  const hasWhatsapp = Boolean(WHATSAPP_NUMBER);
  const whatsappHref = hasWhatsapp ? whatsappUrl('Hi Johnny, I found Kiddo Map and want to reach out.') : '';

  return (
    <ContentPage
      title="Contact"
      description="Reach out about Kiddo Map, suggest places, or share family feedback."
      path="/contact"
      eyebrow="Contact"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Kiddo Map Contact',
        url: `${SITE_URL}/contact`,
      }}
    >
      <p>If you want to suggest a place, report a bad detail, or talk about a partnership, contact can be simple. WhatsApp is a reasonable primary contact method for this product.</p>
      {hasWhatsapp ? (
        <p>
          <a href={whatsappHref}>Message Kiddo Map on WhatsApp</a>
        </p>
      ) : (
        <p>
          WhatsApp contact is supported, but the number has not been configured yet. Once you give me the number, I can wire the button directly.
        </p>
      )}
      {CONTACT_EMAIL ? (
        <p>
          Email fallback: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      ) : null}
      <p>The in-product feedback flow is still the fastest way to send quick product notes.</p>
    </ContentPage>
  );
}
