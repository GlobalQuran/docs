import React, { useEffect, useState } from 'react';
import { Page, GITHUB, DOCS_API_KEY } from '../gq/ui';

const DB = 'https://donorbox.org/embed/sadaqah-jariyah-help-spread-the-quran-globally';
const AMOUNTS = [[5, ''], [10, 'feeds audio for a day'], [25, ''], [50, ''], [100, '']];

const REFS = ['2:261', '2:274', '57:18', '34:39'];
const FALLBACK = {
  '2:261': ['مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ', 'The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains.'],
};

/** A verse about giving, read live from our own API */
const AyahQuote = () => {
  const [ref, setRef] = useState(REFS[0]);
  const [v, setV] = useState(null);
  useEffect(() => {
    let live = true; setV(null);
    fetch(`https://api.globalquran.com/ayah/${ref}/quran-uthmani,en.sahih?key=${DOCS_API_KEY}`).then((r) => r.json()).then((j) => {
      if (!live) return;
      const ar = Object.values(j.quran['quran-uthmani'])[0].verse;
      const en = Object.values(j.quran['en.sahih'])[0].verse;
      setV({ ar, en });
    }).catch(() => live && setV(FALLBACK[ref] ? { ar: FALLBACK[ref][0], en: FALLBACK[ref][1] } : null));
    return () => { live = false; };
  }, [ref]);
  return (
    <div>
      <div className="quote" style={{ minHeight: 190 }}>
        {v ? (<><div className="ar" lang="ar">{v.ar}</div><div className="en">{v.en}</div></>) : <div className="mute">Loading verse…</div>}
        <div className="ref">Quran {ref}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        {REFS.map((r) => <button key={r} type="button" className={`chip ${r === ref ? 'on' : ''}`} onClick={() => setRef(r)} style={{ cursor: 'pointer', border: r === ref ? '1px solid var(--gold)' : undefined }}>{r}</button>)}
        <a className="chip" href={`https://globalquran.com/${ref}`} target="_blank" rel="noopener noreferrer">Read in context</a>
      </div>
    </div>
  );
};

const PLANS = [
  ['AI that listens and helps memorise', 'A tutor that hears a child or a new reciter, follows the verse, gently marks mistakes and helps them memorise, at their own pace.'],
  ['Tools for teachers and reciters', 'Practice, revision and progress for schools, madrasahs and anyone learning to recite correctly.'],
  ['More reciters, more languages', 'More recitations and translations, with better quality audio, all free to link and use.'],
  ['Faster, safer servers', 'Hosting that stays fast for millions of readers, plus backups so nothing is ever lost.'],
];

