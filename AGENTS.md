# Instructions du projet

Ce fichier est un index. Lire le guide pertinent avant de modifier le code.

## Règles critiques

- Pour afficher les données d’une entité TSWoW, appeler la méthode `objectify` directement sur l’entité à journaliser dans un datascript.
- S’attacher ensuite au container `tswow`, se placer dans le répertoire approprié sous `/var/lib/tswow`, puis exécuter `build data --readonly` pour lancer le datascript et consulter les données de l’entité.
- Ne jamais exécuter `build data` sans `--readonly` pour cette inspection.
- Ne jamais utiliser `build data --read-only` : cette option n’est pas reconnue par cette version de TSWoW et n’active pas le mode lecture seule.

## Guides à consulter

- Pour écrire ou modifier un datascript, lire [docs/agents/datascripts-style.md](docs/agents/datascripts-style.md).
- Pour créer ou modifier un spell, choisir un spell parent, inspecter ses effets ou écrire un tooltip dynamique, lire [docs/agents/spells.md](docs/agents/spells.md).
