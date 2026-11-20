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
    .catch(() => publish(false));
  return pending;
}

export function signInUrl(back) {
  return `${LOGIN_URL}?redirect=${encodeURIComponent(back || window.location.href)}`;
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
