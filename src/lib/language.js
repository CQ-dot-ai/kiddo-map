import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DEFAULT_LANGUAGE } from './copy';

const SUPPORTED = new Set(['zh', 'en']);

export function useLanguage() {
  const router = useRouter();
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const queryLang = typeof router?.query?.lang === 'string' ? router.query.lang.toLowerCase() : null;
    if (queryLang && SUPPORTED.has(queryLang)) {
      setLanguage(queryLang);
      try {
        localStorage.setItem('kiddo-language', queryLang);
      } catch {}
      return;
    }

    try {
      const saved = localStorage.getItem('kiddo-language');
      if (saved && SUPPORTED.has(saved)) {
        setLanguage(saved);
      }
    } catch {}
  }, [router?.query?.lang]);

  const changeLanguage = (next) => {
    if (!SUPPORTED.has(next)) return;
    setLanguage(next);
    try {
      localStorage.setItem('kiddo-language', next);
    } catch {}
  };

  return { language, setLanguage: changeLanguage };
}
