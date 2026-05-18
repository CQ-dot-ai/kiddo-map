import GuideCollectionPage from '../../components/GuideCollectionPage';
import { getCopy } from '../../lib/copy';
import { getGuideCollections } from '../../lib/place-seo';
import { SITE_URL } from '../../lib/site';

const places = getGuideCollections().free;
const copy = getCopy('zh');
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '吉隆坡免费亲子去处',
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
      name: 'Kiddomap 里的“免费”是什么意思？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '这里的免费，指的是主要入场或核心体验本身不需要明确门票，但停车、吃饭或额外项目仍然可能花钱。',
      },
    },
    {
      '@type': 'Question',
      name: '为什么还要提醒隐藏成本？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '有些地方虽然免费入场，但加上停车、零食、交通或附加消费后，实际支出并不低。把这部分写清楚，家长就不会临时被反咬一口。',
      },
    },
  ],
};

export default function FreeGuidePage() {
  return (
    <GuideCollectionPage
      title="吉隆坡免费亲子去处"
      description="预算友好的亲子去处合集，也会提醒你哪些地方看似免费、实际还有别的花费。"
      path="/guides/free-kid-friendly-places-kuala-lumpur"
      eyebrow="专题"
      introTitle="免费去处，但不是盲目免费"
      introBody="这页适合想找预算更轻一点的家长，但不会只告诉你“免费”两个字。我们会尽量把停车、吃饭和额外消费这类隐藏成本一起摆出来。"
      introNote="点开地点卡后，可以继续看它适合什么玩法、通常要花多久，以及有没有额外支出风险。"
      updateNote="最近检查：2026 年 5 月 13 日"
      relatedLinks={[
        { href: '/guides/rainy-day-kid-activities-kuala-lumpur', label: '雨天去处', description: '下雨也能比较稳地出门。' },
        { href: '/guides/best-indoor-places-kuala-lumpur', label: '室内去处', description: '天气热或下雨时更省心的选择。' },
      ]}
      faqItems={[
        {
          question: '这页所有地点都是真正完全免费的吗？',
          answer: '主要入场或核心体验通常免费，但有些地方还是会涉及停车、交通、吃饭或额外消费。',
        },
        {
          question: '为什么要特别看隐藏成本？',
          answer: '因为一个“免费出门”，最后很可能因为停车、餐饮或附加项目，变成一笔不小的开销。',
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
        quickNoteFallback: '帮助家长更快看清这类免费去处值不值得去。',
        openFullPlacePage: '打开完整地点页',
      }}
      structuredData={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '吉隆坡免费亲子去处',
          url: `${SITE_URL}/guides/free-kid-friendly-places-kuala-lumpur`,
        },
        itemList,
        faq,
      ]}
      places={places}
    />
  );
}
