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

## Cloudflare Workers / Pages, Vercel, Deno Deploy

Nexus corre en cualquier runtime con soporte Web-standard `Request`/`Response` (Node 22+, Deno, Bun, Cloudflare Workers). Aún no hay un sistema de adapters built-in; despliega el patrón Docker de arriba o corre `nexus start` en tu plataforma objetivo.

Para plataformas serverless, se requiere un adapter comunitario o un entry point personalizado que importe `createNexusServer` desde `@nexus_js/server` y lo envuelva para la firma de handler de la plataforma.

## Variables de entorno requeridas

| Variable | Propósito |
|----------|-----------|
| `NEXUS_SECRET` | Firma de sesiones, tokens CSRF (requerido en producción; el servidor no inicia sin él) |
| `PORT` | Puerto del servidor (por defecto `3000` o el valor de `server.port` en `nexus.config.ts`) |
