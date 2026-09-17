# Deploying nili.aysanz.dev

Follows the runbook's "Adding the next project → Containerised" recipe
exactly, filled in for this site. Read alongside `aysanz.dev — server runbook`
for the parts this doesn't repeat (what `/opt/edge` is, why Caddy owns 80/443
alone, the CDN-proxy-toggle trap, etc).

## What ships

`apps/www/Dockerfile` — three-stage build, **built from the repository root**,
producing `ghcr.io/aysanz/nili-www`. It has to be the root because `apps/www`
imports `@nili/ui` straight from `src/index.ts`, not from a published
package — the Dockerfile's own header comment says why, and `next.config.ts`'s
`outputFileTracingRoot` is the other half of that same fact.

```
deploy/nili/
  docker-compose.prod.yml   the service — mirrors /opt/alidade's shape
  .env.example              → becomes /opt/nili/.env on the box
  Caddyfile.snippet         the block to add to /opt/edge/Caddyfile

.github/workflows/deploy-nili.yml   builds, pushes, deploys on every push to
                                     main that touches apps/www, src/, or
                                     registry/
```

## One-time server setup

```bash
mkdir -p /opt/nili
```

Copy `deploy/nili/docker-compose.prod.yml` to `/opt/nili/docker-compose.prod.yml`
and `deploy/nili/.env.example` to `/opt/nili/.env` (fetch both with `curl`
from the repo, the same way `/opt/alidade`'s config arrived — see the
runbook's "Terminal paste mangling" note on why curl beats pasting a heredoc):

```bash
curl -fsSL -o /opt/nili/docker-compose.prod.yml \
  https://raw.githubusercontent.com/AysanZ/nili-ui/main/deploy/nili/docker-compose.prod.yml
curl -fsSL -o /opt/nili/.env \
  https://raw.githubusercontent.com/AysanZ/nili-ui/main/deploy/nili/.env.example
```

(Replace `nili-ui` above with whatever this repository is actually named on
GitHub — the runbook's own examples use `AysanZ/alidade`; this one wasn't
given.)

Make the GHCR package public the same way `alidade-api` and `alidade-web`
are, once the first push has created it — GitHub → your profile → Packages →
`nili-www` → Package settings → Change visibility.

Add the Caddy block from `deploy/nili/Caddyfile.snippet` to
`/opt/edge/Caddyfile`, then validate and reload:

```bash
cd /opt/edge
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
docker compose restart caddy
```

No DNS change: the wildcard `*` A record already covers `nili.aysanz.dev`.

## GitHub setup

Same four secrets the runbook's §1 describes for Alidade, added again for
**this** repository (secrets belong to a repo, not to the server) —
GitHub → this repo → Settings → Environments → New environment →
`production`:

| Secret     | Value                                          |
| ---------- | ----------------------------------------------- |
| `SSH_HOST` | `185.110.190.42`                                 |
| `SSH_USER` | `deploy`                                         |
| `SSH_KEY`  | the deploy key's private half, `BEGIN`/`END` included |
| `SSH_PORT` | `22`                                             |

If the Alidade deploy key from the runbook's §1 already exists on the laptop
(`~/.ssh/aysanz_deploy`), reuse it — one `deploy` user, one key, both repos'
`production` environments point at the same value. Only generate a new one if
that key doesn't exist yet:

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/aysanz_deploy -N ""
ssh-copy-id -i ~/.ssh/aysanz_deploy.pub deploy@185.110.190.42
```

## First deploy

Push to `main` with a change under `apps/www/`, `src/`, or `registry/`, or
trigger it by hand: Actions → "Deploy nili.aysanz.dev" → Run workflow.

The workflow builds the image, pushes `:latest` and `:<short-sha>`, then SSHes
in and runs the same three lines the runbook documents for a manual deploy —
write the tag into `.env`, `pull`, `up -d`.

## Operating it

Everything from here on is the runbook's own sections, unchanged, with
`/opt/alidade` → `/opt/nili` and the compose file name adjusted:

**Manual deploy**
```bash
cd /opt/nili
docker compose --env-file .env -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.prod.yml up -d
```

**Rollback**
```bash
cd /opt/nili
sed -i 's|^TAG=.*|TAG=PREVIOUS_SHA|' .env
docker compose --env-file .env -f docker-compose.prod.yml up -d
```

**Health**
```bash
curl -s https://nili.aysanz.dev
docker compose -f /opt/nili/docker-compose.prod.yml ps
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"
```

**Logs**
```bash
cd /opt/nili && docker compose -f docker-compose.prod.yml logs -f web
```

## Sizing

`docker-compose.prod.yml` sets `mem_limit: 256m`. That is a guess, not a
measurement — there is nothing in the runbook's "Measured footprint" table for
a Next.js `standalone` server, only Alidade's three containers and Caddy. Once
this is live, `docker stats` on `nili-web-1` for a day of real traffic is the
number to replace it with. The runbook's existing "Idle, no visitors" total
(614 MB used, 1.3 GB available) has room for this to run considerably higher
than 256m if it turns out to need it — the 2 GB box was sized with exactly
this kind of second static-ish site in mind.

## Why this isn't `sites/nili/` after all

The runbook reserves `/opt/edge/sites/nili/` for a *static* export — build
output copied in, served straight by Caddy, no container of its own. This app
can't take that path, and not just because of the no-flash theme script:
`src/proxy.ts` is real Next middleware — it reads the request's
`Accept-Language` header to pick a locale for a bare `/` — and middleware
needs the Node runtime `next start` provides. `next export` refuses to build
at all with middleware present. So it follows the "Containerised" recipe
instead, the same shape as Alidade, and `sites/nili/` stays reserved and
empty as the runbook already shows it.
