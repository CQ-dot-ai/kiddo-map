import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';

const RATING_OPTIONS = [
  { id: '5', emoji: '⭐⭐⭐⭐⭐', label: 'Love it', formValue: '⭐⭐⭐⭐⭐ Love it' },
  { id: '4', emoji: '⭐⭐⭐⭐', label: 'Pretty good', formValue: '⭐⭐⭐⭐ Pretty good' },
  { id: '3', emoji: '⭐⭐⭐', label: 'It is okay', formValue: '⭐⭐⭐ It is okay' },
  { id: '2', emoji: '⭐⭐', label: 'Not great', formValue: '⭐⭐ Not quite right' },
  { id: '1', emoji: '⭐', label: 'Not useful', formValue: '⭐ Not useful yet' },
];

const GOOGLE_FORM_ID =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_ID ||
  '1FAIpQLScaibUcLsfuTPkf3pInp307F5qqwWEV6uYeQecCjihRb5dZmQ';
const ENTRY_TYPE =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_TYPE ||
  'entry.1342373517';
const ENTRY_MESSAGE =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE ||
  'entry.599050854';

export default function FeedbackSheet({ onClose }) {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedRemotely, setSavedRemotely] = useState(false);

  const canSubmitToGoogleForm =
    GOOGLE_FORM_ID &&
    ENTRY_TYPE &&
    ENTRY_MESSAGE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    const selectedRating = RATING_OPTIONS.find(option => option.id === rating);

    const feedback = {
      rating: selectedRating?.formValue || rating,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setSubmitting(true);

    try {
      if (canSubmitToGoogleForm) {
        const body = new FormData();
        body.append(ENTRY_TYPE, feedback.rating);
        body.append(ENTRY_MESSAGE, feedback.message);

        await fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`, {
          method: 'POST',
          mode: 'no-cors',
          body,
        });
        setSavedRemotely(true);
      } else {
        const existing = JSON.parse(localStorage.getItem('kiddo-feedback') || '[]');
        existing.push(feedback);
        localStorage.setItem('kiddo-feedback', JSON.stringify(existing));
        setSavedRemotely(false);
      }
    } catch (error) {
      const existing = JSON.parse(localStorage.getItem('kiddo-feedback') || '[]');
      existing.push(feedback);
      localStorage.setItem('kiddo-feedback', JSON.stringify(existing));
      setSavedRemotely(false);
    }

    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

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
          background: 'rgba(0, 0, 0, 0.6)',
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
          maxHeight: '85vh',
          background: 'white',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          zIndex: 110,
          padding: '20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          overflow: 'auto',
        }}
      >
        {/* 拖动条 */}
        <div style={{
          width: '40px',
          height: '4px',
          background: '#E0E0E0',
          borderRadius: '999px',
          margin: '0 auto 16px',
        }} />

        {submitted ? (
          // 提交成功状态
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              style={{ fontSize: '64px', marginBottom: '16px' }}
            >
              🎉
            </motion.div>
            <div style={{
              fontSize: '20px',
              fontWeight: 800,
              fontFamily: 'Fredoka, sans-serif',
              color: 'var(--charcoal)',
              marginBottom: '8px',
            }}>
              Thank you!
            </div>
            <div style={{
              fontSize: '14px',
              color: '#999',
              fontWeight: 500,
            }}>
              {savedRemotely ? 'I will read every note carefully 💛' : 'Saved on this device for now.'}
            </div>
          </div>
        ) : (
          <>
            {/* 标题 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  fontFamily: 'Fredoka, sans-serif',
                  color: 'var(--charcoal)',
                  marginBottom: '4px',
                }}>
                  💌 Tell me in 10 seconds
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#999',
                  fontWeight: 500,
                }}>
                  Tiny notes help Kiddo Map grow up.
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

            <form onSubmit={handleSubmit}>
              {/* Rating */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#999',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  How is Kiddo Map so far?
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '8px',
                }}>
                  {RATING_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRating(option.id)}
                      className="bouncy-button"
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: rating === option.id ? '2px solid #FF8A65' : '2px solid var(--soft-gray)',
                        background: rating === option.id ? '#FFE0B2' : 'white',
                        color: rating === option.id ? '#E64A19' : 'var(--charcoal)',
                        fontSize: '13px',
                        fontWeight: 700,
                        fontFamily: 'Nunito, sans-serif',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span>{option.label}</span>
                      <span style={{ fontSize: '14px' }}>{option.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Improvement */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  What should we make better?
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Places to add, features you want, or anything that felt bumpy..."
                  rows={4}
                  style={{
                    width: '100%',
                    border: '2px solid var(--soft-gray)',
                    borderRadius: '16px',
                    padding: '14px',
                    fontSize: '14px',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 500,
                    color: 'var(--charcoal)',
                    resize: 'none',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8A65'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--soft-gray)'}
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={submitting || !rating}
                className="bouncy-button"
                style={{
                  width: '100%',
                  background: submitting || !rating
                    ? '#E0E0E0' 
                    : 'linear-gradient(135deg, #FF8A65, #FFD54F)',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 800,
                  fontFamily: 'Nunito, sans-serif',
                  cursor: submitting || !rating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: submitting || !rating
                    ? 'none' 
                    : '0 8px 20px rgba(255, 138, 101, 0.4)',
                }}
              >
                {submitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={16} strokeWidth={3} />
                    Send feedback
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </>
  );
}
