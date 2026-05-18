import GuideCollectionPage from '../../components/GuideCollectionPage';
import { getCopy } from '../../lib/copy';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().indoor;
const copy = getCopy('zh');
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '吉隆坡适合孩子的室内去处',
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
      name: 'Kiddomap 里什么算室内去处？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '只要一个地点主要在室内、能避开天气影响，或在吉隆坡炎热和下雨天更适合带孩子去，我们就会把它归进室内去处。',
      },
    },
    {
      '@type': 'Question',
      name: '为什么推荐这些室内去处？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '这些地点更重视年龄匹配、天气风险低，以及家长是否能更轻松地成行，不会把简单出门变成一场折腾。',
      },
    },
  ],
};

export default function IndoorGuidePage() {
  return (
    <GuideCollectionPage
      title="吉隆坡适合孩子的室内去处"
      description="适合天气热或下雨天的室内亲子去处，帮家长更快决定今天要不要出门。"
      path="/guides/best-indoor-places-kuala-lumpur"
      eyebrow="专题"
      introTitle="适合热天和雨天的室内去处"
      introBody="这页适合想找一个更稳妥的亲子安排时使用：不用太看天气，也不用做太多额外准备。每个地点都尽量回答家长最在意的那几个问题。"
      introNote="点开地点卡后，可以继续看适合年龄、预计时长、路程参考和出发前提醒。"
      updateNote="最近检查：2026 年 5 月 13 日"
      relatedLinks={[
        { href: '/guides/rainy-day-kid-activities-kuala-lumpur', label: '雨天去处', description: '更适合下雨天临时决定出门的选择。' },
        { href: '/guides/free-kid-friendly-places-kuala-lumpur', label: '免费去处', description: '更适合预算有限时参考的地点。' },
      ]}
      faqItems={[
        {
          question: '这页会收哪些地点？',
          answer: '主要是有遮蔽、天气影响较低，或在吉隆坡炎热和下雨时仍然适合亲子出行的地点。',
        },
        {
          question: '这些地点是怎么被挑出来的？',
          answer: '我们会看它是否真的适合室内安排、适合什么年龄、要花多久，以及家长会不会太累、能不能轻松成行。',
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
        quickNoteFallback: '帮助家长更快判断这里值不值得去。',
        openFullPlacePage: '打开完整地点页',
      }}
      structuredData={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '吉隆坡适合孩子的室内去处',
          url: `${SITE_URL}/guides/best-indoor-places-kuala-lumpur`,
        },
        itemList,
        faq,
      ]}
      places={places}
    />
  );
}
