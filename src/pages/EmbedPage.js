import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, GITHUB } from '../gq/ui';
import { ReaderBuilder } from '../keys/Playground';
import { KCopy } from '../keys/ui';
import '../keys/keys.css';

const CLONE = `git clone ${GITHUB}/quran-anywhere\ncd quran-anywhere\npython3 -m http.server 8765`;

const EmbedPage = () => {
  const [kind, setKind] = useState('website');
  return (
    <Page>
      <div className="in" style={{ paddingTop: 38 }}>
        <div className="eyebrow">Embeddable reader · Quran Anywhere</div>
        <h1 className="h1" style={{ margin: '12px 0 10px', fontSize: 40 }}>A full Quran reader on your site or in your app.<br />Two lines, no account.</h1>
        <p className="lead" style={{ maxWidth: 680 }}>Audio, translations, tajweed colours, night mode and search, already working. It lives in a frame, so your site cannot break it and it cannot break your site. Works in WordPress, Notion, a mosque site, or inside a mobile or desktop app through a web view.</p>
      </div>

      <div className="in gq-keys" style={{ paddingTop: 24, paddingBottom: 10 }}>
        <section className="k-card" style={{ padding: '24px 26px' }} aria-labelledby="emb-h">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <h2 className="k-h2" id="emb-h">Try it and copy the code</h2>
            <div className="k-seg2" role="group" aria-label="Where will it run?">
              {[['website', 'Website'], ['app', 'Mobile app']].map(([id, label]) => <button key={id} aria-pressed={kind === id} onClick={() => setKind(id)}>{label}</button>)}
            </div>
          </div>
          <div style={{ height: 18 }} />
          <ReaderBuilder key={kind} app={kind === 'app'} />
          <div className="k-note" style={{ marginTop: 16 }}>No key needed to start. Add <span className="chip">data-api-key</span> when you have one: <Link to="/keys" style={{ textDecoration: 'underline' }}>get a free key</Link>.</div>
        </section>

        <div className="k-grid3" style={{ marginTop: 20 }}>
          <div className="k-card">
            <h3 className="k-h3">Rather build your own screens?</h3>
            <div className="k-note" style={{ margin: '0 0 12px' }}>Call the API straight from your page or app and design everything yourself.</div>
            <div className="k-links"><Link className="k-btn s" to="/api/reference">API reference</Link><Link className="k-btn s" to="/api">Get an API key</Link></div>
          </div>
          <div className="k-card">
            <h3 className="k-h3">Host your own copy</h3>
            <div className="k-note" style={{ margin: '0 0 10px' }}>The whole reader is a folder of static files. No build step, no server code.</div>
            <pre className="k-code" tabIndex={0}>{CLONE}</pre>
            <div className="k-links" style={{ marginTop: 12 }}>
              <KCopy text={CLONE} small label="Copy commands" />
              <a className="k-btn s" href={`${GITHUB}/quran-anywhere`} target="_blank" rel="noopener noreferrer">★ Star</a>
              <a className="k-btn s" href={`${GITHUB}/quran-anywhere/fork`} target="_blank" rel="noopener noreferrer">⑂ Fork</a>
              <a className="k-btn s" href={`${GITHUB}/quran-anywhere#readme`} target="_blank" rel="noopener noreferrer">README</a>
            </div>
          </div>
          <div className="k-card">
            <h3 className="k-h3">Using it in…</h3>
            <div className="k-chips" style={{ marginTop: 10 }}><code>WordPress</code><code>Notion</code><code>Wix</code><code>React</code><code>iOS web view</code><code>Android web view</code></div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EmbedPage;
