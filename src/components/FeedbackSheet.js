import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';

const FEEDBACK_TYPES = [
  { id: 'love', emoji: '❤️', label: '喜欢这个 app' },
  { id: 'bug', emoji: '🐛', label: '发现问题' },
  { id: 'feature', emoji: '💡', label: '功能建议' },
  { id: 'place', emoji: '📍', label: '推荐地点' },
];

export default function FeedbackSheet({ onClose }) {
  const [type, setType] = useState('love');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    
    // 模拟提交（你可以集成 Google Form 或后端）
    // 临时方案：保存到 localStorage，让你可以查看
    const feedback = {
      type,
      message,
      name: name || '匿名',
      timestamp: new Date().toISOString(),
    };
    
    const existing = JSON.parse(localStorage.getItem('kiddo-feedback') || '[]');
    existing.push(feedback);
    localStorage.setItem('kiddo-feedback', JSON.stringify(existing));
    
    // 在控制台打印（你可以在 Vercel logs 中看到）
    console.log('📬 New Feedback:', feedback);
    
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
              感谢你的反馈！
            </div>
            <div style={{
              fontSize: '14px',
              color: '#999',
              fontWeight: 500,
            }}>
              我们会认真看每一条 💛
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
                  💌 留个言吧
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#999',
                  fontWeight: 500,
                }}>
                  你的话能让 Kiddo Map 变更好
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
              {/* 类型选择 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#999',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  反馈类型
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}>
                  {FEEDBACK_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className="bouncy-button"
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        border: type === t.id ? '2px solid #FF8A65' : '2px solid var(--soft-gray)',
                        background: type === t.id ? '#FFE0B2' : 'white',
                        color: type === t.id ? '#E64A19' : 'var(--charcoal)',
                        fontSize: '13px',
                        fontWeight: 700,
                        fontFamily: 'Nunito, sans-serif',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{t.emoji}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 消息内容 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  告诉我们
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你的想法..."
                  required
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

              {/* 名字（可选） */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  你的称呼（选填）
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="希望我们怎么称呼你？"
                  style={{
                    width: '100%',
                    border: '2px solid var(--soft-gray)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    fontSize: '14px',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 500,
                    color: 'var(--charcoal)',
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
                disabled={submitting || !message.trim()}
                className="bouncy-button"
                style={{
                  width: '100%',
                  background: submitting || !message.trim() 
                    ? '#E0E0E0' 
                    : 'linear-gradient(135deg, #FF8A65, #FFD54F)',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 800,
                  fontFamily: 'Nunito, sans-serif',
                  cursor: submitting || !message.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: submitting || !message.trim() 
                    ? 'none' 
                    : '0 8px 20px rgba(255, 138, 101, 0.4)',
                }}
              >
                {submitting ? (
                  '发送中...'
                ) : (
                  <>
                    <Send size={16} strokeWidth={3} />
                    发送反馈
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
