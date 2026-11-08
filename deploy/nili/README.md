# Deploying nili.aysanz.dev

The website runs as `nili-web-1` in `/opt/nili` on the server. Caddy routes
`nili.aysanz.dev` to port 3000 over the existing `edge` Docker network.

## Automatic deployment

`.github/workflows/deploy-nili.yml` runs for relevant changes on `main` and
can also be started from GitHub Actions with **Run workflow**.

1. Test deployment failure and rollback behavior.
2. Build `apps/www/Dockerfile` from the repository root.
3. Publish `ghcr.io/aysanz/nili-design-system` with the commit's first 12
   characters and `latest` as tags. Image labels record the source repository
   and full commit SHA.
4. Connect to the server and download `deploy.sh` and the Compose file from
   that exact commit.
5. Pull and verify the image, back up the current configuration, then update
   only the `web` service. Wait for container health and check all four locales.
6. Verify the public website before marking the `production` deployment successful.

The package is created by this repository's `GITHUB_TOKEN`, so the workflow
inherits package access. This replaces the older `nili-www` package, which
rejected this repository's workflow token. No personal access token or public
package visibility is required. Registry credentials are stored in a temporary
Docker configuration and removed after deployment.

## GitHub environment

Set these secrets under **Settings → Environments → production**:

| Secret     | Value                               |
| ---------- | ----------------------------------- |
| `SSH_HOST` | Server hostname or IP               |
| `SSH_USER` | Deployment user, with Docker access |
| `SSH_KEY`  | Private SSH key for that user       |
| `SSH_PORT` | SSH port, normally `22`             |

The environment's deployment URL is `https://nili.aysanz.dev`.

## Server prerequisites

The server needs Bash, curl, Python 3, Docker, and Docker Compose with `--wait`
support. `/opt/nili/.env` and `/opt/nili/docker-compose.prod.yml` must exist and
be writable by the deployment user. Use the files in this directory for a new
installation; preserve existing environment settings on a running installation.

`IMAGE` selects the image repository and `TAG` selects the release. The deploy
script updates both and synchronizes the Compose file on every release.
It preserves other environment values.

The existing Caddy route remains:

```caddyfile
nili.aysanz.dev {
    reverse_proxy nili-web-1:3000
}
```

Only Caddy publishes ports. The website keeps its 256 MB memory limit.

## Rollback

If deployment or locale checks fail, the script restores the previous `.env`
and Compose file and starts the previous image. Images are retained locally;
the workflow does not prune images belonging to other services.

Each successful deployment prints its backup directory under
`/opt/nili/rollback.*`. To restore one manually, use that exact directory:

```bash
cd /opt/nili
cp -p rollback.XXXXXX/.env .env
cp -p rollback.XXXXXX/docker-compose.prod.yml docker-compose.prod.yml
docker compose --env-file .env -f docker-compose.prod.yml up -d --no-deps --pull never --wait web
```

## Local checks

```bash
bash -n deploy/nili/deploy.sh
python3 -B -m unittest discover -s deploy/nili -p 'test_*.py'
docker compose --env-file deploy/nili/.env.example -f deploy/nili/docker-compose.prod.yml config --quiet
```
