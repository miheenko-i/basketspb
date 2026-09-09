import { copyFile, mkdir } from 'node:fs/promises';

// Vinext beta.5 redirects slashless routes before prerendering when
// trailingSlash is enabled. Export without that redirect, then create the
// directory index required by the public /summercamp/ URL on GitHub Pages.
const output = new URL('../dist/client/', import.meta.url);
await mkdir(new URL('summercamp/', output), { recursive: true });
await copyFile(new URL('summercamp.html', output), new URL('summercamp/index.html', output));
