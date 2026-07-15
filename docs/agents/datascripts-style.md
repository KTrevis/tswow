# Style des datascripts

## API fluide

- Privilégier le method chaining autant que possible.
- Pour modifier ou créer/configurer une entité, préférer les variantes à callback prévues par l’API (`mod`, `addMod`, `modRef`, `modRefCopy`, etc.) plutôt que de récupérer l’objet avec `get`, `addGet`, `getRef` ou `getRefCopy`.
- `mod` modifie une entrée existante via une callback et conserve la chaîne.
- `addMod` sélectionne ou crée une entrée libre, la configure via une callback et conserve la chaîne.
- `modRef` modifie l’entité actuellement référencée.
- `modRefCopy` crée une copie de l’entité référencée, repointe la référence vers cette copie, puis la modifie.
- Réserver les méthodes `get*` à la lecture, ou aux cas où l’objet retourné doit réellement être conservé ou utilisé en dehors de la modification.

## Lisibilité

- Conserver une chaîne uniquement lorsqu’elle reste lisible.
- Éviter les variables intermédiaires qui ne servent qu’à transmettre une valeur à l’appel suivant.
- Ne pas sacrifier la gestion d’erreurs, le typage ou la lisibilité pour maintenir une chaîne.
