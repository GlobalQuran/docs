import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Page, API, GITHUB, Seg } from '../gq/ui';
import { useQuranList } from '../gq/data';

const TABS = [['quran', 'Arabic texts'], ['translation', 'Translations'], ['transliteration', 'Transliteration'], ['tafsir', 'Tafsir']];
const ext = { txt: '', json: '.json', jsonp: '.jsonp' };

const DataPage = () => {
  const { textFormats, loading, error } = useQuranList();
  const [tab, setTab] = useState('translation');
  const [lang, setLang] = useState('all');
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [fmt, setFmt] = useState('txt');
  const [picked, setPicked] = useState({});
  const [progress, setProgress] = useState(null);
  const [limit, setLimit] = useState(25);

  // arriving from search with an id: open the tab that holds it
  useEffect(() => {
    const id = params.get('q');
    const hit = id && textFormats.find((t) => t.id === id);
    if (hit) setTab(hit.type);
  }, [params, textFormats]);
  const counts = useMemo(() => { const c = {}; textFormats.forEach((t) => { c[t.type] = (c[t.type] || 0) + 1; }); return c; }, [textFormats]);
  const ofTab = useMemo(() => textFormats.filter((t) => t.type === tab), [textFormats, tab]);
  const languages = useMemo(() => [...new Set(ofTab.map((t) => t.language))].sort(), [ofTab]);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ofTab.filter((t) => (lang === 'all' || t.language === lang) && (!s || `${t.id} ${t.name} ${t.localName}`.toLowerCase().includes(s)));
  }, [ofTab, lang, q]);
  const ids = Object.keys(picked).filter((k) => picked[k]);
  const toggle = (id) => setPicked({ ...picked, [id]: !picked[id] });
  const allShown = rows.slice(0, limit);
  const allOn = allShown.length > 0 && allShown.every((r) => picked[r.id]);
  const toggleAll = () => { const n = { ...picked }; allShown.forEach((r) => { n[r.id] = !allOn; }); setPicked(n); };
  const url = (id, f) => `${API}/complete/${id}${ext[f]}`;

  const download = async () => {
    if (!ids.length) return;
    const zip = new JSZip();
    const folder = zip.folder(`quran-data-${fmt}`);
    for (let i = 0; i < ids.length; i += 1) {
      setProgress(`${i + 1} of ${ids.length}`);
      try {
        const r = await fetch(url(ids[i], fmt));
        folder.file(`${ids[i]}${fmt === 'txt' ? '.txt' : ext[fmt]}`, r.ok ? await r.text() : `Could not fetch ${url(ids[i], fmt)} (${r.status})`);
      } catch (e) { folder.file(`${ids[i]}.error.txt`, `Could not fetch: ${e.message}`); }
    }
    folder.file('README.txt', `GlobalQuran data, ${fmt}. Generated ${new Date().toISOString()}.\nOne ayah per line for txt; see https://docs.globalquran.com/how-it-works\n\n${ids.join('\n')}\n`);
    saveAs(await zip.generateAsync({ type: 'blob' }), `quran-data-${fmt}-${new Date().toISOString().slice(0, 10)}.zip`);
    setProgress(null);
  };

  return (
    <Page>
      <div className="in" style={{ paddingTop: 34 }}>
        <div className="eyebrow">No key · no limits</div>
        <h1 className="h1" style={{ fontSize: 38, margin: '12px 0 8px' }}>Download the data</h1>
        <p className="lead" style={{ maxWidth: 700 }}>The same text the API serves, as plain files. Tick what you want, pick a format, download. Always the latest, straight from the open <a href={`${GITHUB}/data`} style={{ fontWeight: 700 }}>data repository</a>.</p>
      </div>

      <div className="in twocol" style={{ paddingTop: 22 }}>
        <div className="main">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            <Seg value={tab} onChange={(v) => { setTab(v); setLang('all'); setLimit(25); }}
              options={TABS.filter(([k]) => counts[k]).map(([k, l]) => ({ value: k, label: `${l} ${counts[k]}` }))} />
            <div className="search" style={{ minHeight: 38, fontSize: 13.5, flex: 1, minWidth: 200, borderRadius: 19 }}>
              <span>⌕</span><input placeholder="Search language or translator" value={q} onChange={(e) => { setQ(e.target.value); setLimit(25); }} aria-label="Search" />
            </div>
            <select className="sel" style={{ width: 160 }} value={lang} onChange={(e) => { setLang(e.target.value); setLimit(25); }} aria-label="Language">
              <option value="all">All languages</option>{languages.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {loading && <div className="card loading">Loading the list…</div>}
          {error && <div className="err">Could not load the list: {error}</div>}
          {!loading && !error && (
            <div className="card" style={{ padding: 0 }}>
              <table>
                <thead><tr>
                  <th style={{ width: 36 }}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="Select all shown" /></th>
                  <th>ID</th><th>Name</th><th>Language</th><th>Get one</th></tr></thead>
                <tbody>
                  {allShown.map((r) => (
                    <tr key={r.id}>
                      <td><input type="checkbox" checked={!!picked[r.id]} onChange={() => toggle(r.id)} aria-label={`Select ${r.id}`} /></td>
                      <td className="mono small"><b>{r.id}</b></td>
                      <td>{r.name}{r.localName && r.localName !== r.name ? <div className="small mute">{r.localName}</div> : null}</td>
                      <td>{r.language}</td>
                      <td className="small"><a href={url(r.id, 'txt')}>TXT</a> · <a href={url(r.id, 'json')}>JSON</a> · <a href={`https://globalquran.com/1:1?tr=${encodeURIComponent(r.id)}`} target="_blank" rel="noopener noreferrer">View</a></td>
                    </tr>
                  ))}
                  {allShown.length === 0 && <tr><td colSpan="5" className="mute">Nothing matches.</td></tr>}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: 'var(--sub)', borderRadius: '0 0 12px 12px' }}>
                <b>{ids.length} selected</b><span className="mute small">· one ZIP, built in your browser</span>
                <span style={{ flex: 1 }} />
                <Seg value={fmt} onChange={setFmt} options={[{ value: 'txt', label: 'TXT' }, { value: 'json', label: 'JSON' }, { value: 'jsonp', label: 'JSONP' }]} />
                <button type="button" className="btn p s" onClick={download} disabled={!ids.length || !!progress}>{progress ? `Fetching ${progress}…` : 'Download ZIP'}</button>
              </div>
            </div>
          )}
          {!loading && rows.length > limit && (
            <div style={{ marginTop: 12 }}><button type="button" className="btn s" onClick={() => setLimit(limit + 50)}>Show more ({rows.length - limit} left)</button></div>
          )}
          <div className="small mute" style={{ marginTop: 10 }}>Showing {Math.min(limit, rows.length)} of {rows.length}.</div>
        </div>

        <div className="aside">
          <div className="card"><div className="h3">How a data file looks</div>
            <div className="mute small" style={{ margin: '6px 0 10px' }}>Plain text. <b>One ayah per line</b>, 6,236 lines, then a small info block.</div>
            <div className="code" style={{ fontSize: 11.5 }}>{'line 1     In the name of Allah, the Entirely…\nline 2     [All] praise is [due] to Allah…\n…\nline 6236  Say, "I seek refuge in the Lord of mankind…\n# ID: en.sahih · Language: English · Source: Tanzil.net'}</div>
            <div className="small mute" style={{ marginTop: 8 }}>Line number = global ayah number. <Link to="/how-it-works" style={{ fontWeight: 700 }}>How it works</Link></div></div>
          <div className="card"><div className="h3">Developers: use Git</div>
            <div className="code" style={{ fontSize: 12, margin: '10px 0' }}>git clone https://github.com/GlobalQuran/data</div>
            <div className="mute small" style={{ marginBottom: 10 }}>Folders: Quran, Translation, Transliteration, Audio (reciter info).</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><a className="btn s" href={`${GITHUB}/data`}>GitHub</a><a className="btn s" href={`${GITHUB}/data#adding-new-file`}>Add a translation</a></div></div>
          <div className="card"><div className="h3">Also from here</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <Link className="mini" to="/audio"><div className="ic">♪</div><div><b>Audio</b><span>Link the files, no download</span></div></Link>
              <Link className="mini" to="/pdf"><div className="ic">PDF</div><div><b>Quran PDF</b><span>Read or print</span></div></Link>
            </div></div>
        </div>
      </div>
    </Page>
  );
};

export default DataPage;
