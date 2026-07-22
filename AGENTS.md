# Instructions du projet

Ce fichier est un index. Lire le guide pertinent avant de modifier le code.

## Règles critiques

- Pour afficher les données d’une entité TSWoW, appeler la méthode `objectify` directement sur l’entité à journaliser dans un datascript.
- S’attacher au terminal TSWoW déjà lancé avec `docker attach tswow` : ne pas tenter d’exécuter `build` depuis un shell obtenu avec `docker exec`, car `build` est une commande du terminal interactif TSWoW et non une commande du shell du container.
- Une fois à l’invite TSWoW affichée par `docker attach tswow`, exécuter directement `build data --readonly` pour lancer le datascript et consulter les données de l’entité.
- Après l’exécution, se détacher avec la séquence Docker `Ctrl-P`, puis `Ctrl-Q`, afin de ne pas arrêter le container.
- Ne jamais exécuter `build data` sans `--readonly` pour cette inspection.
- Ne jamais utiliser `build data --read-only` : cette option n’est pas reconnue par cette version de TSWoW et n’active pas le mode lecture seule.
- Les unités de puissance dépendent de la ressource. La rage et la puissance runique sont stockées en dixièmes dans le core : `1000` unités internes correspondent à `100` points en jeu. Pour leurs coûts et leurs effets tels que `ENERGIZE` ou `PERIODIC_ENERGIZE`, multiplier les points voulus par `10` (`20` dans les données produit `2` points en jeu). Dans les tooltips, les placeholders qui affichent ces valeurs internes doivent effectuer la conversion inverse, par exemple `$/10;S2` plutôt que `$s2` pour l’effet 2. La mana, l’énergie et la focalisation utilisent directement leurs points en jeu et ne doivent pas recevoir ce facteur. Les runes passent par `SpellRuneCost`, tandis que le bonheur des familiers utilise une échelle interne spécifique.
- Le type de ressource principal affiché par une classe n'empêche pas ses sorts d'utiliser également de la mana. Le jeu prévoit cette coexistence notamment pour le druide : une classe peut donc afficher ou employer une ressource telle que la rage, l'énergie ou la puissance runique tout en conservant une réserve de mana et des sorts qui la dépensent.
- Pour une valeur d'effet fixe affichée par un placeholder tel que `$s1`, conserver `EffectDieSides` à `1`, valeur établie par `effect.clear()`, et appeler `effect.PointsBase.set(valeurVoulue)`. Ce setter encode automatiquement la valeur brute comme `valeurVoulue - 1`, tandis que le core et le client ajoutent le point fixe produit par `DieSides = 1`. Ne pas forcer `PointsDieSides` à `0` : le client 3.3.5 calcule alors une plage inversée, par exemple une base brute de `5` devient « 6 to 5% » dans le tooltip. Si l'API typée `PercentBase` est utilisée directement avec `DieSides = 1`, lui fournir explicitement `valeurVoulue - 1`.

## Guides à consulter

- Pour écrire ou modifier un datascript, lire [docs/agents/datascripts-style.md](docs/agents/datascripts-style.md).
- Pour créer ou modifier un spell, choisir un spell parent, inspecter ses effets ou écrire un tooltip dynamique, lire [docs/agents/spells.md](docs/agents/spells.md).
