# Instructions du projet

Ce fichier est un index. Lire le guide pertinent avant de modifier le code.

## Règles critiques

- Pour afficher les données d’une entité TSWoW, appeler la méthode `objectify` directement sur l’entité à journaliser dans un datascript.
- S’attacher au terminal TSWoW déjà lancé avec `docker attach tswow` : ne pas tenter d’exécuter `build` depuis un shell obtenu avec `docker exec`, car `build` est une commande du terminal interactif TSWoW et non une commande du shell du container.
- Une fois à l’invite TSWoW affichée par `docker attach tswow`, exécuter directement `build data --readonly` pour lancer le datascript et consulter les données de l’entité.
- Après l’exécution, se détacher avec la séquence Docker `Ctrl-P`, puis `Ctrl-Q`, afin de ne pas arrêter le container.
- Ne jamais exécuter `build data` sans `--readonly` pour cette inspection.
- Ne jamais utiliser `build data --read-only` : cette option n’est pas reconnue par cette version de TSWoW et n’active pas le mode lecture seule.
- Les unités de puissance dépendent de la ressource. La rage et la puissance runique sont stockées en dixièmes dans le core : `1000` unités internes correspondent à `100` points en jeu. Pour leurs coûts et leurs effets tels que `ENERGIZE` ou `PERIODIC_ENERGIZE`, multiplier les points voulus par `10` (`20` dans les données produit `2` points en jeu). La mana, l’énergie et la focalisation utilisent directement leurs points en jeu et ne doivent pas recevoir ce facteur. Les runes passent par `SpellRuneCost`, tandis que le bonheur des familiers utilise une échelle interne spécifique.

## Guides à consulter

- Pour écrire ou modifier un datascript, lire [docs/agents/datascripts-style.md](docs/agents/datascripts-style.md).
- Pour créer ou modifier un spell, choisir un spell parent, inspecter ses effets ou écrire un tooltip dynamique, lire [docs/agents/spells.md](docs/agents/spells.md).
