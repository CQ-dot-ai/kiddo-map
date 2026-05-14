export const SITE_NAME = 'Kiddo Map';
export const SITE_URL = 'https://www.kiddomap.ai';
export const SITE_TAGLINE = 'Less Deciding, More Family Time';
export const SITE_DESCRIPTION =
  'Kiddo Map helps Kuala Lumpur families plan easier, happier weekends.';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '60126103025';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@kiddomap.ai';
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export function normalizeWhatsappNumber(number = WHATSAPP_NUMBER) {
  return String(number).replace(/[^\d]/g, '');
}

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function whatsappUrl(message = 'Hi Johnny, I found Kiddo Map and want to ask something.') {
  const normalizedNumber = normalizeWhatsappNumber();
  if (!normalizedNumber) return '';
  const text = encodeURIComponent(message);
  return `https://wa.me/${normalizedNumber}?text=${text}`;
}
