import { useDroppable } from '@dnd-kit/core';
import { BookOpen } from 'lucide-react';
import type { ClassPrototype, PrototypeSpell } from '../lib/model';
import { sortedBaselineSpells } from '../lib/rules';
import { SpellCard } from './spell-card';

export function BaselinePanel({ prototype, onEditSpell, onDuplicateSpell, onDeleteSpell }: {
  prototype: ClassPrototype;
  onEditSpell: (id: string) => void;
  onDuplicateSpell: (id: string) => void;
  onDeleteSpell: (spell: PrototypeSpell) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: 'baseline' });
  const spells = sortedBaselineSpells(prototype.spells);
  let previousLevel: number | undefined;

  return (
    <section ref={setNodeRef} className={`baseline-panel ${isOver ? 'drop-over' : ''}`}>
      <header className="panel-heading"><span className="panel-icon"><BookOpen size={17} /></span><div><h2>Sorts baseline</h2><p>Dépose ici les sorts appris naturellement.</p></div></header>
      <div className="baseline-list">
        {spells.length === 0 && <div className="empty-state">Aucun sort baseline</div>}
        {spells.map(spell => {
          const showLevel = spell.level !== previousLevel;
          previousLevel = spell.level;
          return <div key={spell.id}>{showLevel && <div className="level-divider"><span>Niveau {spell.level}</span></div>}<SpellCard spell={spell} onEdit={onEditSpell} onDuplicate={onDuplicateSpell} onDelete={onDeleteSpell} /></div>;
        })}
      </div>
    </section>
  );
}
