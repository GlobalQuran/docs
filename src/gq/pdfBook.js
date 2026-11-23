/**
 * The Quran as printed pages: the same mushaf glyph fonts, tajweed colours, golden frame and surah cartouche as the Quran Anywhere
 * reader (github-public-apps/quran-anywhere). Used by the PDF page for the preview and for the print, so both are the same markup.
 *
 * Data: glyph words per surah from the CDN (quran_data/qcf/<surah>.json: [ayah][word] = [glyph, uthmani, meaning, transliteration, page, isEnd]),
 * the page fonts (fonts/qcf/v2-pN = plain, v4-pN = tajweed colours), and the page/surah tables in /pdf-assets (copied from the reader).
 */
import { API, DOCS_API_KEY } from './ui';

const CDN = 'https://cdn.globalquran.com';
export const ASSETS = '/pdf-assets';

/** A4 is the reference (794 x 1123 CSS px); every size in the CSS is multiplied by --u = width / 794. */
export const SIZES = { A4: [794, 1123], A5: [559, 794], Letter: [816, 1056] };
export const MM = { A4: ['210mm', '297mm'], A5: ['148mm', '210mm'], Letter: ['8.5in', '11in'] };
export const TEXT = { sm: 32, md: 38, lg: 46 };

const RTL = new Set(['ar', 'fa', 'ur', 'ps', 'sd', 'ug', 'ku', 'dv', 'he', 'yi']);
export const isRtl = (id) => RTL.has(String(id || '').split('.')[0]);

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad3 = (n) => String(n).padStart(3, '0');

/* ---------- data ---------- */
const qcf = new Map();
export function loadQcf(s) {
  if (!qcf.has(s)) qcf.set(s, fetch(`${CDN}/quran_data/qcf/${s}.json`).then((r) => { if (!r.ok) throw new Error(`mushaf data ${r.status}`); return r.json(); }).catch((e) => { qcf.delete(s); throw e; }));
  return qcf.get(s);
}

let metaP;
export function loadMeta() {
  if (!metaP) metaP = Promise.all([fetch(`${ASSETS}/surahs.json`).then((r) => r.json()), fetch(`${ASSETS}/pages.json`).then((r) => r.json())])
    .then(([s, pages]) => ({ bismillah: s.bismillah, surahs: s.surahs, pages })).catch((e) => { metaP = null; throw e; });
  return metaP;
}

const trCache = new Map();   // edition id -> Map("s:n" -> text)
async function fetchTr(path, id, into) {
  const key = DOCS_API_KEY ? `?key=${encodeURIComponent(DOCS_API_KEY)}` : '';
  const r = await fetch(`${API}/v1/${path}/${id}${key}`);
  if (!r.ok) throw new Error(`translation ${r.status}`);
  const q = ((await r.json()).quran || {})[id] || {};
  Object.values(q).forEach((a) => into.set(`${a.surah}:${a.ayah}`, a.verse));
}
/** make sure the translation for these surahs is loaded (many surahs: the whole Quran in one request) */
export async function ensureTranslation(id, surahs) {
  if (!id) return new Map();
  if (!trCache.has(id)) trCache.set(id, { map: new Map(), done: new Set(), all: false });
  const c = trCache.get(id);
  const need = [...new Set(surahs)].filter((s) => !c.done.has(s));
  if (!c.all && need.length > 12) { await fetchTr('complete', id, c.map); c.all = true; }
  else if (!c.all) await Promise.all(need.map((s) => fetchTr(`surah/${s}`, id, c.map).then(() => c.done.add(s))));
  return c.map;
}

/** which mushaf pages a scope covers, and which ayahs of them belong to it */
export async function scopePages(scope, num) {
  if (scope === 'whole') return { pages: Array.from({ length: 604 }, (_, i) => i + 1), allowed: () => true };
  if (scope === 'surah') {
    const d = await loadQcf(num);
    const set = new Set(); d.forEach((ay) => ay.forEach((w) => set.add(w[4])));
    return { pages: [...set].sort((a, b) => a - b), allowed: (s) => s === num };
  }
  const key = DOCS_API_KEY ? `?key=${encodeURIComponent(DOCS_API_KEY)}` : '';
  const j = await (await fetch(`${API}/v1/juz/${num}/quran-uthmani${key}`)).json();
  const q = (j.quran || {})['quran-uthmani'] || {};
  const ok = new Set(), surahs = new Set();
  Object.values(q).forEach((a) => { ok.add(`${a.surah}:${a.ayah}`); surahs.add(a.surah); });
  const set = new Set();
  for (const s of surahs) { const d = await loadQcf(s); d.forEach((ay, i) => { if (ok.has(`${s}:${i + 1}`)) ay.forEach((w) => set.add(w[4])); }); }
  return { pages: [...set].sort((a, b) => a - b), allowed: (s, n) => ok.has(`${s}:${n}`) };
}

