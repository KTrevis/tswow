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

Pour comprendre un spell existant, ajouter temporairement un log ciblé dans un datascript :

```ts
const example = std.Spells.load(133);

console.log(example.Effects.objectify());
```

Il est alors permis d’exécuter :

```text
build data --readonly
```

Cette exception sert uniquement à lire et afficher avec `objectify` les effets d’une entité utilisée comme exemple. Ne pas exécuter une autre variante de `build data`. Retirer le log temporaire une fois l’inspection terminée.

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

## Scaling automatique opt-in

Le scaling automatique est activé séparément sur chaque effet. Sans appel à
`Scaling.set()`, un spell conserve exactement son calcul 3.3.5.

```ts
spell.Effects.mod(0, effect => {
    effect.PointsBase.set(100, 'EFFECTIVE');
    effect.Scaling.set(); // profil UNIVERSAL
});
```

La valeur DBC effective de l'effet sert d'ancre au niveau
`max(SpellLevel, BaseLevel)`. `Scaling.set()` remet `PointsPerLevel` à zéro et
le core applique ensuite la courbe au niveau du lanceur. `Scaling.clear()`
désactive le profil, et `Scaling.get()` renvoie son ID ou `0`.

Un profil par paliers peut être créé pour un module. Le niveau 1 est
obligatoire, les valeurs doivent être finies et strictement positives, et la
dernière valeur déclarée est conservée jusqu'au point suivant :

```ts
const customScaling = std.SpellScalings
    .create('my-mod', 'my-scaling')
    .Points.set([
        [1, 1],
        [20, 12],
        [40, 35],
        [60, 70],
        [80, 120],
    ]);

spell.Effects.get(0).Scaling.set(customScaling.ID);
```

Le client 3.3.5 ne connaît pas ces courbes serveur : un placeholder comme
`$s1` continue d'afficher la valeur d'ancrage. Le résultat en combat est en
revanche calculé avec le profil sélectionné.

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

Les spells Blizzard peuvent combiner des références à d’autres spells, des expressions et des variables conditionnelles. Pour une formule complexe, commencer par rechercher et inspecter un spell existant utilisant un tooltip similaire.

## Limite du système

Le tooltip est dynamique par rapport aux données que le client sait lire : effets DBC, durée, période, rayon, niveau et certaines statistiques du personnage. Une valeur calculée arbitrairement dans un livescript ou uniquement côté serveur ne sera pas automatiquement reflétée dans le tooltip.

Sources utiles dans le dépôt :

- `tswow-scripts/wotlk/std/Spell/Spell.ts`
- `tswow-scripts/wotlk/std/Spell/SpellEffect.ts`
- `tswow-scripts/wotlk/std/Spell/SpellDescriptionVariable.ts`
- `tswow-scripts/wotlk/std/Spell/SpellDuration.ts`
