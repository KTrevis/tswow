# Spells et tooltips dynamiques

Lire aussi [datascripts-style.md](datascripts-style.md) avant de modifier un datascript.

## Créer à partir d’un spell existant

- Pour créer un nouveau spell, utiliser autant que possible un spell Blizzard existant comme parent ou modèle.
- Choisir un parent dont le comportement est proche du résultat recherché, puis ne modifier que les propriétés nécessaires.
- Éviter de reconstruire entièrement un spell vide lorsque les effets, attributs, ciblages, durée ou visuels existent déjà sur un spell adapté.
- Avant de choisir ou modifier un parent, inspecter son comportement et ses effets au lieu de se baser uniquement sur son nom.

Exemple :

```ts
std.Spells
    .create('my-mod', 'custom-fireball', 133)
    .Name.frFR.set('Boule de feu améliorée')
    .Description.frFR.set(
        'Inflige $s1 points de dégâts de Feu, puis $o2 points supplémentaires en $d.'
    )
    .AuraDescription.frFR.set(
        'Inflige des dégâts de Feu toutes les $t2 secondes.'
    )
```

## Inspecter un spell de référence

Pour comprendre un spell existant, utiliser le MCP en lecture seule `tswow_inspector` :

1. Appeler `list_entity_types` pour vérifier le nom du registre, par exemple `Spells`.
2. Appeler `objectify_entity` avec le registre et l'ID du spell.
3. Utiliser autant que possible un chemin ciblé comme `Effects`, `Description`, `Duration` ou `Power`; augmenter `refDepth` uniquement lorsqu'une référence doit être développée.

Le MCP ne lance ni datascript ni `build data`. Ne pas ajouter de log temporaire dans un datascript pour cette inspection.

## Tooltips dynamiques

Le client WoW interprète nativement les placeholders présents dans `Description` et `AuraDescription`. TSWoW écrit ces textes et leurs variables dans `Spell.dbc` et `SpellDescriptionVariables.dbc`; il ne calcule pas lui-même le rendu final du tooltip.

Les numéros des placeholders commencent à 1, alors que les index de l’API TSWoW commencent à 0. Par exemple, `$s1` décrit l’effet manipulé avec `Effects.mod(0, ...)`.

Placeholders courants :

| Placeholder | Valeur |
| --- | --- |
| `$s1`, `$s2`, `$s3` | Valeur calculée des effets 1, 2 ou 3 |
| `$m1`, `$M1` | Valeur minimale ou maximale de l’effet 1 |
| `$d` | Durée du spell |
| `$t1` | Intervalle entre les ticks de l’effet 1 |
| `$o1` | Total produit par l’effet périodique 1 pendant toute sa durée |
| `$a1` | Rayon de l’effet 1 |
| `$x1` | Nombre de cibles ou d’enchaînements de l’effet 1 |
| `$12345s1` | Valeur de l’effet 1 du spell `12345` |
| `$12345d` | Durée du spell `12345` |
| `${expression}` | Résultat d’une expression, par exemple `${$m1*5}` |
| `$lpoint:points;` | Forme singulier/pluriel |
| `$<variable>` | Variable définie dans `SpellDescriptionVariables.dbc` |

## Formules personnalisées

Utiliser `DescriptionVariable.setSimple` pour définir des variables réutilisables dans le tooltip :

```ts
std.Spells
    .create('my-mod', 'custom-dot', 172)
    .DescriptionVariable.setSimple('$total=${$m1*5}')
    .Description.frFR.set(
        'Corrompt la cible et lui inflige $<total> points de dégâts en $d.'
    );
```

Pour définir plusieurs variables, séparer les affectations par `\r\n`, comme dans
les données Blizzard :

```ts
.DescriptionVariable.setSimple(
    "$damage=$s1\r\n$duration=$d"
)
```

### Référencer un spell créé par le datascript

Quand le tooltip décrit les effets d'un spell déclenché, construire la référence
croisée avec son ID généré. Par exemple, si `TRIGGER` porte les dégâts dans son
premier effet, `` `$${TRIGGER.ID}s1` `` produit le placeholder WoW
`$12345s1` attendu dans les DBC.

Dans un template literal TypeScript, une expression WoW `${...}` doit échapper
son premier `$` pour ne pas être interprétée par TypeScript :

```ts
.DescriptionVariable.setSimple(
    `$damage=$${TRIGGER.ID}s1\r\n$runicPower=\${$${TRIGGER.ID}s2/10}`
)
.Description.frFR.set(
    "Inflige $<damage> points de dégâts et génère $<runicPower> points de puissance runique."
)
```

Les valeurs internes de rage et de puissance runique sont exprimées en dixièmes
de point dans WoW/TrinityCore. Pour un effet `ENERGIZE` de puissance runique,
conserver la valeur interne dans l'effet et appliquer `/10` uniquement dans
l'expression du tooltip.

Les spells Blizzard peuvent combiner des références à d’autres spells, des expressions et des variables conditionnelles. Pour une formule complexe, commencer par rechercher et inspecter un spell existant utilisant un tooltip similaire.

## Limite du système

Le tooltip est dynamique par rapport aux données que le client sait lire : effets DBC, durée, période, rayon, niveau et certaines statistiques du personnage. Une valeur calculée arbitrairement dans un livescript ou uniquement côté serveur ne sera pas automatiquement reflétée dans le tooltip.

Sources utiles dans le dépôt :

- `tswow-scripts/wotlk/std/Spell/Spell.ts`
- `tswow-scripts/wotlk/std/Spell/SpellEffect.ts`
- `tswow-scripts/wotlk/std/Spell/SpellDescriptionVariable.ts`
- `tswow-scripts/wotlk/std/Spell/SpellDuration.ts`
