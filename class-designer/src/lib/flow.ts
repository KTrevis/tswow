import type { Edge, Node } from '@xyflow/react';
import type { ClassPrototype, PrototypeSpell, TalentTree } from './model';

export const CELL_SIZE = 64;
export const CELL_STEP_X = 82;
export const CELL_STEP_Y = 96;
export const GRID_PADDING_X = 13;
export const GRID_PADDING_Y = 18;
export const FLOW_WIDTH = 340;
export const FLOW_HEIGHT = 1060;

export type TalentNodeData = { spell: PrototypeSpell };
export type TalentFlowNode = Node<TalentNodeData, 'talent'>;

export function projectTreeToFlow(prototype: ClassPrototype, tree: TalentTree) {
  const talentSpells = prototype.spells.filter(spell => spell.placement.kind === 'talent' && spell.placement.treeId === tree.id);
  const nodes: TalentFlowNode[] = talentSpells.map(spell => {
    const placement = spell.placement.kind === 'talent' ? spell.placement : undefined;
    return {
      id: spell.id,
      type: 'talent',
      position: {
        x: GRID_PADDING_X + placement!.column * CELL_STEP_X,
        y: GRID_PADDING_Y + placement!.row * CELL_STEP_Y,
      },
      data: { spell },
      draggable: false,
      selectable: true,
      style: { width: CELL_SIZE, height: CELL_SIZE, background: 'transparent', border: 0 },
    };
  });
  const nodeIds = new Set(nodes.map(node => node.id));
  const edges: Edge[] = talentSpells
    .filter(spell => spell.prerequisite && nodeIds.has(spell.prerequisite.spellId))
    .map(spell => ({
      id: `prerequisite:${spell.id}`,
      source: spell.prerequisite!.spellId,
      target: spell.id,
      type: 'prerequisite',
      animated: false,
      interactionWidth: 20,
    }));
  return { nodes, edges };
}
