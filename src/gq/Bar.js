import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle, GITHUB } from './ui';
import { useSession, signInUrl, signOut, KEYS_URL } from './auth';

const LINKS = [
  ['/', 'Docs', true],
  ['/api', 'API'],
  ['/mcp', 'MCP'],
  ['/embed', 'Embed'],
  ['/data', 'Data'],
  ['/audio', 'Audio'],
  ['/assets', 'Assets'],
  ['/pdf', 'Quran PDF', false, true],
];

const REPO = 'GlobalQuran/quran-anywhere';

function useRepoCounts() {
  const [c, setC] = useState(null);
  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem('gq_repo') || 'null');
      if (cached && Date.now() - cached.t < 3600e3) { setC(cached); return; }
    } catch (e) { /* ignore */ }
    fetch(`https://api.github.com/repos/${REPO}`).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (!j) return;
      const v = { stars: j.stargazers_count, forks: j.forks_count, t: Date.now() };
      setC(v);
      try { sessionStorage.setItem('gq_repo', JSON.stringify(v)); } catch (e) { /* ignore */ }
    }).catch(() => {});
  }, []);
  return c;
}

const Bar = () => {
  const [open, setOpen] = useState(false);
  const [acct, setAcct] = useState(false);
  const { user } = useSession();
  const loc = useLocation();
  const counts = useRepoCounts();
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  const on = (to) => (to === '/' ? loc.pathname === '/' || loc.pathname.startsWith('/how-it-works') : loc.pathname.startsWith(to));
  return (
    <div className="gq-new gq-noprint">
      <div className={`bar ${open ? 'menu-open' : ''}`}>
        <div className="in">
          <Link className="brand" to="/" aria-label="GlobalQuran developers home">
            <img src="/logo192.png" alt="" />
            <div><b>Global<i>Quran</i></b><small>DEVELOPERS</small></div>
          </Link>
          <button type="button" className="ib ibtn burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div className="navlinks">
            {LINKS.map(([to, label, , isNew]) => (
              to === '/api' && user ? (
                <Link key={to} to={KEYS_URL} className={`lk ${on('/keys') ? 'on' : ''}`} title="Your keys">{label}</Link>
              ) : <NavLink key={to} to={to} end={to === '/'} className={`lk ${on(to) ? 'on' : ''}`}>
                {label}{isNew && <span className="new">NEW</span>}
              </NavLink>
            ))}
          </div>
          <span className="sp" />
          <div className="navright">
            <span className="gh">
              <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer"><span>★ {counts ? counts.stars : 'Star'}</span></a>
              <a href={`https://github.com/${REPO}/fork`} target="_blank" rel="noopener noreferrer"><span>⑂ {counts ? counts.forks : 'Fork'}</span></a>
            </span>
            <Link className="donate" to="/donate">Donate</Link>
            <ThemeToggle />
            {user ? (
              <>
                <span style={{ position: 'relative' }}>
                  <button type="button" className="ib ibtn" aria-label="Account" aria-expanded={acct} onClick={() => setAcct(!acct)}
                    style={{ background: '#2e3a3c', color: '#f0d98a', fontWeight: 700 }}>{(user.email || '?')[0].toUpperCase()}</button>
                  {acct && (
                    <div className="results" style={{ left: 'auto', right: 0, top: 44, width: 220 }}>
                      <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--mute)', borderBottom: '1px solid var(--line2)', wordBreak: 'break-all' }}>{user.email}</div>
                      <a href="#signout" onClick={(e) => { e.preventDefault(); setAcct(false); signOut(); }}>Sign out</a>
                    </div>
                  )}
                </span>
              </>
            ) : (
              <a className="signin" href={signInUrl()}>Sign in</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { GITHUB };
export default Bar;
