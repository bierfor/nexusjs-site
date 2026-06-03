# Middleware

Web-standard middleware pipeline. Compose, redirect, and guard requests.

## Custom middleware

```ts
// src/lib/middleware/auth.ts
import type { NexusContext } from '@nexus_js/server';

export async function auth(ctx: NexusContext, next: () => Promise<Response>) {
  const session = ctx.getCookie('session');
  if (!session) return ctx.redirect('/login');
  ctx.locals.user = await verifySession(session);
  return next();
}
```

## Applying middleware
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