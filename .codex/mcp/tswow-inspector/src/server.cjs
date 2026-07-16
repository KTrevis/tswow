const {createRequire} = require('node:module');
const {McpServer} = require('@modelcontextprotocol/sdk/server/mcp.js');
const {StdioServerTransport} = require('@modelcontextprotocol/sdk/server/stdio.js');
const {z} = require('zod');
const {
    listEntityTypes,
    objectifyEntity,
} = require('./inspection.cjs');

const TSWOW_DATA_ROOT = '/opt/tswow/install/bin/scripts/wow';
const TSWOW_NODE_MODULES = '/opt/tswow/install/node_modules';
const runtimeRequire = createRequire(__filename);

// MCP owns stdout. TSWoW and server diagnostics must use stderr.
console.log = (...args) => console.error(...args);
console.info = (...args) => console.error(...args);

async function withTswowOutputOnStderr(callback) {
    const stdoutWrite = process.stdout.write;
    process.stdout.write = process.stderr.write.bind(process.stderr);
    try {
        return await callback();
    } finally {
        process.stdout.write = stdoutWrite;
    }
}

async function connectSourceCompatibility(sqlModule) {
    const mysql = runtimeRequire(`${TSWOW_NODE_MODULES}/mysql2`);
    const deasync = runtimeRequire(`${TSWOW_NODE_MODULES}/deasync`);
    const source = sqlModule.SqlConnection.world_src;
    sqlModule.Connection.end(source);
    source.async = mysql.createConnection(source.settings);
    source.sync = mysql.createConnection(source.settings);
    source.syncQuery = deasync(source.sync.query.bind(source.sync));
    await Promise.all([source.async, source.sync].map(client =>
        new Promise((resolve, reject) => client.connect(error =>
            error ? reject(error) : resolve()
        ))
    ));
}

async function loadTswowRuntime() {
    const sqlModule = runtimeRequire(`${TSWOW_DATA_ROOT}/data/sql/SQLConnection.js`);
    console.error('TSWoW inspector: connecting to world source.');
    if (typeof sqlModule.SqlConnection.connectSourceAsync === 'function') {
        await sqlModule.SqlConnection.connectSourceAsync();
    } else {
        // Compatibility with an existing image while the updated runtime is rebuilt.
        await connectSourceCompatibility(sqlModule);
    }
    console.error('TSWoW inspector: loading std registries.');
    const {std} = runtimeRequire(`${TSWOW_DATA_ROOT}/wotlk/wotlk.js`);
    console.error('TSWoW inspector: runtime loaded.');
    return {
        close() {
            if (typeof sqlModule.SqlConnection.disconnect === 'function') {
                sqlModule.SqlConnection.disconnect();
            } else {
                sqlModule.Connection.end(sqlModule.SqlConnection.world_src);
            }
        },
        std,
    };
}

function toolResult(payload) {
    return {
        content: [{type: 'text', text: 'Structured result attached.'}],
        structuredContent: payload,
    };
}

function toolError(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`TSWoW inspector tool error: ${message}`);
    return {
        content: [{type: 'text', text: message}],
        isError: true,
    };
}

async function main() {
    let runtimePromise;
    let loadedRuntime;
    const getRuntime = () => {
        if (!runtimePromise) {
            runtimePromise = loadTswowRuntime().then(runtime => {
                loadedRuntime = runtime;
                return runtime;
            });
        }
        return runtimePromise;
    };
    const server = new McpServer(
        {name: 'tswow-inspector', version: '1.0.0'},
        {
            instructions:
                'Read-only access to raw TSWoW entities. Use list_entity_types to discover registries, then objectify_entity with a registry name and entity ID. '
                + 'The server never runs datascripts or build data. Prefer a focused path such as Effects when the complete entity is unnecessary.',
        }
    );

    const annotations = {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
    };

    server.registerTool(
        'list_entity_types',
        {
            title: 'List TSWoW entity types',
            description: 'List raw TSWoW std registries that can load an entity by ID.',
            inputSchema: {},
            outputSchema: {entityTypes: z.array(z.string())},
            annotations,
        },
        async () => {
            try {
                return await withTswowOutputOnStderr(async () => {
                    const runtime = await getRuntime();
                    return toolResult({entityTypes: listEntityTypes(runtime.std)});
                });
            } catch (error) {
                return toolError(error);
            }
        }
    );

    server.registerTool(
        'objectify_entity',
        {
            title: 'Objectify a TSWoW entity',
            description:
                'Load a raw TSWoW entity and return objectify() for the whole entity or a focused path such as Effects or Effects[0].Type.',
            inputSchema: {
                entityType: z.string().min(1).describe('Registry name returned by list_entity_types, for example Spells or Items.'),
                id: z.union([z.number().int(), z.string().min(1)]).describe('Numeric or textual entity identifier accepted by the registry.'),
                path: z.string().optional().describe('Optional property/index path such as Effects, Power, Name, or Effects[0].Type.'),
                refDepth: z.number().int().min(0).max(2).default(0).describe('Reference expansion depth, from 0 to 2.'),
            },
            outputSchema: {
                entityType: z.string(),
                id: z.union([z.number(), z.string()]),
                path: z.string().nullable(),
                refDepth: z.number().int(),
                value: z.unknown(),
            },
            annotations,
        },
        async input => {
            try {
                return await withTswowOutputOnStderr(async () => {
                    const runtime = await getRuntime();
                    return toolResult(objectifyEntity(runtime.std, input).output);
                });
            } catch (error) {
                return toolError(error);
            }
        }
    );

    let closing = false;
    const shutdown = async exitCode => {
        if (closing) return;
        closing = true;
        try {
            await server.close();
        } finally {
            loadedRuntime?.close();
        }
        if (exitCode !== undefined) process.exit(exitCode);
    };

    process.once('SIGINT', () => void shutdown(0));
    process.once('SIGTERM', () => void shutdown(0));
    process.once('beforeExit', () => loadedRuntime?.close());
    process.stdin.once('end', () => void shutdown(0));
    process.stdin.once('close', () => void shutdown(0));

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('TSWoW inspector MCP server ready on stdio.');
}

main().catch(error => {
    console.error('TSWoW inspector MCP server failed:', error);
    process.exit(1);
});
