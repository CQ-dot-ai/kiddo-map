import Link from 'next/link';
import ContentPage from '../components/ContentPage';
import { SITE_URL } from '../lib/site';

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: '关于 Kiddomap',
    url: `${SITE_URL}/about`,
    description: 'Kiddomap 的定位、适用人群与推荐方式说明。',
  };

  return (
    <ContentPage
      title="关于 Kiddomap"
      description="Kiddomap 的定位、适用人群与推荐方式说明。"
      path="/about"
      eyebrow="关于"
      structuredData={structuredData}
    >
      <section style={{
        borderRadius: '22px',
        padding: '18px',
        background: 'rgba(255, 248, 231, 0.92)',
        border: '1px solid rgba(255, 138, 101, 0.16)',
        display: 'grid',
        gap: '10px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ff8a65' }}>
          Kiddomap 是什么
        </div>
        <div style={{ fontSize: '16px', lineHeight: 1.7, fontWeight: 700, color: '#4d4d4d' }}>
          Kiddomap 帮助吉隆坡家庭更快决定亲子出行地点。我们整理亲子友好去处和实用信息，让家长少一点纠结，多一点亲子时光。
        </div>
        <div style={{ fontSize: '12px', lineHeight: 1.45, color: '#8b8b8b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          最近审核：2026 年 5 月 13 日
        </div>
      </section>

      <section style={{
        display: 'grid',
        gap: '22px',
        paddingTop: '4px',
      }}>
        <AboutBlock
          title="我们怎么做推荐"
          body="我们会综合年龄匹配、室内/户外属性、预计时长、家长体力成本和出行实用信息。目标是帮助你在当下做决定，而不只是增加浏览信息。"
        />
        <AboutBlock
          title="它不是什么"
          body="Kiddomap 不是官方场馆信息源。开放时间、票务规则和现场情况可能会变动。出发前请以场馆官方信息为准。"
        />
        <AboutBlock
          title="我们如何持续改进"
          body="推荐来自地点数据、家庭匹配规则和人工审核。如果你发现信息有误或过期，欢迎反馈，我们会尽快修正。"
        />
        <AboutBlock
          title="联系我们"
          body={
            <>
              如发现信息错误、想推荐地点，或希望补充更好的家庭出行建议，请使用联系我们页面或产品内反馈入口。{' '}
              <Link href="/contact" style={{ color: '#ff8a65', fontWeight: 900, textDecoration: 'none' }}>前往联系我们</Link>
            </>
          }
        />
      </section>
    </ContentPage>
  );
}

function AboutBlock({ title, body }) {
  return (
    <section style={{
      display: 'grid',
      gap: '10px',
      paddingTop: '18px',
      borderTop: '1px solid rgba(34,34,34,0.08)',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ff8a65' }}>
        {title}
      </div>
      <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#555', fontWeight: 700, maxWidth: '68ch' }}>
        {body}
      </div>
    </section>
  );
}
