import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parseImportedPrototype } from '../lib/export';
import {
  createEmptyPrototype,
  newId,
  type ClassPrototype,
  type OperationResult,
  type SpellDraft,
  type SpellPlacement,
} from '../lib/model';
import { connectTalents, moveSpell, validatePrototypeRules } from '../lib/rules';

type DesignerState = {
  prototypes: ClassPrototype[];
  activePrototypeId: string;
  setActivePrototype: (id: string) => void;
  createPrototype: (name?: string) => string;
  renamePrototype: (name: string) => void;
  duplicatePrototype: () => string;
  deletePrototype: () => void;
  renameTree: (treeId: string, name: string) => void;
  createSpell: (draft: SpellDraft) => string;
  duplicateSpell: (spellId: string) => string | undefined;
  updateSpell: (spellId: string, draft: SpellDraft) => OperationResult;
  deleteSpell: (spellId: string) => void;
  moveSpell: (spellId: string, destination: SpellPlacement) => OperationResult;
  connectTalents: (sourceId: string, targetId: string) => OperationResult;
  removePrerequisite: (targetId: string) => void;
  updatePrerequisiteRank: (targetId: string, requiredRank: number) => OperationResult;
  importPrototype: (source: string) => OperationResult;
};

function touch(prototype: ClassPrototype): ClassPrototype {
  return { ...prototype, updatedAt: new Date().toISOString() };
}

function migratePersistedState(persistedState: unknown) {
  const state = persistedState as DesignerState;
  if (!Array.isArray(state?.prototypes)) return state;
  return {
    ...state,
    prototypes: state.prototypes.map(prototype => ({
      ...prototype,
      spells: prototype.spells.map(spell => {
        const legacyPlacement = spell.placement as SpellPlacement & { level?: number };
        return {
          ...spell,
          level: spell.level ?? legacyPlacement.level ?? 1,
          placement: spell.placement.kind === 'baseline' ? { kind: 'baseline' as const } : spell.placement,
        };
      }),
    })),
  };
}

const initialPrototype = createEmptyPrototype();

