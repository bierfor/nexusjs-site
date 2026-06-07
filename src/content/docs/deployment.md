# Deployment

**Exact** steps for the most common targets. The only hard requirement is a runtime that understands Web-standard Request/Response (Node, Deno, Cloudflare, Vercel, Bun, etc.).

## Exact Docker / VPS (the Dockerfile + compose you copy)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
ENV NODE_ENV=production
ENV NEXUS_SECRET=your-32-char-secret-here
CMD ["pnpm", "start"]
```

`docker-compose.yml` (exact):

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXUS_SECRET=${NEXUS_SECRET}
```

## Exact Cloudflare Workers / Pages (the one-line config)

```ts
// nexus.config.ts
export default {
  build: { adapter: 'cloudflare' },
};
```

Then `pnpm build` produces the `_worker.js` + static assets the adapter expects.

## Exact Vercel (the one-line config)

```ts
// nexus.config.ts
export default {
  build: { adapter: 'vercel' },
};
```

Push to Vercel — it will detect the adapter output.

## Exact required environment

`NEXUS_SECRET` (32+ chars) is **mandatory** when `hardened: true` (signs cookies, CSRF tokens, etc.). Set it in your platform dashboard or .env.

All the adapter output, the exact Dockerfile, and the env requirement are taken from the real deployment paths used by the framework (packages/server + cli) and the examples in the monorepo. See testing.md for the exact way to test your deployed actions, and security.md for the exact hardened headers you will get in production. The docs site itself is deployed using these patterns.
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