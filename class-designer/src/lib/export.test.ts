import { describe, expect, it } from 'vitest';
import { parseImportedPrototype, serializePrototype } from './export';
import type { ClassPrototype } from './model';

const fixture: ClassPrototype = {
  id: 'old-class',
  name: 'Nécromancien',
  createdAt: '2026-07-16T10:00:00.000Z',
  updatedAt: '2026-07-16T10:00:00.000Z',
  trees: [{ id: 'old-tree', name: 'Sang' }, { id: 'tree-2', name: 'Os' }, { id: 'tree-3', name: 'Ombre' }],
  spells: [
    { id: 'source', name: 'Source', icon: 'a.PNG', tooltip: '', notes: '', level: 1, maxRanks: 3, placement: { kind: 'talent', treeId: 'old-tree', row: 0, column: 0 } },
    { id: 'target', name: 'Cible', icon: 'b.PNG', tooltip: '', notes: '', level: 1, maxRanks: 1, placement: { kind: 'talent', treeId: 'old-tree', row: 2, column: 0 }, prerequisite: { spellId: 'source', requiredRank: 3 } },
  ],
};

describe('prototype import/export', () => {
  it('round-trips while regenerating every relational id', () => {
    const imported = parseImportedPrototype(serializePrototype(fixture));
    expect(imported.id).not.toBe(fixture.id);
    expect(imported.name).toBe('Nécromancien (importé)');
    expect(imported.trees[0].id).not.toBe('old-tree');
    expect(imported.spells[0].id).not.toBe('source');
    expect(imported.spells[0].placement).toMatchObject({ treeId: imported.trees[0].id });
    expect(imported.spells[1].prerequisite?.spellId).toBe(imported.spells[0].id);
  });

  it('rejects unsupported or malformed files', () => {
    expect(() => parseImportedPrototype('{"schemaVersion":3}')).toThrow();
    expect(() => parseImportedPrototype('not json')).toThrow();
  });

  it('migrates baseline levels from schema version 1', () => {
    const legacy = JSON.stringify({
      schemaVersion: 1,
      prototype: {
        ...fixture,
        spells: [{ ...fixture.spells[0], level: undefined, placement: { kind: 'baseline', level: 12 } }],
      },
    });
    const imported = parseImportedPrototype(legacy);
    expect(imported.spells[0]).toMatchObject({ level: 12, placement: { kind: 'baseline' } });
  });
});
