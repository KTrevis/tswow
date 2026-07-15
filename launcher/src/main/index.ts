import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { LauncherSettings } from '../shared/types';
import { launchWow, updateClient } from './patch-engine';

let mainWindow: BrowserWindow | undefined;

function settingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

async function readSettings(): Promise<LauncherSettings> {
  try {
    const value = JSON.parse(await fs.readFile(settingsPath(), 'utf8')) as Partial<LauncherSettings>;
    return { server: value.server || '', clientDirectory: value.clientDirectory || '' };
  } catch {
    return { server: '', clientDirectory: '' };
  }
}

async function saveSettings(settings: LauncherSettings): Promise<void> {
  await fs.mkdir(path.dirname(settingsPath()), { recursive: true });
  await fs.writeFile(settingsPath(), JSON.stringify(settings, null, 2), 'utf8');
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 760,
    height: 600,
    minWidth: 680,
    minHeight: 540,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#071018',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  mainWindow.once('ready-to-show', () => mainWindow?.show());
  if (process.env.ELECTRON_RENDERER_URL) mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  else mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('launcher:get-settings', readSettings);
  ipcMain.handle('launcher:select-client', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, { properties: ['openDirectory'], title: 'Sélectionner le dossier WoW 3.3.5a' });
    return result.canceled ? undefined : result.filePaths[0];
  });
  ipcMain.handle('launcher:update-and-play', async (event, settings: LauncherSettings) => {
    await saveSettings(settings);
    await updateClient(settings, progress => event.sender.send('launcher:progress', progress));
    event.sender.send('launcher:progress', { phase: 'launching', message: 'Lancement de WoW…', completed: 1, total: 1 });
    launchWow(settings.clientDirectory);
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
