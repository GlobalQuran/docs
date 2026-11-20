// After `react-scripts build`: write real HTML for every public page (so each address answers 200 with its content, title and tags),
// plus sitemap.xml and robots.txt. Uses headless Chrome; set CHROME_BIN if it is not found.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

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

const puppeteer = (await import('puppeteer-core')).default;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
const done = new Set();
async function render(route) {
  let page;
  try {
    page = await browser.newPage();
    // only our own files load: live API data, frames and media are not part of the page text
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url().startsWith(`http://127.0.0.1:${port}`) ? r.continue() : r.abort()));
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForSelector('h1, h2', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 300));
    const html = '<!DOCTYPE html>' + (await page.evaluate(() => document.documentElement.outerHTML));
    if (route === '/') writeFileSync(join(BUILD, 'index.html'), html);
    else { const dir = join(BUILD, route); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'index.html'), html); }
    done.add(route); console.log('prerendered', route);
  } catch (e) { console.warn('skipped', route, String(e.message).slice(0, 80)); }
  finally { try { if (page) await page.close(); } catch (e) { /* already gone */ } }
}
const queue = routes.filter((r) => r !== '/');
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await render(queue.shift()); }));
await render('/');
await browser.close();
server.close();

if (done.size === 0) { console.warn('nothing prerendered, leaving the app as it is'); process.exit(0); }
const urls = routes.filter((r) => done.has(r)).map((r) => `${SITE}${r === '/' ? '/' : r + '/'}`);
writeFileSync(join(BUILD, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
// Sign-in pages are not prerendered (and not indexed), but they still get a real file so the host answers 200, not 404.
for (const r of ['/keys', '/keys/start', '/keys/all']) { const d = join(BUILD, r); mkdirSync(d, { recursive: true }); writeFileSync(join(d, 'index.html'), shell); }
writeFileSync(join(BUILD, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /keys\n\nSitemap: ${SITE}/sitemap.xml\n`);
