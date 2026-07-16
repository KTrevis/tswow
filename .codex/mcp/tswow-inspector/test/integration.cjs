const assert = require('node:assert/strict');
const path = require('node:path');
const {Client} = require('@modelcontextprotocol/sdk/client/index.js');
const {StdioClientTransport} = require('@modelcontextprotocol/sdk/client/stdio.js');

const repoRoot = path.resolve(__dirname, '../../../..');
const transport = new StdioClientTransport({
    command: 'docker',
    args: ['compose', 'run', '--rm', '-T', 'tswow-mcp'],
    cwd: repoRoot,
    env: process.env,
    stderr: 'inherit',
});
const client = new Client({name: 'tswow-inspector-test', version: '1.0.0'});

async function main() {
    try {
        await client.connect(transport);
        console.error('MCP connected.');
        const tools = await client.listTools();
        console.error('MCP tools listed.');
        assert.deepEqual(
            tools.tools.map(tool => tool.name).sort(),
            ['list_entity_types', 'objectify_entity']
        );

        const types = await client.callTool({name: 'list_entity_types', arguments: {}});
        console.error('TSWoW entity types listed.');
        console.error(`GameObject registries: ${types.structuredContent.entityTypes.filter(name => name.includes('GameObject')).join(', ')}`);
        for (const expected of ['CreatureTemplates', 'GameObjectTemplates', 'Items', 'Quests', 'Spells']) {
            assert.ok(types.structuredContent.entityTypes.includes(expected), `Missing ${expected}`);
        }

        const spell = await client.callTool({
            name: 'objectify_entity',
            arguments: {entityType: 'Spells', id: 133, path: 'Effects'},
        });
        console.error('Spell 133 effects objectified.');
        assert.equal(spell.isError, undefined);
        assert.equal(spell.structuredContent.entityType, 'Spells');
        assert.equal(spell.structuredContent.id, 133);
        assert.ok(Array.isArray(spell.structuredContent.value));
        assert.ok(spell.structuredContent.value.length > 0);

        for (const example of [
            {entityType: 'Items', id: 25, path: 'Name'},
            {entityType: 'CreatureTemplates', id: 1, path: 'Name'},
            {entityType: 'GameObjectTemplates', id: 4, path: 'Name'},
        ]) {
            const result = await client.callTool({
                name: 'objectify_entity',
                arguments: example,
            });
            assert.equal(result.isError, undefined, `${example.entityType}/${example.id} failed`);
            assert.equal(result.structuredContent.entityType, example.entityType);
            assert.equal(result.structuredContent.id, example.id);
            assert.equal(typeof result.structuredContent.value, 'object');
        }
        console.error('Item, creature, and game object names objectified.');

        const missing = await client.callTool({
            name: 'objectify_entity',
            arguments: {entityType: 'Spells', id: -1},
        });
        console.error('Missing entity error verified.');
        assert.equal(missing.isError, true);
        console.log('TSWoW inspector MCP integration test passed.');
    } finally {
        await client.close();
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
