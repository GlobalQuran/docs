import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Page, Seg } from '../gq/ui';
import { useQuranList, useSurahs } from '../gq/data';
import { MM, SIZES, ensureTranslation, loadFonts, loadMeta, backSheet, coverSheet, pageSheets, preloadArt, pageSurahs, rootVars, scopePages } from '../gq/pdfBook';

const PDF_CDN = 'https://cdn.globalquran.com/resources/pdf';
const READY = [
  ['quran-arabic.pdf', 'Arabic only', 'Clean mushaf-style text, medium size'],
  ['quran-arabic-en-sahih.pdf', 'Arabic + English', 'Saheeh International under every ayah'],
  ['quran-arabic-large-print.pdf', 'Large print', 'Big Arabic text for easy reading'],
];

/** One-click files. Each link only shows once the file really exists on the CDN. */
const ReadyMade = () => {
  const [have, setHave] = useState({});
  useEffect(() => {
    READY.forEach(([f]) => {
      fetch(`${PDF_CDN}/${f}`, { method: 'HEAD' }).then((r) => { if (r.ok) setHave((h) => ({ ...h, [f]: Number(r.headers.get('content-length')) || true })); }).catch(() => {});
    });
  }, []);
  const list = READY.filter(([f]) => have[f]);
  if (!list.length) return <div className="card" style={{ marginTop: 16 }}><div className="small mute">Ready-made files (Arabic only, Arabic + English, large print) are on the way, so one click can download them without the print step.</div></div>;
  return (
    <div style={{ marginTop: 16 }}>
      <div className="h3" style={{ marginBottom: 10 }}>Ready-made, one click</div>
      <div className="grid g3" style={{ gap: 12 }}>
        {list.map(([f, t, d]) => (
          <a key={f} className="tile" href={`${PDF_CDN}/${f}`} download>
            <div className="h3">{t}</div><div className="mute small">{d}</div>
            <span className="go">Download{typeof have[f] === 'number' ? ` · ${(have[f] / 1048576).toFixed(0)} MB` : ''} →</span>
          </a>
        ))}
      </div>
    </div>
  );
};

const PREVIEW_W = 360;
/** the page's own stylesheet (frame pictures and fonts are addressed from /pdf-assets, so it is served as a plain file) */
function useBookCss() {
  useEffect(() => {
    if (document.getElementById('pdfbook-css')) return;
    const l = document.createElement('link'); l.id = 'pdfbook-css'; l.rel = 'stylesheet'; l.href = '/pdf-assets/pdfbook.css'; document.head.appendChild(l);
  }, []);
}
const rootStyle = (size, textSize) => rootVars(size, textSize);

const Check = ({ checked, onChange, children, disabled, note }) => (
  <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', margin: '8px 0', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer' }}>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: 3 }} />
    <span><b style={{ fontWeight: 700 }}>{children}</b>{note && <span className="small mute" style={{ display: 'block' }}>{note}</span>}</span>
  </label>
);

