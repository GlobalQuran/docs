/** "Put it to work": one guide per kind of project (website, mobile app, server or script), with the user's key already in the code. */
import React, { useState } from 'react'
import { KCopy as CopyButton } from './ui'


const READER = 'https://github.com/GlobalQuran/quran-anywhere'
const API = 'https://api.globalquran.com/quran'

const Code = ({ title, code }) => (
  <div>
    <div className="k-cap"><span>{title}</span><CopyButton text={code} small /></div>
    <pre className="k-code" tabIndex={0}>{code}</pre>
  </div>
)

const Step = ({ n, title, text, children }) => (
  <div>
    <div className="k-step"><i>{n}</i><div><b>{title}</b>{text && <div className="k-note" style={{ margin: '.15rem 0 0' }}>{text}</div>}</div></div>
    {children}
  </div>
)

const Mini = ({ options, value, onChange, label }) => (
  <div className="k-seg2" role="group" aria-label={label} style={{ marginBottom: '.7rem' }}>
    {options.map((o) => <button key={o} aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>)}
  </div>
)

const Website = ({ k }) => {
  const html = `<div class="globalquran-book" data-surah="36" data-api-key="${k}"></div>\n<script src="https://globalquran.com/embed.js" async></script>`
  const js = `const book = document.querySelector(".globalquran-book").globalquran;\nbook.goto(36, 12);\nbook.setTheme("night");\nbook.play(5);`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      <div className="k-two">
        <div className="l">
          <Step n={1} title="Paste this where you want the Quran to appear" text="A blog post, a mosque site, a school portal, a WordPress “Custom HTML” block, a Notion embed. Your key is already in it.">
            <Code title="HTML" code={html} />
            <div className="k-note">It runs in its own frame, so your site's CSS and scripts cannot break it and it cannot break yours.</div>
          </Step>
        </div>
        <div className="r">
          <div className="k-preview" aria-hidden="true">
            <div className="tb"><s /><s /><s /></div>
            <div style={{ background: 'var(--chip)', minHeight: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
              <div style={{ width: '100%', maxWidth: 300, background: 'var(--card)', border: '1px solid var(--gold)', outline: '3px double color-mix(in srgb, var(--gold) 38%, transparent)', outlineOffset: -6, padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ font: '400 26px/1.8 Amiri, serif', direction: 'rtl' }} lang="ar">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                <div style={{ font: 'italic 14px/1.5 Georgia, serif', color: 'var(--mute)' }}>In the name of God, the Most Gracious, the Most Merciful.</div>
              </div>
            </div>
          </div>
          <div className="k-note">What your visitors see: audio, translations and tajweed colours already working.</div>
        </div>
      </div>
      <Step n={2} title="Make it yours" text="Every option is an attribute on the div. All are optional.">
        <table className="k-gtable">
          <thead><tr><th>Attribute</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><td>data-surah, data-ayah</td><td>Where to open (surah 1 to 114, or a verse such as 255)</td></tr>
            <tr><td>data-translation</td><td>Any translation id, such as en.sahih or fr.hamidullah, several with commas, or none</td></tr>
            <tr><td>data-theme</td><td>day, night or auto</td></tr>
            <tr><td>data-accent</td><td>Your brand colour, as a hex without the #</td></tr>
            <tr><td>data-player, data-font, data-height</td><td>Hide the audio player, pick the Arabic font, set the frame height</td></tr>
          </tbody>
        </table>
      </Step>
      <Step n={3} title="Control it from your own buttons" text="Optional. Your page can move the reader around.">
        <Code title="JavaScript" code={js} />
      </Step>
      <div className="k-links">
        <a className="k-btn s" href="https://globalquran.com/embed-demo.html">Live embed demo</a>
        <a className="k-btn s" href={READER}>Source on GitHub</a>
        <a className="k-btn s" href="/api">API docs</a>
      </div>
    </div>
  )
}

const Mobile = ({ k }) => {
  const [os, setOs] = useState('iOS (Swift)')
  const html = `<div class="globalquran-book" data-surah="1" data-theme="auto"\n     data-api-key="${k}"></div>\n<script src="https://globalquran.com/embed.js" async></script>`
  const swift = `let html = """\n${html}\n"""\nwebView.loadHTMLString(html, baseURL: URL(string: "https://globalquran.com"))`
  const kotlin = `val html = """\n${html}\n"""\nwebView.settings.javaScriptEnabled = true\nwebView.loadDataWithBaseURL("https://globalquran.com", html, "text/html", "utf-8", null)`
  const api = `let url = URL(string: "${API}?key=${k}")!\nlet (data, _) = try await URLSession.shared.data(from: url)`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      <Step n={1} title="Fastest: show the whole reader inside your app" text="The reader runs in a web view: audio, translations and tajweed colours already working, nothing to build. Your key is already in it.">
        <Mini options={['iOS (Swift)', 'Android (Kotlin)']} value={os} onChange={setOs} label="Platform" />
        {os === 'iOS (Swift)' ? <Code title="Swift" code={swift} /> : <Code title="Kotlin" code={kotlin} />}
      </Step>
      <Step n={2} title="Or build your own screens with the API" text="Text, translations and recitations as JSON. Send your key with every request.">
        <Code title="Swift" code={api} />
        <div className="k-links" style={{ marginTop: '.8rem' }}>
          <a className="k-btn s" href="/api">API docs</a>
          <a className="k-btn s" href={'/examples'}>Code examples</a>
          <a className="k-btn s" href={'/ai-instructions'}>AI instructions</a>
        </div>
      </Step>
    </div>
  )
}

