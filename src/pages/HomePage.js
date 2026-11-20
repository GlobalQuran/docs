import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Page, KEYS_URL, GITHUB } from '../gq/ui';
import { useQuranList, FALLBACK_COUNTS } from '../gq/data';
import { searchAll } from '../gq/search';
import { useSession } from '../gq/auth';

const HomePage = () => {
  const { textFormats, audioFormats } = useQuranList();
  const nav = useNavigate();
  const { user } = useSession();
  const [q, setQ] = useState('');
  const hits = searchAll(q, { texts: textFormats, reciters: audioFormats });
  const translations = textFormats.filter((t) => t.type === 'translation').length || FALLBACK_COUNTS.texts;
  const reciters = audioFormats.length || FALLBACK_COUNTS.reciters;
  const quranTexts = textFormats.filter((t) => t.type === 'quran').length || FALLBACK_COUNTS.quran;

  return (
    <Page>
      <div className="in" style={{ paddingTop: 36, textAlign: 'center' }}>
        <div className="eyebrow">Free and open for everyone</div>
        <h1 className="h1" style={{ margin: '14px auto 10px', maxWidth: 760 }}>What are you building?</h1>
        <p className="lead" style={{ maxWidth: 620, margin: '0 auto 22px' }}>Pick the closest one and we show you the shortest way. No ads, no tracking, no cost.</p>
        <div className="searchwrap">
          <div className="search">
            <span>⌕</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search docs, endpoints, reciters, translations"
              aria-label="Search the docs"
              onKeyDown={(e) => { if (e.key === 'Enter' && hits[0]) { nav(hits[0].to); setQ(''); } if (e.key === 'Escape') setQ(''); }} />
          </div>
          {q.trim() && (
            <div className="results">
              {hits.length === 0 && <div style={{ padding: '14px 16px', fontSize: 14, color: 'var(--mute)' }}>Nothing found for "{q}". Try a word like surah, translation, audio or embed.</div>}
              {hits.map((h) => <Link key={h.group + h.to} to={h.to} onClick={() => setQ('')}>{h.title}<small>{h.group} · {h.sub}</small></Link>)}
            </div>
          )}
        </div>
      </div>

      <div className="in" style={{ paddingTop: 26 }}>
        <div className="frame" style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="eyebrow">{user ? 'Welcome back' : 'Start here'}</div>
            <div className="h2" style={{ margin: '8px 0 6px' }}>{user ? 'Your API key is ready' : 'Get your free API key'}</div>
            <div className="mute small">{user ? 'Open your key page for your key, a ready sample and your other keys.' : 'Sign in, say what you are building, copy your key and a ready sample. About a minute.'}</div>
          </div>
          <a className="btn g" href={KEYS_URL}>{user ? 'Open my key' : 'Get a key'}</a>
          {!user && <a className="btn" href={KEYS_URL}>I already have one</a>}
        </div>
      </div>

      <div className="in" style={{ paddingTop: 34 }}>
        <div className="grid g3">
          <div className="frame">
            <div className="eyebrow">A website or an app</div>
            <h2 className="h2" style={{ margin: '10px 0 8px' }}>Show the Quran on my site or app</h2>
            <p className="mute small">Two lines of HTML give you a full reader with audio, translations and night mode. No account, no key.</p>
            <div className="code" style={{ margin: '14px 0', fontSize: 12 }}>{'<div class="globalquran-book"\n     data-surah="36"></div>'}</div>
            <Link className="btn p" to="/embed">Embed the reader</Link>
          </div>
          <div className="frame">
            <div className="eyebrow">An app or a server</div>
            <h2 className="h2" style={{ margin: '10px 0 8px' }}>Call the API</h2>
            <p className="mute small">JSON for every ayah, page, juz and surah, with your choice of translation. Free key, one request to start.</p>
            <div className="code" style={{ margin: '14px 0', fontSize: 12 }}>{'curl "api.globalquran.com/v1/\n     ayah/262/en.sahih"'}</div>
            <Link className="btn p" to="/api">Get a free key</Link>
          </div>
          <div className="frame">
            <div className="eyebrow">Just the files</div>
            <h2 className="h2" style={{ margin: '10px 0 8px' }}>Take the data with you</h2>
            <p className="mute small">Quran text, {translations} translations, audio you can link, fonts, images and a PDF. No key needed.</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
              <span className="chip">TXT</span><span className="chip">JSON</span><span className="chip">MP3</span><span className="chip">PDF</span>
            </div>
            <Link className="btn p" to="/data">Open downloads</Link>
          </div>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 30 }}>
        <div className="grid g4" style={{ gap: 14 }}>
          <Link className="mini" to="/api/reference"><div className="ic">{'{ }'}</div><div><b>API reference</b><span>Every endpoint</span></div></Link>
          <Link className="mini" to="/how-it-works"><div className="ic">?</div><div><b>How it works</b><span>IDs, ayah numbers, URLs</span></div></Link>
          <Link className="mini" to="/audio"><div className="ic">♪</div><div><b>Audio</b><span>Link our CDN</span></div></Link>
          <Link className="mini" to="/assets"><div className="ic">Aa</div><div><b>Assets</b><span>Fonts and images</span></div></Link>
          <Link className="mini" to="/pdf"><div className="ic">PDF</div><div><b>Quran PDF</b><span>Preview, then download</span></div></Link>
          <Link className="mini" to="/ai-instructions"><div className="ic">AI</div><div><b>AI instructions</b><span>Let your assistant build it</span></div></Link>
          <a className="mini" href={GITHUB}><div className="ic">GH</div><div><b>GitHub</b><span>All repos, open source</span></div></a>
          <Link className="mini" to="/donate"><div className="ic">♥</div><div><b>Why donate</b><span>Keeps it free</span></div></Link>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 30 }}>
        <div className="card stats" style={{ padding: '22px 28px', justifyContent: 'space-between' }}>
          <div><b>6,236</b><span>ayahs</span></div>
          <div><b>{translations}</b><span>translations</span></div>
          <div><b>{reciters}</b><span>reciters</span></div>
          <div><b>{quranTexts}</b><span>Arabic texts</span></div>
          <div><b>114</b><span>surahs</span></div>
        </div>
      </div>

      <div className="band" style={{ marginTop: 34 }}>
        <div className="in" style={{ paddingTop: 24, paddingBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="h3" style={{ color: '#fff' }}>This stays free because people give.</div>
            <div style={{ color: '#b9c1bf', fontSize: 14 }}>Servers and audio hosting are paid by donors like you.</div>
          </div>
          <Link className="btn g" to="/donate">Donate</Link>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
