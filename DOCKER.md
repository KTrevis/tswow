# Running TSWoW with Docker

The published image contains TSWoW, TrinityCore, Node.js, Clang and CMake. The
host only needs Docker with the Compose plugin.

## Requirements

- A Linux `amd64` server with Docker and Docker Compose
- A legally obtained World of Warcraft 3.3.5a client
- At least 4 CPU cores, 8 GB RAM and enough disk space for the client, database
  and extracted server data

## First start

Clone the fork and create the local configuration:

```bash
git clone --recurse-submodules https://github.com/KTrevis/tswow.git
cd tswow
cp .env.example .env
```

Edit `.env` and set:

- `TSWOW_DB_PASSWORD` to a long random password
- `WOW_CLIENT_PATH` to the absolute path of the WoW 3.3.5a client on the host

Then pull and start the services:

```bash
docker compose pull
docker compose up -d
docker compose logs -f tswow
```

The first start initializes TSWoW's persistent configuration under `runtime/`.
The MySQL data is stored in the `tswow_mysql-data` Docker volume. TSWoW is
allowed to write generated patches into the mounted client.

The game ports are:

- `3724/tcp`: authentication
- `8085/tcp`: world server
- `7878/tcp`: SOAP

## TSWoW console

Run a one-off command:

```bash
docker compose exec tswow npm run start -- --help
```

Attach to the interactive process:

```bash
docker attach tswow-tswow-1
```

Detach without stopping it with `Ctrl-p`, then `Ctrl-q`.

## Modifying TSWoW itself

TSWoW's own source lives in the parent repository. Edit it normally, then
commit it from the repository root:

```bash
git switch master
git add <changed-files>
git commit -m "Describe the TSWoW change"
git push origin master
```

Rebuild the image to compile and package the new source revision:

```bash
docker build --platform linux/amd64 \
  --build-arg TSWOW_REVISION="$(git rev-parse HEAD)" \
  --build-arg TRINITYCORE_REVISION="$(git -C cores/TrinityCore rev-parse HEAD)" \
  --tag ghcr.io/ktrevis/tswow:local .
docker compose up -d --no-build --force-recreate tswow
```

Docker reuses cached layers when possible. A change to TSWoW source can still
invalidate the main build layer, so expect a real rebuild after source changes.
Running `docker compose up -d --no-build` at any other time never compiles.

## Modifying TrinityCore

The TrinityCore fork is the `cores/TrinityCore` Git submodule. Commit and push
core changes from inside that directory first, then commit the updated submodule
pointer in the parent TSWoW repository:

```bash
cd cores/TrinityCore
git switch ktrevis
git add .
git commit -m "Describe the core change"
git push origin ktrevis
cd ../..
git add cores/TrinityCore
git commit -m "chore: update TrinityCore"
git push
```

The parent commit does not duplicate the core source: it records the exact
TrinityCore commit that belongs to that TSWoW revision. This makes builds
reproducible. Never update the submodule to an arbitrary upstream commit without
checking that TSWoW is compatible with it.

After committing both repositories, run the same `docker build` and
`docker compose up` commands from the previous section. A core change recompiles
TrinityCore inside the image; the host and deployment server still need only
Docker.

## Deploying a prebuilt image

Push changes to `master`. The `Docker image` GitHub Actions workflow compiles
the complete fork and publishes these tags:

- `ghcr.io/ktrevis/tswow:latest`
- `ghcr.io/ktrevis/tswow:sha-<commit>`

Deploy the new image on the server with:

```bash
docker compose pull tswow
docker compose up -d --no-build tswow
```

No compiler or TSWoW source tree is needed outside the container.

## Local image build

The upstream build is resource-intensive. To build it locally anyway:

```bash
docker build --platform linux/amd64 \
  --build-arg TSWOW_REVISION="$(git rev-parse HEAD)" \
  --build-arg TRINITYCORE_REVISION="$(git -C cores/TrinityCore rev-parse HEAD)" \
  --tag ghcr.io/ktrevis/tswow:local .
```

On Apple Silicon this uses x86 emulation because the initial image target is
`linux/amd64`, so the GitHub Actions build is generally much faster.
