# Class Forge

Éditeur local de prototypes de classes WotLK. Les faux sorts ne créent aucune donnée TSWoW : ils sont sauvegardés dans le navigateur et peuvent être importés/exportés en JSON.

## Démarrer

```bash
pnpm install
pnpm dev
```

## Icônes

Les icônes sont servies depuis `public/spell-icons/files` et indexées dans un manifeste. Pour resynchroniser la bibliothèque :

```bash
pnpm icons:sync /chemin/vers/ICONS
```

Sans argument, la commande utilise `/tmp/wow-ui-textures/ICONS`.

## Vérifications

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```
