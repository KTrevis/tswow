import type { ClassPrototype, OperationResult, PrototypeSpell, SpellPlacement } from './model';

function talentKey(placement: SpellPlacement) {
  return placement.kind === 'talent'
    ? `${placement.treeId}:${placement.row}:${placement.column}`
    : undefined;
}

export function validatePrototypeRules(prototype: ClassPrototype): OperationResult {
  const treeIds = new Set(prototype.trees.map(tree => tree.id));
  const spellsById = new Map(prototype.spells.map(spell => [spell.id, spell]));
  const occupiedCells = new Set<string>();

  for (const spell of prototype.spells) {
    if (spell.placement.kind === 'talent') {
      if (!treeIds.has(spell.placement.treeId)) {
        return { ok: false, error: `L'arbre de « ${spell.name} » n'existe pas.` };
      }
      const key = talentKey(spell.placement)!;
      if (occupiedCells.has(key)) {
        return { ok: false, error: 'Deux talents ne peuvent pas occuper la même case.' };
      }
      occupiedCells.add(key);
    }

    if (!spell.prerequisite) continue;
    const source = spellsById.get(spell.prerequisite.spellId);
    if (!source) return { ok: false, error: `Le prérequis de « ${spell.name} » n'existe plus.` };
    if (source.id === spell.id) return { ok: false, error: 'Un talent ne peut pas être son propre prérequis.' };
    if (source.placement.kind !== 'talent' || spell.placement.kind !== 'talent') {
      return { ok: false, error: 'Les deux sorts liés doivent être placés dans un arbre.' };
    }
    if (source.placement.treeId !== spell.placement.treeId) {
      return { ok: false, error: 'Un prérequis doit rester dans le même arbre.' };
    }
    if (source.placement.row >= spell.placement.row) {
      return { ok: false, error: 'Le prérequis doit être placé sur un tier strictement antérieur.' };
    }
    if (spell.prerequisite.requiredRank > source.maxRanks) {
      return { ok: false, error: `Le rang requis dépasse les ${source.maxRanks} rangs de « ${source.name} ».` };
    }
  }

  return { ok: true };
}

export function moveSpell(
  prototype: ClassPrototype,
  spellId: string,
  destination: SpellPlacement,
): { result: OperationResult; prototype?: ClassPrototype } {
  const spells = prototype.spells.map(spell => ({
    ...spell,
    placement: { ...spell.placement },
    prerequisite: spell.prerequisite ? { ...spell.prerequisite } : undefined,
  }));
  const moving = spells.find(spell => spell.id === spellId);
  if (!moving) return { result: { ok: false, error: 'Sort introuvable.' } };

  const previousPlacement = moving.placement;
  if (destination.kind === 'talent') {
    const occupant = spells.find(spell => spell.id !== spellId && talentKey(spell.placement) === talentKey(destination));
    if (occupant) occupant.placement = previousPlacement;
  }
  moving.placement = destination;

  const candidate = { ...prototype, spells, updatedAt: new Date().toISOString() };
  const result = validatePrototypeRules(candidate);
  return result.ok ? { result, prototype: candidate } : { result };
}

export function connectTalents(
  prototype: ClassPrototype,
  sourceId: string,
  targetId: string,
): { result: OperationResult; prototype?: ClassPrototype } {
  const source = prototype.spells.find(spell => spell.id === sourceId);
  const target = prototype.spells.find(spell => spell.id === targetId);
  if (!source || !target) return { result: { ok: false, error: 'Talent introuvable.' } };
  if (target.prerequisite) {
    return { result: { ok: false, error: `« ${target.name} » possède déjà un prérequis.` } };
  }
  const spells = prototype.spells.map(spell =>
    spell.id === targetId
      ? { ...spell, prerequisite: { spellId: sourceId, requiredRank: source.maxRanks } }
      : spell,
  );
  const candidate = { ...prototype, spells, updatedAt: new Date().toISOString() };
  const result = validatePrototypeRules(candidate);
  return result.ok ? { result, prototype: candidate } : { result };
}

export function sortedBaselineSpells(spells: PrototypeSpell[]) {
  return spells
    .filter(spell => spell.placement.kind === 'baseline')
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'fr'));
}
