Create a new Nexus project in seconds and deploy your first page. Everything follows "modo correcto": data via `load(ctx)` → `pretext`, content via `@nexus_js/content` when needed, direct `{pretext.xxx}` interpolation, no legacy patterns.

### Step 1 — Scaffold a new app

```bash
npx @nexus_js/create-nexus@latest my-app
cd my-app
pnpm install
```

Or with pnpm:

```bash
pnpm dlx @nexus_js/create-nexus my-app
cd my-app
pnpm install
```

This creates a project using the latest v0.9.32 patterns (`load()`, `.nx` templates, islands, link prefetching, hardened security by default).

### Step 2 — Project structure and config

A new Nexus project looks like this:

```
src/
  routes/
    +page.nx
    +layout.nx
    +not-found.nx
  lib/
public/
nexus.config.ts
```

A typical `nexus.config.ts` for v0.9.32:

```ts
import type { NexusConfig } from '@nexus_js/cli';

export default {
  css: { entry: 'src/global.css' },
  server: { port: 3000 },
  security: {
    hardened: true,
    shieldLite: true,
  },
} satisfies NexusConfig;
```

### Step 3 — Your first page (exact .nx file)

Create `src/routes/about/+page.nx` with **exact** code a user should write:

```svelte
---
import { resolveLocale, createT } from '$lib/i18n.ts';

export async function load(ctx) {
  const locale = resolveLocale(ctx);
  const t = createT(locale);

  // Fetch real data (e.g. from DB or content package)
  const pageData = {
    title: 'About Us',
    description: 'Nexus.js in action',
  };

  // Return data for template (auto-merged into pretext)
  return {
    page: pageData,
  };
}
---

<h1>{pretext.page.title}</h1>
<p>{pretext.page.description}</p>

<!-- Example island for interactivity (only this ships JS) -->
<nexus-island client:visible src="$lib/islands/counter.ts" data-initial="42">
</nexus-island>

<style>
  h1 { color: #2563eb; font-size: 2rem; }
  button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 4px; }
</style>
```

**Exactly what happens (modo correcto):**
- `load(ctx)` runs on the server per request (can be async, use ctx.params, ctx.req, security helpers like rateLimit).
- Returned object becomes `pretext` (merged from layouts + pages; child wins).
- Template is SSR'd to static HTML with `{pretext.xxx}` values interpolated (escaped by default).
- `<style>` is auto-scoped.
- `client:visible` island is extracted, bundled separately, and hydrated only when visible (zero JS for the rest of the page).
- `head` is automatically processed by the renderer and injected (see seo.md).

> **Tip:** For anything longer than a few lines, use an **external island** (`src="$lib/islands/counter.ts"`) instead of inline `<script>`. It keeps `.nx` files clean, enables reuse, and works with `defaultHydration` in `nexus.config.ts`. See `islands.md` for the full pattern.

### Step 4 — Add i18n (exact, using defineI18n)

Update `src/lib/i18n.ts` (or use the generated one):

```ts
import { defineI18n } from '@nexus_js/content';

export const i18n = defineI18n({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  messages: {
    en: { 'about.welcome': 'Welcome to Nexus!' },
    es: { 'about.welcome': '¡Bienvenido a Nexus!' },
  },
});
```

Then in load: `const t = i18n.tFn(locale); return { t };` and use `{pretext.t('about.welcome')}`. The `tFn` returns a translation function.

### Step 5 — Use external content (exact with @nexus_js/content)

For MD-driven pages (recommended for docs/blogs):

```ts
// in load(ctx)
import { loadContent } from '@nexus_js/content';

const entry = loadContent('about', { locale, contentDir: 'src/content' });
return { 
  content: entry.html, 
  title: entry.meta?.title,
};
```

In template: `{pretext.content}` (already sanitized HTML).

### Step 6 — Visit & build

- `pnpm dev` → http://localhost:3000/about (instant SSR, hot reload for .nx).
- Set `NEXUS_SECRET` in production, then `pnpm build && pnpm start` → production output in `.nexus/output/`.

The framework guarantees: security (CSRF on actions, CSP, etc.), performance (islands + streaming + link prefetching), type safety (via load returns), and "modo correcto" DX.

See the other pages in this list (e.g. routing.md, server-actions.md) for more exact variations. All examples here are copy-paste ready and match the real paylinks-saas example in the monorepo.
