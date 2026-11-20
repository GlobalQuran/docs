/** Where one key may be used, plus revoke / activate. Simple shows two choices; Advanced shows every restriction. */
import React, { useEffect, useState } from 'react'
import { activateAPIKey, deleteAPIKey, revokeAPIKey, updateRestrictions } from './api'
import { splitLines } from './data'
import { notifyError, notifySuccess, Spinner, useMode } from './ui'
import { KCopy as CopyButton } from './ui'


const KeyEditor = ({ apiKey: k, label, advanced, onChanged, onClose }) => {
  const [anywhere, setAnywhere] = useState(!k.allowed_domains?.length)
  const [domains, setDomains] = useState((k.allowed_domains ?? []).join('\n'))
  const [ips, setIps] = useState((k.allowed_ips ?? []).join('\n'))
  const [agents, setAgents] = useState((k.allowed_user_agents ?? []).join('\n'))
  const [headers, setHeaders] = useState(k.required_headers && Object.keys(k.required_headers).length ? JSON.stringify(k.required_headers, null, 2) : '')
  const [blocked, setBlocked] = useState((k.blocked_patterns ?? []).join('\n'))
  const [more, setMore] = useState(!!(k.allowed_user_agents?.length || k.required_headers || k.blocked_patterns?.length))
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setAnywhere(!k.allowed_domains?.length)
    setDomains((k.allowed_domains ?? []).join('\n')); setIps((k.allowed_ips ?? []).join('\n'))
    setAgents((k.allowed_user_agents ?? []).join('\n')); setBlocked((k.blocked_patterns ?? []).join('\n'))
    setHeaders(k.required_headers && Object.keys(k.required_headers).length ? JSON.stringify(k.required_headers, null, 2) : '')
  }, [k.api_key, k.allowed_domains, k.allowed_ips, k.allowed_user_agents, k.required_headers, k.blocked_patterns])

  const orNull = (a) => (a.length ? a : null)

  const save = async () => {
    let parsedHeaders = null
    if (advanced && headers.trim()) {
      try { parsedHeaders = JSON.parse(headers) } catch { notifyError('Required headers must be valid JSON'); return }
    }
    const list = splitLines(domains)
    if (!advanced && !anywhere && list.length === 0) { notifyError('Add the website this key should work on'); return }
    setBusy(true)
    try {
      await updateRestrictions(k.api_key, {
        restriction_type: 'none',
        allowed_domains: advanced ? orNull(list) : anywhere ? null : list,
        // Simple mode never touches what Advanced set
        allowed_ips: advanced ? orNull(splitLines(ips)) : k.allowed_ips,
        allowed_user_agents: advanced ? orNull(splitLines(agents)) : k.allowed_user_agents,
        required_headers: advanced ? parsedHeaders : k.required_headers,
        blocked_patterns: advanced ? orNull(splitLines(blocked)) : k.blocked_patterns,
      })
      notifySuccess('Saved')
      onChanged()
    } catch { notifyError('Could not save. Please try again.') } finally { setBusy(false) }
  }

  const toggle = async () => {
    if (k.status === 'active' && !window.confirm('Suspend this key? Apps using it will stop working.')) return
    setBusy(true)
    try { await (k.status === 'active' ? revokeAPIKey(k.api_key) : activateAPIKey(k.api_key)); onChanged() }
    catch { notifyError('Could not change the key. Please try again.') } finally { setBusy(false) }
  }

  const remove = async () => {
    if (!window.confirm('Delete this key? Apps using it will stop working, and it will disappear from your list. This cannot be undone.')) return
    setBusy(true)
    try { await deleteAPIKey(k.api_key); onChanged(); onClose?.() }
    catch { notifyError('Could not delete the key. Please try again.') } finally { setBusy(false) }
  }

  const revoked = k.status !== 'active'
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.75rem' }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{label}</div>
          <div className="k-muted" style={{ fontSize: '.8rem', marginTop: 2 }}>Created {new Date(k.created_at).toLocaleDateString()}</div>
        </div>
        {onClose && <button className="k-btn s" onClick={onClose}>Close</button>}
      </div>
      <div>
        <div className="k-label">Your key</div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <input className="k-input k-mono" readOnly value={k.api_key} aria-label="API key" />
          <CopyButton text={k.api_key} primary />
        </div>
      </div>

      {advanced ? (
        <>
          <div><label className="k-label" htmlFor="ed-d">Allowed websites (one per line)</label><textarea id="ed-d" className="k-textarea" value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="Any website" /></div>
          <div><label className="k-label" htmlFor="ed-i">Allowed IP addresses (one per line)</label><textarea id="ed-i" className="k-textarea" value={ips} onChange={(e) => setIps(e.target.value)} placeholder="Any address" /></div>
          <button type="button" className="k-btn s" style={{ alignSelf: 'flex-start' }} onClick={() => setMore(!more)}>{more ? 'Fewer options' : 'More options'}</button>
          {more && (
            <>
              <div><label className="k-label" htmlFor="ed-u">Allowed browsers / user agents</label><textarea id="ed-u" className="k-textarea" value={agents} onChange={(e) => setAgents(e.target.value)} /></div>
              <div><label className="k-label" htmlFor="ed-h">Required headers (JSON)</label><textarea id="ed-h" className="k-textarea" value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder='{"X-App": "mine"}' /></div>
              <div><label className="k-label" htmlFor="ed-b">Blocked patterns</label><textarea id="ed-b" className="k-textarea" value={blocked} onChange={(e) => setBlocked(e.target.value)} /></div>
            </>
          )}
        </>
      ) : (
        <div role="radiogroup" aria-label="Where can this key be used?" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <div className="k-label" style={{ marginBottom: 0 }}>Where can this key be used?</div>
          <div className="k-radio" role="radio" aria-checked={anywhere} tabIndex={0} onClick={() => setAnywhere(true)}>
            <i /><div><b style={{ fontSize: '.9rem' }}>Anywhere</b><div className="k-muted" style={{ fontSize: '.75rem' }}>Easiest. Anyone who gets the key can use it.</div></div>
          </div>
          <div className="k-radio" role="radio" aria-checked={!anywhere} tabIndex={0} onClick={() => setAnywhere(false)}>
            <i /><div style={{ flex: 1 }}>
              <b style={{ fontSize: '.9rem' }}>Only my website</b><div className="k-muted" style={{ fontSize: '.75rem' }}>Safer for a site or web app.</div>
              {!anywhere && <textarea className="k-textarea" style={{ marginTop: '.5rem', minHeight: 60 }} aria-label="Allowed websites, one per line" value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="example.com" onClick={(e) => e.stopPropagation()} />}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '.6rem', marginTop: 'auto' }}>
        <button className="k-btn p" style={{ flex: 1 }} onClick={save} disabled={busy}>Save</button>
        {k.status !== 'blocked' && <button className={`k-btn${revoked ? '' : ' d'}`} onClick={toggle} disabled={busy}>{revoked ? 'Activate' : 'Suspend'}</button>}
        <button className="k-btn d" onClick={remove} disabled={busy}>Delete</button>
      </div>
    </>
  )
}
export default KeyEditor
