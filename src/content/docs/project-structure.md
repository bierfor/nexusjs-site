# Project Structure

Exact recommended structure (copy-paste ready). Everything is colocated with routes for discoverability. Use `load(ctx)` in any .nx for data, @nexus_js/content for MD-driven sections.

```bash
my-app/
├── nexus.config.ts                 # Exact config (see below)
├── package.json
├── src/
│   ├── global.css                  # Entry for global Tailwind/PostCSS (auto in dev)
│   ├── lib/
│   │   ├── db.ts                   # Your DB client (exact wrapper)
│   │   └── i18n.ts                 # defineI18n + resolveLocale (exact)
│   └── routes/
│       ├── +layout.nx              # Root layout (exact with head + slot)
│       ├── +page.nx                # / (home)
│       ├── about/
│       │   └── +page.nx            # /about
│       ├── blog/
│       │   └── [slug]/
│       │       └── +page.nx        # /blog/:slug (exact dynamic load)
│       ├── api/
│       │   └── hello/
│       │       └── +server.nx      # API route (exact GET/POST)
│       └── docs/
│           └── [slug]/
│               └── +page.nx        # MD content page using loadContent
└── public/
    └── images/                     # Static (served as-is)
```

### Exact nexus.config.ts (copy this)

```ts
export default {
  server: { port: 3000 },
  security: {
    hardened: true,                 // Enables CSP nonce, headers, etc.
    csp: { additionalScriptSrc: [] },
  },
  css: { entry: './src/global.css' },
};
```

### Exact lib/db.ts example (BYOD, used in load())

```ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

### Exact usage in a route (see the listed pages for full details)

In any `+page.nx` or layout:

```svelte
---
import { db } from '$lib/db';
import { loadContent } from '@nexus_js/content';

export async function load(ctx) {
  const post = await db.posts.findBySlug(ctx.params.slug);
  const md = loadContent(`blog/${ctx.params.slug}`, { locale: ctx.locale });
  return {
    post,
    contentHtml: md.html,
    head: { title: post?.title },
  };
}
---
```

See routing.md, server-actions.md, content usage in packages.md, etc. for the **exact** full files.

| Path | Exact purpose + how framework uses it |
|------|---------------------------------------|
| `nexus.config.ts` | Loaded by CLI/server at startup. Controls hardened mode, CSP nonces (injected automatically), CSS entry (compiled on the fly in dev via /_nexus/global.css). |
| `src/routes/+layout.nx` | Always runs first. Must contain `<head><!--nexus:head--></head>` and `<!--nexus:slot-->` for child content. Returns shared pretext/head. |
| `src/routes/+page.nx` | Matched for `/`. `load(ctx)` result → pretext. Islands only for interactive parts. |
| `src/routes/blog/[slug]/+page.nx` | Dynamic segment available as `ctx.params.slug`. Use with loadContent for MD or DB. |
| `.../+server.nx` | API routes. Export `GET`, `POST` etc. Receive ctx with req/res. Return ctx.json() etc. |
| `public/` | Served statically at root. Use with assets.md Image() for optimization. |

All paths use the exact conventions the framework compiler/router expects. See the other pages in this list for the complete .nx source you should write.