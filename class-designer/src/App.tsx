import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppHeader } from './components/app-header';
import { BaselinePanel } from './components/baseline-panel';
import { ReservePanel } from './components/reserve-panel';
import { SpellCard } from './components/spell-card';
import { SpellDialog } from './components/spell-dialog';
import { matchesSpellName, SpellSearchBar, SpellSearchProvider } from './components/spell-search';
import { TalentTreePanel } from './components/talent-tree';
import type { PrototypeSpell, SpellPlacement } from './lib/model';
import { useActivePrototype, useDesignerStore } from './store/designer-store';
import { TooltipProvider } from './components/ui/tooltip';

type Message = { text: string; error?: boolean };

function parseCellDestination(id: string): SpellPlacement | undefined {
  if (!id.startsWith('cell:')) return undefined;
  const [, treeId, row, column] = id.split(':');
  return { kind: 'talent', treeId, row: Number(row), column: Number(column) };
}

export function App() {
  const prototype = useActivePrototype();
  const moveSpell = useDesignerStore(state => state.moveSpell);
  const duplicateSpell = useDesignerStore(state => state.duplicateSpell);
  const deleteSpell = useDesignerStore(state => state.deleteSpell);
  const [spellDialogOpen, setSpellDialogOpen] = useState(false);
  const [editedSpellId, setEditedSpellId] = useState<string>();
  const [activeSpellId, setActiveSpellId] = useState<string>();
  const [message, setMessage] = useState<Message>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [spellSearch, setSpellSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const activeSpell = prototype.spells.find(spell => spell.id === activeSpellId);
  const editedSpell = prototype.spells.find(spell => spell.id === editedSpellId);
  const searchResultCount = prototype.spells.filter(spell => matchesSpellName(spell.name, spellSearch)).length;

  const showMessage = useCallback((text: string, error = false) => setMessage({ text, error }), []);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(undefined), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  const focusSearch = useCallback(() => {
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSpellSearch('');
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isFindShortcut = (event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'f';
      if (isFindShortcut) {
        if (document.querySelector('[role="dialog"]')) return;
        event.preventDefault();
        setSearchOpen(true);
        focusSearch();
        return;
      }
      if (event.key === 'Escape' && searchOpen && !document.querySelector('[role="dialog"]')) {
        event.preventDefault();
        closeSearch();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeSearch, focusSearch, searchOpen]);

  function openCreateSpell() {
    setEditedSpellId(undefined);
    setSpellDialogOpen(true);
  }

  function openEditSpell(spellId: string) {
    setEditedSpellId(spellId);
    setSpellDialogOpen(true);
  }

  function requestDeleteSpell(spell: PrototypeSpell) {
    if (!window.confirm(`Supprimer définitivement « ${spell.name} » ?`)) return;
    if (editedSpellId === spell.id) {
      setSpellDialogOpen(false);
      setEditedSpellId(undefined);
    }
    deleteSpell(spell.id);
    showMessage('Sort supprimé.');
  }

  function duplicateSpellToReserve(spellId: string) {
    const duplicateId = duplicateSpell(spellId);
    showMessage(duplicateId ? 'Sort dupliqué dans la réserve.' : 'Sort introuvable.', !duplicateId);
  }

  function onDragStart(event: DragStartEvent) {
    setActiveSpellId(String(event.active.data.current?.spellId ?? '').replace('spell:', ''));
  }

  function onDragEnd(event: DragEndEvent) {
    const spellId = String(event.active.data.current?.spellId ?? '');
    setActiveSpellId(undefined);
    if (!spellId || !event.over) return;
    const target = String(event.over.id);
    const destination = target === 'baseline'
      ? { kind: 'baseline' } satisfies SpellPlacement
      : target === 'reserve'
        ? { kind: 'reserve' } satisfies SpellPlacement
        : parseCellDestination(target);
    if (!destination) return;
    const result = moveSpell(spellId, destination);
    showMessage(result.ok ? 'Sort déplacé.' : result.error, !result.ok);
  }

  if (!prototype) return null;

  return (
    <TooltipProvider delayDuration={250}>
      <SpellSearchProvider query={spellSearch}>
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveSpellId(undefined)}>
          <div className="app-shell">
            <AppHeader prototype={prototype} onCreateSpell={openCreateSpell} onMessage={showMessage} />
            {searchOpen && <SpellSearchBar query={spellSearch} resultCount={searchResultCount} inputRef={searchInputRef} onQueryChange={setSpellSearch} onClose={closeSearch} />}
            <main className="designer-scroll">
              <div className="designer-grid">
                {prototype.trees.map(tree => <TalentTreePanel key={tree.id} prototype={prototype} tree={tree} onEditSpell={openEditSpell} onDuplicateSpell={duplicateSpellToReserve} onDeleteSpell={requestDeleteSpell} onMessage={showMessage} />)}
                <BaselinePanel prototype={prototype} onEditSpell={openEditSpell} onDuplicateSpell={duplicateSpellToReserve} onDeleteSpell={requestDeleteSpell} />
              </div>
            </main>
            <ReservePanel prototype={prototype} onEditSpell={openEditSpell} onDuplicateSpell={duplicateSpellToReserve} onDeleteSpell={requestDeleteSpell} />
            {message && <div role="status" className={`toast ${message.error ? 'error' : ''}`}>{message.text}</div>}
          </div>
          <DragOverlay>{activeSpell && <SpellCard spell={activeSpell} overlay />}</DragOverlay>
          <SpellDialog open={spellDialogOpen} spell={editedSpell} onOpenChange={setSpellDialogOpen} onMessage={showMessage} />
        </DndContext>
      </SpellSearchProvider>
    </TooltipProvider>
  );
}

export { parseCellDestination };
