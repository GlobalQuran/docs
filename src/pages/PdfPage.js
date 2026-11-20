import React, { useEffect, useMemo, useState } from 'react';
import { Page, API, Seg } from '../gq/ui';
import { useQuranList, useSurahs } from '../gq/data';

const ARABIC = 'quran-uthmani';
const PER_SHEET = 6;
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

/** Fetch ayahs for one scope. Returns [{n, surah, ayah, ar, tr}] sorted by global number. */
async function load(scopePath, trId) {
  const ids = trId ? `${ARABIC},${trId}` : ARABIC;
  const r = await fetch(`${API}/v1/${scopePath}/${ids}`);
  const j = await r.json();
  const q = j.quran || {};
  const ar = q[ARABIC] || {};
  const tr = trId ? q[trId] || {} : {};
  return Object.keys(ar).map(Number).sort((a, b) => a - b).map((n) => ({
    n, surah: ar[n].surah, ayah: ar[n].ayah, ar: ar[n].verse, tr: tr[n] ? tr[n].verse : '',
  }));
}

const PdfPage = () => {
  const surahs = useSurahs();
  const { textFormats } = useQuranList();
  const translations = useMemo(() => textFormats.filter((t) => t.type === 'translation'), [textFormats]);
  const [scope, setScope] = useState('surah');
  const [num, setNum] = useState(1);
  const [content, setContent] = useState('both');
  const [tr, setTr] = useState('en.sahih');
  const [size, setSize] = useState('A4');
  const [fontSize, setFontSize] = useState('md');
  const [rows, setRows] = useState([]);
  const [sheet, setSheet] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [printRows, setPrintRows] = useState(null);
  const trId = content === 'both' ? tr : '';

  const path = scope === 'surah' ? `surah/${num}` : scope === 'juz' ? `juz/${num}` : `page/${num}`;
  useEffect(() => {
    let live = true;
    setBusy(true); setErr('');
    load(path, trId).then((r) => { if (live) { setRows(r); setSheet(0); } }).catch((e) => live && setErr(e.message)).finally(() => live && setBusy(false));
    return () => { live = false; };
  }, [path, trId]);

  const sheets = Math.max(1, Math.ceil(rows.length / PER_SHEET));
  const shown = rows.slice(sheet * PER_SHEET, sheet * PER_SHEET + PER_SHEET);
  const sName = (n) => { const s = surahs.find((x) => x.surah_number === n); return s ? `${s.name_english} · ${n}` : `Surah ${n}`; };
  const max = scope === 'surah' ? 114 : scope === 'juz' ? 30 : 604;
  const sizes = { sm: 20, md: 24, lg: 30 };

  const savePdf = async () => {
    setBusy(true); setErr('');
    try {
      const all = scope === 'whole' ? await load('complete', trId) : rows;
      setPrintRows(all);
      setTimeout(() => { window.print(); setBusy(false); }, 400);
    } catch (e) { setErr(`Could not prepare the file: ${e.message}`); setBusy(false); }
  };

  return (
    <Page>
      <style>{`@page{size:${size};margin:14mm}@media print{.gq-noprint{display:none!important}.gq-printonly{display:block!important}body{background:#fff!important}.pp .ar{font:400 ${sizes[fontSize]}px/2.2 Amiri,"Traditional Arabic",serif;direction:rtl;text-align:right;color:#000}.pp .tr{font:${Math.round(sizes[fontSize] / 2)}px/1.5 Georgia,serif;color:#222;margin:0 0 10px}.pp .sh{font:700 14px Georgia,serif;margin:18px 0 6px;text-align:center}}.gq-printonly{display:none}`}</style>
      <div className="gq-noprint">
        <div className="in" style={{ paddingTop: 34 }}>
          <div className="eyebrow">New · free · no sign-in</div>
          <h1 className="h1" style={{ margin: '12px 0 8px', fontSize: 38 }}>The Quran as a PDF.<br />See it first, then download.</h1>
          <p className="lead" style={{ maxWidth: 680 }}>Choose what goes in, check the preview, and only then save it. Read it on any device or print it.</p>
        </div>

        <div className="in twocol" style={{ paddingTop: 22 }}>
          <div className="aside" style={{ flex: '0 1 350px', minWidth: 300 }}>
            <div className="card">
              <div className="step"><i>1</i><div className="h3">What to include</div></div>
              <div style={{ margin: '12px 0' }}><Seg value={scope} onChange={(v) => { setScope(v); setNum(1); }} options={[{ value: 'whole', label: 'Whole Quran' }, { value: 'surah', label: 'Surah' }, { value: 'juz', label: 'Juz' }]} /></div>
              {scope === 'surah' && (<><div className="lbl">Surah</div><select className="sel" style={{ marginBottom: 10 }} value={num} onChange={(e) => setNum(Number(e.target.value))}>{surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>)}</select></>)}
              {scope === 'juz' && (<><div className="lbl">Juz</div><select className="sel" style={{ marginBottom: 10 }} value={num} onChange={(e) => setNum(Number(e.target.value))}>{Array.from({ length: 30 }, (_, i) => <option key={i + 1} value={i + 1}>Juz {i + 1}</option>)}</select></>)}
              {scope === 'whole' && <div className="small mute" style={{ marginBottom: 10 }}>The preview below shows mushaf pages. Use the page box to jump.</div>}
              <div className="lbl">Content</div>
              <select className="sel" style={{ marginBottom: 10 }} value={content} onChange={(e) => setContent(e.target.value)}><option value="both">Arabic + translation</option><option value="ar">Arabic only</option></select>
              {content === 'both' && (<><div className="lbl">Translation</div>
                <select className="sel" value={tr} onChange={(e) => setTr(e.target.value)}>
                  <option value="en.sahih">English · Saheeh International</option>
                  {translations.filter((t) => t.id !== 'en.sahih').map((t) => <option key={t.id} value={t.id}>{t.id} · {t.name}</option>)}</select></>)}
            </div>
            <div className="card">
              <div className="step"><i>2</i><div className="h3">Layout</div></div>
              <div className="grid g2" style={{ gap: 10, marginTop: 12 }}>
                <div><div className="lbl">Page size</div><select className="sel" value={size} onChange={(e) => setSize(e.target.value)}><option>A4</option><option>A5</option><option>Letter</option></select></div>
                <div><div className="lbl">Text size</div><select className="sel" value={fontSize} onChange={(e) => setFontSize(e.target.value)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></div>
              </div>
            </div>
            <div className="frame" style={{ padding: '18px 20px' }}>
              <div className="step"><i>3</i><div className="h3">Save</div></div>
              <div className="small mute" style={{ margin: '8px 0 12px' }}>Opens your browser's print window. Choose <b>Save as PDF</b> as the printer.{scope === 'whole' ? ' The whole Quran is a few hundred pages, so give it a moment.' : ''}</div>
              <button type="button" className="btn p" style={{ width: '100%' }} onClick={savePdf} disabled={busy}>{busy ? 'Preparing…' : 'Save as PDF'}</button>
              {err && <div className="err" style={{ marginTop: 10 }}>{err}</div>}
              <div className="small mute" style={{ marginTop: 10, textAlign: 'center' }}>Free to share. <a href="/donate" style={{ fontWeight: 700 }}>A donation</a> keeps it online.</div>
            </div>
          </div>

          <div className="main" style={{ flex: '1 1 520px' }}>
            <div className="card" style={{ background: 'var(--sub)' }}>
              <div className="cap"><span>Preview</span><span className="small mute">real text, as it will print</span></div>
              <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', padding: '6px 0' }}>
                <div className="sheet" style={{ width: 340, minHeight: 440 }}>
                  <div className="hd">{shown[0] ? sName(shown[0].surah).toUpperCase() : '…'}</div>
                  {busy && !rows.length && <div className="loading">Loading…</div>}
                  {shown.map((r) => (
                    <div key={r.n}>
                      <div className="ayah" style={{ fontSize: sizes[fontSize] - 2 }}>{r.ar} ﴿{r.ayah}﴾</div>
                      {content === 'both' && <p className="tr">{r.tr}</p>}
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', fontSize: 11, color: '#4f5b5a', marginTop: 12 }}>{sheet + 1}</div>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div className="h3">{scope === 'whole' ? `Mushaf page ${num}` : `Sheet ${sheet + 1} of ${sheets}`}</div>
                  <div className="small mute" style={{ margin: '6px 0 12px' }}>Flip through to check the look before you save.</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <button type="button" className="btn s" disabled={sheet === 0 && (scope !== 'whole' || num === 1)} onClick={() => { if (sheet > 0) setSheet(sheet - 1); else if (scope === 'whole' && num > 1) setNum(num - 1); }}>← Prev</button>
                    <button type="button" className="btn s" disabled={sheet >= sheets - 1 && (scope !== 'whole' || num >= max)} onClick={() => { if (sheet < sheets - 1) setSheet(sheet + 1); else if (scope === 'whole' && num < max) setNum(num + 1); }}>Next →</button>
                  </div>
                  {scope === 'whole' && (<><div className="lbl">Go to mushaf page (1 to 604)</div><input className="sel" type="number" min="1" max="604" value={num} onChange={(e) => setNum(Math.min(604, Math.max(1, Number(e.target.value) || 1)))} /></>)}
                </div>
              </div>
            </div>
            <ReadyMade />
          </div>
        </div>
      </div>

      <div className="gq-printonly pp">
        {printRows && (() => {
          let last = 0;
          return printRows.map((r) => {
            const head = r.surah !== last ? <div className="sh" key={`h${r.surah}`}>{sName(r.surah)}</div> : null;
            last = r.surah;
            return (
              <React.Fragment key={r.n}>
                {head}
                <div className="ar">{r.ar} ﴿{r.ayah}﴾</div>
                {content === 'both' && <p className="tr">{r.tr}</p>}
              </React.Fragment>
            );
          });
        })()}
      </div>
    </Page>
  );
};

export default PdfPage;
