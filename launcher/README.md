# Nikev Launcher

Launcher Electron/React portable pour mettre à jour un client WoW 3.3.5a depuis le serveur HTTP TSWoW local.

## Générer les fichiers de patch

1. Construire et démarrer TSWoW :

   ```sh
   docker compose up -d --build
   ```

2. Ouvrir le terminal TSWoW et générer le package :

   ```sh
   docker attach tswow
   package client default.dataset
   ```

   Utiliser `Ctrl-P`, puis `Ctrl-Q` pour se détacher sans arrêter le conteneur. Les fichiers générés sont persistés dans `runtime/launcher-packages`.

3. Vérifier le serveur de patch :

   ```sh
   curl http://localhost:3726/health
   curl http://localhost:3726/api/v1/datasets/default.dataset/manifest
   ```

## Développer et distribuer le launcher

```sh
cd launcher
npm ci
npm test
npm run dev
npm run dist:win
```

L’archive portable Windows x64 est créée dans `launcher/dist`. Le joueur l’extrait, lance `Nikev Launcher.exe`, saisit l’adresse IP du Mac et sélectionne son dossier WoW.
