import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function BottomSheet({
  title,
  subtitle,
  onClose,
  children,
  height = 'min(82vh, calc(100dvh - 20px))',
  maxWidth = 'none',
  zIndex = 90,
  bodyPadding = '12px 14px max(18px, env(safe-area-inset-bottom))',
  bodyStyle = {},
}) {
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
          background: 'rgba(0, 0, 0, 0.38)',
          zIndex: zIndex - 10,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />
      <motion.section
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26 }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex,
          background: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -16px 48px rgba(34,34,34,0.18)',
          height,
          maxWidth,
          margin: maxWidth !== 'none' ? '0 auto' : '0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 14px 10px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--charcoal)' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: '12px', color: '#777', fontWeight: 700 }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="bouncy-button"
            style={{
              background: 'var(--cream)',
              border: 'none',
              borderRadius: '999px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={18} strokeWidth={2.7} color="#999" />
          </button>
        </div>

        <div
          className="hide-scrollbar"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: bodyPadding,
            ...bodyStyle,
          }}
        >
          {children}
        </div>
      </motion.section>
    </>
  );
}
