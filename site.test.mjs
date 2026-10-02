import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const app = path.basename(path.dirname(root)).toLowerCase();
const prefix = `/${app}-site/`;
const pages = ['index.html', `${app}-support/index.html`, `${app}-privacy/index.html`];

for (const page of pages) {
  test(`${page} has valid local links and a stylesheet`, () => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(html, /<main\b/);
    assert.match(html, /rel="stylesheet"/);
    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    for (const reference of references) {
      if (reference.startsWith('mailto:') || reference.startsWith('https://') || reference.startsWith('#')) continue;
      assert.ok(reference.startsWith(prefix), `${page}: unexpected local URL ${reference}`);
      const relative = reference.slice(prefix.length);
      const target = path.join(root, relative, relative.endsWith('/') || !path.extname(relative) ? 'index.html' : '');
      assert.ok(fs.existsSync(target), `${page}: broken local URL ${reference}`);
    }
  });
}

test('home page links to support and privacy', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(home.includes(`${prefix}${app}-support/`));
  assert.ok(home.includes(`${prefix}${app}-privacy/`));
});
