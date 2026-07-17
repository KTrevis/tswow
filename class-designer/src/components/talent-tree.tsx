import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Handle,
  Position,
  ReactFlow,
  type Connection,
  type EdgeMouseHandler,
  type IsValidConnection,
  type NodeProps,
} from '@xyflow/react';
import { Link2, Trash2 } from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';
import {
  CELL_SIZE,
  CELL_STEP_X,
  CELL_STEP_Y,
  FLOW_HEIGHT,
  FLOW_WIDTH,
  GRID_PADDING_X,
  GRID_PADDING_Y,
  projectTreeToFlow,
  type TalentFlowNode,
} from '../lib/flow';
import { GRID_COLUMNS, GRID_ROWS, type ClassPrototype, type PrototypeSpell, type TalentTree } from '../lib/model';
import { useDesignerStore } from '../store/designer-store';
import { SpellIcon } from './spell-icon';
import { useSpellSearchMatch } from './spell-search';
import { SpellContextMenu } from './spell-context-menu';
import { SpellTooltip } from './spell-tooltip';
import { PrerequisiteEdge } from './prerequisite-edge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const TalentActionsContext = createContext<{
  onEdit: (spellId: string) => void;
  onDuplicate: (spellId: string) => void;
  onDelete: (spell: PrototypeSpell) => void;
} | null>(null);