/* ---------- fonts ---------- */
const fontPages = new Set();
let fontStyle;
export function registerFonts(pages) {
  if (!fontStyle) { fontStyle = document.head.appendChild(document.createElement('style')); fontStyle.dataset.pdfFonts = '1'; }
  let css = '';
  for (const p of pages) {
    if (fontPages.has(p)) continue; fontPages.add(p);
    css += `@font-face{font-family:QCF2P${p};src:url(${CDN}/fonts/qcf/v2-p${p}.woff2) format("woff2");font-display:block}` +
           `@font-face{font-family:QCF4P${p};src:url(${CDN}/fonts/qcf/v4-p${p}.woff2) format("woff2");font-display:block}` +
           `.pdf-root .g.p${p}{font-family:QCF2P${p}}.pdf-root.tj .g.p${p}{font-family:QCF4P${p},QCF2P${p}}`;
  }
  if (css) fontStyle.appendChild(document.createTextNode(css));
}
/** wait for the page fonts (and the surah-name font) so the layout is measured with the real glyphs */
export async function loadFonts(pages, tajweed, onProgress) {
  registerFonts(pages);
  let done = 0;
  await Promise.all([
    document.fonts.load('30px SurahNames', '001').catch(() => {}),
    ...pages.map((p) => document.fonts.load(`30px ${tajweed ? 'QCF4P' : 'QCF2P'}${p}`).then((r) => (!r.length && tajweed ? document.fonts.load(`30px QCF2P${p}`) : r)).catch(() => {}).then(() => onProgress && onProgress(++done, pages.length))),
  ]);
}

/* ---------- markup ---------- */
const gSpan = (w) => `<span class="g p${w[4]}" aria-hidden="true">${w[0]}</span>`;
const wordsHtml = (words) => words.map((w) => (w[5] ? `<span class="qe">${gSpan(w)}</span>` : `<span class="w">${gSpan(w)}<span class="sr">${esc(w[1])}</span></span>`)).join(' ');

function headHtml(m, plain) {
  const info = `<p class="s-info"><b>${esc(m.en)}</b> · ${esc(m.me)} · ${m.t === 'M' ? 'Meccan' : 'Medinan'} · ${m.c} verses · Juz ${m.j}</p>`;
  if (plain) return `<div class="it head plain-h"><div class="ph-ar" lang="ar">${esc(m.ar)}</div>${info}</div>`;
  return `<div class="it head"><div class="cart"><img src="${ASSETS}/title_border@4x.webp" alt=""><b class="sn" aria-label="Surah ${m.n}, ${esc(m.en)}">${pad3(m.n)}</b></div>${info}</div>`;
}

/** the surahs that have ayahs on mushaf page p */
export function pageSurahs(p, meta) {
  const [s0] = meta.pages[p - 1];
  const next = meta.pages[p];                       // where the next page starts
  const sLast = !next ? 114 : next[1] === 1 ? next[0] - 1 : next[0];
  return Array.from({ length: sLast - s0 + 1 }, (_, i) => s0 + i);
}

/**
 * The items of one mushaf page: surah headings, bismillah and the ayahs (or the part of an ayah that sits on this page).
 * o: { allowed, trMap, tlit, plain }
 */
export async function pageItems(p, meta, o) {
  const items = [];
  for (const s of pageSurahs(p, meta)) {
    const data = await loadQcf(s), m = meta.surahs[s - 1];
    for (let i = 0; i < data.length; i++) {
      const n = i + 1;
      if (o.allowed && !o.allowed(s, n)) continue;
      const words = data[i].filter((w) => w[4] === p);
      if (!words.length) continue;
      if (n === 1 && data[0][0][4] === p) {
        items.push({ kind: 'head', html: headHtml(m, o.plain) });
        if (s !== 1 && s !== 9) { const f = (await loadQcf(1))[0].slice(0, 4); items.push({ kind: 'bism', html: `<div class="it bism qcf" lang="ar">${wordsHtml(f)}</div>`, p1: true }); }
      }
      const endsHere = words.some((w) => w[5]);
      const tlit = o.tlit ? words.filter((w) => !w[5] && w[3]).map((w) => w[3]).join(' ') : '';
      items.push({ kind: 'ayah', s, n, words, tlit, tr: endsHere ? o.trMap && o.trMap.get(`${s}:${n}`) : '' });
    }
  }
  return items;
}

