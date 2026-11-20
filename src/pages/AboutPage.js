import React from 'react';
import { Link } from 'react-router-dom';
import { Page, GITHUB } from '../gq/ui';

const TEAM = [
  ['Abdul Basit', 'Founder, lead', 'https://basit.me'],
  ['Moazzam Khan', 'Founder, vision', 'https://moazzam-khan.com'],
  ['Umme Ahmed', 'Design and development', 'https://cre8tive-pixels.com'],
  ['M Ali', 'Design and development', 'https://deen-ul-islam.org'],
  ['Hamid Zarrabi-Zadeh', 'Quran text (Tanzil)', 'https://tanzil.net'],
  ['Dr. Shehnaz', 'Word by word translation', null],
  ['QD', 'Corpus data', null],
  ['Nour Sharabash', 'Quran.com', 'https://quran.com'],
  ['Bassem Shama', 'Quran.com', 'https://quran.com'],
];

const AboutPage = () => (
  <Page>
    <div className="in" style={{ paddingTop: 40 }}>
      <div className="eyebrow">About · since 2006</div>
      <h1 className="h1" style={{ fontSize: 40, margin: '12px 0', maxWidth: 780 }}>The Quran, free and open for everyone, for almost twenty years.</h1>
      <p className="lead" style={{ maxWidth: 700 }}>GlobalQuran is a free Quran platform: text, translations, audio and an API that anyone can use. No ads, no tracking, no paywall.</p>
    </div>

    <div className="in" style={{ paddingTop: 28 }}>
      <div className="card stats" style={{ padding: '22px 28px', justifyContent: 'space-between' }}>
        <div><b>2006</b><span>started</span></div>
        <div><b>Free</b><span>text, audio and API for everyone</span></div>
        <div><b>100+</b><span>languages</span></div>
        <div><b>Millions</b><span>of readers served</span></div>
      </div>
    </div>

    <div className="in" style={{ paddingTop: 32 }}>
      <div className="grid g2" style={{ gap: 18 }}>
        <div className="card">
          <div className="h3">How it began</div>
          <p className="mute" style={{ margin: '8px 0 0', lineHeight: 1.7 }}>In 2006 Islamic websites had no easy, free way to show the Quran to their visitors: no simple interface, no API, nothing for people who could not code. We built it, and kept it free. Over the years it grew into a free API, open data and a reader that developers and organisations everywhere use to share the Quran without barriers.</p>
        </div>
        <div className="card">
          <div className="h3">What we believe</div>
          <p className="mute" style={{ margin: '8px 0 0', lineHeight: 1.7 }}>The Quran should reach every home, in every language, on every device. We present the original Arabic unchanged, and translations as interpretations of the meaning, with the respect they deserve. Everything is open, so anyone can check it, improve it and build on it.</p>
        </div>
      </div>
    </div>

    <div className="in" style={{ paddingTop: 32 }}>
      <h2 className="h2" style={{ marginBottom: 6 }}>The people behind it</h2>
      <p className="mute" style={{ margin: '0 0 16px' }}>Since 2006 many people have given their time, skills and duas.</p>
      <div className="team">
        {TEAM.map(([n, role, url]) => (
          <div className="mini" key={n}>
            <div className="ic">{n[0]}</div>
            <div><b>{url ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{n}</a> : n}</b><span>{role}</span></div>
          </div>
        ))}
      </div>
      <p className="small mute" style={{ marginTop: 14 }}>With thanks also to Ahmedre, Sajid Pandore (Ummah.com), Sheraz Sheikh and the many unnamed people who helped. First of all, thanks to Allah, who made it possible.</p>
    </div>

    <div className="band" style={{ marginTop: 40 }}>
      <div className="in" style={{ paddingTop: 30, paddingBottom: 30, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="h3" style={{ color: '#fff' }}>Help us reach more people.</div>
          <div style={{ color: '#b9c1bf', fontSize: 14 }}>Write code, translate, or support the servers.</div>
        </div>
        <a className="btn s ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">Contribute on GitHub</a>
        <Link className="btn g" to="/donate">Donate</Link>
      </div>
    </div>
  </Page>
);

export default AboutPage;
