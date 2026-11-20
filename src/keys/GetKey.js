/** Step 1: first visit, no key yet. One question, then the key is made. */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFirstKey, setKeyType } from './data'
import { notifyError } from './ui'

const CHOICES = [
  { id: 'website', title: 'A website', text: 'We lock the key to your domain.', gets: 'You get: a copy-paste embed',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></> },
  { id: 'mobile', title: 'A mobile app', text: 'No restriction needed.', gets: 'You get: web view and API code',
    icon: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></> },
  { id: 'server', title: 'A server or script', text: 'No restriction needed.', gets: 'You get: curl, Python, Node',
    icon: <><rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /></> },
]

const GetKey = () => {
  const navigate = useNavigate()
  const [where, setWhere] = useState('website')
  const [website, setWebsite] = useState('')
  const [name, setName] = useState('')
  const [commercial, setCommercial] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await createFirstKey({ name, website: where === 'website' ? website : '', commercial, lockToWebsite: where === 'website' })
      setKeyType(where)
      navigate('/keys', { replace: true })
    } catch {
      notifyError('Could not create your key. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="k-center">
      <form className="k-frame k-hero" onSubmit={submit}>
        <div>
          <div className="k-eyebrow">Free API key</div>
          <h1 className="k-h1" style={{ marginTop: '.5rem' }}>One question, then your key is ready</h1>
          <p className="k-sub">No project to set up, nothing else to fill in.</p>
        </div>
        <div>
          <div className="k-label" id="where-q">Where will it run?</div>
          <div className="k-choices" role="group" aria-labelledby="where-q">
            {CHOICES.map((c) => (
              <button type="button" key={c.id} className="k-choice" aria-pressed={where === c.id} onClick={() => setWhere(c.id)}>
                <span className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{c.icon}</svg></span>
                <b>{c.title}</b><span className="t">{c.text}</span><em>{c.gets}</em>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap' }}>
          {where === 'website' && (
            <div style={{ flex: '1 1 260px' }}>
              <label className="k-label" htmlFor="site">Your website address</label>
              <input id="site" className="k-input" placeholder="example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          )}
          <div style={{ flex: '1 1 260px' }}>
            <label className="k-label" htmlFor="nm">Name it <span className="k-muted" style={{ fontWeight: 400 }}>(optional)</span></label>
            <input id="nm" className="k-input" placeholder="My project" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <label className="k-check">
          <input type="checkbox" checked={commercial} onChange={(e) => setCommercial(e.target.checked)} />
          <span>This is for a commercial product <span className="k-muted">(optional, helps us plan)</span></span>
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="k-muted" style={{ fontSize: '.8rem' }}>You can change all of this later.</span>
          <button type="submit" className="k-btn p" disabled={busy} style={{ minHeight: 48, padding: '0 1.6rem' }}>{busy ? 'Creating…' : 'Create my key'}</button>
        </div>
      </form>
    </div>
  )
}
export default GetKey
