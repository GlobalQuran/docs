import React, { useMemo, useState } from 'react';
import { Page, AUDIO, CopyButton, Seg } from '../gq/ui';
import { useQuranList, useSurahs } from '../gq/data';

const verseVariants = (r) => Object.values(r.media || {}).filter((m) => m.mode === 'versebyverse');
const surahVariants = (r) => Object.values(r.media || {}).filter((m) => m.mode === 'surahbysurah');
const statusDot = (st) => (st === 'active' ? '' : st === 'draft' || st === 'incomplete' ? 'd' : 'x');

const AudioPage = () => {
  const { audioFormats, loading, error } = useQuranList();
  const surahs = useSurahs();
  const [mode, setMode] = useState('versebyverse');
  const [rid, setRid] = useState('ar.abdulbasitmurattal');
  const [vidx, setVidx] = useState(0);
  const [surah, setSurah] = useState(2);
  const [ayah, setAyah] = useState(255);
  const [q, setQ] = useState('');
  const [lang, setLang] = useState('all');
  const [limit, setLimit] = useState(20);
  const [playing, setPlaying] = useState(null);

  const withMode = useMemo(() => audioFormats.filter((r) => (mode === 'versebyverse' ? verseVariants(r) : surahVariants(r)).length), [audioFormats, mode]);
  const rec = withMode.find((r) => r.id === rid) || withMode[0];
  const variants = rec ? (mode === 'versebyverse' ? verseVariants(rec) : surahVariants(rec)) : [];
  const variant = variants[Math.min(vidx, Math.max(variants.length - 1, 0))];
  const s = surahs.find((x) => x.surah_number === Number(surah));
  const maxAyah = s ? s.ayahs : 286;
  const a = Math.min(Math.max(1, Number(ayah) || 1), maxAyah);
  const n = mode === 'versebyverse' ? (s ? s.start_ayah + a - 1 : null) : Number(surah);
  const url = variant && n ? `${AUDIO}/${variant.path}${n}.${variant.type}` : '';

  const languages = useMemo(() => [...new Set(audioFormats.map((r) => r.language))].sort(), [audioFormats]);
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return audioFormats.filter((r) => (lang === 'all' || r.language === lang) && (!t || `${r.id} ${r.name} ${r.localName}`.toLowerCase().includes(t)));
  }, [audioFormats, q, lang]);
  const sample = (r) => {
    const v = verseVariants(r).sort((x, y) => (Number(y.kbs) - Number(x.kbs)))[0];
    if (v) return `${AUDIO}/${v.path}1.${v.type}`;
    const sv = surahVariants(r)[0];
    return sv ? `${AUDIO}/${sv.path}1.${sv.type}` : '';
  };
  const togglePlay = (r) => {
    const el = document.getElementById('gq-sample');
    if (!el) return;
    if (playing === r.id) { el.pause(); setPlaying(null); return; }
    el.src = sample(r); el.play().catch(() => {}); setPlaying(r.id);
  };

  return (
    <Page>
      <div className="hero">
        <div className="in" style={{ paddingTop: 40, paddingBottom: 40, display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 460px' }}>
            <div className="eyebrow">Audio · {audioFormats.length || 193} reciters</div>
            <h1 className="h1" style={{ fontSize: 38, margin: '12px 0 10px' }}>Link our audio.<br />Do not host it.</h1>
            <p className="lead">Our servers already stream every reciter, worldwide, with no key and no sign-in. Point your player at the address and you are done: no storage, no bandwidth bill, no updates.</p>
          </div>
          <div style={{ flex: '1 1 360px' }}>
            <div className="card" style={{ background: '#263032', borderColor: '#465052', color: '#efe9d6' }}>
              <div className="h3">Why this is better than copying the files</div>
              <div className="step" style={{ marginTop: 10 }}><i>✓</i><div className="small">Free for you, we carry the cost</div></div>
              <div className="step" style={{ marginTop: 8 }}><i>✓</i><div className="small">Works from any site or app (open access)</div></div>
              <div className="step" style={{ marginTop: 8 }}><i>✓</i><div className="small">New reciters and fixes appear on their own</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="in twocol" style={{ paddingTop: 28 }}>
        <div className="main">
          <div className="frame">
            <div className="eyebrow">Address builder</div>
            <div style={{ margin: '12px 0' }}><Seg value={mode} onChange={(m) => { setMode(m); setVidx(0); }} options={[{ value: 'versebyverse', label: 'Verse by verse' }, { value: 'surahbysurah', label: 'Surah by surah' }]} /></div>
            {loading && <div className="loading">Loading reciters…</div>}
            {error && <div className="err">Could not load reciters: {error}</div>}
            {rec && (
              <>
                <div className="grid g3" style={{ gap: 12 }}>
                  <div><div className="lbl">Reciter</div>
                    <select className="sel" value={rec.id} onChange={(e) => { setRid(e.target.value); setVidx(0); }}>
                      {withMode.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.language})</option>)}</select></div>
                  <div><div className="lbl">Format and quality</div>
                    <select className="sel" value={vidx} onChange={(e) => setVidx(Number(e.target.value))}>
                      {variants.map((v, i) => <option key={i} value={i}>{v.type} · {v.kbs} kbps{v.status !== 'active' ? ` (${v.status})` : ''}</option>)}</select></div>
                  <div><div className="lbl">Surah</div>
                    <select className="sel" value={surah} onChange={(e) => { setSurah(e.target.value); setAyah(1); }}>
                      {surahs.map((x) => <option key={x.surah_number} value={x.surah_number}>{x.surah_number} · {x.name_english}</option>)}</select></div>
                  {mode === 'versebyverse' && (
                    <>
                      <div><div className="lbl">Ayah (1 to {maxAyah})</div><input className="sel" type="number" min="1" max={maxAyah} value={ayah} onChange={(e) => setAyah(e.target.value)} /></div>
                      <div><div className="lbl">Ayah number in the file name</div><div className="sel" style={{ cursor: 'default' }}><b>{n || '…'}</b><span className="small mute">worked out for you</span></div></div>
                    </>
                  )}
                </div>
                <div className="card url" style={{ margin: '14px 0 0', padding: '14px 16px' }}>{url || 'Loading…'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                  <audio controls preload="none" src={url} key={url} style={{ flex: 1, minWidth: 220 }} />
                  <CopyButton text={url} label="Copy address" />
                </div>
                {variant && variant.status !== 'active' && <div className="small mute" style={{ marginTop: 8 }}>This one is marked {variant.status}: some files may be missing.</div>}
              </>
            )}
          </div>

          <h2 className="h2" style={{ margin: '30px 0 12px', fontSize: 22 }}>Reciters</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <div className="search" style={{ minHeight: 38, fontSize: 13.5, flex: 1, minWidth: 200, borderRadius: 19 }}><span>⌕</span><input placeholder="Search reciter" value={q} onChange={(e) => { setQ(e.target.value); setLimit(20); }} aria-label="Search reciter" /></div>
            <select className="sel" style={{ width: 160 }} value={lang} onChange={(e) => { setLang(e.target.value); setLimit(20); }} aria-label="Language">
              <option value="all">All languages</option>{languages.map((l) => <option key={l} value={l}>{l}</option>)}</select>
          </div>
          <audio id="gq-sample" preload="none" onEnded={() => setPlaying(null)} style={{ display: 'none' }} />
          <div className="card" style={{ padding: 0 }}>
            <table>
              <thead><tr><th /><th>Reciter</th><th>Modes</th><th>Formats</th><th>Status</th><th /></tr></thead>
              <tbody>
                {rows.slice(0, limit).map((r) => {
                  const all = Object.values(r.media || {});
                  const modes = [verseVariants(r).length ? 'Verse' : null, surahVariants(r).length ? 'Surah' : null].filter(Boolean).join(' · ');
                  const formats = [...new Set(all.map((m) => `${m.type} ${m.kbs}`))].join(', ');
                  const st = all.some((m) => m.status === 'active') ? 'active' : (all[0] && all[0].status) || 'draft';
                  return (
                    <tr key={r.id}>
                      <td><button type="button" className="play" style={{ border: 0, cursor: 'pointer' }} onClick={() => togglePlay(r)} aria-label={`Play ${r.name}`}>{playing === r.id ? '❚❚' : '▶'}</button></td>
                      <td><b>{r.name}</b><div className="mono small mute">{r.id}</div></td>
                      <td className="small">{modes}</td><td className="small">{formats}</td>
                      <td><span className={`dot ${statusDot(st)}`} />{st}</td>
                      <td><CopyButton text={r.id} label="Copy ID" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="small mute" style={{ marginTop: 8 }}>Showing {Math.min(limit, rows.length)} of {rows.length}. Active = checked and complete. Draft or incomplete = may have gaps.</div>
          {rows.length > limit && <div style={{ marginTop: 10 }}><button type="button" className="btn s" onClick={() => setLimit(limit + 40)}>Show more</button></div>}
        </div>

        <div className="aside">
          <div className="card"><div className="h3">Two ways, two patterns</div>
            <div className="lbl" style={{ marginTop: 12 }}>Verse by verse</div>
            <div className="code" style={{ fontSize: 11.5 }}>{'.../{reciter}/{format}/{kbs}kbs/{ayah}.mp3'}</div>
            <div className="lbl" style={{ marginTop: 12 }}>Surah by surah</div>
            <div className="code" style={{ fontSize: 11.5 }}>{'.../{reciter}/{format}/{kbs}kbs/surah/{1-114}.mp3'}</div>
            <div className="small mute" style={{ marginTop: 10 }}>{'{ayah}'} is the global number 1 to 6,236. File 0 is the a'udhu billah. The exact folder for each reciter is in the list below (the path field).</div></div>
          <div className="card"><div className="h3">Play a whole surah, verse by verse</div>
            <div className="mute small" style={{ margin: '6px 0 10px' }}>Play the next number when one ends. Surah 1 is 1 to 7.</div>
            <div className="code" style={{ fontSize: 11.5 }}>{'a.onended = () => { n++; a.src = url(n); a.play(); }'}</div></div>
          <div className="card"><div className="h3">Which quality?</div><div className="small mute" style={{ marginTop: 6 }}>32 to 64 kbps for phones and slow networks · 128 to 192 for home listening · ogg is smaller on the web.</div></div>
          <div className="card"><div className="h3">Need the list in code?</div>
            <div className="code" style={{ fontSize: 12, margin: '8px 0' }}>GET /v2/list/recitor</div><div className="small mute">Every reciter with the exact folder for each format.</div></div>
          <div className="frame" style={{ padding: 18 }}><div className="h3">Keeping this online costs money</div>
            <div className="small mute" style={{ margin: '6px 0 12px' }}>If you stream from us, please consider giving back.</div>
            <a className="btn g s" href="/donate">Support the audio</a></div>
          <div className="card"><div className="h3">Coming later</div><div className="small mute" style={{ marginTop: 6 }}>Ayah and word timing files, to highlight words as they are read.</div></div>
        </div>
      </div>
    </Page>
  );
};

export default AudioPage;
