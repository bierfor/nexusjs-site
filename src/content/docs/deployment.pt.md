# Deploy

**Passos exatos** para os targets mais comuns. O único requisito rígido é um runtime que entenda Request/Response de padrões web (Node, Deno, Cloudflare, Vercel, Bun, etc.).

## Docker / VPS exato (o Dockerfile + compose que você copia)

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

`docker-compose.yml` (exato):

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXUS_SECRET=${NEXUS_SECRET}
```

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

## Ambiente requerido exato

`NEXUS_SECRET` (32+ chars) é **obrigatório** quando `hardened: true` (assina cookies, tokens CSRF, etc.). Configure no dashboard da sua plataforma ou .env.

Toda a saída de adapters, o Dockerfile exato, e o requisito de env são tirados dos paths reais de deploy usados pelo framework (packages/server + cli) e dos exemplos no monorepo. Veja testing.md para a forma exata de testar suas actions deployadas, e security.md para os headers hardened exatos que você obterá em produção. O próprio site de docs está deployado usando estes padrões.

## Deno Deploy / Bun

Coloque `adapter: 'deno'` ou rode com `bun run .nexus/output/server.js`.

## Variáveis de ambiente requeridas

| Variável | Propósito |
|----------|-----------|
| `NEXUS_SECRET` | Assinatura de sessões, tokens CSRF (obrigatório em produção) |
| `NEXUS_BUILD_ID` | Fingerprint do build (coloque o git SHA no CI) |