const Server = ({ k }) => {
  const [lang, setLang] = useState('curl')
  const code = {
    curl: `curl "${API}?key=${k}"`,
    Python: `import requests\nr = requests.get("${API}", params={"key": "${k}"})\nprint(r.json())`,
    Node: `const r = await fetch("${API}", { headers: { "X-API-Key": process.env.GQ_KEY } });\nconsole.log(await r.json());`,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      <Step n={1} title="Make your first request" text="Pick your language. Your key is already in it. Run it and you get JSON back.">
        <Mini options={['curl', 'Python', 'Node']} value={lang} onChange={setLang} label="Language" />
        <Code title={lang === 'curl' ? 'Terminal' : lang} code={code[lang]} />
        <div className="k-note">Tip: send the key in the <b>X-API-Key</b> header and keep it in an environment variable, so it never lands in your code or logs.</div>
      </Step>
      <Step n={2} title="Lock it to your server" text="If you know your server's address, only that machine can use the key. Under All keys, switch to Advanced and add it to “Allowed IP addresses”.">
        <div className="k-links"><a className="k-btn s" href="/keys/all">Open All keys</a><a className="k-btn s" href="/api">API docs</a></div>
      </Step>
    </div>
  )
}

const MORE = {
  website: [
    { title: 'Rather build your own screens?', text: 'Call the API straight from your page. Same key.', links: [['API docs', '/api'], ['Code examples', '/examples']] },
    { title: 'Host your own copy', text: 'The whole reader is a folder of static files. No build step: git clone, then serve the folder.', links: [['Source on GitHub', READER]] },
  ],
  mobile: [
    { title: 'Apps already built on it', text: 'Quran Anywhere for Apple Vision Pro and in VR on Meta Quest: see what is possible.', links: [['See the reader', 'https://globalquran.com']] },
    { title: 'Or start from the reader', text: 'Quran Anywhere is open source: read it, copy it, change it for your app.', links: [['Source on GitHub', READER]] },
  ],
  server: [
    { title: 'Need everything at once?', text: 'Download the whole Quran, all translations and the audio list as files. No API calls, no key needed.', links: [['Download data', '/data'], ['Data on GitHub', 'https://github.com/GlobalQuran/data']] },
    { title: 'Using an AI assistant?', text: 'Give it our AI instructions page and it can write the integration for you.', links: [['AI instructions', '/ai-instructions']] },
    { title: 'Audio recitations', text: 'Reciters, formats and file addresses for your own player.', links: [['Audio', '/audio'], ['Assets', '/assets']] },
  ],
}

const OPTIONS = [{ id: 'website', label: 'Website' }, { id: 'mobile', label: 'Mobile app' }, { id: 'server', label: 'Server or script' }]

const Guides = ({ apiKey, initial }) => {
  const [type, setType] = useState(initial)
  return (
    <>
      <section className="k-card" style={{ padding: '1.5rem 1.6rem' }} aria-labelledby="work-h">
        <h2 className="k-h2" id="work-h">Put it to work</h2>
        <div className="k-seg2" role="group" aria-label="What are you building?" style={{ margin: '.9rem 0 1.4rem' }}>
          {OPTIONS.map((o) => <button key={o.id} aria-pressed={type === o.id} onClick={() => setType(o.id)}>{o.label}</button>)}
        </div>
        {type === 'website' && <Website k={apiKey} />}
        {type === 'mobile' && <Mobile k={apiKey} />}
        {type === 'server' && <Server k={apiKey} />}
      </section>
      <div className="k-grid3">
        {MORE[type].map((c) => (
          <div className="k-card" key={c.title}>
            <h3 className="k-h3">{c.title}</h3>
            <div className="k-note" style={{ margin: '0 0 .8rem' }}>{c.text}</div>
            <div className="k-links">{c.links.map(([t, h]) => <a key={t} className="k-btn s" href={h}>{t}</a>)}</div>
          </div>
        ))}
      </div>
    </>
  )
}
export default Guides
