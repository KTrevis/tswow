import { z } from 'zod';

export const GRID_COLUMNS = 4;
export const GRID_ROWS = 11;
export const MAX_LEVEL = 80;
export const MAX_TALENT_RANKS = 9;
export const EXPORT_SCHEMA_VERSION = 2;

export const placementSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('reserve') }),
  z.object({ kind: z.literal('baseline') }),
  z.object({
    kind: z.literal('talent'),
    treeId: z.string().min(1),
    row: z.number().int().min(0).max(GRID_ROWS - 1),
    column: z.number().int().min(0).max(GRID_COLUMNS - 1),
  }),
]);

export type SpellPlacement = z.infer<typeof placementSchema>;

export const prerequisiteSchema = z.object({
  spellId: z.string().min(1),
  requiredRank: z.number().int().min(1).max(MAX_TALENT_RANKS),
});

export type TalentPrerequisite = z.infer<typeof prerequisiteSchema>;

export const prototypeSpellSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  icon: z.string().max(255),
  tooltip: z.string().max(4000),
  notes: z.string().max(8000),
  level: z.number().int().min(1).max(MAX_LEVEL),
  maxRanks: z.number().int().min(1).max(MAX_TALENT_RANKS),
  placement: placementSchema,
  prerequisite: prerequisiteSchema.optional(),
});

export type PrototypeSpell = z.infer<typeof prototypeSpellSchema>;

export const talentTreeSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(80),
});

export type TalentTree = z.infer<typeof talentTreeSchema>;

export const classPrototypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  trees: z.array(talentTreeSchema).length(3),
  spells: z.array(prototypeSpellSchema),
});

export type ClassPrototype = z.infer<typeof classPrototypeSchema>;

export const exportDocumentSchema = z.object({
  schemaVersion: z.literal(EXPORT_SCHEMA_VERSION),
  prototype: classPrototypeSchema,
});

export type ExportDocument = z.infer<typeof exportDocumentSchema>;

export type SpellDraft = Pick<PrototypeSpell, 'name' | 'icon' | 'tooltip' | 'notes' | 'level' | 'maxRanks'>;

export type OperationResult = { ok: true } | { ok: false; error: string };

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createEmptyPrototype(name = 'Nouvelle classe'): ClassPrototype {
  const now = new Date().toISOString();
  return {
    id: newId('class'),
    name,
    createdAt: now,
    updatedAt: now,
    trees: [1, 2, 3].map(index => ({ id: newId('tree'), name: `Arbre ${index}` })),
    spells: [],
  };
}

export function iconUrl(icon: string) {
  return icon ? `/spell-icons/files/${encodeURIComponent(icon)}` : '/spell-icons/fallback.svg';
}
