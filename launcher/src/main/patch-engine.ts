import { createHash } from 'node:crypto';
import { execFile, spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { LauncherChunk, LauncherFile, LauncherManifest, LauncherProgress, LauncherSettings } from '../shared/types';

const execFileAsync = promisify(execFile);
const DATASET = 'default.dataset';

export type ProgressReporter = (progress: LauncherProgress) => void;

export function parseServer(input: string): { baseUrl: string; realmHost: string } {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Saisis une IP ou un nom d’hôte.');
  const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Le protocole du serveur est invalide.');
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Utilise uniquement une IP ou un nom d’hôte, avec un port facultatif.');
  }
  if (!url.port) url.port = '3726';
  return { baseUrl: url.origin, realmHost: url.hostname };
}

export function isAllowedDestination(destination: string): boolean {
  const normalized = destination.replace(/\\/g, '/');
  return normalized === 'Wow.exe' || /^Data\/patch-[A-Za-z0-9._-]+\.MPQ$/i.test(normalized);
}

function validateManifest(value: unknown): LauncherManifest {
  const manifest = value as LauncherManifest;
  if (!manifest || manifest.schemaVersion !== 1 || manifest.dataset !== DATASET || !Array.isArray(manifest.files)) {
    throw new Error('Le manifeste du serveur est invalide ou incompatible.');
  }
  for (const file of manifest.files) {
    if (!file.id || !file.filename || !isAllowedDestination(file.destination) || file.size < 0 || !Array.isArray(file.chunks)) {
      throw new Error(`Le manifeste contient un fichier non autorisé : ${file.destination || file.id}`);
    }
    const total = file.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (total !== file.size || file.chunks.some((chunk, index) => chunk.offset !== file.chunks.slice(0, index).reduce((sum, part) => sum + part.size, 0))) {
      throw new Error(`Les blocs de ${file.destination} sont invalides.`);
    }
  }
  return manifest;
}

export async function validateClientDirectory(clientDirectory: string): Promise<void> {
  if (!clientDirectory) throw new Error('Sélectionne le dossier du client WoW.');
  const wow = path.join(clientDirectory, 'Wow.exe');
  const data = path.join(clientDirectory, 'Data');
  const [wowStat, dataStat] = await Promise.all([fs.stat(wow), fs.stat(data)]).catch(() => {
    throw new Error('Le dossier sélectionné ne contient pas un client WoW 3.3.5a valide.');
  });
  if (!wowStat.isFile() || !dataStat.isDirectory()) throw new Error('Le dossier sélectionné ne contient pas un client WoW valide.');
}

async function hashBuffer(buffer: Buffer): Promise<string> {
  return createHash('sha256').update(buffer).digest('hex');
}

async function readChunk(filename: string, chunk: LauncherChunk): Promise<Buffer | undefined> {
  let handle: fs.FileHandle | undefined;
  try {
    handle = await fs.open(filename, 'r');
    const buffer = Buffer.alloc(chunk.size);
    const { bytesRead } = await handle.read(buffer, 0, chunk.size, chunk.offset);
    return bytesRead === chunk.size ? buffer : undefined;
  } catch {
    return undefined;
  } finally {
    await handle?.close();
  }
}

async function matchingChunks(filename: string, file: LauncherFile): Promise<boolean[]> {
  const stat = await fs.stat(filename).catch(() => undefined);
  if (!stat?.isFile() || stat.size !== file.size) return file.chunks.map(() => false);
  const result: boolean[] = [];
  for (const chunk of file.chunks) {
    const buffer = await readChunk(filename, chunk);
    result.push(Boolean(buffer && (await hashBuffer(buffer)) === chunk.sha256));
  }
  return result;
}

async function hashFile(filename: string): Promise<string> {
  const handle = await fs.open(filename, 'r');
  const hash = createHash('sha256');
  try {
    const buffer = Buffer.alloc(1024 * 1024);
    let position = 0;
    while (true) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
      if (!bytesRead) break;
      hash.update(buffer.subarray(0, bytesRead));
      position += bytesRead;
    }
  } finally {
    await handle.close();
  }
  return hash.digest('hex');
}

async function downloadChunk(baseUrl: string, file: LauncherFile, chunk: LauncherChunk): Promise<Buffer> {
  const response = await fetch(`${baseUrl}/api/v1/datasets/${encodeURIComponent(DATASET)}/files/${encodeURIComponent(file.id)}`, {
    headers: { Range: `bytes=${chunk.offset}-${chunk.offset + chunk.size - 1}` },
  });
  if (response.status !== 206) throw new Error(`Téléchargement refusé pour ${file.destination} (${response.status}).`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length !== chunk.size || (await hashBuffer(buffer)) !== chunk.sha256) {
    throw new Error(`Le bloc téléchargé pour ${file.destination} est corrompu.`);
  }
  return buffer;
}

