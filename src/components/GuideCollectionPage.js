import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import ContentPage from './ContentPage';

const ZH_PLACE_COPY = {
  'aquaria-klcc': {
    tagline: '雨天也稳 · 海底隧道',
    description: '可以一路走过长长的海底隧道，看鲨鱼和大鱼从头顶游过去。整体凉快、推车友好，小朋友也比较容易进入状态。',
    costLabel: 'RM 75 起',
    highlights: ['冷气足、推车也相对方便', '海底隧道和触摸池最容易抓住孩子注意力'],
  },
  'kiddo-playland-publika': {
    tagline: '吃饭、看展、周末活动',
    description: 'Publika 不是单一景点，但它的餐厅、艺术空间和周末活动组合起来，很适合变成一个轻松的半天亲子安排。',
    costLabel: '看安排',
    highlights: ['大人也不会太无聊', '市集、艺术活动和小型周末节目更容易吸引孩子'],
  },
  kidzania: {
    tagline: '迷你城市 · 大孩子会很投入',
    description: '孩子可以体验消防员、医生、记者等不同职业。对家长来说，这是一种室内时间比较长、也比较不怕天气的安排。',
    costLabel: 'RM 100 起',
    highlights: ['室内时间长，附近吃饭也方便', '职业体验和“自己做任务”最容易让孩子投入'],
  },
  'islamic-arts-museum': {
    tagline: '安静室内 · 视觉细节很多',
    description: '如果你想找一个更安静、节奏慢一点的室内去处，这里适合搭配看展和短时间走走停停，不会太吵。',
    costLabel: 'RM 20 起',
    highlights: ['冷气和整体动线都比较舒服', '穹顶、模型和细节展示更适合会观察的孩子'],
  },
  'national-museum': {
    tagline: '城市故事 · 轻松短停',
    description: '国家博物馆适合做一个较短的文化类停靠点，尤其是你想让孩子看看马来西亚历史、又不想把行程拉得太长的时候。',
    costLabel: 'RM 5 起',
    highlights: ['靠近 KL Sentral，顺路性比较强', '展厅大、路线直，小朋友不容易一下就累'],
  },
  'kl-city-gallery': {
    tagline: '城市模型 · 适合短暂停留',
    description: '这是一个更适合短停的城市展示空间，适合作为老城区行程里的一个亲子补充，不需要安排太久。',
    costLabel: 'RM 10 左右',
    highlights: ['时间短，适合和其他点位一起安排', '城市模型和大型视觉装置更容易让孩子停下来看'],
  },
  'klcc-park': {
    tagline: '免费戏水 · 市中心经典',
    description: '双子塔脚下的大型公园，浅水区、游乐场和大草地都比较集中，适合不想花钱但又想让孩子跑一跑的安排。',
    costLabel: '免费',
    highlights: ['免费，而且厕所和吃饭都很近', '戏水区和大游乐场通常最受欢迎'],
  },
  'perdana-botanical-garden': {
    tagline: '大面积绿地 · 推车友好',
    description: '适合散步、野餐和轻量户外放风。整体节奏比游乐场慢一点，但更适合想让全家都别太累的户外行程。',
    costLabel: '免费',
    highlights: ['免费、开放，不容易玩得太累', '草地、步道和湖景比较适合慢慢放电'],
  },
  'titiwangsa-lake-gardens': {
    tagline: '湖边散步 · 滑板车友好',
    description: '适合傍晚去走一走、骑滑板车或让孩子在湖边活动。不是强刺激型地点，但整体会比较舒服。',
    costLabel: '免费',
    highlights: ['空间开阔，步调可以放得很慢', '跑跳、滑板车和看湖景对孩子比较有吸引力'],
  },
  'bukit-jalil-recreational-park': {
    tagline: '大游乐场 · 户外放电',
    description: '南边比较大的户外公园之一，有游乐设施、步道和充足的放电空间，适合精力比较多的孩子。',
    costLabel: '免费',
    highlights: ['免费，停车相对也不算太难', '大面积游乐空间更适合想要尽情跑跳的孩子'],
  },
  'taman-botani-negara-shah-alam': {
    tagline: '大植物园 · 更像半日行程',
    description: '如果你想找一个真正有空间感、能待更久的植物园型地点，这里更像一趟半天行程，而不是顺路小停。',
    costLabel: '低花费 / 大多免费',
    highlights: ['空间大，适合推车和慢走', '适合喜欢自然、骑行或宽阔路线的孩子'],
  },
};

