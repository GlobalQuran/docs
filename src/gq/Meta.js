import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ROUTES from './routes.json';
import { ENDPOINTS } from './endpoints';

const SITE = 'https://docs.globalquran.com';
const PRIVATE = /^\/keys/;

function lookup(path) {
  const clean = path.replace(/\/+$/, '') || '/';
  if (PRIVATE.test(clean)) return { path: clean, title: 'Your API keys | GlobalQuran', description: 'Manage your GlobalQuran API keys.' };
  const hit = ROUTES.find((r) => r.path === clean);
  if (hit) return hit;
  const m = clean.match(/^\/api\/reference\/(.+)$/);
  if (m) {
    const e = ENDPOINTS.find((x) => x.slug === m[1]);
    if (e) return { path: clean, title: `${e.title}: Quran API endpoint`, description: `How to call ${e.path} in the GlobalQuran API, with parameters and a live Run button.` };
  }
  return ROUTES[0];
}

function setMeta(sel, attr, key, value) {
  let el = document.head.querySelector(sel);
  if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute(sel.startsWith('link') ? 'href' : 'content', value);
}

/** Sets the title, description, canonical and share tags for the current page. Key pages are marked noindex. */
const Meta = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = lookup(pathname);
    const url = SITE + (m.path === '/' ? '/' : `${m.path}/`);
    document.title = m.title;
    setMeta('meta[name="description"]', 'name', 'description', m.description);
    setMeta('link[rel="canonical"]', 'rel', 'canonical', url);
    setMeta('meta[property="og:title"]', 'property', 'og:title', m.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', m.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    const img = 'https://docs.globalquran.com/og-image.png';
    setMeta('meta[property="og:image"]', 'property', 'og:image', img);
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img);
    setMeta('meta[name="robots"]', 'name', 'robots', PRIVATE.test(pathname) ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);
  return null;
};
export default Meta;
