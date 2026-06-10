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

## Cloudflare Workers / Pages, Vercel, Deno Deploy

O Nexus roda em qualquer runtime com suporte Web-standard `Request`/`Response` (Node 22+, Deno, Bun, Cloudflare Workers). Ainda não há um sistema de adapters built-in; faça deploy do padrão Docker acima ou rode `nexus start` na sua plataforma alvo.

Para plataformas serverless, é necessário um adapter comunitário ou um entry point personalizado que importe `createNexusServer` de `@nexus_js/server` e o envolva para a assinatura de handler da plataforma.

## Variáveis de ambiente requeridas

| Variável | Propósito |
|----------|-----------|
| `NEXUS_SECRET` | Assinatura de sessões, tokens CSRF (obrigatório em produção; o servidor não inicia sem ele) |
| `PORT` | Porta do servidor (padrão é `3000` ou o valor de `server.port` em `nexus.config.ts`) |
