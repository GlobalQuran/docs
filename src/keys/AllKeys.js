/** Steps 3 and 4: all keys. Simple = a flat list with a side panel. Advanced = projects, every restriction, project details. */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { addKey, ALL_SERVICES, describeRestrictions, loadAllKeys, maskKey } from './data'
import { createApp, deleteApp, updateApp } from './api'
import KeyEditor from './KeyEditor'
import { KCopy as CopyButton } from './ui'
import { notifyError, notifySuccess, Spinner, useMode } from './ui'

/** "Reader app", or "Reader app · key 2" when a project has more than one key */
function labelFor(row, rows) {
  const name = row.app.name || 'My project'
  const mine = rows.filter((r) => r.app.app_id === row.app.app_id).sort((a, b) => a.key.created_at.localeCompare(b.key.created_at))
  return mine.length > 1 ? `${name} · key ${mine.findIndex((r) => r.key.api_key === row.key.api_key) + 1}` : name
}

const StatusPill = ({ status }) => (
  <span className={`k-pill ${status === 'active' ? 'ok' : 'off'}`}>{status === 'active' ? 'Active' : status === 'blocked' ? 'Blocked' : 'Suspended'}</span>
)

/* ───────────── Simple ───────────── */
const Simple = ({ apps, rows, reload }) => {
  const [selected, setSelected] = useState(rows[0]?.key.api_key ?? null)
  const sel = rows.find((r) => r.key.api_key === selected) ?? null

  const create = async () => {
    const app = rows[0]?.app ?? apps[0]
    if (!app) return
    try { const k = await addKey(app.app_id); await reload(); setSelected(k.api_key); notifySuccess('New key created') }
    catch { notifyError('Could not create a key') }
  }

  return (
    <div className="k-page">
      <div className="k-layout">
        <div className="k-main">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 className="k-h1">API keys</h1>
              <p className="k-sub">A key lets your app read the Quran text and audio. Keep it private.</p>
            </div>
            <button className="k-btn p" onClick={create}>+ Create key</button>
          </div>
          <div className="k-card" style={{ overflow: 'hidden' }}>
            {rows.map((r) => (
              <div key={r.key.api_key} className={`k-row${r.key.api_key === selected ? ' sel' : ''}`}>
                <button type="button" className="grow" onClick={() => setSelected(r.key.api_key)} style={{ all: 'unset', cursor: 'pointer', flex: 1, minWidth: 180 }} aria-label={`Open ${labelFor(r, rows)}`}>
                  <div style={{ fontWeight: 600 }}>{labelFor(r, rows)}</div>
                  <div className="k-mono k-muted" style={{ marginTop: 4 }}>{maskKey(r.key.api_key)}</div>
                </button>
                <CopyButton text={r.key.api_key} small disabled={r.key.status !== 'active'} />
                <StatusPill status={r.key.status} />
              </div>
            ))}
          </div>
          <p className="k-muted" style={{ margin: 0, fontSize: '.8rem' }}>Free to use. Keep your keys private. Want projects, more restrictions or details? Switch to Advanced at the top.</p>
        </div>
        {sel && (
          <div className="k-frame k-panel">
            <KeyEditor apiKey={sel.key} label={labelFor(sel, rows)} onChanged={reload} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────────── Advanced ───────────── */
const Advanced = ({ apps, rows, reload }) => {
  const [appId, setAppId] = useState(apps[0]?.app_id ?? null)
  const app = apps.find((a) => a.app_id === appId) ?? apps[0]
  const appRows = useMemo(() => rows.filter((r) => r.app.app_id === app?.app_id), [rows, app])
  const [selected, setSelected] = useState(null)
  const sel = appRows.find((r) => r.key.api_key === selected) ?? appRows[0] ?? null
  const [newName, setNewName] = useState(null)

  // project details form
  const [name, setName] = useState(''); const [website, setWebsite] = useState('')
  const [commercial, setCommercial] = useState(false); const [services, setServices] = useState([])
  useEffect(() => {
    if (!app) return
    setName(app.name ?? ''); setWebsite(app.website ?? ''); setCommercial(app.is_commercial); setServices(app.enabled_services)
  }, [app])

  const saveDetails = async () => {
    if (!app) return
    if (services.length === 0) { notifyError('Keep at least one service on'); return }
    try { await updateApp(app.app_id, { name: name.trim() || null, website: website.trim() || null, is_commercial: commercial, enabled_services: services }); await reload(); notifySuccess('Saved') }
    catch { notifyError('Could not save. Please try again.') }
  }

  const removeProject = async () => {
    if (!app) return
    if (!window.confirm(`Delete the project "${app.name || 'Untitled'}"? Its keys stop working and everything disappears from your list. This cannot be undone.`)) return
    try { await deleteApp(app.app_id); setAppId(null); setSelected(null); await reload(); notifySuccess('Project deleted') }
    catch { notifyError('Could not delete the project. Please try again.') }
  }
  const createProject = async () => {
    try {
      const a = await createApp({ name: (newName ?? '').trim() || 'New project', enabled_services: ALL_SERVICES })
      await addKey(a.app_id); await reload(); setAppId(a.app_id); setSelected(null); setNewName(null)
    } catch { notifyError('Could not create the project') }
  }
  const newKey = async () => {
    if (!app) return
    try { const k = await addKey(app.app_id); await reload(); setSelected(k.api_key); notifySuccess('New key created') } catch { notifyError('Could not create a key') }
  }

  return (
    <div className="k-page" style={{ maxWidth: 1240 }}>
      <div className="k-layout">
        <nav className="k-side" aria-label="Projects">
          <div className="k-muted" style={{ fontSize: '.7rem', fontWeight: 600, padding: '0 .9rem .4rem' }}>PROJECTS</div>
          {apps.map((a) => (
            <button key={a.app_id} aria-current={a.app_id === app?.app_id} onClick={() => { setAppId(a.app_id); setSelected(null) }}>{a.name || 'My project'}</button>
          ))}
          {newName === null
            ? <button className="k-btn s" style={{ marginTop: '.6rem' }} onClick={() => setNewName('')}>+ New project</button>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', marginTop: '.6rem' }}>
                <input className="k-input" autoFocus placeholder="Project name" aria-label="Project name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createProject()} />
                <div style={{ display: 'flex', gap: '.4rem' }}><button className="k-btn p s" onClick={createProject}>Create</button><button className="k-btn s" onClick={() => setNewName(null)}>Cancel</button></div>
              </div>}
        </nav>

        {app && (
          <div className="k-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h1 className="k-h1" style={{ fontSize: '1.5rem' }}>{app.name || 'My project'}</h1>
                <p className="k-sub">{[app.description, app.website].filter(Boolean).join(' · ') || 'No description yet'}</p>
              </div>
              <button className="k-btn p s" onClick={newKey}>+ New key</button>
            </div>

            <div className="k-card" style={{ overflow: 'hidden' }}>
              <table className="k-table">
                <thead><tr><th>Key</th><th>Restrictions</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {appRows.map((r) => (
                    <tr key={r.key.api_key} className={r.key.api_key === sel?.key.api_key ? 'sel' : ''}>
                      <td>
                        <button type="button" onClick={() => setSelected(r.key.api_key)} style={{ all: 'unset', cursor: 'pointer' }} aria-label={`Select ${labelFor(r, rows)}`}>
                          <div style={{ fontWeight: 600 }}>{labelFor(r, rows)}</div>
                          <div className="k-mono k-muted">{maskKey(r.key.api_key)}</div>
                        </button>
                      </td>
                      <td>{describeRestrictions(r.key).map((t) => <span key={t} className="k-tag">{t}</span>)}{describeRestrictions(r.key).length === 0 && <span className="k-muted">None</span>}</td>
                      <td><StatusPill status={r.key.status} /></td>
                      <td style={{ textAlign: 'right' }}><CopyButton text={r.key.api_key} small disabled={r.key.status !== 'active'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="k-grid2">
              {sel && (
                <div className="k-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <KeyEditor key={sel.key.api_key} apiKey={sel.key} label={`Restrictions for ${labelFor(sel, rows)}`} advanced onChanged={reload} />
                </div>
              )}
              <div className="k-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontWeight: 700 }}>Project details</div>
                <div><label className="k-label" htmlFor="pd-n">Name</label><input id="pd-n" className="k-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><label className="k-label" htmlFor="pd-w">Website</label><input id="pd-w" className="k-input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" /></div>
                <label className="k-check"><input type="checkbox" checked={commercial} onChange={(e) => setCommercial(e.target.checked)} />Commercial product</label>
                <div style={{ display: 'flex', gap: '1.1rem', flexWrap: 'wrap' }}>
                  {ALL_SERVICES.map((s) => (
                    <label key={s} className="k-check" style={{ textTransform: 'capitalize' }}>
                      <input type="checkbox" checked={services.includes(s)} onChange={(e) => setServices(e.target.checked ? [...services, s] : services.filter((x) => x !== s))} />{s}
                    </label>
                  ))}
                </div>
                <div className="k-muted" style={{ fontSize: '.75rem', marginTop: 'auto' }}>Rate limits are set by GlobalQuran.</div>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <button className="k-btn p s" onClick={saveDetails}>Save</button>
                  <button className="k-btn d s" onClick={removeProject}>Delete project</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────────── Page ───────────── */
const AllKeys = () => {
  const [mode, setMode] = useMode()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  const reload = useCallback(async () => { setData(await loadAllKeys()) }, [])
  useEffect(() => { reload().catch(() => setError(true)) }, [reload])

  if (error) return <div className="k-center"><div className="k-card k-hero">Could not load your keys. Please refresh.</div></div>
  if (!data) return <div className="k-center"><Spinner text="Loading your keys..." /></div>
  if (data.rows.length === 0) return <Navigate to="/keys/start" replace />
  return (
    <>
      <div className="k-page" style={{ paddingBottom: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <div className="k-seg2" role="group" aria-label="Mode">
          <button aria-pressed={mode === 'simple'} onClick={() => setMode('simple')}>Simple</button>
          <button aria-pressed={mode === 'advanced'} onClick={() => setMode('advanced')}>Advanced</button>
        </div>
      </div>
      {mode === 'advanced' ? <Advanced {...data} reload={reload} /> : <Simple {...data} reload={reload} />}
    </>
  )
}
export default AllKeys
