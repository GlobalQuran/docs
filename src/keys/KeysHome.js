/** Step 2: home. Every visit after the first lands here: the key is shown right away. */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getKeyType, loadAllKeys, mainKey } from './data'
import Guides from './Guides'
import HelpLinks from './HelpLinks'
import { KCopy as CopyButton, Spinner } from './ui'

const KeysHome = () => {
  const navigate = useNavigate()
  const [row, setRow] = useState(null)
  const [count, setCount] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadAllKeys()
      .then(({ rows }) => {
        const m = mainKey(rows)
        if (!m) { navigate('/keys/start', { replace: true }); return }
        setRow(m); setCount(rows.length)
      })
      .catch(() => setError(true))
  }, [navigate])

  if (error) return <div className="k-center"><div className="k-card k-hero">Could not load your key. Please refresh.</div></div>
  if (!row) return <div className="k-center"><Spinner text="Loading your key..." /></div>

  const domains = row.key.allowed_domains?.length ? row.key.allowed_domains.join(', ') : null
  return (
    <div className="k-wrap">
      <div>
        <h1 className="k-h1">Your API key</h1>
        <p className="k-sub">{row.app.name || 'My project'}{domains ? ` · works on ${domains}` : ' · works anywhere'}</p>
      </div>
      <div className="k-frame" style={{ padding: '22.4px 25.6px' }}>
        <div className="k-lbl">Your key</div>
        <div className="k-keybox">
          <span className="k-mono">{row.key.api_key}</span>
          <CopyButton text={row.key.api_key} primary label="Copy key" />
        </div>
        <div className="k-note">
          Keep it private. If it leaks, delete it under <Link to="/keys/all" style={{ textDecoration: 'underline' }}>All keys</Link> and make a new one.
          {count > 1 ? ` You have ${count} keys.` : ''}
        </div>
      </div>
      <HelpLinks />
      <Guides apiKey={row.key.api_key} initial={getKeyType()} />
    </div>
  )
}
export default KeysHome
