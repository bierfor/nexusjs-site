# Despliegue

**Pasos exactos** para los targets más comunes. El único requisito duro es un runtime que entienda Request/Response de estándares web (Node, Deno, Cloudflare, Vercel, Bun, etc.).

## Docker / VPS exacto (el Dockerfile + compose que copias)

`postcss`, `tailwindcss` y `autoprefixer` deben estar en `dependencies` (no en `devDependencies`), porque Nexus compila CSS on-the-fly en producción.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build          # ejecuta nexus build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "start"]   # requiere "start": "nexus start" en package.json
```

`docker-compose.yml` (exacto):

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXUS_SECRET=${NEXUS_SECRET}
```

Genera un secreto fuerte para producción:

```bash
openssl rand -base64 32
```

El servidor de producción se niega a iniciar si falta `NEXUS_SECRET`. Debe ser una cadena aleatoria de al menos 32 caracteres.

## Cloudflare Workers / Pages exacto (la config de una línea)

```ts
// nexus.config.ts
export default {
  build: { adapter: 'cloudflare' },
};
```

Luego `pnpm build` produce el `_worker.js` + assets estáticos que el adapter espera.

## Vercel exacto (la config de una línea)

```ts
// nexus.config.ts
export default {
  build: { adapter: 'vercel' },
};
```

Push a Vercel — detectará la salida del adapter.

## Deno Deploy / Bun

Pon `adapter: 'deno'` o corre con `bun run .nexus/output/server.js`.

## Variables de entorno requeridas

| Variable | Propósito |
|----------|-----------|
| `NEXUS_SECRET` | Firma de sesiones, tokens CSRF (requerido en producción; el servidor no inicia sin él) |
| `PORT` | Puerto del servidor (por defecto `3000` o el valor de `server.port` en `nexus.config.ts`) |
