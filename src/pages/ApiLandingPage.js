import React from 'react';
import { Link } from 'react-router-dom';
import { Page, KEYS_URL } from '../gq/ui';
import { useQuranList, FALLBACK_COUNTS } from '../gq/data';

const ApiLandingPage = () => {
  const { textFormats, audioFormats } = useQuranList();
  const translations = textFormats.filter((t) => t.type === 'translation').length || FALLBACK_COUNTS.texts;
  const reciters = audioFormats.length || FALLBACK_COUNTS.reciters;
  const quranTexts = textFormats.filter((t) => t.type === 'quran').length || FALLBACK_COUNTS.quran;
  return (
    <Page>
      <div className="hero">
        <div className="in" style={{ paddingTop: 50, paddingBottom: 50, display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 440px' }}>
            <span className="badge" style={{ background: 'rgba(240,217,138,.18)', color: '#f0d98a' }}>Free forever</span>
            <h1 className="h1" style={{ margin: '14px 0 12px' }}>The Quran API,<br />free for everyone.</h1>
            <p className="lead" style={{ marginBottom: 22 }}>Every ayah, {translations} translations and {reciters} reciters as simple JSON. Sign in, copy your key, make your first call in a minute.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn g" href={KEYS_URL}>Sign in to get your key</a>
              <Link className="btn ghost" to="/api/reference">Read the reference</Link>
            </div>
            <div className="small" style={{ color: '#b9c1bf', marginTop: 14 }}>No card · no ads · no tracking · open source</div>
          </div>
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <div className="code" style={{ fontSize: 12.5 }}>{`# your first call
curl "https://api.globalquran.com/v1/ayah/262/en.sahih" \\
  -H "X-API-Key: YOUR_KEY"

{ "quran": { "en.sahih": { "262": {
  "surah": 2, "ayah": 255,
  "verse": "Allah - there is no deity except Him…" } } } }`}</div>
          </div>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 30 }}>
        <div className="card stats" style={{ padding: '20px 28px', justifyContent: 'space-between' }}>
          <div><b>6,236</b><span>ayahs</span></div><div><b>{translations}</b><span>translations</span></div><div><b>{reciters}</b><span>reciters</span></div><div><b>{quranTexts}</b><span>Arabic texts</span></div><div><b>JSON · JSONP · TXT</b><span>formats</span></div>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 34 }}>
        <h2 className="h2" style={{ marginBottom: 16 }}>What you can do with it</h2>
        <div className="grid g4">
          <div className="card"><div className="h3">Read</div><div className="mute small" style={{ marginTop: 6 }}>By ayah, surah, page or juz. Several translations at once, comma separated.</div></div>
          <div className="card"><div className="h3">Whole text</div><div className="mute small" style={{ marginTop: 6 }}>One call returns a complete Quran edition, ready to cache in your app.</div></div>
          <div className="card"><div className="h3">Lists</div><div className="mute small" style={{ marginTop: 6 }}>All translations, reciters and Arabic texts, so your app can offer a choice.</div></div>
          <div className="card"><div className="h3">Audio paths</div><div className="mute small" style={{ marginTop: 6 }}>Reciter lists tell you the file address for each ayah or surah.</div></div>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 34 }}>
        <h2 className="h2" style={{ marginBottom: 16 }}>Pick the key that fits</h2>
        <div className="grid g3">
          <div className="card"><div className="eyebrow">Website</div><div className="h3" style={{ margin: '8px 0' }}>Locked to your domain</div><div className="mute small">Safe to put in a page because it only works from your address.</div></div>
          <div className="card"><div className="eyebrow">Mobile app</div><div className="h3" style={{ margin: '8px 0' }}>Locked to your app</div><div className="mute small">Tied to your app, so a copied key is useless elsewhere.</div></div>
          <div className="card"><div className="eyebrow">Server or script</div><div className="h3" style={{ margin: '8px 0' }}>Locked to your server</div><div className="mute small">Keep it private. Optionally allow only your server's address.</div></div>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 34, display: 'flex', gap: 22, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px' }}>
          <h2 className="h2" style={{ marginBottom: 16 }}>Three steps</h2>
          <div className="grid" style={{ gap: 12 }}>
            <div className="card step"><i>1</i><div><div className="h3">Sign in</div><div className="mute small">One account for the whole site.</div></div></div>
            <div className="card step"><i>2</i><div><div className="h3">Say what you are building</div><div className="mute small">Website, mobile app or server. We tailor the sample.</div></div></div>
            <div className="card step"><i>3</i><div><div className="h3">Copy the key, run the sample</div><div className="mute small">Your key is already inside it.</div></div></div>
          </div>
        </div>
        <div style={{ flex: '1 1 420px' }}>
          <h2 className="h2" style={{ marginBottom: 16 }}>Good to know</h2>
          <div className="card">
            <div className="step"><i>✓</i><div className="small">Fair use limits keep it fast for everyone. If you need more, ask.</div></div>
            <div className="step" style={{ marginTop: 12 }}><i>✓</i><div className="small">Need everything at once? Use <Link to="/data" style={{ fontWeight: 700 }}>Data</Link> instead of thousands of calls.</div></div>
            <div className="step" style={{ marginTop: 12 }}><i>✓</i><div className="small">New to it? Read <Link to="/how-it-works" style={{ fontWeight: 700 }}>How it works</Link> first (10 minutes).</div></div>
            <div className="step" style={{ marginTop: 12 }}><i>✓</i><div className="small">Please credit translators when you show their text.</div></div>
          </div>
        </div>
      </div>

      <div className="in" style={{ paddingTop: 34 }}>
        <h2 className="h2" style={{ marginBottom: 14 }}>Questions</h2>
        <div className="card" style={{ padding: 0 }}>
          <table><tbody>
            <tr><td><b>Is it really free?</b></td><td className="mute">Yes. Donations pay for the servers.</td></tr>
            <tr><td><b>I lost my key.</b></td><td className="mute">Sign in and open My key. You can make a new one any time.</td></tr>
            <tr><td><b>Do I need a key to use the embed or the data?</b></td><td className="mute">No. Only the API uses keys.</td></tr>
            <tr><td><b>Can I use it in a commercial app?</b></td><td className="mute">Talk to us first: <Link to="/contact">contact</Link>.</td></tr>
          </tbody></table>
        </div>
      </div>

      <div className="band" style={{ marginTop: 36 }}>
        <div className="in" style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div className="h3" style={{ color: '#fff', flex: 1 }}>Ready? It takes a minute.</div>
          <a className="btn g" href={KEYS_URL}>Sign in to get your key</a>
        </div>
      </div>
    </Page>
  );
};

export default ApiLandingPage;
