import { useDroppable } from '@dnd-kit/core';
import { ChevronDown, PackageOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ClassPrototype, PrototypeSpell } from '../lib/model';
import { SpellCard } from './spell-card';

export function ReservePanel({ prototype, onEditSpell, onDuplicateSpell, onDeleteSpell }: {
  prototype: ClassPrototype;
  onEditSpell: (id: string) => void;
  onDuplicateSpell: (id: string) => void;
  onDeleteSpell: (spell: PrototypeSpell) => void;
}) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('class-forge-reserve-collapsed') === 'true');
  const { isOver, setNodeRef } = useDroppable({ id: 'reserve' });
  const spells = prototype.spells.filter(spell => spell.placement.kind === 'reserve').sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  useEffect(() => localStorage.setItem('class-forge-reserve-collapsed', String(collapsed)), [collapsed]);

  return (
    <section ref={setNodeRef} className={`reserve-panel ${collapsed ? 'collapsed' : ''} ${isOver ? 'drop-over' : ''}`}>
      <button type="button" className="reserve-heading" onClick={() => setCollapsed(value => !value)}>
        <span className="panel-icon"><PackageOpen size={17} /></span>
        <span><strong>Réserve</strong><small>{spells.length} sort{spells.length > 1 ? 's' : ''} non placé{spells.length > 1 ? 's' : ''}</small></span>
        <ChevronDown size={18} className="collapse-chevron" />
      </button>
      {!collapsed && <div className="reserve-content">
        {spells.length === 0 ? <div className="empty-state compact-empty">Crée un sort ou dépose-le ici pour le mettre de côté.</div> : spells.map(spell => <SpellCard key={spell.id} spell={spell} onEdit={onEditSpell} onDuplicate={onDuplicateSpell} onDelete={onDeleteSpell} />)}
      </div>}
    </section>
  );
}
