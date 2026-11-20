// Local testing only (REACT_APP_MOCK=1): answers the sign-in and key calls from memory so the key pages can be seen without an account.
const now = new Date().toISOString();
const app = { app_id: 1, user_id: 1, name: 'Reader app', description: null, website: 'https://example.com', is_commercial: false, is_payee: false, enabled_services: ['quran', 'salat', 'hadith'], status: 'active', created_at: now, updated_at: now };
const key = (n, domains) => ({ api_id: n, api_key: `gq_live_8f3a1c9d2b7e4a60f1c5d3e${n}`, app_id: 1, restriction_type: 'none', allowed_domains: domains, allowed_ips: null, allowed_user_agents: null, required_headers: null, blocked_patterns: null, status: 'active', created_at: now, last_access: now, last_ip: null });
const real = window.fetch.bind(window);
window.fetch = (url, opts) => {
  const u = String(url);
  const json = (b) => Promise.resolve(new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  if (u.includes('/auth/me')) return json({ email: 'you@example.com' });
  if (u.includes('/apps/1/keys')) return json({ keys: [key(1, ['example.com']), key(2, null)], total: 2, page: 1, page_size: 100, total_pages: 1 });
  if (u.includes('/apps')) return json({ apps: [app], total: 1, page: 1, page_size: 100, total_pages: 1 });
  return real(url, opts);
};