function TalentNode({ data }: NodeProps<TalentFlowNode>) {
  const { spell } = data;
  const actions = useContext(TalentActionsContext);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `spell:${spell.id}`,
    data: { spellId: spell.id },
  });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  const isSearchMatch = useSpellSearchMatch(spell.name);

  const node = (
    <div ref={setNodeRef} style={style} className={`talent-node nodrag ${isDragging ? 'dragging' : ''} ${isSearchMatch ? 'search-match' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="talent-handle target"
        aria-label={`Prérequis vers ${spell.name}`}
        isConnectableStart={false}
        isConnectableEnd
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="talent-drag-handle" {...listeners} {...attributes}>
            <SpellIcon icon={spell.icon} alt="" />
            <span className="rank-badge">{spell.maxRanks}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" sideOffset={14} className="wow-spell-tooltip">
          <SpellTooltip spell={spell} />
        </TooltipContent>
      </Tooltip>
      <Handle
        type="source"
        position={Position.Bottom}
        className="talent-handle source"
        aria-label={`Prérequis depuis ${spell.name}`}
        isConnectableStart
        isConnectableEnd={false}
      />
    </div>
  );

  return actions ? (
    <SpellContextMenu spell={spell} onEdit={actions.onEdit} onDuplicate={actions.onDuplicate} onDelete={actions.onDelete}>{node}</SpellContextMenu>
  ) : node;
}

const nodeTypes = { talent: TalentNode };
const edgeTypes = { prerequisite: PrerequisiteEdge };

function TalentCell({ treeId, row, column }: { treeId: string; row: number; column: number }) {
  const { isOver, setNodeRef } = useDroppable({ id: `cell:${treeId}:${row}:${column}` });
  return (
    <div
      ref={setNodeRef}
      className={`talent-cell ${isOver ? 'drop-over' : ''}`}
      data-testid={`cell-${row}-${column}`}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        left: GRID_PADDING_X + column * CELL_STEP_X,
        top: GRID_PADDING_Y + row * CELL_STEP_Y,
      }}
    >
      <span>{row + 1}</span>
    </div>
  );
}

export function TalentTreePanel({ prototype, tree, onEditSpell, onDuplicateSpell, onDeleteSpell, onMessage }: {
  prototype: ClassPrototype;
  tree: TalentTree;
  onEditSpell: (spellId: string) => void;
  onDuplicateSpell: (spellId: string) => void;
  onDeleteSpell: (spell: PrototypeSpell) => void;
  onMessage: (message: string, error?: boolean) => void;
}) {
  const renameTree = useDesignerStore(state => state.renameTree);
  const connectTalents = useDesignerStore(state => state.connectTalents);
  const removePrerequisite = useDesignerStore(state => state.removePrerequisite);
  const updatePrerequisiteRank = useDesignerStore(state => state.updatePrerequisiteRank);
  const [selectedTargetId, setSelectedTargetId] = useState<string>();
  const [isConnecting, setIsConnecting] = useState(false);
  const { nodes, edges } = useMemo(() => projectTreeToFlow(prototype, tree), [prototype, tree]);
  const selectedTarget = prototype.spells.find(spell => spell.id === selectedTargetId);
  const prerequisiteSource = prototype.spells.find(spell => spell.id === selectedTarget?.prerequisite?.spellId);

  const isValidConnection: IsValidConnection = connection => {
    if (!connection.source || !connection.target || connection.source === connection.target) return false;
    const source = prototype.spells.find(spell => spell.id === connection.source);
    const target = prototype.spells.find(spell => spell.id === connection.target);
    return Boolean(
      source?.placement.kind === 'talent' &&
      target?.placement.kind === 'talent' &&
      !target.prerequisite &&
      source.placement.treeId === target.placement.treeId &&
      source.placement.row < target.placement.row,
    );
  };

  function onConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;
    const result = connectTalents(connection.source, connection.target);
    onMessage(result.ok ? 'Prérequis ajouté.' : result.error, !result.ok);
  }

  const onEdgeClick: EdgeMouseHandler = (_event, edge) => setSelectedTargetId(edge.target);

  function saveRank(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = updatePrerequisiteRank(selectedTargetId!, Number(form.get('rank')));
    if (!result.ok) return onMessage(result.error, true);
    onMessage('Rang requis mis à jour.');
    setSelectedTargetId(undefined);
  }

  return (
    <section className="tree-panel">
      <div className="tree-title"><Input aria-label="Nom de l'arbre" value={tree.name} onChange={event => renameTree(tree.id, event.target.value)} /></div>
      <div className={`tree-canvas ${isConnecting ? 'is-connecting' : ''}`} style={{ width: FLOW_WIDTH, height: FLOW_HEIGHT }}>
        {Array.from({ length: GRID_ROWS }, (_, row) =>
          Array.from({ length: GRID_COLUMNS }, (_, column) => <TalentCell key={`${row}-${column}`} treeId={tree.id} row={row} column={column} />),
        )}
        <TalentActionsContext.Provider value={{ onEdit: onEditSpell, onDuplicate: onDuplicateSpell, onDelete: onDeleteSpell }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            nodesConnectable
            elementsSelectable
            panOnDrag={false}
            autoPanOnConnect={false}
            autoPanOnNodeDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={1}
            maxZoom={1}
            isValidConnection={isValidConnection}
            onConnectStart={() => setIsConnecting(true)}
            onConnectEnd={() => setIsConnecting(false)}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onNodeDoubleClick={(_event, node) => onEditSpell(node.id)}
            proOptions={{ hideAttribution: true }}
            deleteKeyCode={null}
            className="talent-flow"
          />
        </TalentActionsContext.Provider>
      </div>
      <div className="tree-help"><Link2 size={13} /> Tire la poignée basse vers la poignée haute d’un talent d’un tier inférieur.</div>

      <Dialog open={Boolean(selectedTargetId)} onOpenChange={open => !open && setSelectedTargetId(undefined)}>
        <DialogContent className="edge-dialog">
          <form onSubmit={saveRank}>
            <DialogHeader><DialogTitle>Modifier le prérequis</DialogTitle><DialogDescription>{prerequisiteSource?.name} → {selectedTarget?.name}</DialogDescription></DialogHeader>
            <label>Rang requis<Input name="rank" type="number" min={1} max={prerequisiteSource?.maxRanks ?? 1} defaultValue={selectedTarget?.prerequisite?.requiredRank ?? 1} /></label>
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={() => { removePrerequisite(selectedTargetId!); setSelectedTargetId(undefined); onMessage('Prérequis supprimé.'); }}><Trash2 size={15} /> Supprimer le lien</Button>
              <span className="dialog-spacer" />
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
