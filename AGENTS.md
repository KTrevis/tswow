# Instructions du projet

Ce fichier est un index. Lire le guide pertinent avant de modifier le code.

## Règles critiques

- Ne jamais exécuter `build data` dans le container TSWoW, y compris avec `--readonly` ou `--read-only`.
- Pour inspecter une entité TSWoW existante, utiliser le MCP dédié `tswow_inspector` : découvrir le registre avec `list_entity_types`, puis appeler `objectify_entity` avec le type, l'ID et si possible un chemin ciblé comme `Effects`.
- Le MCP est strictement en lecture seule et ne lance ni datascript ni `build data`.
- Si une vérification nécessite réellement `build data`, demander à l’utilisateur de l’exécuter.

## Exécution des commandes

- Exécuter les commandes TSWoW et les outils fournis par son environnement Node depuis le service Docker `tswow`, jamais directement depuis l’hôte.
- Utiliser `docker compose exec tswow <commande>` ou `docker exec tswow <commande>`, avec le répertoire de travail approprié sous `/var/lib/tswow`.
- Les outils généraux du dépôt (`git`, `rg`, lecture et modification de fichiers) peuvent être exécutés depuis l’hôte.

## Guides à consulter

- Pour écrire ou modifier un datascript, lire [docs/agents/datascripts-style.md](docs/agents/datascripts-style.md).
- Pour créer ou modifier un spell, choisir un spell parent, inspecter ses effets ou écrire un tooltip dynamique, lire [docs/agents/spells.md](docs/agents/spells.md).
