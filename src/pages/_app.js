import '../../styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#FF8A65" />
        <meta name="google-site-verification" content="0K4J9JkzOUeR7aZ1jRctVZl17liTAImF-ZkNiZSXxHM" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kiddo Map" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
