export const SITE_NAME = 'Kiddo Map';
export const SITE_URL = 'https://www.kiddomap.ai';
export const SITE_TAGLINE = 'Decide where to take your kid in Kuala Lumpur in 3 minutes.';
export const SITE_DESCRIPTION =
  'Kid-friendly places in Kuala Lumpur, with indoor and outdoor picks, age fit, timing, parent effort notes, and practical tips before you go.';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function whatsappUrl(message = 'Hi Johnny, I found Kiddo Map and want to ask something.') {
  if (!WHATSAPP_NUMBER) return '';
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
