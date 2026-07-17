import { describe, expect, it } from 'vitest';
import type { ClassPrototype, PrototypeSpell } from './model';
import { connectTalents, moveSpell, sortedBaselineSpells, validatePrototypeRules } from './rules';

function spell(id: string, placement: PrototypeSpell['placement'], prerequisite?: PrototypeSpell['prerequisite']): PrototypeSpell {
  return { id, name: id, icon: 'icon.png', tooltip: '', notes: '', level: 1, maxRanks: 5, placement, prerequisite };
}

function prototype(spells: PrototypeSpell[]): ClassPrototype {
  return {
    id: 'class',
    name: 'Test',
    createdAt: '2026-07-16T10:00:00.000Z',
    updatedAt: '2026-07-16T10:00:00.000Z',
    trees: [{ id: 'tree-1', name: 'Un' }, { id: 'tree-2', name: 'Deux' }, { id: 'tree-3', name: 'Trois' }],
    spells,
  };
}

describe('talent rules', () => {
  it('swaps an occupied talent cell', () => {
    const source = prototype([
      spell('a', { kind: 'talent', treeId: 'tree-1', row: 0, column: 0 }),
      spell('b', { kind: 'talent', treeId: 'tree-1', row: 2, column: 1 }),
    ]);
    const operation = moveSpell(source, 'a', { kind: 'talent', treeId: 'tree-1', row: 2, column: 1 });
    expect(operation.result.ok).toBe(true);
    expect(operation.prototype?.spells.find(item => item.id === 'a')?.placement).toEqual({ kind: 'talent', treeId: 'tree-1', row: 2, column: 1 });
    expect(operation.prototype?.spells.find(item => item.id === 'b')?.placement).toEqual({ kind: 'talent', treeId: 'tree-1', row: 0, column: 0 });
  });

  it('blocks a move that would invalidate a prerequisite', () => {
    const source = prototype([
      spell('source', { kind: 'talent', treeId: 'tree-1', row: 0, column: 0 }),
      spell('target', { kind: 'talent', treeId: 'tree-1', row: 3, column: 0 }, { spellId: 'source', requiredRank: 5 }),
    ]);
    const operation = moveSpell(source, 'source', { kind: 'reserve' });
    expect(operation.result).toEqual({ ok: false, error: 'Les deux sorts liés doivent être placés dans un arbre.' });
    expect(operation.prototype).toBeUndefined();
  });

  it('creates a valid prerequisite with the source max rank', () => {
    const source = prototype([
      spell('source', { kind: 'talent', treeId: 'tree-1', row: 0, column: 0 }),
      spell('target', { kind: 'talent', treeId: 'tree-1', row: 3, column: 0 }),
    ]);
    const operation = connectTalents(source, 'source', 'target');
    expect(operation.result.ok).toBe(true);
    expect(operation.prototype?.spells[1].prerequisite).toEqual({ spellId: 'source', requiredRank: 5 });
  });

  it('rejects backwards links and duplicate incoming links', () => {
    const backwards = prototype([
      spell('source', { kind: 'talent', treeId: 'tree-1', row: 4, column: 0 }),
      spell('target', { kind: 'talent', treeId: 'tree-1', row: 1, column: 0 }),
    ]);
    expect(connectTalents(backwards, 'source', 'target').result.ok).toBe(false);
    const duplicate = prototype([
      spell('source', { kind: 'talent', treeId: 'tree-1', row: 0, column: 0 }),
      spell('target', { kind: 'talent', treeId: 'tree-1', row: 2, column: 0 }, { spellId: 'source', requiredRank: 1 }),
    ]);
    expect(connectTalents(duplicate, 'source', 'target').result.ok).toBe(false);
  });

  it('sorts baseline spells by level and then name', () => {
    const spells = [
      { ...spell('Zulu', { kind: 'baseline' }), level: 10 },
      { ...spell('Alpha', { kind: 'baseline' }), level: 10 },
      { ...spell('First', { kind: 'baseline' }), level: 2 },
      spell('Reserve', { kind: 'reserve' }),
    ];
    expect(sortedBaselineSpells(spells).map(item => item.name)).toEqual(['First', 'Alpha', 'Zulu']);
  });

  it('detects duplicate cells', () => {
    const source = prototype([
      spell('a', { kind: 'talent', treeId: 'tree-1', row: 0, column: 0 }),
      spell('b', { kind: 'talent', treeId: 'tree-1', row: 0, column: 0 }),
    ]);
    expect(validatePrototypeRules(source).ok).toBe(false);
  });
});