export const useDesignerStore = create<DesignerState>()(
  persist(
    (set, get) => ({
      prototypes: [initialPrototype],
      activePrototypeId: initialPrototype.id,
      setActivePrototype: id => set({ activePrototypeId: id }),
      createPrototype: (name = 'Nouvelle classe') => {
        const prototype = createEmptyPrototype(name);
        set(state => ({ prototypes: [...state.prototypes, prototype], activePrototypeId: prototype.id }));
        return prototype.id;
      },
      renamePrototype: name => set(state => ({
        prototypes: state.prototypes.map(prototype =>
          prototype.id === state.activePrototypeId ? touch({ ...prototype, name }) : prototype),
      })),
      duplicatePrototype: () => {
        const current = get().prototypes.find(prototype => prototype.id === get().activePrototypeId)!;
        const treeIds = new Map(current.trees.map(tree => [tree.id, newId('tree')]));
        const spellIds = new Map(current.spells.map(spell => [spell.id, newId('spell')]));
        const now = new Date().toISOString();
        const duplicate: ClassPrototype = {
          ...current,
          id: newId('class'),
          name: `${current.name} (copie)`,
          createdAt: now,
          updatedAt: now,
          trees: current.trees.map(tree => ({ ...tree, id: treeIds.get(tree.id)! })),
          spells: current.spells.map(spell => ({
            ...spell,
            id: spellIds.get(spell.id)!,
            placement: spell.placement.kind === 'talent'
              ? { ...spell.placement, treeId: treeIds.get(spell.placement.treeId)! }
              : { ...spell.placement },
            prerequisite: spell.prerequisite
              ? { ...spell.prerequisite, spellId: spellIds.get(spell.prerequisite.spellId)! }
              : undefined,
          })),
        };
        set(state => ({ prototypes: [...state.prototypes, duplicate], activePrototypeId: duplicate.id }));
        return duplicate.id;
      },
      deletePrototype: () => set(state => {
        const remaining = state.prototypes.filter(prototype => prototype.id !== state.activePrototypeId);
        if (remaining.length) return { prototypes: remaining, activePrototypeId: remaining[0].id };
        const replacement = createEmptyPrototype();
        return { prototypes: [replacement], activePrototypeId: replacement.id };
      }),
      renameTree: (treeId, name) => set(state => ({
        prototypes: state.prototypes.map(prototype => prototype.id === state.activePrototypeId
          ? touch({ ...prototype, trees: prototype.trees.map(tree => tree.id === treeId ? { ...tree, name } : tree) })
          : prototype),
      })),
      createSpell: draft => {
        const id = newId('spell');
        set(state => ({
          prototypes: state.prototypes.map(prototype => prototype.id === state.activePrototypeId
            ? touch({ ...prototype, spells: [...prototype.spells, { ...draft, id, placement: { kind: 'reserve' } }] })
            : prototype),
        }));
        return id;
      },
      duplicateSpell: spellId => {
        const state = get();
        const current = state.prototypes.find(prototype => prototype.id === state.activePrototypeId)!;
        const source = current.spells.find(spell => spell.id === spellId);
        if (!source) return undefined;

        const id = newId('spell');
        const copySuffix = ' (copie)';
        const duplicate = {
          ...source,
          id,
          name: `${source.name.slice(0, 100 - copySuffix.length)}${copySuffix}`,
          placement: { kind: 'reserve' as const },
          prerequisite: undefined,
        };
        set({
          prototypes: state.prototypes.map(prototype => prototype.id === current.id
            ? touch({ ...prototype, spells: [...prototype.spells, duplicate] })
            : prototype),
        });
        return id;
      },
      updateSpell: (spellId, draft) => {
        const state = get();
        const current = state.prototypes.find(prototype => prototype.id === state.activePrototypeId)!;
        const candidate = touch({
          ...current,
          spells: current.spells.map(spell => spell.id === spellId ? { ...spell, ...draft } : spell),
        });
        const result = validatePrototypeRules(candidate);
        if (result.ok) set({
          prototypes: state.prototypes.map(prototype => prototype.id === current.id ? candidate : prototype),
        });
        return result;
      },
      deleteSpell: spellId => set(state => ({
        prototypes: state.prototypes.map(prototype => prototype.id === state.activePrototypeId
          ? touch({
              ...prototype,
              spells: prototype.spells
                .filter(spell => spell.id !== spellId)
                .map(spell => spell.prerequisite?.spellId === spellId ? { ...spell, prerequisite: undefined } : spell),
            })
          : prototype),
      })),
      moveSpell: (spellId, destination) => {
        const state = get();
        const current = state.prototypes.find(prototype => prototype.id === state.activePrototypeId)!;
        const operation = moveSpell(current, spellId, destination);
        if (operation.prototype) set({
          prototypes: state.prototypes.map(prototype => prototype.id === current.id ? operation.prototype! : prototype),
        });
        return operation.result;
      },
      connectTalents: (sourceId, targetId) => {
        const state = get();
        const current = state.prototypes.find(prototype => prototype.id === state.activePrototypeId)!;
        const operation = connectTalents(current, sourceId, targetId);
        if (operation.prototype) set({
          prototypes: state.prototypes.map(prototype => prototype.id === current.id ? operation.prototype! : prototype),
        });
        return operation.result;
      },
      removePrerequisite: targetId => set(state => ({
        prototypes: state.prototypes.map(prototype => prototype.id === state.activePrototypeId
          ? touch({ ...prototype, spells: prototype.spells.map(spell => spell.id === targetId ? { ...spell, prerequisite: undefined } : spell) })
          : prototype),
      })),
      updatePrerequisiteRank: (targetId, requiredRank) => {
        const state = get();
        const current = state.prototypes.find(prototype => prototype.id === state.activePrototypeId)!;
        const target = current.spells.find(spell => spell.id === targetId);
        const source = current.spells.find(spell => spell.id === target?.prerequisite?.spellId);
        if (!target?.prerequisite || !source) return { ok: false, error: 'Prérequis introuvable.' };
        if (requiredRank < 1 || requiredRank > source.maxRanks) {
          return { ok: false, error: `Le rang doit être compris entre 1 et ${source.maxRanks}.` };
        }
        set({ prototypes: state.prototypes.map(prototype => prototype.id === current.id
          ? touch({ ...prototype, spells: prototype.spells.map(spell => spell.id === targetId
              ? { ...spell, prerequisite: { ...spell.prerequisite!, requiredRank } }
              : spell) })
          : prototype) });
        return { ok: true };
      },
      importPrototype: source => {
        try {
          const prototype = parseImportedPrototype(source);
          const validation = validatePrototypeRules(prototype);
          if (!validation.ok) return validation;
          set(state => ({ prototypes: [...state.prototypes, prototype], activePrototypeId: prototype.id }));
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : 'Fichier invalide.' };
        }
      },
    }),
    { name: 'class-forge-designer-v1', version: 2, migrate: migratePersistedState },
  ),
);

export function useActivePrototype() {
  return useDesignerStore(state =>
    state.prototypes.find(prototype => prototype.id === state.activePrototypeId) ?? state.prototypes[0],
  );
}
