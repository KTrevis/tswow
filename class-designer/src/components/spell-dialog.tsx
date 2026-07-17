import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PrototypeSpell, SpellDraft } from '../lib/model';
import { MAX_LEVEL, MAX_TALENT_RANKS } from '../lib/model';
import { useDesignerStore } from '../store/designer-store';
import { IconPicker } from './icon-picker';
import { SpellIcon } from './spell-icon';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const emptyDraft: SpellDraft = { name: '', icon: '', tooltip: '', notes: '', level: 1, maxRanks: 1 };

export function SpellDialog({ open, spell, onOpenChange, onMessage }: {
  open: boolean;
  spell?: PrototypeSpell;
  onOpenChange: (open: boolean) => void;
  onMessage: (message: string, error?: boolean) => void;
}) {
  const [draft, setDraft] = useState<SpellDraft>(emptyDraft);
  const [search, setSearch] = useState('');
  const createSpell = useDesignerStore(state => state.createSpell);
  const updateSpell = useDesignerStore(state => state.updateSpell);
  const deleteSpell = useDesignerStore(state => state.deleteSpell);

  useEffect(() => {
    if (!open) return;
    setDraft(spell ? {
      name: spell.name,
      icon: spell.icon,
      tooltip: spell.tooltip,
      notes: spell.notes,
      level: spell.level,
      maxRanks: spell.maxRanks,
    } : emptyDraft);
    setSearch('');
  }, [open, spell]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return onMessage('Le nom du sort est obligatoire.', true);
    if (!draft.icon) return onMessage('Choisis une icône pour ce sort.', true);
    const normalized = { ...draft, name: draft.name.trim() };
    if (spell) {
      const result = updateSpell(spell.id, normalized);
      if (!result.ok) return onMessage(result.error, true);
      onMessage('Sort mis à jour.');
    } else {
      createSpell(normalized);
      onMessage('Sort créé dans la réserve.');
    }
    onOpenChange(false);
  }

  function submitFromShortcut(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Enter' || (!event.ctrlKey && !event.metaKey)) return;
    event.preventDefault();
    event.currentTarget.requestSubmit();
  }

  function remove() {
    if (!spell || !window.confirm(`Supprimer définitivement « ${spell.name} » ?`)) return;
    deleteSpell(spell.id);
    onMessage('Sort supprimé.');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="spell-dialog">
        <form onSubmit={submit} onKeyDown={submitFromShortcut}>
          <DialogHeader>
            <DialogTitle>{spell ? 'Modifier le sort' : 'Créer un faux sort'}</DialogTitle>
            <DialogDescription>Ces informations servent uniquement au prototype de classe.</DialogDescription>
          </DialogHeader>
          <div className="spell-form-layout">
            <div className="spell-fields">
              <label>Nom<Input autoFocus value={draft.name} maxLength={100} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} /></label>
              <label>Tooltip<Textarea rows={7} value={draft.tooltip} maxLength={4000} onChange={event => setDraft(current => ({ ...current, tooltip: event.target.value }))} /></label>
              <label>Notes de design<Textarea rows={4} value={draft.notes} maxLength={8000} onChange={event => setDraft(current => ({ ...current, notes: event.target.value }))} /></label>
              <label>Niveau d’apprentissage<Input type="number" min={1} max={MAX_LEVEL} value={draft.level} onChange={event => setDraft(current => ({ ...current, level: Math.max(1, Math.min(MAX_LEVEL, Number(event.target.value))) }))} /></label>
              <label>Rangs maximum<Input type="number" min={1} max={MAX_TALENT_RANKS} value={draft.maxRanks} onChange={event => setDraft(current => ({ ...current, maxRanks: Math.max(1, Math.min(MAX_TALENT_RANKS, Number(event.target.value))) }))} /></label>
              <div className="selected-icon"><SpellIcon icon={draft.icon} /><span>{draft.icon || 'Aucune icône sélectionnée'}</span></div>
            </div>
            <IconPicker value={draft.icon} onChange={icon => setDraft(current => ({ ...current, icon }))} search={search} onSearchChange={setSearch} />
          </div>
          <DialogFooter>
            {spell && <Button type="button" variant="destructive" onClick={remove}><Trash2 size={15} /> Supprimer</Button>}
            <span className="dialog-spacer" />
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" aria-keyshortcuts="Control+Enter Meta+Enter" title="Ctrl+Entrée">
              {spell ? 'Enregistrer' : 'Créer le sort'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
