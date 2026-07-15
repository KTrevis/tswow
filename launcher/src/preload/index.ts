import { contextBridge, ipcRenderer } from 'electron';
import type { LauncherApi, LauncherProgress, LauncherSettings } from '../shared/types';

const api: LauncherApi = {
  getSettings: () => ipcRenderer.invoke('launcher:get-settings'),
  selectClientDirectory: () => ipcRenderer.invoke('launcher:select-client'),
  updateAndPlay: (settings: LauncherSettings) => ipcRenderer.invoke('launcher:update-and-play', settings),
  onProgress: (listener: (progress: LauncherProgress) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, progress: LauncherProgress) => listener(progress);
    ipcRenderer.on('launcher:progress', handler);
    return () => ipcRenderer.removeListener('launcher:progress', handler);
  },
};

contextBridge.exposeInMainWorld('launcher', api);
