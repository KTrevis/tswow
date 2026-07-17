import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Pencil } from 'lucide-react';
import type { PrototypeSpell } from '../lib/model';
import { cn } from '../lib/utils';
import { SpellIcon } from './spell-icon';
import { useSpellSearchMatch } from './spell-search';
import { SpellContextMenu } from './spell-context-menu';
import { SpellTooltip } from './spell-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function SpellCard({ spell, onEdit, onDuplicate, onDelete, compact = false, overlay = false }: {
  spell: PrototypeSpell;
  onEdit?: (spellId: string) => void;
  onDuplicate?: (spellId: string) => void;
  onDelete?: (spell: PrototypeSpell) => void;
  compact?: boolean;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `spell:${spell.id}`,
    data: { spellId: spell.id },
    disabled: overlay,
  });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  const isSearchMatch = useSpellSearchMatch(spell.name);

  const card = (
    <article ref={setNodeRef} style={style} className={cn('spell-card', compact && 'compact', overlay && 'drag-overlay-card', isDragging && 'dragging', isSearchMatch && 'search-match')}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="spell-drag-handle" {...listeners} {...attributes}>
            <SpellIcon icon={spell.icon} alt="" />
            {!compact && <span className="spell-card-copy"><strong>{spell.name}</strong>{spell.placement.kind !== 'baseline' && <small>{spell.maxRanks} rang{spell.maxRanks > 1 ? 's' : ''}</small>}</span>}
          </button>
        </TooltipTrigger>
        <TooltipContent className="wow-spell-tooltip">
          <SpellTooltip spell={spell} />
        </TooltipContent>
      </Tooltip>
      {!compact && onEdit && <button type="button" className="card-edit" aria-label={`Modifier ${spell.name}`} onClick={() => onEdit(spell.id)}><Pencil size={14} /></button>}
    </article>
  );

  return onEdit && onDuplicate && onDelete ? (
    <SpellContextMenu spell={spell} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete}>{card}</SpellContextMenu>
  ) : card;
}
