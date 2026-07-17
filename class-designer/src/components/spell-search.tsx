import { Search, X } from 'lucide-react';
import { createContext, useContext, type ReactNode, type RefObject } from 'react';

const SpellSearchContext = createContext('');

export function normalizeSpellSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .trim();
}

export function matchesSpellName(name: string, query: string) {
  const normalizedQuery = normalizeSpellSearch(query);
  return normalizedQuery.length > 0 && normalizeSpellSearch(name).includes(normalizedQuery);
}

export function SpellSearchProvider({ query, children }: { query: string; children: ReactNode }) {
  return <SpellSearchContext.Provider value={query}>{children}</SpellSearchContext.Provider>;
}

export function useSpellSearchMatch(name: string) {
  return matchesSpellName(name, useContext(SpellSearchContext));
}

export function SpellSearchBar({ query, resultCount, inputRef, onQueryChange, onClose }: {
  query: string;
  resultCount: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="spell-search" role="search">
      <Search size={16} aria-hidden="true" />
      <input
        ref={inputRef}
        className="ui-input"
        type="search"
        aria-label="Rechercher un sort"
        placeholder="Nom du sort…"
        autoComplete="off"
        value={query}
        onChange={event => onQueryChange(event.target.value)}
      />
      <span className="spell-search-count" aria-live="polite">
        {resultCount} résultat{resultCount === 1 ? '' : 's'}
      </span>
      <button type="button" className="spell-search-close" aria-label="Fermer la recherche" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