async function replaceFile(temp: string, destination: string, keepBackup: boolean): Promise<void> {
  const previous = `${destination}.tswow-previous`;
  const exists = await fs.stat(destination).then(() => true, () => false);
  if (keepBackup && exists) {
    const backup = `${destination}.backup`;
    if (!(await fs.stat(backup).then(() => true, () => false))) await fs.copyFile(destination, backup);
  }
  await fs.rm(previous, { force: true });
  if (exists) await fs.rename(destination, previous);
  try {
    await fs.rename(temp, destination);
    await fs.rm(previous, { force: true });
  } catch (error) {
    if (exists) await fs.rename(previous, destination).catch(() => undefined);
    throw error;
  }
}

async function patchFile(baseUrl: string, clientDirectory: string, file: LauncherFile, report: ProgressReporter): Promise<void> {
  const destination = path.resolve(clientDirectory, file.destination);
  const root = path.resolve(clientDirectory) + path.sep;
  if (!isAllowedDestination(file.destination) || !destination.startsWith(root)) throw new Error(`Destination refusée : ${file.destination}`);
  await fs.mkdir(path.dirname(destination), { recursive: true });

  const current = await matchingChunks(destination, file);
  if (current.length === file.chunks.length && current.every(Boolean)) return;

  const temp = `${destination}.tswow-update`;
  const tempStat = await fs.stat(temp).catch(() => undefined);
  if (!tempStat || tempStat.size !== file.size) {
    const destinationStat = await fs.stat(destination).catch(() => undefined);
    if (destinationStat?.size === file.size) await fs.copyFile(destination, temp);
    else {
      const handle = await fs.open(temp, 'w');
      await handle.truncate(file.size);
      await handle.close();
    }
  }

  const matches = await matchingChunks(temp, file);
  const missing = file.chunks.filter((_, index) => !matches[index]);
  let completed = 0;
  const total = missing.reduce((sum, chunk) => sum + chunk.size, 0);
  const handle = await fs.open(temp, 'r+');
  try {
    for (const chunk of missing) {
      const buffer = await downloadChunk(baseUrl, file, chunk);
      await handle.write(buffer, 0, buffer.length, chunk.offset);
      completed += chunk.size;
      report({ phase: 'downloading', message: `Téléchargement de ${file.destination}`, file: file.destination, completed, total });
    }
  } finally {
    await handle.close();
  }

  if ((await hashFile(temp)) !== file.sha256) throw new Error(`La vérification finale de ${file.destination} a échoué.`);
  await replaceFile(temp, destination, file.destination === 'Wow.exe');
}

async function wowIsRunning(): Promise<boolean> {
  if (process.platform !== 'win32') return false;
  const { stdout } = await execFileAsync('tasklist', ['/FI', 'IMAGENAME eq Wow.exe', '/NH']);
  return /(^|\s)Wow\.exe(\s|$)/im.test(stdout);
}

async function configureRealmlists(clientDirectory: string, realmHost: string): Promise<void> {
  const dataDirectory = path.join(clientDirectory, 'Data');
  const entries = await fs.readdir(dataDirectory, { withFileTypes: true });
  const realmlists: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(dataDirectory, entry.name, 'realmlist.wtf');
    if (await fs.stat(candidate).then(stat => stat.isFile(), () => false)) realmlists.push(candidate);
  }
  if (!realmlists.length) throw new Error('Aucun fichier Data/<locale>/realmlist.wtf trouvé.');
  await Promise.all(realmlists.map(filename => fs.writeFile(filename, `set realmlist ${realmHost}\n`, 'utf8')));
}

export async function updateClient(settings: LauncherSettings, report: ProgressReporter): Promise<void> {
  const { baseUrl, realmHost } = parseServer(settings.server);
  await validateClientDirectory(settings.clientDirectory);
  if (await wowIsRunning()) throw new Error('Ferme Wow.exe avant de lancer la mise à jour.');

  report({ phase: 'connecting', message: 'Connexion au serveur de patch…', completed: 0, total: 1 });
  const response = await fetch(`${baseUrl}/api/v1/datasets/${encodeURIComponent(DATASET)}/manifest`);
  if (!response.ok) throw new Error(`Impossible de récupérer le manifeste (${response.status}).`);
  const manifest = validateManifest(await response.json());

  for (let index = 0; index < manifest.files.length; index += 1) {
    const file = manifest.files[index];
    report({ phase: 'checking', message: `Vérification de ${file.destination}`, file: file.destination, completed: index, total: manifest.files.length });
    await patchFile(baseUrl, settings.clientDirectory, file, report);
  }

  report({ phase: 'configuring', message: 'Configuration du realmlist…', completed: 0, total: 1 });
  await configureRealmlists(settings.clientDirectory, realmHost);
  report({ phase: 'complete', message: 'Client prêt.', completed: 1, total: 1 });
}

export function launchWow(clientDirectory: string): void {
  const child = spawn(path.join(clientDirectory, 'Wow.exe'), [], {
    cwd: clientDirectory,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}
