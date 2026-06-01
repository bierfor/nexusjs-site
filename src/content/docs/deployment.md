# Deployment

Any runtime that speaks Request/Response works.

## Node.js (VPS / Docker)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
ENV NEXUS_SECRET=${NEXUS_SECRET}
CMD ["pnpm", "start"]
```

## Cloudflare Workers

```ts
// nexus.config.ts
export default {
  build: { adapter: 'cloudflare' },
};
```

## Vercel

```ts
// nexus.config.ts
export default {
  build: { adapter: 'vercel' },
};
```

## Deno Deploy / Bun

Set `adapter: 'deno'` or run with `bun run .nexus/output/server.js`.

## Required env vars

| Variable | Purpose |
|----------|---------|
| `NEXUS_SECRET` | Session signing, CSRF tokens (required in production) |
| `NEXUS_BUILD_ID` | Build fingerprint (set to git SHA in CI) |