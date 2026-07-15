import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { LauncherFile, LauncherManifest, LauncherProgress } from '../shared/types';
import { isAllowedDestination, parseServer, updateClient } from './patch-engine';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => fs.rm(directory, { recursive: true, force: true })));
});

function sha256(value: Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function manifestFile(content: Buffer): LauncherFile {
  const first = content.subarray(0, 4);
  const second = content.subarray(4);
  return {
    id: 'mpq-a',
    filename: 'default.dataset.A.MPQ',
    destination: 'Data/patch-A.MPQ',
    size: content.length,
    sha256: sha256(content),
    chunks: [
      { offset: 0, size: first.length, sha256: sha256(first) },
      { offset: first.length, size: second.length, sha256: sha256(second) },
    ],
  };
}

async function createClient(): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'nikev-launcher-'));
  temporaryDirectories.push(directory);
  await fs.mkdir(path.join(directory, 'Data', 'enUS'), { recursive: true });
  await fs.writeFile(path.join(directory, 'Wow.exe'), 'clean-wow');
  await fs.writeFile(path.join(directory, 'Data', 'enUS', 'realmlist.wtf'), 'set realmlist 127.0.0.1');
  return directory;
}

async function runUpdate(
  client: string,
  manifest: LauncherManifest,
  content: Buffer,
  report: (progress: LauncherProgress) => void = () => undefined,
  servedContent: Buffer = content,
): Promise<string[]> {
  const ranges: string[] = [];
  const server = createServer((request, response) => {
    if (request.url?.endsWith('/manifest')) {
      response.setHeader('Content-Type', 'application/json');
      return response.end(JSON.stringify(manifest));
    }
    const range = request.headers.range!;
    ranges.push(range);
    const match = /bytes=(\d+)-(\d+)/.exec(range)!;
    const start = Number(match[1]);
    const end = Number(match[2]);
    response.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${servedContent.length}` });
    response.end(servedContent.subarray(start, end + 1));
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  try {
    await updateClient({ server: `127.0.0.1:${port}`, clientDirectory: client }, report);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
  return ranges;
}

describe('launcher patch engine', () => {
  it('parses a host and applies the default patch port', () => {
    expect(parseServer('192.168.1.42')).toEqual({ baseUrl: 'http://192.168.1.42:3726', realmHost: '192.168.1.42' });
  });

  it('only accepts the two supported destination families', () => {
    expect(isAllowedDestination('Wow.exe')).toBe(true);
    expect(isAllowedDestination('Data/patch-A.MPQ')).toBe(true);
    expect(isAllowedDestination('../Wow.exe')).toBe(false);
    expect(isAllowedDestination('Data/enUS/patch-enUS-A.MPQ')).toBe(false);
  });

  it('downloads only a changed chunk and configures the realmlist', async () => {
    const client = await createClient();
    const content = Buffer.from('AAAABBBB');
    const file = manifestFile(content);
    await fs.writeFile(path.join(client, 'Data', 'patch-A.MPQ'), 'AAAAXXXX');
    const manifest: LauncherManifest = {
      schemaVersion: 1,
      dataset: 'default.dataset',
      generatedAt: new Date(0).toISOString(),
      chunkSize: 4,
      files: [file],
    };
    const progress: LauncherProgress[] = [];
    const ranges = await runUpdate(client, manifest, content, value => progress.push(value));

    expect(ranges).toEqual(['bytes=4-7']);
    expect(await fs.readFile(path.join(client, 'Data', 'patch-A.MPQ'))).toEqual(content);
    expect(await fs.readFile(path.join(client, 'Data', 'enUS', 'realmlist.wtf'), 'utf8')).toBe('set realmlist 127.0.0.1\n');
    expect(progress.at(-1)?.phase).toBe('complete');
  });

  it('does not download an already current file', async () => {
    const client = await createClient();
    const content = Buffer.from('AAAABBBB');
    await fs.writeFile(path.join(client, 'Data', 'patch-A.MPQ'), content);
    const manifest: LauncherManifest = {
      schemaVersion: 1,
      dataset: 'default.dataset',
      generatedAt: new Date(0).toISOString(),
      chunkSize: 4,
      files: [manifestFile(content)],
    };

    expect(await runUpdate(client, manifest, content)).toEqual([]);
  });

  it('resumes from valid blocks in an interrupted temporary file', async () => {
    const client = await createClient();
    const content = Buffer.from('AAAABBBB');
    const destination = path.join(client, 'Data', 'patch-A.MPQ');
    await fs.writeFile(`${destination}.tswow-update`, 'AAAAXXXX');
    const manifest: LauncherManifest = {
      schemaVersion: 1,
      dataset: 'default.dataset',
      generatedAt: new Date(0).toISOString(),
      chunkSize: 4,
      files: [manifestFile(content)],
    };

    expect(await runUpdate(client, manifest, content)).toEqual(['bytes=4-7']);
    expect(await fs.readFile(destination)).toEqual(content);
  });

  it('rejects a corrupted downloaded block without replacing the client file', async () => {
    const client = await createClient();
    const content = Buffer.from('AAAABBBB');
    const destination = path.join(client, 'Data', 'patch-A.MPQ');
    await fs.writeFile(destination, 'AAAAXXXX');
    const manifest: LauncherManifest = {
      schemaVersion: 1,
      dataset: 'default.dataset',
      generatedAt: new Date(0).toISOString(),
      chunkSize: 4,
      files: [manifestFile(content)],
    };

    await expect(runUpdate(client, manifest, content, undefined, Buffer.from('AAAACCCC'))).rejects.toThrow('corrompu');
    expect(await fs.readFile(destination, 'utf8')).toBe('AAAAXXXX');
  });
});
