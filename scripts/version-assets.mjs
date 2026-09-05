import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Keep the source pages deployable directly as well as through dist/.
// Version imported styles first so their changes also version the entry CSS.
export async function versionAssets(root) {
  const fingerprint = async path => createHash('sha256')
    .update(await readFile(join(root, path))).digest('hex').slice(0, 12);
  const saveIfChanged = async (path, before, after) => {
    if (before !== after) await writeFile(join(root, path), after);
  };

  const stylesheet = await readFile(join(root, 'css/style.css'), 'utf8');
  let versionedStylesheet = stylesheet;
  for (const match of stylesheet.matchAll(/@import '([^'?]+\.css)(?:\?v=[^']*)?';/g)) {
    const version = await fingerprint(`css/${match[1]}`);
    versionedStylesheet = versionedStylesheet.replace(match[0], `@import '${match[1]}?v=${version}';`);
  }
  await saveIfChanged('css/style.css', stylesheet, versionedStylesheet);

  const assets = ['css/style.css', 'js/main.js', 'images/favicon.svg'];
  const versions = new Map(await Promise.all(assets.map(async path => [path, await fingerprint(path)])));
  for (const file of await readdir(root)) {
    if (!file.endsWith('.html')) continue;
    const html = await readFile(join(root, file), 'utf8');
    const versionedHtml = html.replace(/((?:href|src)=")(css\/style\.css|js\/main\.js|images\/favicon\.svg)(?:\?v=[^"]*)?(")/g,
      (_, prefix, path, suffix) => `${prefix}${path}?v=${versions.get(path)}${suffix}`);
    await saveIfChanged(file, html, versionedHtml);
  }
}
