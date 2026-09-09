import { copyFile, mkdir } from 'node:fs/promises';

// Vinext beta.5 redirects slashless routes before prerendering when
// trailingSlash is enabled. Export without that redirect, then create the
// directory indexes required by the public nested URLs on GitHub Pages.
const output = new URL('../dist/client/', import.meta.url);
for (const route of ['summercamp', 'privacy']) {
  await mkdir(new URL(`${route}/`, output), { recursive: true });
  await copyFile(new URL(`${route}.html`, output), new URL(`${route}/index.html`, output));
}
