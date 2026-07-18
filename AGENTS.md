# Instructions du projet

Ce fichier est un index. Lire le guide pertinent avant de modifier le code.

## Règles critiques

- Ne jamais exécuter `build data` dans le container TSWoW, sauf dans le cas en lecture seule autorisé ci-dessous.
- `build data --readonly` est autorisé uniquement pour afficher avec `objectify` les effets d’une entité existante utilisée comme exemple ou modèle.
- Ne jamais utiliser `build data --read-only` : cette option n’est pas reconnue par cette version de TSWoW et n’active pas le mode lecture seule.
- Si une autre vérification nécessite `build data`, demander à l’utilisateur de l’exécuter.

## Guides à consulter

- Pour écrire ou modifier un datascript, lire [docs/agents/datascripts-style.md](docs/agents/datascripts-style.md).
- Pour créer ou modifier un spell, choisir un spell parent, inspecter ses effets ou écrire un tooltip dynamique, lire [docs/agents/spells.md](docs/agents/spells.md).
