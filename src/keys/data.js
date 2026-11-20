import { createApp, listApps, createAPIKey, listAppKeys, updateRestrictions } from './api';

export const ALL_SERVICES = ['quran', 'salat', 'hadith'];

let hasKeysNow = null;
export const getHasKeys = () => hasKeysNow;
const setHasKeys = (v) => { if (hasKeysNow !== v) { hasKeysNow = v; window.dispatchEvent(new Event('gq-haskeys')); } };

export async function loadAllKeys() {
  const { apps } = await listApps(1, 100);
  const perApp = await Promise.all(apps.map(async (app) => (await listAppKeys(app.app_id, 1, 100)).keys.map((key) => ({ key, app }))));
  const rows = perApp.flat().sort((a, b) => b.key.created_at.localeCompare(a.key.created_at));
  setHasKeys(rows.length > 0);
  return { apps, rows };
}

export const mainKey = (rows) => rows.find((r) => r.key.status === 'active') || rows[0];
export const maskKey = (k) => (k.length > 20 ? `${k.slice(0, 20)}…` : k);
export const splitLines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);

export function describeRestrictions(k) {
  const out = [];
  if (k.allowed_domains && k.allowed_domains.length) out.push(`Websites: ${k.allowed_domains.length}`);
  if (k.allowed_ips && k.allowed_ips.length) out.push(`IPs: ${k.allowed_ips.length}`);
  if (k.allowed_user_agents && k.allowed_user_agents.length) out.push('Browsers');
  if (k.required_headers && Object.keys(k.required_headers).length) out.push('Headers');
  if (k.blocked_patterns && k.blocked_patterns.length) out.push('Blocked patterns');
  return out;
}

export async function createFirstKey(o) {
  const site = o.website.trim();
  const app = await createApp({
    name: o.name.trim() || 'My project',
    website: site ? (site.startsWith('http') ? site : `https://${site}`) : null,
    is_commercial: o.commercial,
    enabled_services: ALL_SERVICES,
  });
  let key = await createAPIKey(app.app_id);
  if (o.lockToWebsite && site) {
    const domain = site.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    key = (await updateRestrictions(key.api_key, { restriction_type: 'none', allowed_domains: [domain] })) || key;
  }
  return { key, app };
}
export const addKey = (appId) => createAPIKey(appId);

const TYPE_KEY = 'gq_key_type';
export const getKeyType = () => { try { const v = localStorage.getItem(TYPE_KEY); return v === 'mobile' || v === 'server' ? v : 'website'; } catch (e) { return 'website'; } };
export const setKeyType = (t) => { try { localStorage.setItem(TYPE_KEY, t); } catch (e) { /* private mode */ } };
const MODE_KEY = 'gq_keys_mode';
export const getMode = () => { try { return localStorage.getItem(MODE_KEY) === 'advanced' ? 'advanced' : 'simple'; } catch (e) { return 'simple'; } };
export const setModeStored = (m) => { try { localStorage.setItem(MODE_KEY, m); } catch (e) { /* private mode */ } };
