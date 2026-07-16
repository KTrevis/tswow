# TSWoW inspector MCP

Ce serveur MCP expose les données source DBC et SQL de TSWoW sans exécuter les
datascripts du projet et sans appeler `build data`.

Avant la première utilisation, construire l'image partagée par les services
`tswow` et `tswow-mcp` :

```sh
docker compose --profile tools build tswow-mcp
```

Codex démarre ensuite le serveur à partir de `.codex/config.toml` avec :

```sh
docker compose run --rm -T tswow-mcp
```

Le serveur fournit `list_entity_types` et `objectify_entity`. Les données sont
mises en cache pendant la durée du processus ; redémarrer le MCP pour les
recharger.
