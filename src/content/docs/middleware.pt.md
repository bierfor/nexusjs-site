# Middleware

**Exato** middleware de padrões web que você escreve e registra.

## Middleware custom exato (a assinatura de função que você implementa)

```ts
// src/lib/middleware/auth.ts
import type { NexusContext } from '@nexus_js/server';

export async function auth(ctx: NexusContext, next: () => Promise<Response>) {
  const token = ctx.getCookie('session');
  if (!token) {
    return ctx.redirect('/login');
  }
  ctx.locals.user = await verifySession(token);
  return next();   // continua a cadeia
}
```

## Formas exatas de aplicar (em config ou por-rota)

```ts
// nexus.config.ts
import { auth } from './src/lib/middleware/auth';

export default {
  server: {
    middleware: [auth],           // global
  },
};
```

Ou por-página (em load ou via a export de middleware própria da página se o router suportar — o padrão é o mesmo).

O middleware roda antes de load(), tem acesso ao ctx completo (pode short-circuit com redirect/response), e é totalmente compatível com runtimes edge.

Veja security.md para o rateLimit / hardened middleware exato que vem com o framework, e as outras páginas desta lista para como load() recebe os dados que o middleware colocou em ctx.locals. Todos os padrões são os exatos usados no pacote middleware do monorepo e no site de docs.
Registre em `nexus.config.ts` ou por-rota.

Compatível com Edge (Web Standards Request/Response). Use com segurança (rateLimit, vault) em load() ou actions.

Veja o README de @nexus_js/middleware para exemplos completos de pipeline.

```svelte
---
import { auth } from '$lib/middleware/auth';

export const middleware = [auth];

export async function load(ctx) {
  return { user: ctx.locals.user };
}
---
```

## Adaptadores Edge

O middleware roda igual no Node, Cloudflare Workers, Vercel Edge, Deno, e Bun. Não são necessárias APIs específicas de plataforma.
