# Stylesheets — Tailwind, PostCSS & Scoped CSS

Nexus has first-class CSS support with automatic PostCSS compilation, Tailwind CSS v4 integration, scoped component styles, and zero-config global stylesheet serving.

---

## Global CSS entry

Nexus auto-discovers your global stylesheet from these locations (in order):

- `src/app.css`
- `src/global.css`
- `src/index.css`
- `src/styles.css`

If found, it is processed with PostCSS (when a config is present) and served at `/_nexus/global.css`. The framework automatically injects the link in SSR.

### Custom entry

Override the auto-discovery in `nexus.config.ts`:

```ts
export default {
  css: { entry: './src/styles/main.css' },
};
```

The path is relative to your project root.

---

## PostCSS & Tailwind CSS v4

Nexus reads `postcss.config.{mjs,cjs,js}` and runs your global CSS through PostCSS automatically in both dev and production.

### Exact setup for Tailwind v4

```bash
pnpm add -D tailwindcss postcss @tailwindcss/postcss autoprefixer
```

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

```css
/* src/global.css */
@import 'tailwindcss';

@theme {
  --color-accent: #c45c26;
}

:root {
  --bg: #0a0a0a;
  --ink: #ffffff;
}

body {
  background-color: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
```

That is all. In dev, `/_nexus/global.css` returns the fully compiled Tailwind output. In production, the build pipeline bundles and hashes it.

**Note:** Tailwind v4 uses CSS-native configuration (`@theme`, `@import "tailwindcss"`). There is no `tailwind.config.js` required unless you need custom content globs (Nexus already compiles `.nx` files, so Tailwind scans them automatically via the PostCSS plugin).

---

## Scoped component styles

Any `<style>` block inside a `.nx` file is automatically scoped to that component.

```svelte
<!-- src/routes/card/+page.nx -->
<div class="card">
  <h2>{pretext.title}</h2>
</div>

<style>
  .card {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--surface);
  }
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }
</style>
```

The compiler hashes the selectors so `.card` only applies to elements in this component. It is served via the aggregated stylesheet at `/_nexus/styles.css`.

### `:global()` escape hatch

To target global elements (e.g., `body`, `html`) or override a child component:

```svelte
<style>
  :global(body) {
    margin: 0;
  }
  .card :global(.external-widget) {
    border: 1px solid red;
  }
</style>
```

---

## How styles are served

Nexus serves **two** stylesheets automatically in every page:

1. **`/_nexus/global.css`** — your global entry (PostCSS-processed)
2. **`/_nexus/styles.css`** — aggregated scoped styles from all `.nx` files

Both are injected into the `<head>` during SSR (unless you already declared them manually). You do not need to add `<link>` tags yourself.

The aggregated scoped stylesheet wraps each component's CSS in `@layer nexus.scoped` so it coexists cleanly with your global styles.

---

## CSS layers

Nexus uses CSS `@layer` to manage specificity:

```css
@layer nexus.scoped, nexus.global;
```

- Scoped styles from `.nx` files live in `@layer nexus.scoped`
- Your global CSS can optionally live in `@layer nexus.global` if you wrap it:

```css
@layer nexus.global {
  body { /* ... */ }
}
```

This prevents specificity wars between global utilities and component styles.

---

## Dev vs production

| Environment | Global CSS | Scoped CSS |
|-------------|------------|------------|
| **Dev** | Compiled on-demand with PostCSS, served with hot-reload busting | Recompiled on any `.nx` save |
| **Production** | Bundled, minified, and hashed into `.nexus/output/` | Extracted, deduplicated, and hashed per route |

In production, both stylesheets carry a content hash in their filename for immutable caching.

---

## Best practices

1. **Use `src/global.css` for design tokens** (colors, fonts, spacing) and Tailwind directives.
2. **Use `<style>` in `.nx` for component-specific layout** that should not leak to other components.
3. **Avoid heavy global CSS**; the aggregated scoped stylesheet is deduplicated per route in production.
4. **Prefer CSS variables** for theming; they work in both global and scoped contexts.
5. **Do not manually link `/_nexus/global.css`** in your layout; the renderer injects it automatically when the entry file exists.
