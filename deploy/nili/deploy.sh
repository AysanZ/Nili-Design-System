#!/usr/bin/env bash
set -Eeuo pipefail

# Invoked by GitHub Actions with the compose file from the same commit.
: "${DEPLOY_IMAGE:?Missing DEPLOY_IMAGE}"
: "${DEPLOY_TAG:?Missing DEPLOY_TAG}"
: "${DEPLOY_REVISION:?Missing DEPLOY_REVISION}"
: "${GHCR_USER:?Missing GHCR_USER}"
: "${GHCR_TOKEN:?Missing GHCR_TOKEN}"
compose_source=${1:?Expected the release compose file}

cd "${NILI_DEPLOY_DIR:-/opt/nili}"
test -f .env
test -f docker-compose.prod.yml
test -f "$compose_source"

image_ref="$DEPLOY_IMAGE:$DEPLOY_TAG"
auth_dir=$(mktemp -d /tmp/nili-registry-auth.XXXXXX)
backup_dir=''
deployment_started=0

finish() {
  result=$?
  trap - EXIT
  set +e
  if [ "$result" -ne 0 ] && [ "$deployment_started" -eq 1 ]; then
    echo 'Deployment failed; restoring the previous Nili release.' >&2
    cp -p "$backup_dir/.env" .env
    cp -p "$backup_dir/docker-compose.prod.yml" docker-compose.prod.yml
    if ! docker compose --env-file .env -f docker-compose.prod.yml up -d --no-deps --pull never --wait --wait-timeout 90 web; then
      echo 'Automatic rollback failed; check the retained rollback configuration.' >&2
    fi
  fi
  rm -rf "$auth_dir"
  exit "$result"
}
trap finish EXIT

# Keep the short-lived Actions token separate from other projects' Docker auth.
export DOCKER_CONFIG="$auth_dir"
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
unset GHCR_TOKEN
docker pull "$image_ref"
revision=$(docker image inspect "$image_ref" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')
if [ "$revision" != "$DEPLOY_REVISION" ]; then
  echo 'The downloaded image does not match the requested commit.' >&2
  exit 1
fi

backup_dir=$(mktemp -d "$PWD/rollback.XXXXXX")
cp -p .env "$backup_dir/.env"
cp -p docker-compose.prod.yml "$backup_dir/docker-compose.prod.yml"
deployment_started=1
install -m 644 "$compose_source" docker-compose.prod.yml
python3 - <<'PY'
import os
from pathlib import Path

path = Path('.env')
updates = {'IMAGE': os.environ['DEPLOY_IMAGE'], 'TAG': os.environ['DEPLOY_TAG']}
lines = []
for line in path.read_text().splitlines():
    key = line.partition('=')[0]
    if key in updates:
        line = f'{key}={updates.pop(key)}'
    lines.append(line)
lines.extend(f'{key}={value}' for key, value in updates.items())
path.write_text('\n'.join(lines) + '\n')
PY

docker compose --env-file .env -f docker-compose.prod.yml config --quiet
docker compose --env-file .env -f docker-compose.prod.yml up -d --no-deps --pull never --wait --wait-timeout 90 web
docker exec -i nili-web-1 node <<'JS'
(async () => {
  for (const locale of ['en', 'fa', 'ar', 'tr']) {
    const response = await fetch(`http://127.0.0.1:3000/${locale}`, {
      signal: AbortSignal.timeout(5000),
    });
    await response.arrayBuffer();
    if (response.status !== 200) throw new Error(`${locale}: HTTP ${response.status}`);
    console.log(`${locale}: HTTP 200`);
  }
})().catch(error => { console.error(error.message); process.exit(1); });
JS
deployment_started=0
echo "Deployed $image_ref"
echo "Rollback configuration retained in $backup_dir"
