import { useEffect, useMemo, useState } from 'react';
import type { LauncherProgress, LauncherSettings } from '../../shared/types';

const initialProgress: LauncherProgress = { phase: 'connecting', message: 'Prêt à mettre le client à jour.', completed: 0, total: 1 };

export function App() {
  const [settings, setSettings] = useState<LauncherSettings>({ server: '', clientDirectory: '' });
  const [progress, setProgress] = useState(initialProgress);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.launcher.getSettings().then(setSettings);
    return window.launcher.onProgress(setProgress);
  }, []);

  const percentage = useMemo(() => {
    if (!busy && progress.phase !== 'complete') return 0;
    return progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  }, [busy, progress]);

  async function browse() {
    const clientDirectory = await window.launcher.selectClientDirectory();
    if (clientDirectory) setSettings(current => ({ ...current, clientDirectory }));
  }

  async function updateAndPlay() {
    setBusy(true);
    setError('');
    setProgress({ phase: 'connecting', message: 'Connexion…', completed: 0, total: 1 });
    try {
      await window.launcher.updateAndPlay(settings);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header>
        <div className="eyebrow">TSWoW · 3.3.5a</div>
        <h1>Nikev Launcher</h1>
        <p>Synchronise ton client avec le serveur local, configure le royaume et entre en jeu.</p>
      </header>

      <section className="panel">
        <label htmlFor="server">Serveur</label>
        <input
          id="server"
          value={settings.server}
          disabled={busy}
          placeholder="192.168.1.42"
          onChange={event => setSettings(current => ({ ...current, server: event.target.value }))}
        />
        <span className="hint">Port de patch par défaut : 3726</span>

        <label htmlFor="client">Dossier du client WoW</label>
        <div className="path-row">
          <input id="client" value={settings.clientDirectory} readOnly placeholder="C:\\Games\\World of Warcraft 3.3.5a" />
          <button className="secondary" type="button" disabled={busy} onClick={browse}>Parcourir</button>
        </div>
      </section>

      <section className="status" aria-live="polite">
        <div className="status-line">
          <span>{progress.message}</span>
          <strong>{percentage}%</strong>
        </div>
        <div className="progress-track"><div className="progress-value" style={{ width: `${percentage}%` }} /></div>
        {error && <div className="error">{error}</div>}
      </section>

      <button className="primary" type="button" disabled={busy} onClick={updateAndPlay}>
        {busy ? 'Mise à jour en cours…' : 'Mettre à jour et jouer'}
      </button>
    </main>
  );
}
