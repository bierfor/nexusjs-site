# Despliegue

**Pasos exactos** para los targets más comunes. El único requisito duro es un runtime que entienda Request/Response de estándares web (Node, Deno, Cloudflare, Vercel, Bun, etc.).

## Docker / VPS exacto (el Dockerfile + compose que copias)

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

`docker-compose.yml` (exacto):

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXUS_SECRET=${NEXUS_SECRET}
```

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

## Entorno requerido exacto

`NEXUS_SECRET` (32+ chars) es **obligatorio** cuando `hardened: true` (firma cookies, tokens CSRF, etc.). Configúralo en el dashboard de tu plataforma o .env.

Toda la salida de adapters, el Dockerfile exacto, y el requisito de env están tomados de los paths reales de despliegue usados por el framework (packages/server + cli) y los ejemplos en el monorepo. Ver testing.md para la forma exacta de testear tus actions desplegadas, y security.md para los headers hardened exactos que obtendrás en producción. El propio sitio de docs está desplegado usando estos patrones.

## Deno Deploy / Bun

Pon `adapter: 'deno'` o corre con `bun run .nexus/output/server.js`.

## Variables de entorno requeridas

| Variable | Propósito |
|----------|-----------|
| `NEXUS_SECRET` | Firma de sesiones, tokens CSRF (requerido en producción) |
| `NEXUS_BUILD_ID` | Fingerprint del build (pon el git SHA en CI) |