function getLocalizedPlace(place, locale = 'en') {
  if (locale !== 'zh') return place;

  const override = ZH_PLACE_COPY[place.id];
  if (!override) return place;

  return {
    ...place,
    tagline: override.tagline || place.tagline,
    description: override.description || place.description,
    costLabel: override.costLabel || place.costLabel,
    highlights: (override.highlights || []).map((detail, index) => ({
      ...(place.highlights?.[index] || { emoji: '•', text: '' }),
      detail,
    })),
  };
}

function MetaChip({ label, value }) {
  return (
    <div style={{
      borderRadius: '14px',
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.9)',
      border: '1px solid rgba(34,34,34,0.06)',
      minWidth: 0,
    }}>
      <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#8b8b8b', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ marginTop: '3px', fontSize: '13px', fontWeight: 800, color: 'var(--charcoal)', lineHeight: 1.25 }}>
        {value}
      </div>
    </div>
  );
}

function GuidePlaceCard({ place, uiText, locale }) {
  const localizedPlace = getLocalizedPlace(place, locale);
  const highlights = (localizedPlace.highlights || []).slice(0, 2);

  return (
    <article
      style={{
        borderRadius: '22px',
        padding: '18px',
        background: 'white',
        border: `1px solid ${place.color.primary}22`,
        boxShadow: '0 10px 28px rgba(34,34,34,0.06)',
        display: 'grid',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '26px',
          boxShadow: `0 10px 22px ${place.color.primary}33`,
          flexShrink: 0,
        }}>
            {localizedPlace.emoji}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '999px',
            background: localizedPlace.color.light,
            color: localizedPlace.color.dark,
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            marginBottom: '8px',
          }}>
            {localizedPlace.tagline}
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '20px',
            lineHeight: 1.08,
            color: 'var(--charcoal)',
          }}>
            {localizedPlace.nameEn || localizedPlace.name}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#666', lineHeight: 1.55, fontSize: '14px', fontWeight: 700 }}>
            {localizedPlace.description}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '8px',
      }}>
        <MetaChip label={uiText.age} value={`${localizedPlace.ageMin}-${localizedPlace.ageMax}`} />
        <MetaChip label={uiText.time} value={localizedPlace.durationHours} />
        <MetaChip label={uiText.cost} value={localizedPlace.costLabel} />
      </div>

      <div style={{
        borderRadius: '18px',
        padding: '14px',
        background: localizedPlace.color.light,
        display: 'grid',
        gap: '10px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: localizedPlace.color.dark }}>
          {uiText.quickNote}
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {highlights.length > 0 ? highlights.map(highlight => (
            <div key={`${place.id}-${highlight.text}`} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#555', fontSize: '13px', lineHeight: 1.45, fontWeight: 700 }}>
              <span aria-hidden="true">{highlight.emoji}</span>
              <span>{highlight.detail}</span>
            </div>
          )) : (
            <div style={{ color: '#555', fontSize: '13px', lineHeight: 1.5, fontWeight: 700 }}>
              {uiText.quickNoteFallback}
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/places/${localizedPlace.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '16px',
          background: 'var(--cream)',
          color: 'var(--charcoal)',
          textDecoration: 'none',
          fontWeight: 900,
          fontSize: '14px',
        }}
      >
        {uiText.openFullPlacePage}
        <ArrowRight size={16} strokeWidth={3} />
      </Link>
    </article>
  );
}

function SeoPillLink({ href, label, description }) {
  return (
    <Link
      href={href}
      style={{
        display: 'grid',
        gap: '4px',
        padding: '14px 16px',
        borderRadius: '16px',
        background: 'white',
        border: '1px solid rgba(34,34,34,0.06)',
        textDecoration: 'none',
        color: 'var(--charcoal)',
        boxShadow: '0 8px 24px rgba(34,34,34,0.04)',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 900, lineHeight: 1.3 }}>{label}</div>
      {description ? (
        <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#777', fontWeight: 700 }}>{description}</div>
      ) : null}
    </Link>
  );
}

function PlaceClusterLink({ href, place }) {
  return (
    <Link
      href={href}
      style={{
        display: 'grid',
        gap: '6px',
        padding: '14px 16px',
        borderRadius: '18px',
        background: 'white',
        border: `1px solid ${place.color.primary}22`,
        boxShadow: '0 8px 24px rgba(34,34,34,0.04)',
        textDecoration: 'none',
        color: 'var(--charcoal)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          flexShrink: 0,
        }}>
          {place.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 900, lineHeight: 1.25 }}>{place.nameEn || place.name}</div>
          <div style={{ fontSize: '11px', color: place.color.dark, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: '2px' }}>
            {place.tagline}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#777', fontWeight: 700 }}>
        Age {place.ageMin}-{place.ageMax} · {place.durationHours}h · {place.costLabel}
      </div>
    </Link>
  );
}

