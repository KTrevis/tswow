const MAX_OUTPUT_BYTES = 200 * 1024;
const FORBIDDEN_PATH_SEGMENTS = new Set([
    '__proto__',
    'prototype',
    'constructor',
]);
const PATH_PATTERN = /^[A-Za-z_$][\w$]*(?:\[\d+\])?(?:\.[A-Za-z_$][\w$]*(?:\[\d+\])?)*$/;

function listEntityTypes(std) {
    return Object.entries(std)
        .filter(([, registry]) => loadableRegistry(registry) !== undefined)
        .map(([name]) => name)
        .sort();
}

function loadableRegistry(registry) {
    if (registry && typeof registry.load === 'function') {
        return registry;
    }
    for (const fallback of ['All', 'Generic']) {
        if (registry?.[fallback] && typeof registry[fallback].load === 'function') {
            return registry[fallback];
        }
    }
    return undefined;
}

function resolveRegistry(std, entityType) {
    const registry = loadableRegistry(std[entityType]);
    if (!registry) {
        const available = listEntityTypes(std).join(', ');
        throw new Error(`Unknown entity type "${entityType}". Available types: ${available}`);
    }
    return registry;
}

function parsePath(path) {
    if (path === undefined || path === '') {
        return [];
    }
    if (!PATH_PATTERN.test(path)) {
        throw new Error(`Invalid path "${path}". Use properties and numeric indexes such as Effects or Effects[0].Type.`);
    }

    const segments = path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.');

    for (const segment of segments) {
        if (FORBIDDEN_PATH_SEGMENTS.has(segment)) {
            throw new Error(`Forbidden path segment "${segment}".`);
        }
    }
    return segments;
}

function resolvePath(root, path) {
    let current = root;
    for (const segment of parsePath(path)) {
        if (current === null || current === undefined) {
            throw new Error(`Path "${path}" cannot be resolved after "${segment}".`);
        }

        if (/^\d+$/.test(segment)) {
            const index = Number(segment);
            if (Array.isArray(current)) {
                current = current[index];
            } else if (typeof current.get === 'function') {
                current = current.get(index);
            } else {
                throw new Error(`Path "${path}" indexes a value that is not an array system.`);
            }
            continue;
        }

        if (!(segment in Object(current))) {
            throw new Error(`Property "${segment}" does not exist while resolving "${path}".`);
        }
        current = current[segment];
        if (typeof current === 'function') {
            throw new Error(`Path "${path}" resolves to a method, which is not allowed.`);
        }
    }
    return current;
}

function stringifyJson(value) {
    return JSON.stringify(value, (_key, nestedValue) =>
        typeof nestedValue === 'bigint' ? nestedValue.toString() : nestedValue
    );
}

function makeJsonSafe(value) {
    const json = stringifyJson(value);
    if (json === undefined) {
        throw new Error('objectify() returned an unsupported undefined value.');
    }
    return {json, value: JSON.parse(json)};
}

function objectifyEntity(std, {entityType, id, path, refDepth = 0}) {
    if (!Number.isInteger(refDepth) || refDepth < 0 || refDepth > 2) {
        throw new Error('refDepth must be an integer between 0 and 2.');
    }
    const registry = resolveRegistry(std, entityType);
    const entity = registry.load(id);
    if (!entity) {
        throw new Error(`Entity ${entityType}/${String(id)} was not found.`);
    }

    const target = resolvePath(entity, path);
    if (!target || typeof target.objectify !== 'function') {
        const targetName = path || entityType;
        throw new Error(`Target "${targetName}" does not expose objectify().`);
    }

    const safe = makeJsonSafe(target.objectify({refDepth}));
    const output = {
        entityType,
        id,
        path: path || null,
        refDepth,
        value: safe.value,
    };
    const outputJson = stringifyJson(output);
    const outputBytes = Buffer.byteLength(outputJson, 'utf8');
    if (outputBytes > MAX_OUTPUT_BYTES) {
        throw new Error(
            `objectify() produced ${outputBytes} bytes, above the ${MAX_OUTPUT_BYTES}-byte limit. `
            + 'Use a more precise path or a lower refDepth.'
        );
    }
    return {output, outputJson, outputBytes};
}

module.exports = {
    FORBIDDEN_PATH_SEGMENTS,
    MAX_OUTPUT_BYTES,
    listEntityTypes,
    loadableRegistry,
    makeJsonSafe,
    objectifyEntity,
    parsePath,
    resolvePath,
    resolveRegistry,
    stringifyJson,
};
