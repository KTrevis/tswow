import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { resfp } from '../util/FileTree';
import { ipaths } from '../util/Paths';
import { term } from '../util/Terminal';
import { NodeConfig } from './NodeConfig';
import { LauncherFile, LauncherManifest, LAUNCHER_SCHEMA_VERSION } from './LauncherProtocol';

function json(res: http.ServerResponse, status: number, value: unknown) {
    const body = JSON.stringify(value);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store',
    });
    res.end(body);
}

function parseRange(value: string | undefined, size: number): [number, number] | undefined | null {
    if (!value) return undefined;
    const match = /^bytes=(\d+)-(\d*)$/.exec(value);
    if (!match) return null;
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || end >= size) {
        return null;
    }
    return [start, end];
}

function readManifest(packageRoot: string, dataset: string): LauncherManifest | undefined {
    const manifestPath = path.join(packageRoot, `${dataset}.meta.json`);
    if (!fs.existsSync(manifestPath)) return undefined;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as LauncherManifest;
    if (manifest.schemaVersion !== LAUNCHER_SCHEMA_VERSION || manifest.dataset !== dataset || !Array.isArray(manifest.files)) {
        throw new Error(`Invalid launcher manifest: ${manifestPath}`);
    }
    return manifest;
}

function findFile(manifest: LauncherManifest, id: string): LauncherFile | undefined {
    return manifest.files.find(file => file.id === id);
}

export function createLauncherServer(packageRoot: string, dataset: string = 'default.dataset') {
    return http.createServer((req, res) => {
        const requestUrl = new URL(req.url || '/', 'http://launcher.local');
        if (req.method !== 'GET') {
            res.writeHead(405, { Allow: 'GET' });
            return res.end();
        }

        if (requestUrl.pathname === '/health') {
            return json(res, 200, { status: 'ok' });
        }

        const manifestRoute = `/api/v1/datasets/${encodeURIComponent(dataset)}/manifest`;
        const filesPrefix = `/api/v1/datasets/${encodeURIComponent(dataset)}/files/`;
        let manifest: LauncherManifest | undefined;
        try {
            manifest = readManifest(packageRoot, dataset);
        } catch (error) {
            return json(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }

        if (requestUrl.pathname === manifestRoute) {
            return manifest
                ? json(res, 200, manifest)
                : json(res, 404, { error: 'No package has been generated for this dataset' });
        }

        if (!requestUrl.pathname.startsWith(filesPrefix) || !manifest) {
            return json(res, 404, { error: 'Not found' });
        }

        const id = decodeURIComponent(requestUrl.pathname.slice(filesPrefix.length));
        const entry = findFile(manifest, id);
        if (!entry || path.basename(entry.filename) !== entry.filename) {
            return json(res, 404, { error: 'Unknown file' });
        }

        const filePath = path.resolve(packageRoot, entry.filename);
        const resolvedRoot = path.resolve(packageRoot) + path.sep;
        if (!filePath.startsWith(resolvedRoot) || !fs.existsSync(filePath)) {
            return json(res, 404, { error: 'File not found' });
        }

        const stat = fs.statSync(filePath);
        const range = parseRange(req.headers.range, stat.size);
        if (range === null) {
            res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
            return res.end();
        }

        const [start, end] = range || [0, stat.size - 1];
        const partial = range !== undefined;
        res.writeHead(partial ? 206 : 200, {
            'Content-Type': 'application/octet-stream',
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            ...(partial ? { 'Content-Range': `bytes ${start}-${end}/${stat.size}` } : {}),
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
    });
}

export class Launcher {
    static initialize() {
        if (!NodeConfig.AutoStartLauncherServer) return;
        const packageRoot = resfp(ipaths.package);
        createLauncherServer(packageRoot).listen(NodeConfig.LauncherPort, '0.0.0.0', () => {
            term.log('launcher', `Launcher service running on 0.0.0.0:${NodeConfig.LauncherPort}`);
        });
    }
}
