import type { PrototypeSpell } from '../lib/model';

function getSpellMeta(spell: PrototypeSpell) {
  if (spell.placement.kind === 'baseline') return `Niveau ${spell.level}`;
  if (spell.placement.kind === 'talent') return `${spell.maxRanks} rang${spell.maxRanks > 1 ? 's' : ''}`;
  return 'Non placé';
}

export function SpellTooltip({ spell }: { spell: PrototypeSpell }) {
  return (
    <div className="spell-tooltip">
      <div className="spell-tooltip-header">
        <strong>{spell.name}</strong>
        <span>{getSpellMeta(spell)}</span>
      </div>
      <p className={!spell.tooltip ? 'spell-tooltip-empty' : undefined}>
        {spell.tooltip || 'Aucune description.'}
      </p>
      {spell.notes && (
        <small>
          <span>Notes de conception</span>
          {spell.notes}
        </small>
      )}
    </div>
  );
}