const verseHtml = (it, rtlTr) => `<div class="it ayah"><div class="ar qcf" lang="ar">${wordsHtml(it.words)}</div>` +
  (it.tlit ? `<div class="tlit">${esc(it.tlit)}</div>` : '') + (it.tr ? `<div class="trs${rtlTr ? ' rtl' : ''}" ${rtlTr ? 'dir="rtl"' : ''}>${esc(it.tr)}</div>` : '') + '</div>';

/** items -> the inner markup of one sheet. Flow mode (Arabic only) runs the ayahs on like a printed mushaf. */
function innerHtml(items, verse, rtlTr) {
  if (verse) return items.map((it) => (it.kind === 'ayah' ? verseHtml(it, rtlTr) : it.html)).join('');
  let out = '', buf = '';
  const flush = () => { if (buf) out += `<div class="it flow qcf" lang="ar">${buf}</div>`; buf = ''; };
  for (const it of items) { if (it.kind === 'ayah') buf += (buf ? ' ' : '') + wordsHtml(it.words); else { flush(); out += it.html; } }
  flush();
  return out;
}

export function rootVars(size, textSize) {
  const [w, h] = SIZES[size] || SIZES.A4;
  return { '--w': `${w}px`, '--h': `${h - 1}px`, '--u': w / 794, '--ar': `${TEXT[textSize] || TEXT.md}px` };
}

const FRAME = '<div class="pb-frame" aria-hidden="true"><i class="mf-t"></i><i class="mf-b"></i><i class="mf-l"></i><i class="mf-r"></i><i class="mf-tl"></i><i class="mf-tr"></i><i class="mf-bl"></i><i class="mf-br"></i></div>';
const sheetHtml = (inner, p, label, plain, k, verse) => `<section class="pdf-sheet${plain ? ' plain' : ''}${verse ? ' vs' : ''}" style="--k:${k}">${plain ? '' : FRAME}<div class="pdf-body">${inner}</div><div class="pdf-foot">${label || p}</div></section>`;

let probe;
function getProbe(o) {
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:-99999px;top:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
  }
  probe.className = `pdf-root${o.tajweed && !o.plain ? ' tj' : ''}`;
  const v = rootVars(o.size, o.textSize);
  Object.entries(v).forEach(([a, b]) => probe.style.setProperty(a, b));
  return probe;
}

/**
 * One mushaf page -> one or more sheets (several when a translation or transliteration makes it longer than a sheet).
 * Returns [{ html, p, sub, of }]. o: { size, textSize, plain, tajweed, tlit, trId, trMap, allowed }
 */
export async function pageSheets(p, meta, o) {
  const items = await pageItems(p, meta, o);
  const verse = !!(o.tlit || o.trId);
  const rtlTr = isRtl(o.trId);
  const box = getProbe(o);
  const measure = (inner, k) => {
    box.innerHTML = sheetHtml(inner, p, p, o.plain, k, verse);
    const body = box.querySelector('.pdf-body');
    return { body, over: body.scrollHeight > body.clientHeight + 1 };
  };
  let groups;
  if (!verse) {
    groups = [items];
  } else {
    // pack whole items into sheets by their measured height
    const first = measure(innerHtml(items, true, rtlTr), 1);
    const cap = first.body.clientHeight;
    const hs = [...first.body.children].map((el) => el.offsetHeight);
    groups = []; let cur = [], used = 0;
    items.forEach((it, i) => {
      if (cur.length && used + hs[i] > cap) { groups.push(cur); cur = []; used = 0; }
      cur.push(it); used += hs[i];
    });
    if (cur.length) groups.push(cur);
  }
  return groups.map((g, i) => {
    const inner = innerHtml(g, verse, rtlTr);
    let k = 1;
    if (!verse) { let r = measure(inner, k); while (r.over && k > 0.5) { k = Math.round((k - 0.02) * 100) / 100; r = measure(inner, k); } }
    return { html: sheetHtml(inner, p, groups.length > 1 ? `${p} · ${i + 1}/${groups.length}` : p, o.plain, k, verse), p, sub: i, of: groups.length };
  });
}

/** the frame pieces are CSS backgrounds of hidden print markup: have them loaded and decoded before the print starts */
export function preloadArt() {
  const names = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'].map((x) => `frame_${x}@4x.webp`).concat('title_border@4x.webp');
  return Promise.all(names.map((n) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = `${ASSETS}/${n}`; if (i.decode) i.decode().then(res, res); })));
}

export function disposeProbe() { if (probe) { probe.remove(); probe = null; } }
