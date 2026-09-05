import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && (entry.name.endsWith('.html') || ['robots.txt', 'sitemap.xml'].includes(entry.name))) {
    await cp(join(root, entry.name), join(output, entry.name));
  }
}
for (const folder of ['css', 'js', 'images', 'media']) {
  await cp(join(root, folder), join(output, folder), { recursive: true });
}
console.log('Static site built in dist/.');
