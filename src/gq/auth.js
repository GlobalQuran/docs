import { useEffect, useState } from 'react';

// Same sign-in as app.globalquran.com: one cookie shared across *.globalquran.com.
// If the login service does not allow this site yet (CORS), the check fails quietly and the visitor simply looks signed out.
export const LOGIN_API = 'https://api-login.globalquran.com/api/v1';
export const LOGIN_URL = 'https://login.globalquran.com';
export const KEYS_URL = '/keys';

let cache = null; // null = not asked yet, false = signed out, object = signed in
let pending = null;
const listeners = new Set();
const publish = (v) => { cache = v; listeners.forEach((f) => f(v)); };

function check() {
  if (pending) return pending;
  pending = fetch(`${LOGIN_API}/auth/me`, { credentials: 'include' })
    .then((r) => (r.ok ? r.json() : false))
    .then((j) => publish(j && j.email ? { email: j.email } : false))
    .catch(() => publish(false))
    .then(() => { if (cache === false) oneTap(); });
  return pending;
}

// Signing in from the docs lands on the key page, unless a page asked to come back to itself.
export function signInUrl(back) {
  return `${LOGIN_URL}?reason=api&redirect=${encodeURIComponent(back || window.location.origin + KEYS_URL)}`;
}

// Google's "Continue as <name>" card. Shown once per page load to visitors who are signed out.
// If Google or the login service is unreachable, nothing appears and the Sign in link still works.
const AUTH_BASE = 'https://api-login.globalquran.com/api';
let oneTapStarted = false;
function oneTap() {
  if (oneTapStarted) return;
  oneTapStarted = true;
  fetch(`${AUTH_BASE}/gq/providers`)
    .then((r) => r.json())
    .then(({ googleClientId }) => {
      if (!googleClientId) return;
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = () => {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          cancel_on_tap_outside: false,
          itp_support: true,
          callback: ({ credential }) => {
            fetch(`${AUTH_BASE}/auth/one-tap/callback`, {
              method: 'POST', credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: credential }),
            })
              .then((r) => { if (r.ok) window.location.assign(KEYS_URL); })
              .catch(() => {});
          },
        });
        window.google.accounts.id.prompt();
      };
      document.head.appendChild(s);
    })
    .catch(() => {});
}

export async function signOut() {
  try { await fetch(`${LOGIN_API}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (e) { /* ignore */ }
  publish(false);
}

/** {loading, user}: user is {email} when signed in, otherwise null. */
export function useSession() {
  const [v, setV] = useState(cache);
  useEffect(() => {
    listeners.add(setV);
    if (cache === null) check();
    return () => { listeners.delete(setV); };
  }, []);
  return { loading: v === null, user: v || null };
}
