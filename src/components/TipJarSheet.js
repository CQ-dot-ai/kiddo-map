import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, MapPin, X, ExternalLink } from 'lucide-react';

const BASE_TIP_LINK = process.env.NEXT_PUBLIC_POLAR_TIP_LINK;
const TIP_LINKS = {
  1:
    process.env.NEXT_PUBLIC_POLAR_TIP_USD_1_LINK ||
    'https://buy.polar.sh/polar_cl_HrX7CXqzdzs1qNKst2u1MxJTLFVTezbPSrMNw4gevzD',
  3:
    process.env.NEXT_PUBLIC_POLAR_TIP_USD_3_LINK ||
    'https://buy.polar.sh/polar_cl_mxWGdFpAcmGKDrmx7X6SS6Cc4e1rCULkdFSGg3kdQ8r',
  5:
    process.env.NEXT_PUBLIC_POLAR_TIP_USD_5_LINK ||
    'https://buy.polar.sh/polar_cl_wH4USP6fxaGTyxY9ZGjdSbHkoOvm4QnTj8FgJ3cvPz0',
};

const TIP_OPTIONS = [
  {
    amount: 1,
    icon: Coffee,
    label: 'Tiny high five',
    tone: '#FF8A65',
  },
  {
    amount: 3,
    icon: MapPin,
    label: 'Buy me a KL coffee',
    tone: '#64B5F6',
  },
  {
    amount: 5,
    icon: Heart,
    label: 'Help add more kid spots',
    tone: '#9575CD',
  },
];

function buildTipUrl(amount) {
  const specificLink = TIP_LINKS[amount];
  const link = specificLink || BASE_TIP_LINK;

  if (!link) return '';

  try {
    const url = new URL(link);
    url.searchParams.set('amount', String(amount));
    url.searchParams.set('utm_source', 'kiddo_map');
    url.searchParams.set('utm_medium', 'tip_jar');
    url.searchParams.set('utm_campaign', `usd_${amount}`);
    return url.toString();
  } catch {
    return link;
  }
}

export default function TipJarSheet({ onClose }) {
  const options = useMemo(
    () => TIP_OPTIONS.map(option => ({ ...option, url: buildTipUrl(option.amount) })),
    []
  );

  const hasAnyLink = options.some(option => option.url);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          zIndex: 110,
          padding: '20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{
          width: '40px',
          height: '4px',
          background: '#E0E0E0',
          borderRadius: '999px',
          margin: '0 auto 16px',
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '18px',
        }}>
          <div>
            <div style={{
              fontSize: '22px',
              fontWeight: 800,
              fontFamily: 'Fredoka, sans-serif',
              color: 'var(--charcoal)',
              marginBottom: '5px',
            }}>
              Like this little app?
            </div>
            <div style={{ fontSize: '14px', color: '#777', fontWeight: 600 }}>
              Buy me a KL coffee ☕
            </div>
          </div>
          <button
            onClick={onClose}
            className="bouncy-button"
            style={{
              background: 'var(--cream)',
              border: 'none',
              borderRadius: '999px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} strokeWidth={3} color="#999" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map(option => {
            const Icon = option.icon;
            return (
              <a
                key={option.amount}
                href={option.url || undefined}
                target="_blank"
                rel="noreferrer"
                className="bouncy-button"
                onClick={(event) => {
                  if (!option.url) event.preventDefault();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: '18px',
                  border: `2px solid ${option.tone}22`,
                  background: option.url ? 'white' : '#F5F5F5',
                  textDecoration: 'none',
                  color: 'var(--charcoal)',
                  cursor: option.url ? 'pointer' : 'not-allowed',
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '16px',
                  background: `${option.tone}22`,
                  color: option.tone,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={22} strokeWidth={2.6} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>
                    ${option.amount}
                  </div>
                  <div style={{ fontSize: '13px', color: '#777', fontWeight: 700 }}>
                    {option.label}
                  </div>
                </div>
                <ExternalLink size={16} color={option.url ? '#999' : '#CCC'} />
              </a>
            );
          })}
        </div>

        {!hasAnyLink && (
          <div style={{
            marginTop: '14px',
            padding: '12px 14px',
            borderRadius: '16px',
            background: 'var(--cream)',
            color: '#777',
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: 1.5,
          }}>
            Tip Jar is ready. Add a Polar Checkout Link and these buttons will start taking tips.
          </div>
        )}
      </motion.div>
    </>
  );
}
