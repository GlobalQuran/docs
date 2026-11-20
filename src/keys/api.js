// Key management API (api-app.globalquran.com), called with the shared sign-in cookie.
import { signInUrl } from '../gq/auth';

const BASE = 'https://api-app.globalquran.com/api/v1';

async function call(method, path, body, params) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const r = await fetch(`${BASE}${path}${qs}`, {
    method, credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 401) { window.location.href = signInUrl(); throw new Error('signed out'); }
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.status === 204 ? null : r.json().catch(() => null);
}

export const createApp = (d) => call('POST', '/apps', d);
export const listApps = (page = 1, size = 100) => call('GET', '/apps', null, { page, page_size: size });
export const updateApp = (id, d) => call('PUT', `/apps/${id}`, d);
export const deleteApp = (id) => call('DELETE', `/apps/${id}`);
export const createAPIKey = (appId) => call('POST', `/apps/${appId}/keys`);
export const listAppKeys = (appId, page = 1, size = 100) => call('GET', `/apps/${appId}/keys`, null, { page, page_size: size });
export const updateRestrictions = (key, d) => call('PUT', `/keys/${key}/restrictions`, d);
export const revokeAPIKey = (key) => call('POST', `/keys/${key}/revoke`);
export const activateAPIKey = (key) => call('POST', `/keys/${key}/activate`);
export const deleteAPIKey = (key) => call('DELETE', `/keys/${key}`);
