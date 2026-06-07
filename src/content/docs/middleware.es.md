# Middleware

**Exacto** middleware de estándares web que escribes y registras.

## Middleware personalizado exacto (la firma de función que implementas)

```ts
// src/lib/middleware/auth.ts
import type { NexusContext } from '@nexus_js/server';

export async function auth(ctx: NexusContext, next: () => Promise<Response>) {
  const token = ctx.getCookie('session');
  if (!token) {
    return ctx.redirect('/login');
  }
  ctx.locals.user = await verifySession(token);
  return next();   // continúa la cadena
}
```

## Formas exactas de aplicar (en config o por-ruta)

```ts
// nexus.config.ts
import { auth } from './src/lib/middleware/auth';

export default {
  server: {
    middleware: [auth],           // global
  },
};
```

O por-página (en load o vía la export de middleware propia de la página si el router lo soporta — el patrón es el mismo).

El middleware corre antes de load(), tiene acceso al ctx completo (puede cortocircuitar con redirect/response), y es totalmente compatible con runtimes edge.

Ver security.md para el rateLimit / hardened middleware exacto que viene con el framework, y las otras páginas de esta lista para cómo load() recibe los datos que el middleware puso en ctx.locals. Todos los patrones son los exactos usados en el paquete middleware del monorepo y el sitio de docs.
Regístralo en `nexus.config.ts` o por-ruta.

Compatible con Edge (Web Standards Request/Response). Usar con seguridad (rateLimit, vault) en load() o actions.

Ver el README de @nexus_js/middleware para ejemplos completos de pipeline.

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

El middleware corre igual en Node, Cloudflare Workers, Vercel Edge, Deno, y Bun. No se requieren APIs específicas de plataforma.
