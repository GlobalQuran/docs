// Builds the ready-made Quran PDFs with headless Chrome from the live API text.
//   node tools/make-pdfs.mjs [outDir]      (default: tools/out)
// Needs Node 18+ and Google Chrome. Upload the results to cdn.globalquran.com/resources/pdf/ (see README of the CDN bucket).
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const API = 'https://api.globalquran.com';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = resolve(process.argv[2] || 'tools/out');
mkdirSync(out, { recursive: true });

const VARIANTS = [
  { file: 'quran-arabic.pdf', tr: '', size: 24 },
  { file: 'quran-arabic-en-sahih.pdf', tr: 'en.sahih', size: 22 },
  { file: 'quran-arabic-large-print.pdf', tr: '', size: 34 },
];
const ARABIC = 'quran-uthmani';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const surahs = Object.values((await (await fetch(`${API}/surah`)).json()).surahList).sort((a, b) => a.surah_number - b.surah_number);
const get = async (id) => (await (await fetch(`${API}/v1/complete/${id}.json`)).json()).quran[id];

for (const v of VARIANTS) {
  const ar = await get(ARABIC);
  const tr = v.tr ? await get(v.tr) : {};
  let html = `<!doctype html><meta charset="utf-8"><title>Quran</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<style>@page{size:A4;margin:16mm}body{margin:0;color:#000}
h1{font:700 15px Georgia,serif;text-align:center;margin:22px 0 8px;break-after:avoid;border-bottom:1px solid #999;padding-bottom:4px}
.a{font:400 ${v.size}px/2.2 Amiri,serif;direction:rtl;text-align:right}.t{font:${Math.round(v.size / 2)}px/1.45 Georgia,serif;color:#222;margin:0 0 8px}
.cover{height:240mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;break-after:page}
.cover b{font:400 64px Amiri,serif}.cover span{font:14px Georgia,serif;margin-top:14px;color:#444}</style>
<div class="cover"><b>القرآن الكريم</b><span>The Noble Quran · globalquran.com${v.tr ? ' · translation: ' + v.tr : ''}</span></div>`;
  for (const s of surahs) {
    html += `<h1>${esc(s.name_english)} · ${s.name_arabic} · ${s.surah_number}</h1>`;
    for (let n = s.start_ayah; n <= s.end_ayah; n += 1) {
      const a = ar[n];
      if (!a) continue;
      html += `<div class="a">${esc(a.verse)} ﴿${a.ayah}﴾</div>`;
      if (v.tr && tr[n]) html += `<p class="t">${esc(tr[n].verse)}</p>`;
    }
  }
  const htmlPath = join(out, v.file.replace('.pdf', '.html'));
  writeFileSync(htmlPath, html);
  console.log('printing', v.file);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=60000', `--print-to-pdf=${join(out, v.file)}`, `file://${htmlPath}`], { stdio: 'inherit', timeout: 600000 });
}
console.log('done ->', out);
