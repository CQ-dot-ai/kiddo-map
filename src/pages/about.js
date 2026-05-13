import ContentPage from '../components/ContentPage';
import { SITE_URL } from '../lib/site';

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Kiddo Map',
    url: `${SITE_URL}/about`,
    description: 'Why Kiddo Map exists and how it helps Kuala Lumpur parents decide where to take their kids faster.',
  };

  return (
    <ContentPage
      title="About Kiddo Map"
      description="Kiddo Map is built for tired Kuala Lumpur parents who want one clear answer, not another hour of browsing."
      path="/about"
      eyebrow="About"
      structuredData={structuredData}
    >
      <p>
        Kiddo Map is not trying to be a prettier map. The job is simpler: help parents in Kuala Lumpur decide where to take their kids in about three minutes.
      </p>
      <p>
        We focus on the questions that actually block a family decision: Is it indoor or outdoor? What age is it good for? How long will it take? Will parents need a lot of energy? Is it easy to start?
      </p>
      <p>
        The recommendations are curated from place data, family-fit heuristics, and practical notes. The current version is still editorial and improving. It is designed to reduce hesitation, not replace official venue information.
      </p>
      <p>
        If you find a broken detail, a better family tip, or a place we should add, use the feedback flow inside the product or the contact page.
      </p>
    </ContentPage>
  );
}
