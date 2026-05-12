import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function NavigationSheet({ place, onClose }) {
  const [lng, lat] = place.coordinates;

  // Detect if running in PWA/App mode
  const isApp = typeof window !== 'undefined' && (
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );

  // Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  // Waze URL
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17`;

  // Grab URL - use app deep link in app mode, web link otherwise
  const grabUrl = isApp
    ? `grab://search?latitude=${lat}&longitude=${lng}`
    : 'https://www.grab.com/my/consumer/transport/';

  const handleNavigate = (url) => {
    window.open(url, '_blank');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Navigation panel */}
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
          zIndex: 110,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
      <div style={{
          width: '100%',
          maxWidth: '480px',
          background: 'white',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          padding: '20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Handle */}
        <div style={{
          width: '40px',
          height: '4px',
          background: '#E0E0E0',
          borderRadius: '999px',
          margin: '0 auto 20px',
        }} />

        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '6px',
          }}>
            🗺️
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 800,
            fontFamily: 'Fredoka, sans-serif',
            color: 'var(--charcoal)',
            marginBottom: '4px',
          }}>
            Pick a map app
          </div>
          <div style={{
            fontSize: '13px',
            color: '#999',
            fontWeight: 500,
          }}>
            Go to {place.nameEn || place.name}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Google Maps */}
          <button
            onClick={() => handleNavigate(googleMapsUrl)}
            className="bouncy-button"
            style={{
              background: 'linear-gradient(135deg, #4285F4, #1A73E8)',
              border: 'none',
              borderRadius: '20px',
              padding: '18px 20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 6px 20px rgba(66, 133, 244, 0.3)',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              📍
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '2px' }}>
                Google Maps
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 500 }}>
                Easy, familiar, and good for transit too
              </div>
            </div>
            <div style={{ fontSize: '20px' }}>→</div>
          </button>

          {/* Waze */}
          <button
            onClick={() => handleNavigate(wazeUrl)}
            className="bouncy-button"
            style={{
              background: 'linear-gradient(135deg, #33CCFF, #00AAFF)',
              border: 'none',
              borderRadius: '20px',
              padding: '18px 20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 6px 20px rgba(0, 170, 255, 0.3)',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              🚗
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '2px' }}>
                Waze
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 500 }}>
                Live traffic, great for driving in KL
              </div>
            </div>
            <div style={{ fontSize: '20px' }}>→</div>
          </button>

          {/* Grab - Only show in App mode */}
          {isApp && (
            <button
              onClick={() => handleNavigate(grabUrl)}
              className="bouncy-button"
              style={{
                background: 'linear-gradient(135deg, #00B14F, #008C3A)',
                border: 'none',
                borderRadius: '20px',
                padding: '18px 20px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 6px 20px rgba(0, 177, 79, 0.28)',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                🚕
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '2px' }}>
                  Grab
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 500 }}>
                  Open Grab app to request a ride
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>→</div>
            </button>
          )}

          {/* Cancel */}
          <button
            onClick={onClose}
            className="bouncy-button"
            style={{
              background: 'var(--cream)',
              border: 'none',
              borderRadius: '20px',
              padding: '14px',
              color: '#999',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              marginTop: '4px',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      </motion.div>
    </>
  );
}
