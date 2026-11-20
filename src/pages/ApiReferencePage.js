import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Page, API, Seg, CopyButton, KEYS_URL } from '../gq/ui';
import { GROUPS, ENDPOINTS, bySlug } from '../gq/endpoints';

const readKey = () => { try { return localStorage.getItem('gq_key') || ''; } catch (e) { return ''; } };
const saveKey = (v) => { try { localStorage.setItem('gq_key', v); } catch (e) { /* ignore */ } };

const Overview = () => {
  const [key, setKey] = useState(readKey());
  return (
    <div style={{ flex: 1, minWidth: 0, maxWidth: 820 }}>
      <h1 className="h1" style={{ fontSize: 36 }}>API reference</h1>
      <p className="lead" style={{ margin: '8px 0 22px' }}>Everything starts at <span className="chip">{API}/v1</span>. Two kinds of call: <b>lists</b> (what exists) and <b>read</b> (give me the text).</p>

      <div className="frame" style={{ padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div className="h3">Your key</div>
          <div className="small mute">Send it as a header: <span className="chip">X-API-Key: your key</span>. Paste it here and the samples and Run buttons use it. It stays in your browser.</div>
        </div>
        <input className="sel" style={{ width: 240 }} placeholder="paste your key" value={key} onChange={(e) => { setKey(e.target.value); saveKey(e.target.value); }} />
        <a className="btn s" href={KEYS_URL}>Get a key</a>
      </div>

      {GROUPS.map((g) => (
        <div key={g.id}>
          <h2 className="h2" style={{ margin: '30px 0 4px', fontSize: 22 }}>{g.title}</h2>
          <div className="mute small" style={{ marginBottom: 12 }}>{g.blurb}</div>
          <div className="card" style={{ padding: 0 }}>
            <table><tbody>
              {ENDPOINTS.filter((e) => e.group === g.id).map((e) => (
                <tr key={e.slug}>
                  <td style={{ width: 56 }}><span className="m">GET</span></td>
                  <td className="mono small"><b>{e.path}</b></td>
                  <td className="mute">{e.title}</td>
                  <td style={{ textAlign: 'right' }}><Link to={`/api/reference/${e.slug}`}>Details →</Link></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 26 }}>
        <div className="h3">Errors</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          <span className="chip">401 key missing or wrong</span><span className="chip">403 key blocked</span><span className="chip">404 unknown id</span><span className="chip">429 slow down</span>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="small mute" style={{ flex: 1 }}>The full OpenAPI file, for code generators and tools.</div>
        <a className="btn s" href="/docs-assets/api.yaml">Download OpenAPI</a>
      </div>
    </div>
  );
};

const Detail = ({ ep }) => {
  const [lang, setLang] = useState('curl');
  const [path, setPath] = useState(ep.sample);
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);
  const key = readKey();
  const url = `${API}${path}`;
  const hdr = key || 'YOUR_KEY';
  const samples = {
    curl: `curl "${url}" \\\n  -H "X-API-Key: ${hdr}"`,
    JavaScript: `const r = await fetch("${url}", {\n  headers: { "X-API-Key": "${hdr}" },\n});\nconsole.log(await r.json());`,
    Python: `import requests\nr = requests.get("${url}",\n                 headers={"X-API-Key": "${hdr}"})\nprint(r.json())`,
  };
  const run = async () => {
    setBusy(true); setOut(null);
    try {
      const r = await fetch(url, key ? { headers: { 'X-API-Key': key } } : undefined);
      const t = await r.text();
      let shown = t;
      try { shown = JSON.stringify(JSON.parse(t), null, 2); } catch (e) { /* plain text */ }
      setOut(`${r.status} ${r.statusText}\n\n${shown.length > 4000 ? shown.slice(0, 4000) + '\n… (cut, ' + shown.length + ' characters)' : shown}`);
    } catch (e) { setOut(`Could not reach the API: ${e.message}`); }
    setBusy(false);
  };
  const idx = ENDPOINTS.findIndex((e) => e.slug === ep.slug);
  const prev = ENDPOINTS[idx - 1]; const next = ENDPOINTS[idx + 1];
  return (
    <div style={{ flex: 1, minWidth: 0, maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="m" style={{ fontSize: 13, padding: '4px 9px' }}>GET</span>
        <h1 className="h2 mono" style={{ fontSize: 22 }}>{ep.path}</h1>
      </div>
      <p className="lead" style={{ margin: '10px 0 24px', fontSize: 17 }}>{ep.summary} <span className="small"><Link to="/how-it-works" style={{ fontWeight: 700 }}>How IDs and ayah numbers work</Link></span></p>

      <div className="card">
        <div className="cap"><Seg options={['curl', 'JavaScript', 'Python']} value={lang} onChange={setLang} /><CopyButton text={samples[lang]} /></div>
        <div className="code">{samples[lang]}</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <input className="sel mono" style={{ flex: 1, minWidth: 220, fontSize: 13 }} value={path} onChange={(e) => setPath(e.target.value)} aria-label="Request path" />
          <button type="button" className="btn p s" onClick={run} disabled={busy}>{busy ? 'Running…' : '▶ Run'}</button>
        </div>
        <div className="small mute" style={{ marginTop: 8 }}>Edit the path above to try other values. {key ? 'Using your saved key.' : <>No key saved: <Link to="/api/reference" style={{ fontWeight: 700 }}>add it on the overview</Link>.</>}</div>
      </div>

      {out && (<><h2 className="h3" style={{ margin: '24px 0 8px' }}>What came back</h2><div className="code" style={{ fontSize: 12.5, maxHeight: 360, overflow: 'auto' }}>{out}</div></>)}

      {ep.params.length > 0 && (<>
        <h2 className="h3" style={{ margin: '24px 0 8px' }}>Parameters</h2>
        <div className="card" style={{ padding: 0 }}><table><tbody>
          {ep.params.map(([n, d]) => (<tr key={n}><td style={{ width: 150 }}><b className="mono">{n}</b></td><td className="mute">{d}</td></tr>))}
        </tbody></table></div>
      </>)}
      {ep.note && <div className="card" style={{ marginTop: 18 }}><div className="small"><b>Good to know:</b> {ep.note}</div></div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
        {prev ? <Link className="btn s" to={`/api/reference/${prev.slug}`}>← {prev.title}</Link> : <span />}
        {next ? <Link className="btn s" to={`/api/reference/${next.slug}`}>{next.title} →</Link> : <span />}
      </div>
    </div>
  );
};

const ApiReferencePage = () => {
  const { slug } = useParams();
  const ep = slug ? bySlug(slug) : null;
  return (
    <Page>
      <div className="crumbs"><div className="in"><Link to="/api">API</Link> <span>›</span> {ep ? <><Link to="/api/reference">Reference</Link> <span>›</span> <b>{ep.title}</b></> : <b>Reference</b>}</div></div>
      <div className="in" style={{ display: 'flex', gap: 34, paddingTop: 30, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="side" style={{ width: 200, flex: 'none', position: 'sticky', top: 10 }}>
          <Link className={!ep ? 'on' : ''} to="/api/reference">Overview</Link>
          {GROUPS.map((g) => (
            <div key={g.id}>
              <div className="grp">{g.title}</div>
              {ENDPOINTS.filter((e) => e.group === g.id).map((e) => (
                <Link key={e.slug} className={ep && ep.slug === e.slug ? 'on' : ''} to={`/api/reference/${e.slug}`}>{e.title}</Link>
              ))}
            </div>
          ))}
          <div className="grp">Also</div>
          <Link to="/how-it-works">How it works</Link><Link to="/ai-instructions">AI instructions</Link>
        </div>
        {ep ? <Detail key={ep.slug} ep={ep} /> : <Overview />}
      </div>
    </Page>
  );
};

export default ApiReferencePage;
