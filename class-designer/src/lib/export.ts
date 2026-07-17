import {
  classPrototypeSchema,
  exportDocumentSchema,
  EXPORT_SCHEMA_VERSION,
  newId,
  type ClassPrototype,
  type ExportDocument,
} from './model';
import { z } from 'zod';

const legacyPlacementSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('reserve') }),
  z.object({ kind: z.literal('baseline'), level: z.number().int().min(1).max(80) }),
  z.object({
    kind: z.literal('talent'),
    treeId: z.string().min(1),
    row: z.number().int().min(0).max(10),
    column: z.number().int().min(0).max(3),
  }),
]);

const legacyExportDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  prototype: z.object({
    id: z.string().min(1),
    name: z.string().trim().min(1).max(100),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    trees: z.array(z.object({ id: z.string().min(1), name: z.string().trim().min(1).max(80) })).length(3),
    spells: z.array(z.object({
      id: z.string().min(1),
      name: z.string().trim().min(1).max(100),
      icon: z.string().max(255),
      tooltip: z.string().max(4000),
      notes: z.string().max(8000),
      maxRanks: z.number().int().min(1).max(9),
      placement: legacyPlacementSchema,
      prerequisite: z.object({
        spellId: z.string().min(1),
        requiredRank: z.number().int().min(1).max(9),
      }).optional(),
    })),
  }),
});

export function serializePrototype(prototype: ClassPrototype) {
  const document: ExportDocument = { schemaVersion: EXPORT_SCHEMA_VERSION, prototype };
  return JSON.stringify(document, null, 2);
}

export function parseImportedPrototype(source: string): ClassPrototype {
  const parsed = JSON.parse(source);
  const document = parsed.schemaVersion === 1
    ? migrateLegacyDocument(legacyExportDocumentSchema.parse(parsed))
    : exportDocumentSchema.parse(parsed);
  const treeIds = new Map(document.prototype.trees.map(tree => [tree.id, newId('tree')]));
  const spellIds = new Map(document.prototype.spells.map(spell => [spell.id, newId('spell')]));
  const now = new Date().toISOString();

  return classPrototypeSchema.parse({
    ...document.prototype,
    id: newId('class'),
    name: `${document.prototype.name} (importé)`,
    createdAt: now,
    updatedAt: now,
    trees: document.prototype.trees.map(tree => ({ ...tree, id: treeIds.get(tree.id)! })),
    spells: document.prototype.spells.map(spell => ({
      ...spell,
      id: spellIds.get(spell.id)!,
      placement: spell.placement.kind === 'talent'
        ? { ...spell.placement, treeId: treeIds.get(spell.placement.treeId) }
        : spell.placement,
      prerequisite: spell.prerequisite
        ? { ...spell.prerequisite, spellId: spellIds.get(spell.prerequisite.spellId) }
        : undefined,
    })),
  });
}

function migrateLegacyDocument(document: z.infer<typeof legacyExportDocumentSchema>): ExportDocument {
  return exportDocumentSchema.parse({
    schemaVersion: EXPORT_SCHEMA_VERSION,
    prototype: {
      ...document.prototype,
      spells: document.prototype.spells.map(spell => ({
        ...spell,
        level: spell.placement.kind === 'baseline' ? spell.placement.level : 1,
        placement: spell.placement.kind === 'baseline' ? { kind: 'baseline' } : spell.placement,
      })),
    },
  });
}