const DonatePage = () => {
  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState('');
  const value = custom || amount;
  return (
    <Page>
      <div className="in" style={{ paddingTop: 30 }}>
        <div className="card" style={{ padding: '10px 18px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderColor: 'var(--gold)' }}>
          <div className="small" style={{ flex: 1, minWidth: 240 }}><b>Donation goal</b> (live from Donorbox)</div>
          <iframe title="Donation goal" src={`${DB}?donation_meter_color=%23b99c45&only_donation_meter=true&preview=true`} style={{ border: 0, width: 360, maxWidth: '100%', height: 93 }} scrolling="no" />
        </div>
      </div>

      <div className="in twocol" style={{ paddingTop: 30 }}>
        <div className="main" style={{ flex: '1 1 560px' }}>
          <div className="eyebrow">Support GlobalQuran</div>
          <h1 className="h1" style={{ fontSize: 40, margin: '12px 0' }}>Help keep the Quran free for everyone.</h1>
          <p className="lead">No ads, no tracking, no paywall. Developers, schools and readers everywhere use it free. It runs on donations.</p>
          <div style={{ margin: '26px 0 6px' }}><AyahQuote /></div>
          <h2 className="h2" style={{ margin: '30px 0 8px' }}>What your gift builds next</h2>
          <p className="mute" style={{ margin: '0 0 14px', maxWidth: 640 }}>Keeping the Quran free is the base. We also want to build more for the Quran, and that needs budget.</p>
          <div className="grid g2" style={{ marginBottom: 6 }}>
            {PLANS.map(([t, d]) => <div className="card" key={t}><div className="h3">{t}</div><div className="mute small" style={{ marginTop: 6 }}>{d}</div></div>)}
          </div>
          <h2 className="h2" style={{ margin: '30px 0 14px' }}>Why donate?</h2>
          <div className="grid g2">
            <div className="card"><div className="h3">It costs real money</div><div className="mute small" style={{ marginTop: 6 }}>Servers, audio bandwidth for every reciter, backups.</div></div>
            <div className="card"><div className="h3">It stays independent</div><div className="mute small" style={{ marginTop: 6 }}>Donors, not advertisers, decide what we build.</div></div>
            <div className="card"><div className="h3">Open source</div><div className="mute small" style={{ marginTop: 6 }}>Every project is on GitHub. Star or fork to help too.</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}><a className="btn s" href={`${GITHUB}/quran-anywhere`}>★ Star</a><a className="btn s" href={`${GITHUB}/quran-anywhere/fork`}>⑂ Fork</a></div></div>
            <div className="card"><div className="h3">Ongoing reward</div><div className="mute small" style={{ marginTop: 6 }}>Every verse read through us can be sadaqah jariyah for you.</div></div>
          </div>
          <h2 className="h2" style={{ margin: '30px 0 12px' }}>Other ways to help</h2>
          <div className="card" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a className="chip" href={`${GITHUB}/quran-anywhere`}>Star the repo</a><span className="chip">Share with a friend</span>
            <a className="chip" href={`${GITHUB}/quran-anywhere/issues`}>Report a bug</a><a className="chip" href={`${GITHUB}/data`}>Add a translation</a><a className="chip" href="/contact">Sponsor</a>
          </div>
        </div>

        <div style={{ flex: '0 0 400px', maxWidth: '100%' }}>
          <div className="frame sticky" style={{ padding: 20 }}>
            <div className="eyebrow">Donate securely</div>
            <div className="grid g3" style={{ gap: 8, margin: '14px 0' }}>
              {AMOUNTS.map(([a, note]) => (
                <div key={a} role="button" tabIndex={0} className={`pick ${!custom && amount === a ? 'on' : ''}`} onClick={() => { setAmount(a); setCustom(''); }}>${a}{note && <small>{note}</small>}</div>
              ))}
              <input className="pick" style={{ fontSize: 14 }} inputMode="numeric" placeholder="Other" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))} aria-label="Other amount" />
            </div>
            <div className="small mute" style={{ marginBottom: 10 }}>Pick an amount, then finish in Donorbox's secure form (cards, PayPal, Apple Pay).</div>
            <iframe key={value} title="Donation form" src={`${DB}?amount=${value}`} allow="payment" scrolling="no" style={{ border: 0, width: '100%', height: 900, maxWidth: 500 }} />
          </div>
        </div>
      </div>

      <div className="band" style={{ marginTop: 40 }}>
        <div className="in" style={{ paddingTop: 34, paddingBottom: 34 }}>
          <div className="eyebrow">Donors wall</div>
          <h2 className="h2" style={{ margin: '8px 0 18px', color: '#fff' }}>Thank you to everyone who gave</h2>
          <div className="paper" style={{ maxWidth: 840 }}>
            <iframe title="Donor wall" src={`${DB}?donor_wall_color=%23866e1f&only_donor_wall=true&preview=true`} scrolling="no" style={{ border: 0, width: '100%', minHeight: 345, display: 'block', position: 'relative', zIndex: 1 }} />
          </div>
          <div className="small" style={{ color: '#b9c1bf', marginTop: 12 }}>Only donors who choose to show their name appear.</div>
        </div>
      </div>
    </Page>
  );
};

export default DonatePage;
