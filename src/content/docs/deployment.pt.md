# Deploy

**Passos exatos** para os targets mais comuns. O único requisito rígido é um runtime que entenda Request/Response de padrões web (Node, Deno, Cloudflare, Vercel, Bun, etc.).

## Docker / VPS exato (o Dockerfile + compose que você copia)

`postcss`, `tailwindcss` e `autoprefixer` devem estar em `dependencies` (não em `devDependencies`), porque Nexus compila CSS on-the-fly em produção.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build          # executa nexus build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "start"]   # requer "start": "nexus start" no package.json
```

`docker-compose.yml` (exato):

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXUS_SECRET=${NEXUS_SECRET}
```

Gere um segredo forte para produção:

```bash
openssl rand -base64 32
```

O servidor de produção se recusa a iniciar se `NEXUS_SECRET` estiver ausente. Ele deve ser uma string aleatória de pelo menos 32 caracteres.

## Cloudflare Workers / Pages exato (a config de uma linha)

```ts
// nexus.config.ts
export default {
  build: { adapter: 'cloudflare' },
};
```

Então `pnpm build` produz o `_worker.js` + assets estáticos que o adapter espera.

## Vercel exato (a config de uma linha)

```ts
// nexus.config.ts
export default {
  build: { adapter: 'vercel' },
};
```

Push para Vercel — ele detectará a saída do adapter.

## Deno Deploy / Bun

Coloque `adapter: 'deno'` ou rode com `bun run .nexus/output/server.js`.

## Variáveis de ambiente requeridas

| Variável | Propósito |
|----------|-----------|
| `NEXUS_SECRET` | Assinatura de sessões, tokens CSRF (obrigatório em produção; o servidor não inicia sem ele) |
| `PORT` | Porta do servidor (padrão é `3000` ou o valor de `server.port` em `nexus.config.ts`) |
