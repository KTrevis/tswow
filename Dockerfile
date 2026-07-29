# syntax=docker/dockerfile:1.7

FROM node:18.12.1-bullseye-slim AS node

FROM ubuntu:22.04 AS toolchain

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Etc/UTC

COPY --from=node /usr/local/ /usr/local/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        clang \
        cmake \
        curl \
        git \
        libboost-all-dev \
        libbz2-dev \
        libmysqlclient-dev \
        libncurses-dev \
        libreadline-dev \
        libssl-dev \
        make \
        mysql-client \
        p7zip-full \
        pkg-config \
    && update-alternatives --install /usr/bin/cc cc /usr/bin/clang 100 \
    && update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++ 100 \
    && rm -rf /var/lib/apt/lists/*

FROM toolchain AS builder

ARG TSWOW_REVISION=docker-build
ARG TRINITYCORE_REVISION=docker-build

WORKDIR /opt/tswow/source
COPY . .

# Preserve native build objects when only scripts or auxiliary tools change.
RUN --mount=type=cache,id=tswow-build,target=/opt/tswow/tswow-build,sharing=locked \
    --mount=type=cache,id=tswow-npm,target=/root/.npm,sharing=locked \
    test -f cores/TrinityCore/CMakeLists.txt \
    && test -f misc/adt-creator/CMakeLists.txt \
    && rm -f cores/TrinityCore/.git misc/adt-creator/.git \
    && git init \
    && git config user.email docker@localhost \
    && git config user.name Docker \
    && printf '*\n' > .git/info/exclude \
    && git commit --allow-empty -m "Docker build ${TSWOW_REVISION}" \
    && git -C cores/TrinityCore init \
    && git -C cores/TrinityCore config user.email docker@localhost \
    && git -C cores/TrinityCore config user.name Docker \
    && printf '*\n' > cores/TrinityCore/.git/info/exclude \
    && git -C cores/TrinityCore commit --allow-empty -m "Docker build ${TRINITYCORE_REVISION}" \
    && npm ci \
    && npm run build noac \
    && printf '%s' "${TSWOW_REVISION}" > /opt/tswow/tswow-install/bin/revisions/tswow \
    && printf '%s' "${TRINITYCORE_REVISION}" > /opt/tswow/tswow-install/bin/revisions/trinitycore

FROM toolchain AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/tswow/tswow-install /opt/tswow/install
COPY docker/entrypoint.sh /usr/local/bin/tswow-entrypoint
COPY docker/configure-node-conf.js /usr/local/lib/tswow/configure-node-conf.js

RUN chmod +x /usr/local/bin/tswow-entrypoint \
    && mkdir -p /var/lib/tswow /client

ENV TSWOW_INSTALL_DIR=/opt/tswow/install \
    TSWOW_STATE_DIR=/var/lib/tswow \
    TSWOW_CLIENT_PATH=/client \
    TSWOW_DB_HOST=mysql \
    TSWOW_DB_PORT=3306 \
    TSWOW_DB_USER=root \
    LD_LIBRARY_PATH=/opt/tswow/install/bin/trinitycore/RelWithDebInfo:/opt/tswow/install/bin/libraries/RelWithDebInfo

WORKDIR /opt/tswow/install

EXPOSE 3724 8085 7878

VOLUME ["/var/lib/tswow", "/client"]

ENTRYPOINT ["tswow-entrypoint"]
CMD ["npm", "run", "start"]
