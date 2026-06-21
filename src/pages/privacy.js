import ContentPage from '../components/ContentPage';
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_NUMBER, whatsappUrl } from '../lib/site';
import { getCopy } from '../lib/copy';
import { useLanguage } from '../lib/language';

export default function PrivacyPage() {
  const { language, setLanguage } = useLanguage();
  const copy = getCopy(language);
  const contactTarget = WHATSAPP_NUMBER
    ? whatsappUrl(language === 'zh' ? '你好，我想咨询 Kiddomap 的隐私问题。' : 'Hi Johnny, I have a privacy question about Kiddomap.')
    : '';
  const t = language === 'zh'
    ? {
        title: '隐私政策',
        description: '说明 Kiddomap 如何收集、使用、存储和披露信息。',
        eyebrow: '法律',
        name: '隐私政策',
        intro: '本隐私政策说明当你访问或使用 Kiddomap 网站或 iOS App 时，我们如何收集、使用、存储和披露信息。本产品面向成年人、家长与监护人。',
        date: '生效日期：2026 年 6 月 21 日 · 最近更新：2026 年 6 月 21 日',
        contact: '联系方式',
        contactBody: '如有隐私相关问题，你可以通过 WhatsApp 或邮件联系我们。',
      }
    : {
        title: 'Privacy Policy',
        description: 'How Kiddomap collects, uses, stores, and discloses information.',
        eyebrow: 'Legal',
        name: 'Privacy Policy',
        intro: 'This Privacy Policy explains how Kiddomap collects, uses, stores, and discloses information when you access or use the Kiddomap website or iOS app. It is intended for adult users, parents, and guardians.',
        date: 'Effective date: June 21, 2026 · Last updated: June 21, 2026',
        contact: 'Contact',
        contactBody: 'For privacy questions, you may contact us on WhatsApp or email.',
      };

  return (
    <ContentPage
      title={t.title}
      description={t.description}
      path="/privacy"
      eyebrow={t.eyebrow}
      language={language}
      onLanguageChange={setLanguage}
      copy={copy}
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t.name,
        url: `${SITE_URL}/privacy`,
      }}
      >
      <section style={{ display: 'grid', gap: '8px' }}>
        <p style={{ margin: 0, lineHeight: 1.62 }}>{t.intro}</p>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.4, color: '#777', fontWeight: 700 }}>
          {t.date}
        </p>
      </section>
      {language === 'zh' ? (
        <>
          <Block title="网站与 App 运营方" body="KiddoMap 当前由个人开发者运营，尚未注册为公司。本政策中“我们”均指该运营者，除非未来主体发生变化并另行公告。" />
          <Block title="我们收集的信息" body={<>我们仅收集应用运行所需的信息：<br /><br />· <b>账户信息</b>：若你登录，我们会通过一次性验证码（OTP，由 Supabase 提供）收集你的电子邮箱用于身份验证。我们不收集、不存储密码。<br />· <b>收藏的地点</b>：你收藏的地点会保存在你的账户中，以便跨设备同步。<br />· <b>位置信息</b>：在你授权后，我们使用设备位置来显示附近地点和当地天气。位置在设备本地处理、并用于向天气服务（Open-Meteo）请求数据；不会存储在我们的服务器上，也不与你的身份关联。<br />· <b>使用数据</b>：我们通过 Google Analytics（GA4）收集匿名使用数据（如浏览了哪些页面和地点），用于了解使用情况并改进产品。<br />· <b>儿童年龄段（仅存于你的设备）</b>：在初始设置时，你可输入孩子的年龄段以个性化推荐。该信息仅保存在你的设备上，不会上传至服务器，也不与你的身份关联。<br />· <b>你主动提交的信息</b>：当你通过邮箱或反馈入口联系我们时，我们会收到你选择提供的信息（如姓名、联系方式、消息内容）。</>} />
          <Block title="信息用途" body="我们使用上述信息用于运营应用、为你登录、同步收藏地点、显示附近及天气相关推荐、了解使用情况以改进产品、回应咨询，以及减少技术问题。" />
          <Block title="位置数据" body="位置信息仅用于显示附近地点和当地天气。你的坐标在设备本地处理，并发送给天气服务商（Open-Meteo）以获取天气预报。我们不会将你的位置存储在服务器上，也不与你的身份关联。你可随时在设备设置中关闭位置权限。" />
          <Block title="儿童信息" body="KiddoMap 面向成年用户、家长及监护人使用。你输入的任何儿童年龄段信息仅存储于你的设备上以个性化推荐——绝不会上传、共享或与身份关联。我们不会在明知的情况下直接收集儿童的个人信息。若你认为有儿童向我们提交了个人信息，请联系我们。" />
          <Block title="照片与地点信息" body="地点照片在你查看某个地点时向 Google 实时请求。请求照片时，我们仅向 Google 发送地点标识符——不会发送你的个人信息、账户信息或位置。照片为实时显示，我们不予存储。" />
          <Block title="第三方服务" body={<>KiddoMap 依赖以下第三方服务，各自受其隐私政策约束：<br /><br />· <b>Google Analytics（GA4）</b>——匿名使用分析<br />· <b>Supabase</b>——账户登录与收藏地点存储<br />· <b>Open-Meteo</b>——天气数据<br />· <b>Google Places / Google 地图、Waze</b>——地点照片与导航链接<br />· <b>CartoDB / OpenStreetMap</b>——地图瓦片<br /><br />我们也会链接至由第三方运营的导航、票务及场馆网站；我们不对其行为负责。</>} />
          <Block title="默认不做的事" body="我们不使用广告像素、再营销追踪器或第三方营销画像，也不出售个人数据。我们不使用 PostHog、会话录制或行为广告追踪。若此立场未来发生变化，我们会在变化生效前更新本政策。" />
          <Block title="你的选择与账号删除" body="你可随时在应用内删除账号：进入「我」（Me）页面，在已登录的账户卡片中点击「Delete account / 删除账号」。删除后将移除你的账号、个人资料及收藏地点。你也可通过清除应用在设备上的存储来清除本地数据。如需帮助，请通过下方方式联系我们。" />
          <Block title="安全与保留期限" body="我们采取合理的管理与技术措施保护信息，但任何线上服务都无法保证绝对安全。账户数据在你账户有效期间保留；联系信息仅在为支持、运营、法律或留档目的合理必要的期限内保留。" />
          <Block title="政策更新" body="我们可能不定期更新本政策。以本页面发布的最新版本为准。" />
          <Block title={t.contact} body={<>{t.contactBody} {contactTarget ? <a href={contactTarget}>WhatsApp</a> : '（WhatsApp 通道待启用）'}。{CONTACT_EMAIL ? <> 邮箱：<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>。</> : null}</>} />
        </>
      ) : (
        <>
          <Block title="Who operates the service" body="KiddoMap is currently operated by an individual creator, not a registered company. References to “KiddoMap,” “we,” “us,” or “our” refer to that individual operator unless the service is later transferred to a legal entity." />
          <Block title="Information we collect" body={<>We collect only what the app needs to function:<br /><br />· <b>Account information</b>: If you sign in, we collect your email address to authenticate you (via Supabase, using a one-time passcode). We do not collect or store passwords.<br />· <b>Saved places</b>: Places you save are stored in your account so they sync across devices.<br />· <b>Location</b>: With your permission, we use your device location to show nearby places and local weather. Your location is processed on-device and used to request weather data (Open-Meteo); it is not stored on our servers and is not linked to your identity.<br />· <b>Usage data</b>: We collect anonymous usage data (such as which screens and places are viewed) through Google Analytics (GA4) to understand how the app is used and improve it.<br />· <b>Child age range (on your device only)</b>: During setup you may enter a child's age range to personalise recommendations. This stays on your device, is not uploaded to our servers, and is not linked to your identity.<br />· <b>Information you submit</b>: If you contact us by email or feedback form, we receive what you choose to send (name, contact details, message content).</>} />
          <Block title="How we use information" body="We use information to operate the app, sign you in, sync your saved places, show nearby and weather-relevant recommendations, understand usage to improve the product, respond to enquiries, and reduce technical issues." />
          <Block title="Location data" body="Location is used only to show nearby places and local weather. Your coordinates are processed on your device and sent to a weather provider (Open-Meteo) to retrieve forecasts. We do not store your location on our servers and do not associate it with your identity. You can disable location access at any time in your device settings." />
          <Block title="Children's information" body="KiddoMap is intended to be used by adults, parents, and guardians. Any child age range you enter is stored only on your device to personalise recommendations — it is never uploaded, shared, or linked to an identity. We do not knowingly collect personal information directly from children. If you believe a child has submitted personal information to us, please contact us." />
          <Block title="Photos and place information" body="Place photos are requested from Google at the time you view a place. When requesting a photo, we send only the place identifier to Google — we do not send your personal information, account details, or location. Photos are displayed at runtime and are not stored by us." />
          <Block title="Third-party services" body={<>KiddoMap relies on the following third parties, each governed by its own privacy policy:<br /><br />· <b>Google Analytics (GA4)</b> — anonymous usage analytics<br />· <b>Supabase</b> — account sign-in and saved-place storage<br />· <b>Open-Meteo</b> — weather data<br />· <b>Google Places / Google Maps, Waze</b> — place photos and navigation links<br />· <b>CartoDB / OpenStreetMap</b> — map tiles<br /><br />We also link out to navigation, ticketing, and venue websites operated by third parties; we are not responsible for their practices.</>} />
          <Block title="What we do not do" body="We do not use advertising pixels, retargeting trackers, or third-party marketing profiles, and we do not sell personal data. We do not use PostHog, session recording, or behavioural ad tracking. If this position ever changes, this policy will be updated before the change takes effect." />
          <Block title="Your choices and account deletion" body="You can delete your account at any time from within the app: open the “Me” tab and, in the signed-in account card, tap “Delete account.” Deletion removes your account, profile, and saved places. You can also clear locally stored data by clearing the app's storage on your device. For help, contact us using the details below." />
          <Block title="Security and retention" body="We maintain reasonable administrative and technical safeguards, but no online service can guarantee absolute security. We retain account data while your account is active, and contact messages only as long as reasonably necessary for support, operational, legal, or recordkeeping purposes." />
          <Block title="Changes to this policy" body="We may update this policy from time to time. The version published on this page is the controlling version." />
          <Block title="Contact" body={<>For privacy questions, you may {contactTarget ? <a href={contactTarget}>contact us on WhatsApp</a> : 'contact us once the WhatsApp line is published'}. {CONTACT_EMAIL ? <>You may also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : null}</>} />
        </>
      )}
    </ContentPage>
  );
}

function Block({ title, body }) {
  return (
    <section style={{ display: 'grid', gap: '6px', paddingTop: '2px' }}>
      <h2 style={{ margin: 0, fontSize: '18px', lineHeight: 1.25, fontWeight: 900 }}>{title}</h2>
      <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#4f4f4f', maxWidth: '70ch' }}>{body}</div>
    </section>
  );
}
