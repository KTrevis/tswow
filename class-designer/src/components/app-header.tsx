import { Copy, Download, Plus, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { serializePrototype } from '../lib/export';
import type { ClassPrototype } from '../lib/model';
import { useDesignerStore } from '../store/designer-store';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function AppHeader({ prototype, onCreateSpell, onMessage }: {
  prototype: ClassPrototype;
  onCreateSpell: () => void;
  onMessage: (message: string, error?: boolean) => void;
}) {
  const prototypes = useDesignerStore(state => state.prototypes);
  const setActivePrototype = useDesignerStore(state => state.setActivePrototype);
  const createPrototype = useDesignerStore(state => state.createPrototype);
  const renamePrototype = useDesignerStore(state => state.renamePrototype);
  const duplicatePrototype = useDesignerStore(state => state.duplicatePrototype);
  const deletePrototype = useDesignerStore(state => state.deletePrototype);
  const importPrototype = useDesignerStore(state => state.importPrototype);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportCurrent() {
    const blob = new Blob([serializePrototype(prototype)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${prototype.name.toLocaleLowerCase('fr').replace(/[^a-z0-9]+/gi, '-') || 'prototype'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    onMessage('Prototype exporté.');
  }

  async function importFile(file?: File) {
    if (!file) return;
    const result = importPrototype(await file.text());
    onMessage(result.ok ? 'Prototype importé.' : result.error, !result.ok);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <header className="app-header">
      <div className="brand"><span className="brand-rune">CF</span><div><strong>Class Forge</strong><small>Prototype de classe · WotLK</small></div></div>
      <div className="prototype-controls">
        <select aria-label="Prototype actif" value={prototype.id} onChange={event => setActivePrototype(event.target.value)}>
          {prototypes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <Input aria-label="Nom du prototype" value={prototype.name} onChange={event => renamePrototype(event.target.value)} />
        <Button size="icon" variant="ghost" title="Nouveau prototype" aria-label="Nouveau prototype" onClick={() => createPrototype()}><Plus size={17} /></Button>
        <Button size="icon" variant="ghost" title="Dupliquer" aria-label="Dupliquer le prototype" onClick={() => { duplicatePrototype(); onMessage('Prototype dupliqué.'); }}><Copy size={16} /></Button>
        <Button size="icon" variant="ghost" title="Supprimer" aria-label="Supprimer le prototype" onClick={() => { if (window.confirm(`Supprimer « ${prototype.name} » ?`)) { deletePrototype(); onMessage('Prototype supprimé.'); } }}><Trash2 size={16} /></Button>
      </div>
      <div className="header-actions">
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={event => void importFile(event.target.files?.[0])} />
        <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}><Upload size={15} /> Importer</Button>
        <Button variant="ghost" size="sm" onClick={exportCurrent}><Download size={15} /> Exporter</Button>
        <Button size="sm" onClick={onCreateSpell}><Plus size={16} /> Nouveau sort</Button>
      </div>
    </header>
  );
}
