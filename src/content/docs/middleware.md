# Middleware

**Exact** Web-standard middleware you write and register.

## Exact custom middleware (the function signature you implement)

```ts
// src/lib/middleware/auth.ts
import type { NexusContext } from '@nexus_js/server';

export async function auth(ctx: NexusContext, next: () => Promise<Response>) {
  const token = ctx.getCookie('session');
  if (!token) {
    return ctx.redirect('/login');
  }
  ctx.locals.user = await verifySession(token);
  return next();   // continue the chain
}
```

## Exact ways to apply (in config or per-route)

```ts
// nexus.config.ts
import { auth } from './src/lib/middleware/auth';

export default {
  server: {
    middleware: [auth],           // global
  },
};
```

Or per-page (in load or via the page's own middleware export if the router supports it — the pattern is the same).

Middleware runs before load(), has access to the full ctx (can short-circuit with redirect/response), and is fully compatible with edge runtimes.

See security.md for the exact rateLimit / hardened middleware that ships with the framework, and the other pages in this list for how load() receives the data that middleware put on ctx.locals. All patterns are the exact ones used in the monorepo middleware package and the docs site.
Register in `nexus.config.ts` or per-route.

Edge compatible (Web Standards Request/Response). Use with security (rateLimit, vault) in load() or actions.

See @nexus_js/middleware README for full pipeline examples.


```svelte
---
import { auth } from '$lib/middleware/auth';

export const middleware = [auth];

export async function load(ctx) {
  return { user: ctx.locals.user };
}
---
```

## Edge adapters

Middleware runs the same on Node, Cloudflare Workers, Vercel Edge, Deno, and Bun. No platform-specific APIs required.