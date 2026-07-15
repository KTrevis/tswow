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

## Building core changes

Push changes to `master`. The `Docker image` GitHub Actions workflow compiles
the complete fork and publishes these tags:

- `ghcr.io/ktrevis/tswow:latest`
- `ghcr.io/ktrevis/tswow:sha-<commit>`

Deploy the new image on the server with:

```bash
docker compose pull tswow
docker compose up -d tswow
```

No compiler or TSWoW source tree is needed outside the container.

## Local image build

The upstream build is resource-intensive. To build it locally anyway:

```bash
docker compose build tswow
```

On Apple Silicon this uses x86 emulation because the initial image target is
`linux/amd64`, so the GitHub Actions build is generally much faster.
