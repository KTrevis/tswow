#!/usr/bin/env bash
set -euo pipefail

install_dir="${TSWOW_INSTALL_DIR:-/opt/tswow/install}"
state_dir="${TSWOW_STATE_DIR:-/var/lib/tswow}"
config_dir="${state_dir}/config"

mkdir -p "${config_dir}" "${state_dir}/modules" "${state_dir}/coredata"

if [[ ! -f "${config_dir}/node.conf" ]]; then
  cp "${install_dir}/node.conf" "${config_dir}/node.conf"
fi

if [[ -d "${install_dir}/modules" && -z "$(find "${state_dir}/modules" -mindepth 1 -print -quit)" ]]; then
  cp -a "${install_dir}/modules/." "${state_dir}/modules/"
fi

if [[ -d "${install_dir}/coredata" && -z "$(find "${state_dir}/coredata" -mindepth 1 -print -quit)" ]]; then
  cp -a "${install_dir}/coredata/." "${state_dir}/coredata/"
fi

rm -rf "${install_dir}/modules" "${install_dir}/coredata" "${install_dir}/node.conf"
ln -s "${state_dir}/modules" "${install_dir}/modules"
ln -s "${state_dir}/coredata" "${install_dir}/coredata"
ln -s "${config_dir}/node.conf" "${install_dir}/node.conf"

node /usr/local/lib/tswow/configure-node-conf.js "${config_dir}/node.conf"

until mysqladmin ping \
  --host="${TSWOW_DB_HOST:-mysql}" \
  --port="${TSWOW_DB_PORT:-3306}" \
  --user="${TSWOW_DB_USER:-root}" \
  --password="${TSWOW_DB_PASSWORD}" \
  --silent; do
  echo "Waiting for MySQL..."
  sleep 2
done

exec "$@"
