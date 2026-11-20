// After `react-scripts build`: write real HTML for every public page (so each address answers 200 with its content, title and tags),
// plus sitemap.xml and robots.txt. Uses headless Chrome; set CHROME_BIN if it is not found.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const BUILD = resolve('build');
const SITE = 'https://docs.globalquran.com';
const routes = JSON.parse(readFileSync('src/gq/routes.json', 'utf8')).map((r) => r.path);
const ep = readFileSync('src/gq/endpoints.js', 'utf8');
for (const m of ep.matchAll(/slug: '([a-z0-9-]+)'/g)) routes.push(`/api/reference/${m[1]}`);

const CHROME = process.env.CHROME_BIN || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
].find(existsSync);
if (!CHROME) { console.error('Chrome not found, set CHROME_BIN'); process.exit(1); }

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  let file = join(BUILD, path);
  if (!existsSync(file) || path.endsWith('/') || !extname(file)) file = join(BUILD, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const shell = readFileSync(join(BUILD, 'index.html'), 'utf8');
writeFileSync(join(BUILD, 'app-shell.html'), shell);

for (const route of routes) {
  let html;
  try { html = execFileSync(CHROME, ['--headless=new', '--no-sandbox', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'gq-prerender-'))}`, '--no-first-run', '--disable-gpu', '--virtual-time-budget=9000', '--dump-dom', `http://127.0.0.1:${port}${route}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 }); } catch (e) { console.warn('skipped', route, String(e.message).slice(0, 80)); continue; }
  if (!/<h1|<h2/.test(html)) { console.warn('no content for', route); continue; }
  if (route === '/') { writeFileSync(join(BUILD, 'index.html'), html); }
  else { const dir = join(BUILD, route); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'index.html'), html); }
  console.log('prerendered', route);
}
server.close();

const urls = routes.map((r) => `${SITE}${r === '/' ? '/' : r + '/'}`);
writeFileSync(join(BUILD, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(BUILD, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /keys\n\nSitemap: ${SITE}/sitemap.xml\n`);
