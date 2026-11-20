import React from 'react';
import { Page, CopyButton } from '../gq/ui';

const CDN = 'https://cdn.globalquran.com/resources';

const AssetsPage = () => (
  <Page>
    <div className="in" style={{ paddingTop: 36 }}>
      <h1 className="h1" style={{ fontSize: 38 }}>Assets</h1>
      <p className="lead" style={{ margin: '8px 0 22px', maxWidth: 640 }}>Quran fonts and verse images, free to use. Download them, or link them from our CDN.</p>
      <div className="grid g2">
        <div className="card">
          <div className="cap"><span>Quran fonts</span><span className="badge">TTF · OTF</span></div>
          <div style={{ font: '400 34px/1.7 Amiri, "Scheherazade New", serif', direction: 'rtl', textAlign: 'right' }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          <div className="small mute" style={{ margin: '6px 0 12px' }}>Unicode, made for Quran text. Windows, Mac, Linux. Free for personal and commercial use.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><a className="btn p s" href={`${CDN}/quran-fonts.zip`}>Download fonts (ZIP)</a><CopyButton text={`${CDN}/quran-fonts.zip`} label="Copy link" /></div>
        </div>
        <div className="card">
          <div className="cap"><span>Ayah images</span><span className="badge">6,236 PNG</span></div>
          <div style={{ border: '1px solid var(--gold)', borderRadius: 6, background: '#fbfaf6', padding: 10, color: '#2b3434', marginBottom: 10 }}>
            <div style={{ font: '400 22px/1.8 Amiri, serif', direction: 'rtl', textAlign: 'right' }}>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</div></div>
          <div className="small mute" style={{ marginBottom: 12 }}>One high-resolution image per verse, Uthmani script. Large download (about 50 MB), so use a stable connection.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><a className="btn p s" href={`${CDN}/quran-ayah-images.zip`}>Download images (ZIP)</a><CopyButton text={`${CDN}/quran-ayah-images.zip`} label="Copy link" /></div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div className="h3">Good to know</div>
        <div className="grid g3" style={{ marginTop: 10, gap: 12 }}>
          <div className="small mute">Treat the text with respect: no changes to the words.</div>
          <div className="small mute">Check each font's licence and test it in your app before release.</div>
          <div className="small mute">Fonts may need an Arabic language pack on some systems.</div>
        </div>
      </div>
    </div>
  </Page>
);

export default AssetsPage;
