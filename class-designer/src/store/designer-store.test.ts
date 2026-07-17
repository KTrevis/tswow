import { beforeEach, describe, expect, it } from 'vitest';
import { createEmptyPrototype } from '../lib/model';
import { useDesignerStore } from './designer-store';

describe('designer store', () => {
  beforeEach(() => {
    const prototype = createEmptyPrototype('Fixture');
    useDesignerStore.setState({ prototypes: [prototype], activePrototypeId: prototype.id });
  });

  it('creates a spell in reserve and persists mutations', () => {
    const id = useDesignerStore.getState().createSpell({ name: 'Trait de mort', icon: 'Spell_Shadow.PNG', tooltip: 'Inflige des dégâts.', notes: '', level: 12, maxRanks: 3 });
    expect(useDesignerStore.getState().prototypes[0].spells[0]).toMatchObject({ id, level: 12, placement: { kind: 'reserve' } });
    expect(localStorage.getItem('class-forge-designer-v1')).toContain('Trait de mort');
  });

  it('deletes dependent links together with a source spell', () => {
    const state = useDesignerStore.getState();
    const source = state.createSpell({ name: 'Source', icon: 'a.PNG', tooltip: '', notes: '', level: 1, maxRanks: 2 });
    const target = state.createSpell({ name: 'Target', icon: 'b.PNG', tooltip: '', notes: '', level: 1, maxRanks: 1 });
    const treeId = useDesignerStore.getState().prototypes[0].trees[0].id;
    expect(useDesignerStore.getState().moveSpell(source, { kind: 'talent', treeId, row: 0, column: 0 }).ok).toBe(true);
    expect(useDesignerStore.getState().moveSpell(target, { kind: 'talent', treeId, row: 2, column: 0 }).ok).toBe(true);
    expect(useDesignerStore.getState().connectTalents(source, target).ok).toBe(true);
    useDesignerStore.getState().deleteSpell(source);
    expect(useDesignerStore.getState().prototypes[0].spells.find(spell => spell.id === target)?.prerequisite).toBeUndefined();
  });

  it('always leaves one prototype after deletion', () => {
    useDesignerStore.getState().deletePrototype();
    expect(useDesignerStore.getState().prototypes).toHaveLength(1);
  });

  it('updates the learning level when editing a spell', () => {
    const state = useDesignerStore.getState();
    const id = state.createSpell({ name: 'Trait', icon: 'a.PNG', tooltip: '', notes: '', level: 4, maxRanks: 1 });
    expect(useDesignerStore.getState().updateSpell(id, { name: 'Trait', icon: 'a.PNG', tooltip: '', notes: '', level: 18, maxRanks: 1 }).ok).toBe(true);
    expect(useDesignerStore.getState().prototypes[0].spells[0].level).toBe(18);
  });

  it('duplicates a spell into the reserve without its talent prerequisite', () => {
    const state = useDesignerStore.getState();
    const sourceId = state.createSpell({ name: 'Source', icon: 'a.PNG', tooltip: 'Tooltip', notes: 'Notes', level: 8, maxRanks: 3 });
    const targetId = state.createSpell({ name: 'Target', icon: 'b.PNG', tooltip: 'Target tooltip', notes: 'Target notes', level: 12, maxRanks: 2 });
    const treeId = useDesignerStore.getState().prototypes[0].trees[0].id;
    expect(useDesignerStore.getState().moveSpell(sourceId, { kind: 'talent', treeId, row: 0, column: 0 }).ok).toBe(true);
    expect(useDesignerStore.getState().moveSpell(targetId, { kind: 'talent', treeId, row: 2, column: 0 }).ok).toBe(true);
    expect(useDesignerStore.getState().connectTalents(sourceId, targetId).ok).toBe(true);

    const duplicateId = useDesignerStore.getState().duplicateSpell(targetId);
    const duplicate = useDesignerStore.getState().prototypes[0].spells.find(spell => spell.id === duplicateId);

    expect(duplicate).toMatchObject({
      id: duplicateId,
      name: 'Target (copie)',
      icon: 'b.PNG',
      tooltip: 'Target tooltip',
      notes: 'Target notes',
      level: 12,
      maxRanks: 2,
      placement: { kind: 'reserve' },
    });
    expect(duplicate?.id).not.toBe(targetId);
    expect(duplicate?.prerequisite).toBeUndefined();
  });
});
