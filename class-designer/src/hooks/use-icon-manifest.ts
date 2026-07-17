import { useEffect, useState } from 'react';

export type IconManifest = { version: 1; count: number; icons: string[] };

let cachedManifest: IconManifest | undefined;

export function useIconManifest(enabled: boolean) {
  const [manifest, setManifest] = useState<IconManifest | undefined>(cachedManifest);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled || manifest) return;
    let cancelled = false;
    fetch('/spell-icons/manifest.json')
      .then(response => {
        if (!response.ok) throw new Error('Impossible de charger la bibliothèque d’icônes.');
        return response.json() as Promise<IconManifest>;
      })
      .then(value => {
        if (cancelled) return;
        cachedManifest = value;
        setManifest(value);
      })
      .catch(reason => !cancelled && setError(reason instanceof Error ? reason.message : String(reason)));
    return () => { cancelled = true; };
  }, [enabled, manifest]);

  return { manifest, error };
}
