import React, { useEffect, useMemo, useState } from 'react';
import { Page, CopyButton, Seg } from '../gq/ui';
import { useSurahs } from '../gq/data';

const CDN = 'https://cdn.globalquran.com';
const READER = 'https://globalquran.com';

const FONTS = [
  { id: 'amiri', name: 'Amiri Quran', file: 'AmiriQuran-Regular.ttf', fmt: 'truetype', family: 'GQ Amiri Quran', note: 'Clean naskh, great for long reading.' },
  { id: 'kfgqpc', name: 'KFGQPC Naskh', file: 'KFCNaskh.woff', fmt: 'woff', family: 'GQ KFGQPC Naskh', note: 'Madinah mushaf naskh from the King Fahd Complex.' },
  { id: 'me', name: 'Me Quran', file: 'me_quran-webfont.woff', fmt: 'woff', family: 'GQ Me Quran', note: 'Light, open style with full tajweed marks.' },
];
const SAMPLES = [
  ['Bismillah', 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'],
  ['Ayat al-Kursi', 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ'],
  ['Al-Ikhlas', 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ'],
];
const fontCss = (f) => `@font-face { font-family: "${f.family}"; src: url("${CDN}/fonts/${f.file}") format("${f.fmt}"); }`;

/** Mushaf as printed: glyph fonts from Quran.com (QCF), plain (v2) or with tajweed colours (v4). */
const Mushaf = () => {
  const surahs = useSurahs();
  const [s, setS] = useState(1);
  const [mode, setMode] = useState('normal');
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    setBusy(true);
    fetch(`${CDN}/quran_data/qcf/${s}.json`).then((r) => r.json()).then((j) => {
      if (!live) return;
      const flat = j.flat();
      const first = flat[0] ? flat[0][4] : 1;
      setPage(first); setWords(flat);
    }).catch(() => live && setWords([])).finally(() => live && setBusy(false));
    return () => { live = false; };
  }, [s]);

  const onPage = useMemo(() => words.filter((w) => w[4] === page), [words, page]);
  const pages = useMemo(() => [...new Set(words.map((w) => w[4]))], [words]);
  const css = `@font-face{font-family:QCF2P${page};src:url(${CDN}/fonts/qcf/v2-p${page}.woff2) format("woff2");font-display:block}
@font-face{font-family:QCF4P${page};src:url(${CDN}/fonts/qcf/v4-p${page}.woff2) format("woff2") tech(color-COLRv1);font-display:block}`;
  const family = mode === 'tajweed' ? `QCF4P${page}, QCF2P${page}` : `QCF2P${page}`;

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <style>{css}</style>
      <div className="cap"><span>Mushaf pages</span><span className="badge">604 pages</span></div>
      <div className="small mute" style={{ marginBottom: 12 }}>Every page of the printed mushaf is a font: one glyph per word, so text stays sharp and selectable. Pick a surah and compare plain with tajweed colours.</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 14 }}>
        <div style={{ minWidth: 220 }}><div className="lbl">Surah</div>
          <select className="sel" value={s} onChange={(e) => setS(Number(e.target.value))}>
            {surahs.length ? surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>) : <option value={s}>{s}</option>}</select></div>
        <Seg value={mode} onChange={setMode} options={[{ value: 'normal', label: 'Normal' }, { value: 'tajweed', label: 'Tajweed colours' }]} />
        {pages.length > 1 && (<div style={{ minWidth: 140 }}><div className="lbl">Page</div>
          <select className="sel" value={page} onChange={(e) => setPage(Number(e.target.value))}>{pages.map((p) => <option key={p} value={p}>Page {p}</option>)}</select></div>)}
      </div>
      <div className="sheet" style={{ maxWidth: 520, margin: '0 auto', minHeight: 220 }}>
        {busy && <div className="loading">Loading…</div>}
        <div style={{ fontFamily: family, fontSize: 30, lineHeight: 2.1, direction: 'rtl', textAlign: 'justify', textAlignLast: 'center', color: '#2b3434' }}>
          {onPage.map((w, i) => <span key={i}>{w[0]} </span>)}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#4f5b5a', marginTop: 8 }}>Page {page}</div>
      </div>
      <div className="small mute" style={{ marginTop: 10 }}>Tajweed colours need a browser with colour-font support (Chrome, Edge, Firefox). Safari shows the plain version.</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        <a className="btn p s" href={`${READER}/?font=mushaf#${s}:1`} target="_blank" rel="noopener noreferrer">View this in Quran Anywhere</a>
        <CopyButton text={`${CDN}/fonts/qcf/v2-p${page}.woff2`} label="Copy plain font link" />
        <CopyButton text={`${CDN}/fonts/qcf/v4-p${page}.woff2`} label="Copy tajweed font link" />
        <CopyButton text={`${CDN}/quran_data/qcf/${s}.json`} label="Copy glyph data link" />
      </div>
    </div>
  );
};

