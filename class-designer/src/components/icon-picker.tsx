import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { useDeferredValue, useEffect, useMemo, useRef } from 'react';
import { useIconManifest } from '../hooks/use-icon-manifest';
import { cn } from '../lib/utils';
import { Input } from './ui/input';
import { SpellIcon } from './spell-icon';

const COLUMN_COUNT = 8;

function searchableName(filename: string) {
  return filename.replace(/\.[^.]+$/, '').replaceAll('_', ' ').toLocaleLowerCase('fr');
}

export function IconPicker({ value, onChange, search, onSearchChange }: {
  value: string;
  onChange: (icon: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}) {
  const { manifest, error } = useIconManifest(true);
  const deferredSearch = useDeferredValue(search.trim().replaceAll('_', ' ').replaceAll('-', ' ').toLocaleLowerCase('fr'));
  const scrollRef = useRef<HTMLDivElement>(null);
  const icons = useMemo(() => {
    if (!manifest) return [];
    if (!deferredSearch) return manifest.icons;
    return manifest.icons.filter(icon => searchableName(icon).includes(deferredSearch));
  }, [deferredSearch, manifest]);
  const rowCount = Math.ceil(icons.length / COLUMN_COUNT);
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 58,
    initialRect: { width: 460, height: 440 },
    overscan: 3,
  });
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    virtualizer.scrollToOffset(0, { align: 'start' });
    virtualizer.measure();
  }, [rowCount, virtualizer]);
  const measuredRows = virtualizer.getVirtualItems();
  const visibleRows = measuredRows.length > 0
    ? measuredRows
    : rowCount > 0
      ? [{ key: 'initial', index: 0, start: 0 }]
      : [];

  return (
    <div className="icon-picker">
      <div className="icon-search"><Search size={15} /><Input value={search} onChange={event => onSearchChange(event.target.value)} placeholder="Rechercher une icône…" /></div>
      <div className="icon-picker-meta">
        {manifest ? `${icons.length.toLocaleString('fr-FR')} icône${icons.length > 1 ? 's' : ''}` : 'Chargement…'}
      </div>
      {error ? <div className="inline-error">{error}</div> : (
        <div ref={scrollRef} className="icon-scroll" data-testid="icon-scroll">
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {visibleRows.map(row => (
              <div
                key={row.key}
                className="icon-row"
                style={{ transform: `translateY(${row.start}px)` }}
              >
                {Array.from({ length: COLUMN_COUNT }, (_, column) => icons[row.index * COLUMN_COUNT + column]).map((icon, index) => icon ? (
                  <button
                    key={icon}
                    type="button"
                    title={icon}
                    aria-label={`Choisir ${icon}`}
                    className={cn('icon-choice', value === icon && 'selected')}
                    onClick={() => onChange(icon)}
                  >
                    <SpellIcon icon={icon} />
                  </button>
                ) : <span key={`empty-${index}`} />)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
