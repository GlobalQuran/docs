import React, { useMemo, useState } from 'react';
import { Page, GITHUB, CopyButton } from '../gq/ui';
import { useQuranList, useSurahs } from '../gq/data';

const READER = 'https://globalquran.com';

const EmbedPage = () => {
  const surahs = useSurahs();
  const { textFormats } = useQuranList();
  const [o, setO] = useState({ surah: 36, ayah: '', tr: 'en.sahih', theme: 'auto', font: 'mushaf', accent: '', height: 720, sidebar: '0', player: '1' });
  const set = (k, v) => setO({ ...o, [k]: v });
  const translations = useMemo(() => textFormats.filter((t) => t.type === 'translation'), [textFormats]);

  const attrs = [['data-surah', o.surah]];
  if (o.ayah) attrs.push(['data-ayah', o.ayah]);
  attrs.push(['data-translation', o.tr]);
  if (o.theme !== 'auto') attrs.push(['data-theme', o.theme]);
  if (o.font !== 'mushaf') attrs.push(['data-font', o.font]);
  if (o.accent) attrs.push(['data-accent', o.accent.replace('#', '')]);
  if (o.sidebar === '1') attrs.push(['data-sidebar', '1']);
  if (o.player === '0') attrs.push(['data-player', '0']);
  if (Number(o.height) !== 720) attrs.push(['data-height', o.height]);
  const snippet = `<div class="globalquran-book"\n${attrs.map(([k, v]) => `     ${k}="${v}"`).join('\n')}></div>\n<script src="${READER}/embed.js" async></script>`;

  const q = ['embed=1', `surah=${o.surah}`];
  if (o.ayah) q.push(`ayah=${o.ayah}`);
  q.push(`tr=${encodeURIComponent(o.tr === 'none' ? '' : o.tr)}`);
  if (o.theme !== 'auto') q.push(`theme=${o.theme}`);
  if (o.font !== 'mushaf') q.push(`font=${o.font}`);
  if (o.accent) q.push(`accent=${o.accent.replace('#', '')}`);
  if (o.sidebar === '1') q.push('sidebar=1');
  if (o.player === '0') q.push('player=0');
  const src = `${READER}/index.html?${q.join('&')}`;

  return (
    <Page>
      <div className="in" style={{ paddingTop: 38 }}>
        <div className="eyebrow">Embeddable reader · Quran Anywhere</div>
        <h1 className="h1" style={{ margin: '12px 0 10px', fontSize: 40 }}>A full Quran reader on your site.<br />Two lines, no account.</h1>
        <p className="lead" style={{ maxWidth: 680 }}>Audio, translations, tajweed colours, night mode and search, already working. It lives in a frame, so your site cannot break it and it cannot break your site. Works in WordPress, Notion, a mosque site or an app's web view.</p>
      </div>

      <div className="in twocol" style={{ paddingTop: 24 }}>
        <div className="main">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)' }} className="cap"><span>Live preview</span><span className="small mute">changes as you tweak the options</span></div>
            <iframe key={src} title="Quran reader preview" src={src} allow="autoplay" style={{ display: 'block', width: '100%', height: Math.min(Number(o.height) || 720, 640), border: 0, background: 'transparent' }} />
          </div>
          <div className="card" style={{ marginTop: 18 }}>
            <div className="h3" style={{ marginBottom: 12 }}>Options</div>
            <div className="grid g3" style={{ gap: 12 }}>
              <div><div className="lbl">Open at surah</div>
                <select className="sel" value={o.surah} onChange={(e) => set('surah', e.target.value)}>
                  {surahs.length ? surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>) : <option value={o.surah}>{o.surah}</option>}</select></div>
              <div><div className="lbl">Ayah (optional)</div><input className="sel" type="number" min="1" placeholder="e.g. 255" value={o.ayah} onChange={(e) => set('ayah', e.target.value)} /></div>
              <div><div className="lbl">Translation</div>
                <select className="sel" value={o.tr} onChange={(e) => set('tr', e.target.value)}>
                  <option value="en.sahih">en.sahih</option><option value="none">None (Arabic only)</option>
                  {translations.filter((t) => t.id !== 'en.sahih').map((t) => <option key={t.id} value={t.id}>{t.id} · {t.name}</option>)}</select></div>
              <div><div className="lbl">Theme</div><select className="sel" value={o.theme} onChange={(e) => set('theme', e.target.value)}><option value="auto">Auto (follows the visitor)</option><option value="day">Day</option><option value="night">Night</option></select></div>
              <div><div className="lbl">Arabic font</div><select className="sel" value={o.font} onChange={(e) => set('font', e.target.value)}><option value="mushaf">Mushaf</option><option value="amiri">Amiri</option><option value="me">Me Quran</option></select></div>
              <div><div className="lbl">Accent colour (hex)</div><input className="sel" placeholder="a58a3a" value={o.accent} onChange={(e) => set('accent', e.target.value.replace(/[^0-9a-fA-F#]/g, '').slice(0, 7))} /></div>
              <div><div className="lbl">Height (px)</div><input className="sel" type="number" min="300" value={o.height} onChange={(e) => set('height', e.target.value)} /></div>
              <div><div className="lbl">Surah list sidebar</div><select className="sel" value={o.sidebar} onChange={(e) => set('sidebar', e.target.value)}><option value="0">Off</option><option value="1">On (wide pages)</option></select></div>
              <div><div className="lbl">Audio player</div><select className="sel" value={o.player} onChange={(e) => set('player', e.target.value)}><option value="1">On</option><option value="0">Off</option></select></div>
            </div>
          </div>
        </div>

        <div className="aside">
          <div className="card">
            <div className="step"><i>1</i><div className="h3">Copy this</div></div>
            <div className="cap" style={{ marginTop: 12 }}><span>HTML</span><CopyButton text={snippet} primary /></div>
            <div className="code" style={{ fontSize: 12 }}>{snippet}</div>
            <div className="step" style={{ marginTop: 14 }}><i>2</i><div className="h3">Paste it in your page. Done.</div></div>
            <div className="small mute" style={{ marginTop: 8 }}>An API key is optional (<span className="chip">data-api-key</span>).</div>
          </div>
          <div className="card"><div className="h3">Prefer to host it yourself?</div>
            <div className="mute small" style={{ margin: '6px 0 10px' }}>It is just a folder of static files. No build, no server.</div>
            <div className="code" style={{ fontSize: 12 }}>{`git clone ${GITHUB}/quran-anywhere\npython3 -m http.server 8765`}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <a className="btn s" href={`${GITHUB}/quran-anywhere`}>★ Star</a><a className="btn s" href={`${GITHUB}/quran-anywhere/fork`}>⑂ Fork</a><a className="btn s" href={`${GITHUB}/quran-anywhere#readme`}>Read the README</a></div></div>
          <div className="card"><div className="h3">Using it in…</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}><span className="chip">WordPress</span><span className="chip">Notion</span><span className="chip">Wix</span><span className="chip">React</span><span className="chip">App web view</span></div></div>
        </div>
      </div>
    </Page>
  );
};

export default EmbedPage;