const AssetsPage = () => {
  const [fid, setFid] = useState('amiri');
  const [sample, setSample] = useState(0);
  const f = FONTS.find((x) => x.id === fid);
  const css = FONTS.map(fontCss).join('\n');
  return (
    <Page>
      <style>{css}</style>
      <div className="in" style={{ paddingTop: 36 }}>
        <h1 className="h1" style={{ fontSize: 38 }}>Assets</h1>
        <p className="lead" style={{ margin: '8px 0 22px', maxWidth: 680 }}>Quran fonts, mushaf pages and verse images, free to use. Download them, or link them from our CDN.</p>

        <div className="card">
          <div className="cap"><span>Arabic fonts</span><span className="badge">try them</span></div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <Seg value={fid} onChange={setFid} options={FONTS.map((x) => ({ value: x.id, label: x.name }))} />
            <Seg value={sample} onChange={setSample} options={SAMPLES.map((x, i) => ({ value: i, label: x[0] }))} />
          </div>
          <div style={{ fontFamily: `"${f.family}", serif`, fontSize: 40, lineHeight: 2, direction: 'rtl', textAlign: 'right', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 18px', background: 'var(--field)' }}>{SAMPLES[sample][1]}</div>
          <div className="small mute" style={{ margin: '10px 0' }}>{f.name}: {f.note}</div>
          <div className="code" style={{ fontSize: 12 }}>{fontCss(f)}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <a className="btn p s" href={`${CDN}/fonts/${f.file}`} download>Download {f.name}</a>
            <CopyButton text={fontCss(f)} label="Copy CSS" />
            <CopyButton text={`${CDN}/fonts/${f.file}`} label="Copy link" />
            <a className="btn s" href={`${READER}/?font=${f.id === 'kfgqpc' ? 'mushaf' : f.id}`} target="_blank" rel="noopener noreferrer">View in Quran Anywhere</a>
          </div>
          <div className="small mute" style={{ marginTop: 12 }}>Also on the CDN: <span className="chip">sura_names.woff2</span> (calligraphic surah titles). All fonts together: <a href={`${CDN}/resources/quran-fonts.zip`} style={{ fontWeight: 700 }}>quran-fonts.zip</a>.</div>
        </div>

        <Mushaf />

        <div className="grid g2" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="cap"><span>Ayah images</span><span className="badge">6,236 PNG</span></div>
            <div style={{ border: '1px solid var(--gold)', borderRadius: 6, background: '#fbfaf6', padding: 10, color: '#2b3434', marginBottom: 10 }}>
              <div style={{ font: '400 22px/1.8 "GQ Amiri Quran", serif', direction: 'rtl', textAlign: 'right' }}>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</div></div>
            <div className="small mute" style={{ marginBottom: 12 }}>One image per verse, named like <span className="chip">2_255.png</span> (surah_ayah) inside the ZIP, about 31 MB.</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><a className="btn p s" href={`${CDN}/resources/quran-ayah-images.zip`}>Download images (ZIP)</a><CopyButton text={`${CDN}/resources/quran-ayah-images.zip`} label="Copy link" /></div>
          </div>
          <div className="card">
            <div className="cap"><span>All fonts</span><span className="badge">ZIP</span></div>
            <div className="small mute" style={{ marginBottom: 12 }}>Amiri Quran, KFGQPC Naskh, Me Quran and the others in one download. Free for personal and commercial use. Mushaf page fonts load straight from the CDN (see above).</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><a className="btn p s" href={`${CDN}/resources/quran-fonts.zip`}>Download fonts (ZIP)</a></div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 18 }}>
          <div className="h3">Good to know</div>
          <div className="grid g3" style={{ marginTop: 10, gap: 12 }}>
            <div className="small mute">Treat the text with respect: no changes to the words.</div>
            <div className="small mute">Check each font's licence and test it in your app before release.</div>
            <div className="small mute">Mushaf fonts and word data come from Quran.com, who allow developers to use them.</div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AssetsPage;
