import ContentPage from '../components/ContentPage';
import { Mail, MessageCircleMore, Sparkles } from 'lucide-react';
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER, whatsappUrl } from '../lib/site';

export default function ContactPage() {
 const hasWhatsapp = Boolean(WHATSAPP_NUMBER);
 const whatsappHref = hasWhatsapp ? whatsappUrl('Hi Johnny, I found Kiddomap and want to reach out.') : '';
 const displayWhatsapp = WHATSAPP_NUMBER ? `+${String(WHATSAPP_NUMBER).replace(/[^\d]/g, '')}` : '';

 return (
  <ContentPage
   title="Contact"
   description="Reach out about Kiddomap, suggest places, or share family feedback."
   path="/contact"
   eyebrow="Contact"
   structuredData={{
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Kiddomap Contact',
    url: `${SITE_URL}/contact`,
   }}
  >
   <div
    style={{
     borderRadius: '20px',
     padding: '18px',
     background: 'rgba(255, 248, 231, 0.92)',
     border: '1px solid rgba(255, 138, 101, 0.18)',
     display: 'grid',
     gap: '8px',
    }}
   >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}>
     <Sparkles size={18} color="#ff8a65" />
     Two simple ways to reach us
    </div>
    <div style={{ color: '#555', lineHeight: 1.6 }}>
     Share a place, flag a bad detail, or talk about a partnership.
    </div>
   </div>

   <div
    style={{
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
     gap: '14px',
    }}
   >
    {hasWhatsapp ? (
     <a
      href={whatsappHref}
      style={{
              display: 'grid',
              gap: '10px',
              padding: '18px',
              borderRadius: '18px',
              textDecoration: 'none',
              color: 'inherit',
              background: 'white',
              border: '1px solid rgba(34, 34, 34, 0.08)',
              boxShadow: '0 8px 24px rgba(34, 34, 34, 0.06)',
            }}
      >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}>
       <MessageCircleMore size={18} color="#ff8a65" />
       WhatsApp
      </div>
      <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.2 }}>
       {displayWhatsapp}
      </div>
      <div style={{ color: '#666' }}>
       Best for quick notes and fast back-and-forth.
      </div>
          </a>
        ) : null}

        {CONTACT_EMAIL ? (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              display: 'grid',
              gap: '10px',
              padding: '18px',
              borderRadius: '18px',
              textDecoration: 'none',
              color: 'inherit',
              background: 'white',
              border: '1px solid rgba(34, 34, 34, 0.08)',
              boxShadow: '0 8px 24px rgba(34, 34, 34, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}>
              <Mail size={18} color="#ff8a65" />
              Email
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.2 }}>
              {CONTACT_EMAIL}
            </div>
            <div style={{ color: '#666' }}>
              Best for longer notes, partnerships, or anything you want in writing.
            </div>
          </a>
    ) : null}
   </div>

   <div
    style={{
     borderRadius: '18px',
     padding: '14px 16px',
     background: 'rgba(255,255,255,0.82)',
     border: '1px solid rgba(34, 34, 34, 0.08)',
     color: '#666',
     lineHeight: 1.6,
    }}
   >
    Short product notes are still fastest inside the app's feedback flow.
   </div>
  </ContentPage>
 );
}
