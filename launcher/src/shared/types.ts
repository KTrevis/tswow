export interface LauncherChunk {
  offset: number;
  size: number;
  sha256: string;
}

export interface LauncherFile {
  id: string;
  filename: string;
  destination: string;
  size: number;
  sha256: string;
  chunks: LauncherChunk[];
}

export interface LauncherManifest {
  schemaVersion: 1;
  dataset: string;
  generatedAt: string;
  chunkSize: number;
  files: LauncherFile[];
}

export interface LauncherSettings {
  server: string;
  clientDirectory: string;
}

export interface LauncherProgress {
  phase: 'connecting' | 'checking' | 'downloading' | 'configuring' | 'launching' | 'complete';
  message: string;
  file?: string;
  completed: number;
  total: number;
}

export interface LauncherApi {
  getSettings(): Promise<LauncherSettings>;
  selectClientDirectory(): Promise<string | undefined>;
  updateAndPlay(settings: LauncherSettings): Promise<void>;
  onProgress(listener: (progress: LauncherProgress) => void): () => void;
}
