// GitHub Pages has no rewrites. Copy index.html to every known route so deep
// links answer 200, and to 404.html so routes added later from the Console
// (new products, posts) still load the app.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');

const products = readFileSync(join(root, 'src/data/products.ts'), 'utf8').split('export const products')[1].split('export const horizon')[0];
const ids = [...products.matchAll(/^\s{4}id: '([a-z0-9-]+)'/gm)].map((m) => m[1]);
const slugs = [...readFileSync(join(root, 'src/data/site.ts'), 'utf8').matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);

const routes = [
  'products', 'ecosystem', 'about', 'careers', 'partners', 'journal', 'open-source', 'developers', 'pricing',
  'status', 'contact', 'security', 'legal/privacy', 'legal/terms', 'legal/cookies', 'privacy', 'terms', 'studio',
  ...ids.map((id) => `products/${id}`),
  ...slugs.map((s) => `journal/${s}`),
];

for (const r of routes) {
  const file = join(dist, r, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(dist, '404.html'), html);

const today = new Date().toISOString().slice(0, 10);
const urls = ['', ...routes.filter((r) => !['studio', 'privacy', 'terms'].includes(r))].map((r) => `  <url><loc>https://poelys.com/${r}</loc><lastmod>${today}</lastmod></url>`);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`routes: wrote ${routes.length} pages + 404.html (${ids.length} products, ${slugs.length} posts)`);
