import { describe, expect, it } from 'vitest';
import { GRID_PADDING_X, GRID_PADDING_Y, CELL_STEP_X, CELL_STEP_Y, projectTreeToFlow } from './flow';
import type { ClassPrototype } from './model';

describe('XYFlow projection', () => {
  it('derives stable coordinates and edges from business placements', () => {
    const prototype: ClassPrototype = {
      id: 'class', name: 'Test', createdAt: '2026-07-16T10:00:00.000Z', updatedAt: '2026-07-16T10:00:00.000Z',
      trees: [{ id: 'tree', name: 'One' }, { id: 'two', name: 'Two' }, { id: 'three', name: 'Three' }],
      spells: [
        { id: 'a', name: 'A', icon: 'a.PNG', tooltip: '', notes: '', level: 1, maxRanks: 2, placement: { kind: 'talent', treeId: 'tree', row: 1, column: 2 } },
        { id: 'b', name: 'B', icon: 'b.PNG', tooltip: '', notes: '', level: 1, maxRanks: 1, placement: { kind: 'talent', treeId: 'tree', row: 4, column: 2 }, prerequisite: { spellId: 'a', requiredRank: 2 } },
      ],
    };
    const projection = projectTreeToFlow(prototype, prototype.trees[0]);
    expect(projection.nodes[0].position).toEqual({ x: GRID_PADDING_X + CELL_STEP_X * 2, y: GRID_PADDING_Y + CELL_STEP_Y });
    expect(projection.edges).toHaveLength(1);
    expect(projection.edges[0]).toMatchObject({
      source: 'a',
      target: 'b',
      type: 'prerequisite',
      interactionWidth: 20,
    });
    expect(projection.edges[0].label).toBeUndefined();
  });
});
