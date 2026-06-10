# Deployment

**Exact** steps for the most common targets. The only hard requirement is a runtime that understands Web-standard Request/Response (Node, Deno, Cloudflare, Vercel, Bun, etc.).

## Exact Docker / VPS (the Dockerfile + compose you copy)

`postcss`, `tailwindcss`, and `autoprefixer` must be in `dependencies` (not `devDependencies`), because Nexus compiles CSS on-the-fly in production.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build          # runs nexus build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "start"]   # requires "start": "nexus start" in package.json
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

Generate a strong production secret:

```bash
openssl rand -base64 32
```

The production server refuses to start if `NEXUS_SECRET` is missing. It must be a random string of at least 32 characters.

## Cloudflare Workers / Pages, Vercel, Deno Deploy

Nexus runs on any runtime with Web-standard `Request`/`Response` support (Node 22+, Deno, Bun, Cloudflare Workers). There is no built-in adapter system yet; deploy the Docker pattern above or run `nexus start` on your target platform.

For serverless platforms, a community adapter or custom entry point that imports `createNexusServer` from `@nexus_js/server` and wraps it for the platform's handler signature is required.

## Required environment variables

| Variable | Purpose |
|----------|---------|
| `NEXUS_SECRET` | Session signing, CSRF tokens (required in production; the server will not start without it) |
| `PORT` | Server port (default is `3000` or whatever you set in `nexus.config.ts` `server.port`) |
