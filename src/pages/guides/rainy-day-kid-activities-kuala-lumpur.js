import GuideCollectionPage from '../../components/GuideCollectionPage';
import { getCopy } from '../../lib/copy';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().rainyDay;
const copy = getCopy('zh');
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '吉隆坡雨天亲子去处',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: places.length,
  itemListElement: places.map((place, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/places/${place.id}`,
    name: place.nameEn || place.name,
  })),
};

const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '吉隆坡下雨时还能带孩子去哪？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '优先看不太受天气影响、仍然像一次正式出门的地点，例如水族馆、博物馆、室内游乐或商场里的亲子停靠点。',
      },
    },
    {
      '@type': 'Question',
      name: '这页的雨天去处是怎么选出来的？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我们更看重遮蔽程度、年龄匹配、出门阻力低不低，以及在天气不稳定时，这趟出门还值不值得。',
      },
    },
  ],
};

export default function RainyDayGuidePage() {
  return (
    <GuideCollectionPage
      title="吉隆坡雨天亲子去处"
      description="下雨天也能比较稳地带孩子出门的地点，尽量减少天气带来的临时变数。"
      path="/guides/rainy-day-kid-activities-kuala-lumpur"
      eyebrow="专题"
      introTitle="下雨天也值得出门的亲子去处"
      introBody="这页适合那种一看天气就容易想放弃出门的日子。我们优先挑出更防雨、更省心，也更容易快速做决定的地点。"
      introNote="每张卡都会强调雨天最关键的部分：遮蔽够不够、适不适合孩子，以及这趟出门到底值不值得。"
      updateNote="最近检查：2026 年 5 月 13 日"
      relatedLinks={[
        { href: '/guides/best-indoor-places-kuala-lumpur', label: '室内去处', description: '更广一点的室内地点清单。' },
        { href: '/guides/free-kid-friendly-places-kuala-lumpur', label: '免费去处', description: '预算更轻一点，也适合下雨天参考。' },
      ]}
      faqItems={[
        {
          question: '这页为什么适合雨天参考？',
          answer: '它会先帮你缩小范围，只留下更可能舒适、受天气影响较小、也更容易快速成行的地点。',
        },
        {
          question: '适合雨天，是否就代表免费或便宜？',
          answer: '不一定。它更强调这趟出门不容易被下雨毁掉，即使仍然需要门票或其他小额花费。',
        },
      ]}
      copy={copy}
      locale="zh"
      uiText={{
        keyPlaces: '这页重点地点',
        relatedGuides: '相关专题',
        faq: '常见问题',
        age: '年龄',
        time: '时长',
        cost: '花费',
        quickNote: '快速判断',
        quickNoteFallback: '帮助家长更快判断这是不是雨天也值得去的地方。',
        openFullPlacePage: '打开完整地点页',
      }}
      structuredData={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '吉隆坡雨天亲子去处',
          url: `${SITE_URL}/guides/rainy-day-kid-activities-kuala-lumpur`,
        },
        itemList,
        faq,
      ]}
      places={places}
    />
  );
}
