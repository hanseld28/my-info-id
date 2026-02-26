const LOCAL_DEVELOPMENT_FALLBACK_URL = `http://localhost:${process.env.PORT || 3000}`;
const PRODUCTION_FALLBACK_URL = 'https://meuinfoid.com.br';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_FALLBACK_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return LOCAL_DEVELOPMENT_FALLBACK_URL;
};