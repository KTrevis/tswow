import { Copy, Pencil, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import type { PrototypeSpell } from '../lib/model';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './ui/context-menu';

export function SpellContextMenu({ spell, children, onEdit, onDuplicate, onDelete }: {
  spell: PrototypeSpell;
  children: ReactElement;
  onEdit: (spellId: string) => void;
  onDuplicate: (spellId: string) => void;
  onDelete: (spell: PrototypeSpell) => void;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent aria-label={`Actions pour ${spell.name}`}>
        <ContextMenuItem onSelect={() => onEdit(spell.id)}>
          <Pencil size={14} />
          Modifier
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => onDuplicate(spell.id)}>
          <Copy size={14} />
          Dupliquer
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="destructive" onSelect={() => onDelete(spell)}>
          <Trash2 size={14} />
          Supprimer
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