function FaqItem({ question, answer }) {
  return (
    <section
      style={{
        borderRadius: '18px',
        padding: '16px 18px',
        background: 'white',
        border: '1px solid rgba(34,34,34,0.06)',
        boxShadow: '0 8px 24px rgba(34,34,34,0.04)',
        display: 'grid',
        gap: '8px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '16px', lineHeight: 1.35, fontWeight: 900, color: 'var(--charcoal)' }}>
        {question}
      </h3>
      <div style={{ fontSize: '14px', lineHeight: 1.65, color: '#555', fontWeight: 700 }}>
        {answer}
      </div>
    </section>
  );
}

export default function GuideCollectionPage({
  title,
  description,
  path,
  eyebrow = 'Guide',
  structuredData,
  introTitle,
  introBody,
  introNote,
  updateNote,
  relatedLinks = [],
  faqItems = [],
  places,
  copy,
  locale = 'en',
  uiText = {
    keyPlaces: '重点地点',
    relatedGuides: '相关专题',
    faq: '常见问题',
    age: '年龄',
    time: '时长',
    cost: '花费',
    quickNote: '快速判断',
    quickNoteFallback: '帮助家长更快判断这个地方值不值得去。',
    openFullPlacePage: '打开完整地点页',
  },
}) {
  const featuredPlaces = places.slice(0, 4);

  return (
    <>
      {/* This component is intentionally thin: guide pages keep the ContentPage shell,
          but their internal layout gets a wider, card-based treatment. */}
      <ContentPage
        title={title}
        description={description}
        path={path}
        eyebrow={eyebrow}
        structuredData={structuredData}
        maxWidth="1080px"
        copy={copy}
      >
        <section
          style={{
            borderRadius: '22px',
            padding: '18px',
            background: 'rgba(255, 248, 231, 0.92)',
            border: '1px solid rgba(255, 138, 101, 0.16)',
            display: 'grid',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, color: 'var(--charcoal)' }}>
            <Sparkles size={18} color="#ff8a65" />
            {introTitle}
          </div>
          <div style={{ fontSize: '15px', lineHeight: 1.65, color: '#555', fontWeight: 700 }}>
            {introBody}
          </div>
          {introNote ? (
            <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#777' }}>
              {introNote}
            </div>
          ) : null}
          {updateNote ? (
            <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#8b8b8b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {updateNote}
            </div>
          ) : null}
        </section>

        {featuredPlaces.length > 0 ? (
          <section
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b8b8b' }}>
              {uiText.keyPlaces}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {featuredPlaces.map(place => (
                <PlaceClusterLink key={place.id} href={`/places/${place.id}`} place={getLocalizedPlace(place, locale)} />
              ))}
            </div>
          </section>
        ) : null}

        {relatedLinks.length > 0 ? (
          <section
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b8b8b' }}>
              {uiText.relatedGuides}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {relatedLinks.map(link => (
                <SeoPillLink key={link.href} {...link} />
              ))}
            </div>
          </section>
        ) : null}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {places.map(place => (
            <GuidePlaceCard key={place.id} place={place} uiText={uiText} locale={locale} />
          ))}
        </section>

        {faqItems.length > 0 ? (
          <section style={{ display: 'grid', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b8b8b' }}>
              {uiText.faq}
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {faqItems.map(item => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>
        ) : null}
      </ContentPage>
    </>
  );
}
