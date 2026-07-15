import * as assert from 'assert';
import * as fs from 'fs';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';
import { createLauncherServer } from '../runtime/Launcher';
import { hashLauncherFile, LauncherManifest, LAUNCHER_SCHEMA_VERSION } from '../runtime/LauncherProtocol';

function request(port: number, requestPath: string, range?: string): Promise<{status: number, body: Buffer}> {
    return new Promise((resolve, reject) => {
        const req = http.request({ host: '127.0.0.1', port, path: requestPath, headers: range ? { Range: range } : {} }, res => {
            const chunks: Buffer[] = [];
            res.on('data', value => chunks.push(value));
            res.on('end', () => resolve({ status: res.statusCode || 0, body: Buffer.concat(chunks) }));
        });
        req.on('error', reject);
        req.end();
    });
}

describe('Launcher server', function() {
    let directory: string;
    let server: http.Server;
    let port: number;

    beforeEach(async function() {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tswow-launcher-'));
        const filename = 'default.dataset.A.MPQ';
        const source = path.join(directory, filename);
        fs.writeFileSync(source, 'AAAABBBB');
        const manifest: LauncherManifest = {
            schemaVersion: LAUNCHER_SCHEMA_VERSION,
            dataset: 'default.dataset',
            generatedAt: new Date(0).toISOString(),
            chunkSize: 4,
            files: [hashLauncherFile('mpq-a', filename, 'Data/patch-A.MPQ', source, 4)],
        };
        fs.writeFileSync(path.join(directory, 'default.dataset.meta.json'), JSON.stringify(manifest));
        server = createLauncherServer(directory);
        await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
        const address = server.address();
        port = typeof address === 'object' && address ? address.port : 0;
    });

    afterEach(async function() {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        fs.rmSync(directory, { recursive: true, force: true });
    });

    it('serves health and the generated manifest', async function() {
        assert.strictEqual((await request(port, '/health')).status, 200);
        const response = await request(port, '/api/v1/datasets/default.dataset/manifest');
        assert.strictEqual(response.status, 200);
        assert.strictEqual(JSON.parse(response.body.toString()).files[0].destination, 'Data/patch-A.MPQ');
    });

    it('supports ranges and rejects invalid ranges', async function() {
        const partial = await request(port, '/api/v1/datasets/default.dataset/files/mpq-a', 'bytes=4-7');
        assert.strictEqual(partial.status, 206);
        assert.strictEqual(partial.body.toString(), 'BBBB');
        assert.strictEqual((await request(port, '/api/v1/datasets/default.dataset/files/mpq-a', 'bytes=8-9')).status, 416);
    });

    it('does not expose files absent from the manifest', async function() {
        assert.strictEqual((await request(port, '/api/v1/datasets/default.dataset/files/..%2Fsecret')).status, 404);
    });
});