const PdfPage = () => {
  useBookCss();
  const surahs = useSurahs();
  const { textFormats } = useQuranList();
  const translations = useMemo(() => textFormats.filter((t) => t.type === 'translation'), [textFormats]);
  const [scope, setScope] = useState('surah');
  const [num, setNum] = useState(1);
  const [trId, setTrId] = useState('');
  const [tlit, setTlit] = useState(false);
  const [tajweed, setTajweed] = useState(true);
  const [look, setLook] = useState('original');       // original: frame, cartouche, colours · plain: text only, black and white
  const [size, setSize] = useState('A4');
  const [fontSize, setFontSize] = useState('md');
  const [info, setInfo] = useState(null);             // { pages, allowed } of the chosen scope
  const [cover, setCover] = useState(true);          // cover and closing page with the branding
  const [pi, setPi] = useState(0);                    // index into info.pages (mushaf page)
  const [sub, setSub] = useState(0);                  // sheet within that page (long pages with a translation take several)
  const [view, setView] = useState(null);             // sheets of the current mushaf page
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [err, setErr] = useState('');
  const [printSheets, setPrintSheets] = useState(null);
  const cache = useRef(new Map());
  const coverRef = useRef(true);
  useEffect(() => { coverRef.current = cover; setPi((x) => (cover ? (x === 0 ? -1 : x) : Math.max(0, Math.min(x, info ? info.pages.length - 1 : 0)))); }, [cover]); // eslint-disable-line react-hooks/exhaustive-deps
  const plain = look === 'plain';
  const opts = useMemo(() => ({ size, textSize: fontSize, plain, tajweed: tajweed && !plain, tlit, trId }), [size, fontSize, plain, tajweed, tlit, trId]);
  const optKey = `${scope}:${num}:${size}:${fontSize}:${opts.plain}:${opts.tajweed}:${tlit}:${trId}`;

  const coverText = (meta) => {
    const t = translations.find((x) => x.id === trId);
    const lines = [plain ? 'Mushaf text, black and white' : opts.tajweed ? 'Mushaf text with tajweed colours' : 'Mushaf text', tlit && 'With transliteration',
      trId && `Translation: ${trId === 'en.sahih' ? 'Saheeh International' : (t && t.name) || trId}`].filter(Boolean);
    if (scope === 'surah') { const m = meta.surahs[num - 1]; return { title: `Surah ${m.en}`, sub: `${m.me} · ${m.c} verses`, ar: num, arName: m.ar, lines }; }
    if (scope === 'juz') return { title: `Juz ${num}`, sub: `Part ${num} of 30 · The Holy Quran`, ar: 0, lines };
    return { title: 'The Holy Quran', sub: 'The complete mushaf · 604 pages', ar: 0, lines };
  };

  // 1. which mushaf pages the choice covers
  useEffect(() => {
    let live = true; setErr(''); setInfo(null);
    scopePages(scope, num).then((r) => { if (live) { setInfo(r); setPi(coverRef.current ? -1 : 0); setSub(0); } }).catch((e) => live && setErr(`Could not load the pages: ${e.message}`));
    return () => { live = false; };
  }, [scope, num]);

  // 2. the sheets of the page being previewed (fonts and text are loaded first, so what you see is what prints)
  const isCover = !!info && pi === -1, isBack = !!info && pi === info.pages.length;
  const pageNo = info && !isCover && !isBack ? info.pages[pi] : 0;
  useEffect(() => {
    if (!info || !(pageNo || isCover || isBack)) return undefined;
    let live = true; setBusy(true);
    (async () => {
      const key = `${optKey}|${isCover ? 'cover' : isBack ? 'back' : pageNo}`;
      if (!cache.current.has(key)) {
        const meta = await loadMeta();
        if (isCover || isBack) {
          await loadFonts([1], opts.tajweed);
          const html = isCover ? await coverSheet(coverText(meta), opts) : backSheet(opts);
          cache.current.set(key, [{ html, p: 0, sub: 0, of: 1 }]);
          return cache.current.get(key);
        }
        await loadFonts([1, pageNo], opts.tajweed);
        const trMap = trId ? await ensureTranslation(trId, pageSurahs(pageNo, meta)) : null;
        cache.current.set(key, await pageSheets(pageNo, meta, { ...opts, trMap, allowed: info.allowed }));
      }
      return cache.current.get(key);
    })().then((r) => { if (live) { setView(r); setSub((x) => (x < 0 ? r.length - 1 : Math.min(x, r.length - 1))); setErr(''); } })
      .catch((e) => live && setErr(`Could not build the page: ${e.message}`)).finally(() => live && setBusy(false));
    return () => { live = false; };
  }, [info, pageNo, isCover, isBack, optKey, opts, trId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sheet = view && view[Math.min(Math.max(sub, 0), view.length - 1)];
  const last = info ? info.pages.length - 1 + (cover ? 1 : 0) : 0;
  const first = cover ? -1 : 0;
  const atStart = pi === first && sub <= 0;
  const atEnd = pi >= last && (!view || sub >= view.length - 1);
  const prev = () => { if (sub > 0) setSub(sub - 1); else if (pi > first) { setPi(pi - 1); setSub(-1); } };
  const next = () => { if (view && sub < view.length - 1) setSub(sub + 1); else if (pi < last) { setPi(pi + 1); setSub(0); } };
  const [W, H] = SIZES[size];
  const k = PREVIEW_W / W;
  const vars = rootStyle(size, fontSize);

  const savePdf = async () => {
    setBusy(true); setErr(''); setPrintSheets(null);
    try {
      const meta = await loadMeta();
      const pages = info.pages;
      await loadFonts([1, ...pages], opts.tajweed, (d, t) => setProgress(`Loading the Quran fonts ${d}/${t}`));
      const trMap = trId ? await ensureTranslation(trId, [...new Set(pages.flatMap((p) => pageSurahs(p, meta)))]) : null;
      const out = [];
      if (cover) out.push(await coverSheet(coverText(meta), opts));
      for (let i = 0; i < pages.length; i++) {
        const key = `${optKey}|${pages[i]}`;
        if (!cache.current.has(key)) cache.current.set(key, await pageSheets(pages[i], meta, { ...opts, trMap, allowed: info.allowed }));
        cache.current.get(key).forEach((s) => out.push(s.html));
        if (i % 6 === 0) { setProgress(`Laying out the pages ${i + 1}/${pages.length}`); await new Promise((r) => setTimeout(r, 0)); }
      }
      if (cover) out.push(backSheet(opts));
      await preloadArt();
      setPrintSheets(out);
      setProgress('');
      setTimeout(() => { window.print(); setBusy(false); }, 900);
    } catch (e) { setErr(`Could not prepare the file: ${e.message}`); setBusy(false); setProgress(''); }
  };
  useEffect(() => {
    const done = () => setPrintSheets(null);
    window.addEventListener('afterprint', done);
    return () => window.removeEventListener('afterprint', done);
  }, []);

  const sName = (n) => { const s = surahs.find((x) => x.surah_number === n); return s ? `${s.name_english}` : `Surah ${n}`; };
  const whole = scope === 'whole';
  return (
    <Page>
      <style>{`@page{size:${MM[size][0]} ${MM[size][1]};margin:0}@media print{.gq-noprint{display:none!important}.gq-printonly{display:block!important}html,body,#root{background:#fff!important;margin:0!important;padding:0!important;height:auto!important;min-height:0!important}.gqapp,.gq-main,.gq-new:not(.gq-noprint){display:block!important;padding:0!important;margin:0!important;min-height:0!important;height:auto!important}}.gq-printonly{display:none}`}</style>
      <div className="gq-noprint">
        <div className="in" style={{ paddingTop: 34 }}>
          <div className="eyebrow">New · free · no sign-in</div>
          <h1 className="h1" style={{ margin: '12px 0 8px', fontSize: 38 }}>The Quran as a PDF.<br />See it first, then download.</h1>
          <p className="lead" style={{ maxWidth: 680 }}>Real mushaf pages in the Quran Anywhere design: the mushaf font with tajweed colours, the golden frame and the surah titles. Or just plain black and white text. Check the preview, then save it.</p>
        </div>

        <div className="in twocol" style={{ paddingTop: 22 }}>
          <div className="aside" style={{ flex: '0 1 350px', minWidth: 300 }}>
            <div className="card">
              <div className="step"><i>1</i><div className="h3">What to include</div></div>
              <div style={{ margin: '12px 0' }}><Seg value={scope} onChange={(v) => { setScope(v); setNum(1); }} options={[{ value: 'whole', label: 'Whole Quran' }, { value: 'surah', label: 'Surah' }, { value: 'juz', label: 'Juz' }]} /></div>
              {scope === 'surah' && (<><div className="lbl">Surah</div><select className="sel" style={{ marginBottom: 6 }} value={num} onChange={(e) => setNum(Number(e.target.value))}>{surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>)}</select></>)}
              {scope === 'juz' && (<><div className="lbl">Juz</div><select className="sel" style={{ marginBottom: 6 }} value={num} onChange={(e) => setNum(Number(e.target.value))}>{Array.from({ length: 30 }, (_, i) => <option key={i + 1} value={i + 1}>Juz {i + 1}</option>)}</select></>)}
              {whole && <div className="small mute">604 mushaf pages. Flip through the preview, or jump to a page.</div>}
            </div>
            <div className="card">
              <div className="step"><i>2</i><div className="h3">Text</div></div>
              <div className="small mute" style={{ margin: '8px 0 4px' }}>The Arabic is always the mushaf font. Add what helps you read it.</div>
              <Check checked={tajweed && !plain} disabled={plain} onChange={setTajweed} note={plain ? 'Not in the text-only look (black and white).' : 'Colours the tajweed rules, as in the reader.'}>Tajweed colours</Check>
              <Check checked={tlit} onChange={setTlit} note="The Arabic in Latin letters, under each verse.">Transliteration</Check>
              <div className="lbl" style={{ marginTop: 8 }}>Translation</div>
              <select className="sel" value={trId} onChange={(e) => setTrId(e.target.value)}>
                <option value="">None</option>
                <option value="en.sahih">English · Saheeh International</option>
                {translations.filter((t) => t.id !== 'en.sahih').map((t) => <option key={t.id} value={t.id}>{t.id} · {t.name}</option>)}
              </select>
              {(tlit || trId) && <div className="small mute" style={{ marginTop: 8 }}>With a translation or transliteration the pages go verse by verse, so a page may take more than one sheet.</div>}
            </div>
            <div className="card">
              <div className="step"><i>3</i><div className="h3">Look</div></div>
              <div style={{ margin: '12px 0' }}><Seg value={look} onChange={setLook} options={[{ value: 'original', label: 'Original design' }, { value: 'plain', label: 'Text only' }]} /></div>
              <div className="small mute" style={{ marginBottom: 10 }}>{plain ? 'No frame or graphics, black on white. Saves ink.' : 'The Quran Anywhere look: golden frame, surah title and colours.'}</div>
              <Check checked={cover} onChange={setCover} note="Global Quran cover and closing page, and a link to each verse in every footer.">Cover and closing page</Check>
              <div className="grid g2" style={{ gap: 10 }}>
                <div><div className="lbl">Page size</div><select className="sel" value={size} onChange={(e) => setSize(e.target.value)}><option>A4</option><option>A5</option><option>Letter</option></select></div>
                <div><div className="lbl">Arabic size</div><select className="sel" value={fontSize} onChange={(e) => setFontSize(e.target.value)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></div>
              </div>
            </div>
            <div className="frame" style={{ padding: '18px 20px' }}>
              <div className="step"><i>4</i><div className="h3">Save</div></div>
              <div className="small mute" style={{ margin: '8px 0 12px' }}>Opens your browser's print window. Choose <b>Save as PDF</b> as the printer, and in More settings switch on <b>Background graphics</b> for the frame and colours.{whole ? ' The whole Quran is a few hundred pages, so give it a moment.' : ''}</div>
              <button type="button" className="btn p" style={{ width: '100%' }} onClick={savePdf} disabled={busy || !info}>{busy && progress ? progress : busy ? 'Preparing…' : 'Save as PDF'}</button>
              {info && info.pages.length * (opts.tajweed ? 0.55 : 0.15) > 15 && <div className="small mute" style={{ marginTop: 10 }}>A big file: about {Math.round(info.pages.length * (opts.tajweed ? 0.55 : 0.15) / 10) * 10} MB{opts.tajweed ? ' with tajweed colours. Turn them off, or choose Text only, for a much smaller file.' : '.'}</div>}
              {err && <div className="err" style={{ marginTop: 10 }}>{err}</div>}
              <div className="small mute" style={{ marginTop: 10, textAlign: 'center' }}>Free to share. <a href="/donate" style={{ fontWeight: 700 }}>A donation</a> keeps it online.</div>
            </div>
          </div>

          <div className="main" style={{ flex: '1 1 520px' }}>
            <div className="card" style={{ background: 'var(--sub)' }}>
              <div className="cap"><span>Preview</span><span className="small mute">the real page, as it will print</span></div>
              <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', padding: '6px 0' }}>
                <div style={{ width: PREVIEW_W, height: Math.round((H - 1) * k) + 2, boxShadow: '0 6px 22px rgba(15,28,26,.25)', borderRadius: 3, overflow: 'hidden', background: '#fff', position: 'relative', opacity: busy && sheet ? 0.55 : 1, transition: 'opacity .15s' }}>
                  {sheet
                    ? <div className={`pdf-root pdf-prev${opts.tajweed ? ' tj' : ''}`} style={{ ...vars, transform: `scale(${k})`, width: W, height: H }} dangerouslySetInnerHTML={{ __html: sheet.html }} />
                    : <div className="loading" style={{ padding: 24 }}>{err ? '' : 'Loading the page…'}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 170 }}>
                  <div className="h3">{isCover ? 'Cover' : isBack ? 'Closing page' : `Mushaf page ${pageNo || '…'}`}</div>
                  <div className="small mute" style={{ margin: '6px 0 12px' }}>
                    {info && !isCover && !isBack ? `Page ${pi + 1} of ${info.pages.length}` : ''}{view && view.length > 1 ? ` · sheet ${Math.min(sub, view.length - 1) + 1} of ${view.length}` : ''}
                    {scope === 'surah' ? ` · ${sName(num)}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <button type="button" className="btn s" disabled={atStart || !info} onClick={prev}>← Prev</button>
                    <button type="button" className="btn s" disabled={atEnd || !info} onClick={next}>Next →</button>
                  </div>
                  {whole && info && !isCover && !isBack && (<><div className="lbl">Go to mushaf page (1 to 604)</div><input className="sel" type="number" min="1" max="604" value={pageNo || 1} onChange={(e) => { const v = Math.min(604, Math.max(1, Number(e.target.value) || 1)); setPi(v - 1); setSub(0); }} /></>)}
                </div>
              </div>
            </div>
            <ReadyMade />
          </div>
        </div>
      </div>

      <div className="gq-printonly">
        {printSheets && <div className={`pdf-root${opts.tajweed ? ' tj' : ''}`} style={vars} dangerouslySetInnerHTML={{ __html: printSheets.join('') }} />}
      </div>
    </Page>
  );
};

export default PdfPage;
