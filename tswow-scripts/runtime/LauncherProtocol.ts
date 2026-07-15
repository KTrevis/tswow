import * as crypto from 'crypto';
import * as fs from 'fs';

export const LAUNCHER_SCHEMA_VERSION = 1;

export interface LauncherChunk {
    offset: number;
    size: number;
    sha256: string;
}

export interface LauncherFile {
    id: string;
    filename: string;
    destination: string;
    size: number;
    sha256: string;
    chunks: LauncherChunk[];
}

export interface LauncherManifest {
    schemaVersion: 1;
    dataset: string;
    generatedAt: string;
    chunkSize: number;
    files: LauncherFile[];
}

export function hashLauncherFile(
    id: string,
    filename: string,
    destination: string,
    sourcePath: string,
    chunkSize: number
): LauncherFile {
    const handle = fs.openSync(sourcePath, 'r');
    const fullHash = crypto.createHash('sha256');
    const chunks: LauncherChunk[] = [];
    let offset = 0;

    try {
        const buffer = Buffer.alloc(chunkSize);
        while (true) {
            const bytesRead = fs.readSync(handle, buffer, 0, chunkSize, null);
            if (bytesRead === 0) break;
            const chunk = buffer.slice(0, bytesRead);
            fullHash.update(chunk);
            chunks.push({
                offset,
                size: bytesRead,
                sha256: crypto.createHash('sha256').update(chunk).digest('hex'),
            });
            offset += bytesRead;
        }
    } finally {
        fs.closeSync(handle);
    }

    return {
        id,
        filename,
        destination,
        size: offset,
        sha256: fullHash.digest('hex'),
        chunks,
    };
}
