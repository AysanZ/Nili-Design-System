# syntax=docker/dockerfile:1

# ────────────────────────────────────────────────────────────────
# apps/www — production image
#
# This has to be built from the REPOSITORY ROOT, not from apps/www, and the
# build context has to be the root too:
#
#   docker build -f apps/www/Dockerfile -t nili-www .
#
# `@nili/ui` is not a published package here — apps/www imports it straight
# from `src/index.ts` in TypeScript, and `next.config.ts` sets
# `outputFileTracingRoot` to the repo root specifically so Next's file tracer
# will follow that import out of apps/www. A context scoped to apps/www alone
# would never see `src/`, `registry/`, or the root `public/` that
# `scripts/sync-public.mjs` copies fonts and flags from, and the build would
# fail resolving `@nili/ui` on the first line that imports it.
#
# Three stages: install once against the root lockfile (workspaces share one
# node_modules), build with the full source tree available, then run from
# Next's `standalone` output — a pruned server bundle holding only the
# dependencies this app's traced import graph actually uses, not the whole
# monorepo's node_modules (Storybook, Vite, the studio app, and everything
# those pull in).
# ────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22-bookworm-slim

# ── deps ──────────────────────────────────────────────────────────
# Cached on the lockfile, not on source: this layer only re-runs when a
# dependency changes, which is the expensive part to redo.
FROM node:${NODE_VERSION} AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/www/package.json apps/www/package.json
COPY apps/studio/package.json apps/studio/package.json
COPY packages/cli/package.json packages/cli/package.json

# `npm ci` needs every workspace manifest present to resolve the tree, even
# for workspaces this image never builds — omitting apps/studio here would
# make npm rewrite the lockfile instead of installing from it.
RUN npm ci

# ── builder ───────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/www/node_modules ./apps/www/node_modules
# The rest of the tree: root src/ and public/ (what @nili/ui and its assets
# resolve to), registry/*.json (generated and committed — see
# CHANGES-OUTSIDE-WWW.md's note that this site never re-runs that generator),
# and apps/www itself. apps/studio and packages/cli come along too since they
# are real paths under the workspace root; harmless, and simpler than
# maintaining a second, narrower copy list that silently drifts from what the
# tracer actually follows.
COPY . .

# Fonts and flags into apps/www/public — see scripts/sync-public.mjs's own
# comment for why this is a copy step rather than something next.config.ts
# can route around: Next has no publicDir option, public/ is always the one
# beside next.config.ts.
RUN npm run --workspace apps/www predev

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run --workspace apps/www build

# ── runner ────────────────────────────────────────────────────────
# Distroless-ish: only what `.next/standalone`'s generated server.js needs at
# runtime, run as a non-root user.
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# `standalone` bundles a server.js plus the pruned node_modules subset
# server-side rendering needs; it does NOT include the static assets or
# public/, which is why those two are copied in separately below. Paths keep
# the apps/www prefix standalone traced them under, since server.js is
# written expecting to run from that same relative position.
COPY --from=builder --chown=nextjs:nodejs /repo/apps/www/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/www/.next/static ./apps/www/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/www/public ./apps/www/public

USER nextjs

EXPOSE 3000

# server.js lives at apps/www/server.js inside the standalone output, mirroring
# the workspace path it was traced from.
CMD ["node", "apps/www/server.js"]
