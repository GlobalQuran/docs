import React, { useMemo, useState } from 'react';
import { useSurahs, useQuranList } from '../gq/data';
import { KCopy } from './ui';

const READER = 'https://globalquran.com';
const API = 'https://api.globalquran.com';
const DEFAULTS = { surah: 36, ayah: '', tr: 'en.sahih', theme: 'auto', font: 'mushaf', accent: '', height: 560, sidebar: '0', player: '1' };

/** Options for the reader (shared by the website and mobile guides): every change rewrites the code and the live preview. */
function useOptions() {
  const [o, setO] = useState(DEFAULTS);
  const set = (k, v) => setO((p) => ({ ...p, [k]: v }));
  return [o, set];
}

const attrsOf = (o, key) => {
  const a = [['data-surah', o.surah]];
  if (o.ayah) a.push(['data-ayah', o.ayah]);
  a.push(['data-translation', o.tr === 'none' ? '' : o.tr]);
  if (o.theme !== 'auto') a.push(['data-theme', o.theme]);
  if (o.font !== 'mushaf') a.push(['data-font', o.font]);
  if (o.accent) a.push(['data-accent', o.accent.replace('#', '')]);
  if (o.sidebar === '1') a.push(['data-sidebar', '1']);
  if (o.player === '0') a.push(['data-player', '0']);
  if (Number(o.height) !== 560) a.push(['data-height', o.height]);
  if (key) a.push(['data-api-key', key]);
  return a;
};
export const htmlSnippet = (o, key) => `<div class="globalquran-book"\n${attrsOf(o, key).map(([k, v]) => `     ${k}="${v}"`).join('\n')}></div>\n<script src="${READER}/embed.js" async></script>`;

const previewSrc = (o) => {
  const q = ['embed=1', `surah=${o.surah}`];
  if (o.ayah) q.push(`ayah=${o.ayah}`);
  q.push(`tr=${encodeURIComponent(o.tr === 'none' ? '' : o.tr)}`);
  if (o.theme !== 'auto') q.push(`theme=${o.theme}`);
  if (o.font !== 'mushaf') q.push(`font=${o.font}`);
  if (o.accent) q.push(`accent=${o.accent.replace('#', '')}`);
  if (o.sidebar === '1') q.push('sidebar=1');
  if (o.player === '0') q.push('player=0');
  return `${READER}/index.html?${q.join('&')}`;
};

