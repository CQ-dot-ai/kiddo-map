import { motion } from 'framer-motion';
import { X, Heart, Navigation, Star, Clock, Users, DollarSign } from 'lucide-react';

export default function PlaceDetail({ place, isFavorite, onToggleFavorite, onClose, onNavigate }) {
  return (
    <>
      {/* 黑色遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 50,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* 详情面板 */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '88vh',
          background: 'white',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          zIndex: 60,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* 顶部图片 + 关闭按钮 */}
        <div style={{
          position: 'relative',
          height: '220px',
          background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
          flexShrink: 0,
        }}>
          {/* 图片 */}
          <img
            src={place.image}
            alt={place.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85,
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
          {/* 渐变遮罩 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
          }} />

          {/* 顶部操作 */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            {/* 拖动条 */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '4px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '999px',
            }} />
            
            {/* 类别标签 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: place.color.dark,
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {place.emoji} {place.category}
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="bouncy-button"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '999px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--charcoal)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>

          {/* 名字 */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            color: 'white',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              opacity: 0.9,
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              {place.tagline}
            </div>
            <h2 style={{
              fontSize: '26px',
              fontWeight: 900,
              fontFamily: 'Fredoka, sans-serif',
              margin: 0,
              textShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}>
              {place.name}
            </h2>
          </div>
        </div>

        {/* 可滚动内容 */}
        <div
          className="hide-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            paddingBottom: '120px',
          }}
        >
          {/* 评分卡 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '16px',
          }}>
            <div style={{
              background: place.color.light,
              padding: '12px 14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Star size={16} fill={place.color.dark} color={place.color.dark} />
              <div>
                <div style={{ fontSize: '10px', color: '#666', fontWeight: 600 }}>Google</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: place.color.dark }}>
                  {place.googleRating}
                  <span style={{ fontSize: '10px', color: '#999', fontWeight: 600, marginLeft: '4px' }}>
                    ({place.googleReviewCount > 1000 ? `${(place.googleReviewCount/1000).toFixed(1)}k` : place.googleReviewCount})
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: place.color.light,
              padding: '12px 14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '18px' }}>👶</span>
              <div>
                <div style={{ fontSize: '10px', color: '#666', fontWeight: 600 }}>童游评分</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: place.color.dark }}>
                  {place.ourRating} <span style={{ fontSize: '10px', color: '#999' }}>/ 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* 关键信息 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <InfoChip icon={<DollarSign size={14} />} label="价格" value={place.costLabel} color={place.color.dark} />
            <InfoChip icon={<Clock size={14} />} label="时长" value={`${place.durationHours}h`} color={place.color.dark} />
            <InfoChip icon={<Users size={14} />} label="适龄" value={`${place.ageMin}-${place.ageMax}岁`} color={place.color.dark} />
          </div>

          {/* 描述 */}
          <div style={{
            background: 'var(--cream)',
            borderRadius: '20px',
            padding: '16px 18px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: place.color.dark,
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              ✨ 这里有什么好玩的？
            </div>
            <div style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--charcoal)',
              fontWeight: 500,
            }}>
              {place.description}
            </div>
          </div>

          {/* 三个亮点 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#999',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 4px',
            }}>
              💡 必看小贴士
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {place.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: 'white',
                    border: `2px solid ${place.color.light}`,
                    padding: '12px 14px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: place.color.light,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}>
                    {h.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: place.color.dark,
                      marginBottom: '2px',
                    }}>
                      {h.text}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--charcoal)',
                      fontWeight: 500,
                    }}>
                      {h.detail}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 设施友好度 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#999',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 4px',
            }}>
              🏠 家长友好度
            </div>
            <div style={{
              background: 'white',
              border: `2px solid ${place.color.light}`,
              borderRadius: '20px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
            }}>
              <FacilityItem emoji="👶" label="婴儿车" level={place.facilities.stroller} color={place.color.dark} />
              <FacilityItem emoji="🍼" label="哺乳室" level={place.facilities.nursing} color={place.color.dark} />
              <FacilityItem emoji="🚼" label="尿布台" level={place.facilities.diaper} color={place.color.dark} />
              <FacilityItem emoji="❄️" label="冷气" level={place.facilities.aircon} color={place.color.dark} />
              <FacilityItem emoji="🍽️" label="餐饮" level={place.facilities.food} color={place.color.dark} />
              <FacilityItem emoji="🚻" label="厕所" level={place.facilities.restroom} color={place.color.dark} />
            </div>
          </div>

          {/* 地址 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '12px',
            background: 'var(--cream)',
            borderRadius: '14px',
            fontSize: '12px',
            color: '#666',
            fontWeight: 500,
          }}>
            <span>📍</span>
            <span>{place.address}</span>
          </div>
        </div>

        {/* 底部固定按钮 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          padding: '14px 20px',
          paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
          display: 'flex',
          gap: '10px',
        }}>
          <button
            onClick={onToggleFavorite}
            className="bouncy-button"
            style={{
              width: '54px',
              height: '54px',
              background: isFavorite ? '#FFE0E0' : 'var(--cream)',
              border: 'none',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <Heart 
              size={22} 
              fill={isFavorite ? '#FF6B6B' : 'transparent'} 
              color={isFavorite ? '#FF6B6B' : '#999'} 
              strokeWidth={2.5}
            />
          </button>
          
          <button
            onClick={onNavigate}
            className="bouncy-button"
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
              border: 'none',
              borderRadius: '18px',
              padding: '0 20px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 800,
              fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '54px',
              boxShadow: `0 8px 20px ${place.color.primary}55`,
            }}
          >
            <Navigation size={18} strokeWidth={3} />
            一键导航前往
          </button>
        </div>
      </motion.div>
    </>
  );
}

function InfoChip({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'white',
      border: '2px solid var(--soft-gray)',
      borderRadius: '14px',
      padding: '10px',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color, marginBottom: '2px' }}>
        {icon}
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#666' }}>{label}</span>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--charcoal)' }}>
        {value}
      </div>
    </div>
  );
}

function FacilityItem({ emoji, label, level, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{emoji}</div>
      <div style={{ fontSize: '10px', color: '#666', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: i <= level ? color : '#E0E0E0',
            }}
          />
        ))}
      </div>
    </div>
  );
}
