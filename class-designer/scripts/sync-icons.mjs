import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const source = path.resolve(process.argv[2] ?? '/tmp/wow-ui-textures/ICONS');
const publicRoot = path.resolve('public/spell-icons');
const destination = path.join(publicRoot, 'files');
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp']);

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });

const files = (await readdir(destination, { withFileTypes: true }))
  .filter(entry => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()))
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

const manifest = { version: 1, count: files.length, icons: files };
await writeFile(path.join(publicRoot, 'manifest.json'), `${JSON.stringify(manifest)}\n`);
process.stdout.write(`Synchronized ${files.length} icons from ${source}\n`);
