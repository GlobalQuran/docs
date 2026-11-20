import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, API, AUDIO } from '../gq/ui';
import { useSurahs } from '../gq/data';

const HowItWorksPage = () => {
  const surahs = useSurahs();
  const [surah, setSurah] = useState(2);
  const [ayah, setAyah] = useState(255);
  const [verse, setVerse] = useState('');
  const s = surahs.find((x) => x.surah_number === Number(surah));
  const maxAyah = s ? s.ayahs : 286;
  const a = Math.min(Math.max(1, Number(ayah) || 1), maxAyah);
  const global = s ? s.start_ayah + a - 1 : null;
  const audioUrl = global ? `${AUDIO}/ar.abdulbasitmurattal/mp3/64kbs/${global}.mp3` : '';
  const textUrl = global ? `${API}/v1/ayah/${global}/en.sahih` : '';

  useEffect(() => {
    if (!textUrl) return undefined;
    let live = true;
    setVerse('');
    fetch(textUrl).then((r) => r.json()).then((j) => {
      const v = j && j.quran && j.quran['en.sahih'] && j.quran['en.sahih'][global];
      if (live && v) setVerse(v.verse);
    }).catch(() => {});
    return () => { live = false; };
  }, [textUrl, global]);

  const options = useMemo(() => surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>), [surahs]);

  return (
    <Page>
      <div className="crumbs"><div className="in"><Link to="/">Docs</Link> <span>›</span> <b>How it works</b></div></div>
      <div className="in" style={{ paddingTop: 34, maxWidth: 960 }}>
        <div className="eyebrow">Docs · the one page to read first</div>
        <h1 className="h1" style={{ fontSize: 38, margin: '12px 0 10px' }}>How everything fits together</h1>
        <p className="lead">The API, the data files, the audio and the embed all use the same three ideas. Learn them once and the rest is easy.</p>

        <div className="grid g3" style={{ marginTop: 26 }}>
          <div className="frame"><div className="eyebrow">1 · Quran ID</div><div className="h2" style={{ margin: '8px 0' }}>en.sahih</div><div className="mute small">Names one text: <b>language code</b> + <b>author</b>. Arabic texts have their own IDs, like <span className="chip">quran-uthmani</span>.</div></div>
          <div className="frame"><div className="eyebrow">2 · Reciter ID</div><div className="h2" style={{ margin: '8px 0', fontSize: 22 }}>ar.abdulbasitmurattal</div><div className="mute small">Names one reciter, same pattern. Each has formats, bit rates and a mode.</div></div>
          <div className="frame"><div className="eyebrow">3 · Ayah number</div><div className="h2" style={{ margin: '8px 0' }}>262 = 2:255</div><div className="mute small">Every ayah has a <b>global number 1 to 6,236</b>. Surah:ayah is the same thing in two parts.</div></div>
        </div>

        <h2 className="h2" style={{ margin: '36px 0 14px' }}>Try it: pick any ayah</h2>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ minWidth: 220 }}><div className="lbl">Surah</div>
              <select className="sel" value={surah} onChange={(e) => { setSurah(e.target.value); setAyah(1); }}>{options.length ? options : <option>{surah}</option>}</select></div>
            <div style={{ minWidth: 120 }}><div className="lbl">Ayah (1 to {maxAyah})</div>
              <input className="sel" type="number" min="1" max={maxAyah} value={ayah} onChange={(e) => setAyah(e.target.value)} /></div>
          </div>
          {global ? (
            <div className="grid" style={{ gap: 14 }}>
              <div className="step"><i>1</i><div><b>Global number</b> = ayahs in earlier surahs + this ayah → <span className="chip">{s.start_ayah - 1} + {a} = {global}</span></div></div>
              <div className="step"><i>2</i><div style={{ flex: 1, minWidth: 0 }}><b>Get the text</b>
                <div className="code" style={{ marginTop: 6, fontSize: 12.5 }}>{`GET ${textUrl}`}</div>
                <div className="small mute" style={{ marginTop: 6 }}>{verse || 'Loading…'}</div></div></div>
              <div className="step"><i>3</i><div style={{ flex: 1, minWidth: 0 }}><b>Play the audio</b>
                <div className="card url" style={{ marginTop: 6, padding: '12px 14px' }}>
                  {AUDIO}/<i>ar.abdulbasitmurattal</i>/<b>mp3</b>/<em>64</em>kbs/<b>{global}</b>.mp3</div>
                <audio controls preload="none" src={audioUrl} style={{ marginTop: 10 }} />
                <div className="small mute" style={{ marginTop: 6 }}><span style={{ background: 'rgba(165,138,58,.2)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>reciter</span> · <span style={{ background: 'var(--okbg)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>format and ayah number</span> · <span style={{ background: 'rgba(80,120,200,.16)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>bit rate</span></div></div></div>
            </div>
          ) : <div className="loading">Loading the surah list…</div>}
        </div>

        <div className="grid g2" style={{ marginTop: 26 }}>
          <div className="card"><div className="h3">Where do I find the IDs?</div><div className="mute small" style={{ margin: '6px 0 12px' }}>Three lists, always current.</div>
            <div className="code" style={{ fontSize: 12 }}>{'GET /v2/list/translation\nGET /v2/list/recitor\nGET /v2/list/quran'}</div></div>
          <div className="card"><div className="h3">Which ayah is which number?</div><div className="mute small" style={{ margin: '6px 0 12px' }}>The surah list gives where each surah starts and ends.</div>
            <div className="code" style={{ fontSize: 12 }}>{'GET /v1/surah\n# surah 2: start_ayah 8, end_ayah 293'}</div></div>
        </div>

        <h2 className="h2" style={{ margin: '34px 0 14px' }}>Which door should I use?</h2>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>I want to…</th><th>Use</th><th>Key?</th></tr></thead>
            <tbody>
              <tr><td>Show a Quran reader on a web page</td><td><Link to="/embed"><b>Embed</b></Link></td><td>No</td></tr>
              <tr><td>Build my own app or look up verses</td><td><Link to="/api"><b>API</b></Link></td><td>Free key</td></tr>
              <tr><td>Have everything offline or in my database</td><td><Link to="/data"><b>Data</b></Link></td><td>No</td></tr>
              <tr><td>Play recitations</td><td><Link to="/audio"><b>Audio</b></Link> (link the CDN)</td><td>No</td></tr>
              <tr><td>Let an AI assistant write it for me</td><td><Link to="/ai-instructions"><b>AI instructions</b></Link></td><td>Same as API</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  );
};

export default HowItWorksPage;
