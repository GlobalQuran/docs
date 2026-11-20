import { ENDPOINTS } from './endpoints';

// Hand-written pages, plus every API endpoint, plus (when loaded) every translation and reciter.
const PAGES = [
  ['How it works', '/how-it-works', 'quran id ids ayah number global surah url audio explained start learn guide'],
  ['API', '/api', 'api key free sign in get key landing'],
  ['API reference', '/api/reference', 'endpoints endpoint reference docs get request json'],
  ['Embed the reader', '/embed', 'embed reader iframe website app snippet quran anywhere widget html'],
  ['Download data', '/data', 'data download translation transliteration tafsir arabic txt json jsonp zip files'],
  ['Audio', '/audio', 'audio mp3 ogg reciter recitor cdn verse surah url sound recitation'],
  ['Assets', '/assets', 'fonts images ayah images logo mushaf tajweed typeface'],
  ['Quran PDF', '/pdf', 'pdf print download whole quran book'],
  ['AI instructions', '/ai-instructions', 'ai assistant chatgpt claude prompt build llm'],
  ['Donate', '/donate', 'donate donation support sadaqah wall donors'],
  ['About', '/about', 'about us team'],
  ['Contact', '/contact', 'contact email feedback'],
  ['My API keys', '/keys', 'key keys api key create delete suspend project'],
];

const STATIC = [
  ...PAGES.map(([t, to, k]) => ({ title: t, to, sub: to, kw: k, group: 'Pages' })),
  ...ENDPOINTS.map((e) => ({ title: e.title, to: `/api/reference/${e.slug}`, sub: `GET ${e.path}`, kw: `${e.path} ${e.summary} endpoint api`, group: 'API' })),
];

const norm = (s) => s.toLowerCase();

export function searchAll(q, { texts = [], reciters = [] } = {}) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const ok = (hay) => words.every((w) => hay.includes(w));
  const out = [];
  STATIC.forEach((r) => { if (ok(norm(`${r.title} ${r.kw}`))) out.push(r); });
  texts.forEach((t) => {
    if (ok(norm(`${t.id} ${t.name} ${t.localName || ''} ${t.language} ${t.type}`))) out.push({ title: `${t.id} · ${t.name}`, to: `/data?q=${encodeURIComponent(t.id)}`, sub: `${t.type} · ${t.language}`, group: 'Data' });
  });
  reciters.forEach((r) => {
    if (ok(norm(`${r.id} ${r.name} ${r.localName || ''} ${r.language} reciter`))) out.push({ title: `${r.name}`, to: `/audio?q=${encodeURIComponent(r.id)}`, sub: `${r.id} · audio`, group: 'Audio' });
  });
  // pages and endpoints first, then data and audio; at most 10
  return out.slice(0, 10);
}
