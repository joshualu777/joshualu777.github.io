import { readFile, mkdir, rename, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const output = path.resolve('dist/client');
const routes = ['collection', 'experience', 'projects', 'research-teaching'];
// Vinext's trailingSlash redirect currently interrupts prerendering. Export
// without redirects, then create directory indexes for GitHub's static server.
for (const route of routes) {
  await mkdir(path.join(output, route), { recursive: true });
  try {
    await rename(path.join(output, `${route}.html`), path.join(output, route, 'index.html'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
for (const file of ['index.html', ...routes.map(route => `${route}/index.html`), '404.html']) {
  const html = await readFile(path.join(output, file), 'utf8');
  assert.ok(html.includes('<html'), `Missing rendered HTML: ${file}`);
  assert.ok(!html.includes('chatgpt.site'), `Old hosting URL in ${file}`);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const asset = match[1];
    if (asset === '/' || routes.includes(asset.replace(/^\/|\/$/g, ''))) continue;
    await access(path.join(output, decodeURIComponent(asset)));
  }
}
const collection = await readFile(path.join(output, 'collection/index.html'), 'utf8');
assert.ok(collection.includes('16,262.11'), 'Showcase total changed');
assert.ok(!collection.includes('Bombirdier'), 'Non-showcased data in export');
assert.equal((await readdir(path.join(output, 'collection'))).filter(file => file.endsWith('.webp')).length, 17);
await access(path.join(output, '.nojekyll'));
console.log('GitHub Pages export verified: all five pages, 404, links, assets and showcase.');