const Controls = ({ o, set, only }) => {
  const surahs = useSurahs();
  const { textFormats } = useQuranList();
  const translations = useMemo(() => textFormats.filter((t) => t.type === 'translation'), [textFormats]);
  const show = (k) => !only || only.includes(k);
  return (
    <div className="grid g3" style={{ gap: 12 }}>
      {show('surah') && <div><div className="lbl">Surah</div>
        <select className="sel" value={o.surah} onChange={(e) => set('surah', e.target.value)}>
          {surahs.length ? surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>) : <option value={o.surah}>{o.surah}</option>}</select></div>}
      {show('ayah') && <div><div className="lbl">Ayah (optional)</div><input className="sel" type="number" min="1" placeholder="e.g. 255" value={o.ayah} onChange={(e) => set('ayah', e.target.value)} /></div>}
      {show('tr') && <div><div className="lbl">Translation</div>
        <select className="sel" value={o.tr} onChange={(e) => set('tr', e.target.value)}>
          <option value="en.sahih">en.sahih</option><option value="none">None (Arabic only)</option>
          {translations.filter((t) => t.id !== 'en.sahih').map((t) => <option key={t.id} value={t.id}>{t.id} · {t.name}</option>)}</select></div>}
      {show('theme') && <div><div className="lbl">Theme</div><select className="sel" value={o.theme} onChange={(e) => set('theme', e.target.value)}><option value="auto">Auto (follows the visitor)</option><option value="day">Day</option><option value="night">Night</option></select></div>}
      {show('font') && <div><div className="lbl">Arabic font</div><select className="sel" value={o.font} onChange={(e) => set('font', e.target.value)}><option value="mushaf">Mushaf</option><option value="amiri">Amiri</option><option value="me">Me Quran</option></select></div>}
      {show('accent') && <div><div className="lbl">Accent colour (hex)</div><input className="sel" placeholder="a58a3a" value={o.accent} onChange={(e) => set('accent', e.target.value.replace(/[^0-9a-fA-F#]/g, '').slice(0, 7))} /></div>}
      {show('height') && <div><div className="lbl">Height (px)</div><input className="sel" type="number" min="300" value={o.height} onChange={(e) => set('height', e.target.value)} /></div>}
      {show('sidebar') && <div><div className="lbl">Surah list sidebar</div><select className="sel" value={o.sidebar} onChange={(e) => set('sidebar', e.target.value)}><option value="0">Off</option><option value="1">On (wide pages)</option></select></div>}
      {show('player') && <div><div className="lbl">Audio player</div><select className="sel" value={o.player} onChange={(e) => set('player', e.target.value)}><option value="1">On</option><option value="0">Off</option></select></div>}
    </div>
  );
};

const Cap = ({ title, text, note }) => (
  <div className="cap" style={{ marginTop: 14 }}><span>{title}</span><KCopy text={text} primary small /></div>
);

const Step = ({ n, title, children }) => (
  <div style={{ marginTop: 20 }}><div className="k-step"><i>{n}</i><div><b>{title}</b></div></div>{children}</div>
);

/** Website or mobile app: options, live preview, code that follows the options. */
export const ReaderBuilder = ({ apiKey, app, defaultHeight }) => {
  const [o, set] = useOptions();
  const [os, setOs] = useState('iOS (Swift)');
  const html = htmlSnippet(o, apiKey);
  const swift = `let html = """\n${html}\n"""\nwebView.loadHTMLString(html, baseURL: URL(string: "${READER}"))`;
  const kotlin = `val html = """\n${html}\n"""\nwebView.settings.javaScriptEnabled = true\nwebView.loadDataWithBaseURL("${READER}", html, "text/html", "utf-8", null)`;
  const code = !app ? html : os === 'iOS (Swift)' ? swift : kotlin;
  const src = previewSrc(o);
  const h = Math.min(Number(o.height) || 560, 640);
  return (
    <div className="k-builder">
      <div className="k-bl">
        <Step n={1} title="Choose how it looks"><Controls o={o} set={set} /></Step>
        <Step n={2} title={app ? 'Paste it in your app' : 'Paste this where you want the Quran to appear'}>
          {app && <div className="k-seg2" role="group" aria-label="Platform" style={{ margin: '0 0 11.2px' }}>
            {['iOS (Swift)', 'Android (Kotlin)'].map((x) => <button key={x} aria-pressed={os === x} onClick={() => setOs(x)}>{x}</button>)}</div>}
          <Cap title={app ? (os === 'iOS (Swift)' ? 'Swift' : 'Kotlin') : 'HTML'} text={code} />
          <pre className="k-code" tabIndex={0}>{code}</pre>
          <div className="k-note">{app ? 'The reader runs in a web view inside your app: audio, translations and tajweed colours already working.' : 'It runs in its own frame, so your site’s CSS and scripts cannot break it and it cannot break yours.'}</div>
        </Step>
      </div>
      <div className="k-br">
        <div className="cap"><span>Live preview</span><span className="small mute">changes as you pick</span></div>
        {app
          ? <div className="k-phone"><iframe key={src} title="Reader preview in a phone" src={src} allow="autoplay" /></div>
          : <div className="k-preview"><div className="tb"><s /><s /><s /></div><iframe key={src} title="Reader preview" src={src} allow="autoplay" style={{ display: 'block', width: '100%', height: h, border: 0 }} /></div>}
      </div>
    </div>
  );
};

/** Server or script: pick what to fetch, get the call in curl, Python or Node. */
export const ServerBuilder = ({ apiKey }) => {
  const [o, set] = useOptions();
  const [lang, setLang] = useState('curl');
  const ids = o.tr === 'none' ? 'quran-uthmani' : `quran-uthmani,${o.tr}`;
  const url = `${API}/ayah/${o.surah}:${o.ayah || 1}/${ids}`;
  const code = {
    curl: `curl "${url}" \\\n  -H "X-API-Key: ${apiKey}"`,
    Python: `import requests\nr = requests.get("${url}", headers={"X-API-Key": "${apiKey}"})\nprint(r.json())`,
    Node: `const r = await fetch("${url}", { headers: { "X-API-Key": process.env.GQ_KEY } });\nconsole.log(await r.json());`,
  }[lang];
  return (
    <div className="k-builder">
      <div className="k-bl">
        <Step n={1} title="Choose what to fetch"><Controls o={o} set={set} only={['surah', 'ayah', 'tr']} /></Step>
        <Step n={2} title="Make your first request">
          <div className="k-seg2" role="group" aria-label="Language" style={{ margin: '0 0 11.2px' }}>
            {['curl', 'Python', 'Node'].map((x) => <button key={x} aria-pressed={lang === x} onClick={() => setLang(x)}>{x}</button>)}</div>
          <Cap title={lang === 'curl' ? 'Terminal' : lang} text={code} />
          <pre className="k-code" tabIndex={0}>{code}</pre>
          <div className="k-note">Tip: send the key in the <b>X-API-Key</b> header and keep it in an environment variable, so it never lands in your code or logs.</div>
        </Step>
      </div>
      <div className="k-br">
        <div className="cap"><span>What comes back</span><span className="small mute">JSON</span></div>
        <pre className="k-code" tabIndex={0}>{`{ "quran": {\n    "quran-uthmani": {\n      "${o.surah}": { "surah": ${o.surah}, "ayah": ${o.ayah || 1}, "verse": "…" }\n    }\n  }\n}`}</pre>
        <div className="k-links" style={{ marginTop: '12.8px' }}>
          <a className="k-btn s" href="/api/reference">See every endpoint</a>
          <a className="k-btn s" href="/data">Download everything</a>
        </div>
      </div>
    </div>
  );
};

/**
 * Verse card: pick a verse and a translation, get the picture the Global Quran reader shares (Mushaf script with tajweed colours,
 * the golden frame, the translation under it) and the code to put it anywhere: HTML, Markdown, a plain link, or the WordPress plugin's shortcode.
 * The picture is drawn on request by the card service on globalquran.com (a few seconds the first time, instant after).
 */
const CARD_LOOKS = [['both', 'Arabic + translation'], ['ar', 'Arabic only'], ['tr', 'Translation only']];

export const VerseCardBuilder = () => {
  const surahs = useSurahs();
  const { textFormats } = useQuranList();
  const translations = useMemo(() => textFormats.filter((t) => t.type === 'translation'), [textFormats]);
  const [c, setC] = useState({ surah: 2, ayah: 255, tr: 'en.sahih', m: 'both' });
  const [out, setOut] = useState('HTML');
  const [loaded, setLoaded] = useState(false);
  const set = (k, v) => { setLoaded(false); setC((p) => ({ ...p, [k]: v })); };
  const sur = surahs.find((x) => Number(x.surah_number) === Number(c.surah));
  const max = sur ? Number(sur.ayahs) : 286;
  const ayah = Math.min(Math.max(1, Number(c.ayah) || 1), max);
  const name = sur ? sur.name_english : `Surah ${c.surah}`;
  const q = `t=${encodeURIComponent(c.tr === 'none' ? 'en.sahih' : c.tr)}&m=${c.tr === 'none' ? 'ar' : c.m}`;
  const img = `${READER}/card/${c.surah}-${ayah}.jpg?${q}`;
  const link = `${READER}/${c.surah}:${ayah}?${q}`;
  const alt = `${name} ${c.surah}:${ayah}`;
  const code = {
    HTML: `<a href="${link}" target="_blank" rel="noopener">\n  <img src="${img}" alt="${alt}" style="max-width:100%;height:auto">\n</a>`,
    Markdown: `[![${alt}](${img})](${link})`,
    Link: link,
    Image: img,
    WordPress: `[globalquran_verse ref="${c.surah}:${ayah}" translation="${c.tr === 'none' ? 'none' : c.tr}" font="mushaf" tajweed="yes" style="day"]`,
  }[out];
  const note = {
    HTML: 'Paste it into any page or post. The picture links to the verse on globalquran.com.',
    Markdown: 'For READMEs, forums, Notion, Reddit and chat tools that read Markdown.',
    Link: 'Share this address anywhere: it opens the verse, and chat apps show the card as the preview.',
    Image: 'The picture on its own, for a post, a slide or a message. Open it and save it.',
    WordPress: 'With the free Global Quran plugin the card is real text on your page, with a Listen button. Search “Global Quran” under Plugins.',
  }[out];
  return (
    <div className="k-builder">
      <div className="k-bl">
        <Step n={1} title="Choose the verse">
          <div className="grid g3" style={{ gap: 12 }}>
            <div><div className="lbl">Surah</div>
              <select className="sel" value={c.surah} onChange={(e) => set('surah', e.target.value)}>
                {surahs.length ? surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>) : Array.from({ length: 114 }, (_, i) => <option key={i + 1} value={i + 1}>Surah {i + 1}</option>)}</select></div>
            <div><div className="lbl">Ayah (1 to {max})</div><input className="sel" type="number" min="1" max={max} value={c.ayah} onChange={(e) => set('ayah', e.target.value)} /></div>
            <div><div className="lbl">Translation</div>
              <select className="sel" value={c.tr} onChange={(e) => set('tr', e.target.value)}>
                <option value="en.sahih">en.sahih</option><option value="none">None (Arabic only)</option>
                {translations.filter((t) => t.id !== 'en.sahih').map((t) => <option key={t.id} value={t.id}>{t.id} · {t.name}</option>)}</select></div>
          </div>
          <div className="k-seg2" role="group" aria-label="What the card shows" style={{ margin: '14px 0 0' }}>
            {CARD_LOOKS.map(([id, label]) => <button key={id} aria-pressed={c.m === id} disabled={c.tr === 'none' && id !== 'ar'} onClick={() => set('m', id)}>{label}</button>)}
          </div>
        </Step>
        <Step n={2} title="Copy it and share it">
          <div className="k-seg2" role="group" aria-label="Format" style={{ margin: '0 0 11.2px' }}>
            {['HTML', 'Markdown', 'Link', 'Image', 'WordPress'].map((x) => <button key={x} aria-pressed={out === x} onClick={() => setOut(x)}>{x === 'Image' ? 'Image address' : x}</button>)}</div>
          <Cap title={out === 'Image' ? 'Image address' : out} text={code} />
          <pre className="k-code" tabIndex={0} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{code}</pre>
          <div className="k-note">{note}</div>
          <div className="k-links" style={{ marginTop: 12 }}>
            <a className="k-btn s" href={img} target="_blank" rel="noopener noreferrer">Open the picture</a>
            <a className="k-btn s" href={link} target="_blank" rel="noopener noreferrer">Open the verse</a>
          </div>
        </Step>
      </div>
      <div className="k-br">
        <div className="cap"><span>Your card</span><span className="small mute">{loaded ? 'ready' : 'drawing… a few seconds the first time'}</span></div>
        <img key={img} src={img} alt={alt} onLoad={() => setLoaded(true)} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 10, border: '1px solid var(--k-line, rgba(128,128,128,.3))', background: 'rgba(128,128,128,.08)', minHeight: 160 }} />
      </div>
    </div>
  );
};
