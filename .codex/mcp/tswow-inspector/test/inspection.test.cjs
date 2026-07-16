const assert = require('node:assert/strict');
const test = require('node:test');
const {
    MAX_OUTPUT_BYTES,
    listEntityTypes,
    makeJsonSafe,
    objectifyEntity,
    parsePath,
    resolvePath,
} = require('../src/inspection.cjs');

function fakeStd(value = {answer: 42}) {
    return {
        Helpers: {},
        Spells: {
            load(id) {
                if (id !== 133) return undefined;
                return {
                    Effects: {
                        get(index) {
                            return {
                                objectify: () => ({index, value}),
                            };
                        },
                        objectify: () => [value],
                    },
                    objectify: () => ({ID: id, value}),
                };
            },
        },
        Quests: {
            load(id) {
                if (id !== 'intro') return undefined;
                return {objectify: () => ({ID: id})};
            },
        },
        GameObjectTemplates: {
            Generic: {
                load(id) {
                    if (id !== 5) return undefined;
                    return {objectify: () => ({ID: id})};
                },
            },
        },
    };
}

test('lists only loadable std registries', () => {
    assert.deepEqual(listEntityTypes(fakeStd()), ['GameObjectTemplates', 'Quests', 'Spells']);
});

test('parses safe property and index paths', () => {
    assert.deepEqual(parsePath('Effects[0].Type'), ['Effects', '0', 'Type']);
    assert.throws(() => parsePath('constructor'), /Forbidden/);
    assert.throws(() => parsePath('Effects.get(0)'), /Invalid path/);
});

test('resolves array-system indexes through get()', () => {
    const entity = fakeStd().Spells.load(133);
    assert.deepEqual(resolvePath(entity, 'Effects[1]').objectify(), {
        index: 1,
        value: {answer: 42},
    });
});

test('objectifies a focused entity path', () => {
    const result = objectifyEntity(fakeStd(), {
        entityType: 'Spells',
        id: 133,
        path: 'Effects',
        refDepth: 0,
    });
    assert.deepEqual(result.output.value, [{answer: 42}]);
    assert.ok(result.outputBytes < MAX_OUTPUT_BYTES);
    assert.equal(result.output.refDepth, 0);
});

test('accepts textual IDs and bounds refDepth', () => {
    const textual = objectifyEntity(fakeStd(), {
        entityType: 'Quests',
        id: 'intro',
        refDepth: 2,
    });
    assert.equal(textual.output.value.ID, 'intro');
    assert.equal(textual.output.refDepth, 2);
    assert.throws(
        () => objectifyEntity(fakeStd(), {entityType: 'Spells', id: 133, refDepth: 3}),
        /between 0 and 2/
    );
});

test('loads composite registries through a bounded fallback registry', () => {
    const result = objectifyEntity(fakeStd(), {
        entityType: 'GameObjectTemplates',
        id: 5,
    });
    assert.equal(result.output.value.ID, 5);
});

test('reports unknown types, missing entities, and non-objectifiable paths', () => {
    assert.throws(
        () => objectifyEntity(fakeStd(), {entityType: 'Unknown', id: 1}),
        /Unknown entity type/
    );
    assert.throws(
        () => objectifyEntity(fakeStd(), {entityType: 'Spells', id: 999}),
        /was not found/
    );
    assert.throws(
        () => objectifyEntity(fakeStd(), {entityType: 'Spells', id: 133, path: 'Effects.length'}),
        /does not exist/
    );
});

test('serializes bigint values as strings', () => {
    assert.deepEqual(makeJsonSafe({value: 12n}).value, {value: '12'});
});

test('rejects objectified output above 200 KiB', () => {
    const huge = 'x'.repeat(MAX_OUTPUT_BYTES);
    assert.throws(
        () => objectifyEntity(fakeStd({huge}), {entityType: 'Spells', id: 133}),
        /above the 204800-byte limit/
    );
});
