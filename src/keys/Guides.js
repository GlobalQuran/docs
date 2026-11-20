/** "Put it to work": one guide per kind of project (website, mobile app, server or script), with the user's key already in the code. */
import React, { useState } from 'react'
import { ReaderBuilder, ServerBuilder } from './Playground'


const READER = 'https://github.com/GlobalQuran/quran-anywhere'

const Website = ({ k }) => <ReaderBuilder apiKey={k} />
const Mobile = ({ k }) => <ReaderBuilder apiKey={k} app />
const Server = ({ k }) => <ServerBuilder apiKey={k} />

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
      <section className="k-card" style={{ padding: '24px 25.6px' }} aria-labelledby="work-h">
        <h2 className="k-h2" id="work-h">Put it to work</h2>
        <div className="k-seg2" role="group" aria-label="What are you building?" style={{ margin: '14.4px 0 22.4px' }}>
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
            <div className="k-note" style={{ margin: '0 0 12.8px' }}>{c.text}</div>
            <div className="k-links">{c.links.map(([t, h]) => <a key={t} className="k-btn s" href={h}>{t}</a>)}</div>
          </div>
        ))}
      </div>
    </>
  )
}
export default Guides
