# Stylesheets — Tailwind, PostCSS & Scoped CSS

Nexus has first-class CSS support with a single unified stylesheet, automatic PostCSS compilation, Tailwind CSS v4 integration, scoped component styles, and zero-config global stylesheet serving.

---

## How styles are served

Nexus v0.9.32 serves **one** stylesheet automatically:

- **`/_nexus/styles.css`** — a unified stylesheet that includes:
  1. Your global CSS entry, processed with PostCSS/Tailwind (prepended first).
  2. Aggregated scoped CSS from all `.nx` files.

It begins with the layer declaration:

```css
@layer nexus.scoped, nexus.global;
```

The framework injects `<link rel="stylesheet" href="/_nexus/styles.css">` into the SSR `<head>`. You do not need to add it yourself.

The legacy **`/_nexus/global.css`** endpoint is still available for backward compatibility, but it is **no longer injected** into SSR.

---

## Global CSS entry

Nexus auto-discovers your global stylesheet from these locations (in order):

- `src/app.css`
- `src/global.css`
- `src/index.css`
- `src/styles.css`

If found, the file is processed with PostCSS and prepended into the unified stylesheet.

### Custom entry

Override auto-discovery in `nexus.config.ts`:

```ts
export default {
  css: { entry: 'src/global.css' },
};
```

The path is relative to your project root.

---

## PostCSS & Tailwind CSS v4

Nexus reads `postcss.config.{mjs,cjs,js}` and runs your global CSS through PostCSS automatically in both dev and production.

### Recommended dependencies

Because production CSS is compiled on-the-fly, install these as regular `dependencies`, **not** `devDependencies`:

```json
{
  "dependencies": {
    "tailwindcss": "^4.3.0",
    "@tailwindcss/postcss": "^4.3.0",
    "postcss": "^8.5.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### PostCSS config

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### Telling Tailwind about `.nx` files

Tailwind CSS v4 does not scan `.nx` files by default. Point it to a generated HTML file that contains the classes used in your components.

Add a `predev` and `prebuild` script that generates `src/.generated/tailwind-classes.html`. Example `scripts/extract-tw-classes.mjs`:

```js
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (path.endsWith('.nx')) yield path;
  }
}

const classes = new Set();
for await (const file of walk('src')) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/class\s*=\s*["']([^"']+)["']/g)) {
    match[1].split(/\s+/).forEach((c) => c && classes.add(c));
  }
}

const tags = [...classes].sort().map((c) => `<div class="${c}"></div>`).join('\n');
const html = `<!DOCTYPE html>\n<html>\n<body>\n${tags}\n</body>\n</html>\n`;

await mkdir('src/.generated', { recursive: true });
await writeFile('src/.generated/tailwind-classes.html', html);
```

Then wire it up in `package.json`:

```json
{
  "scripts": {
    "predev": "node scripts/extract-tw-classes.mjs",
    "prebuild": "node scripts/extract-tw-classes.mjs"
  }
}
```

Add `src/.generated` to your `.gitignore`.

### Global CSS file

```css
/* src/global.css */
@import 'tailwindcss';

@source './.generated/tailwind-classes.html';

@theme {
  --color-bg: var(--bg);
  --color-ink: var(--ink);
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

Tailwind v4 is CSS-first: define custom design tokens with `@theme` inside `global.css` instead of using `tailwind.config.js`.

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

The compiler hashes the selectors so `.card` only applies to elements in this component. Scoped styles are aggregated into `/_nexus/styles.css`.

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

## CSS layers

Nexus manages specificity with CSS `@layer`. The unified stylesheet declares:

```css
@layer nexus.scoped, nexus.global;
```

- Scoped styles from `.nx` files live in `@layer nexus.scoped`.
- Your global CSS can optionally live in `@layer nexus.global` if you wrap it:

```css
@layer nexus.global {
  body { /* ... */ }
}
```

This prevents specificity wars between global utilities and component styles.

---

## Dev vs production

| Environment | Unified stylesheet (`/_nexus/styles.css`) |
|-------------|------------------------------------------|
| **Dev** | Compiled on-demand with PostCSS, hot-reloaded when global or scoped CSS changes |
| **Production** | Bundled, minified, and content-hashed into `.nexus/output/` for immutable caching |

---

## Best practices

1. **Use `src/global.css` for design tokens** (colors, fonts, spacing) and Tailwind directives.
2. **Use `<style>` in `.nx` for component-specific layout** that should not leak to other components.
3. **Avoid heavy global CSS**; scoped styles are deduplicated per route in production.
4. **Prefer CSS variables** for theming; they work in both global and scoped contexts.
5. **Do not manually link `/_nexus/global.css`** in your layout; rely on the unified `/_nexus/styles.css` that Nexus injects automatically.
6. **Keep Tailwind packages in `dependencies`** (`tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer`) so production builds can compile CSS on-the-fly.
7. **Run the Tailwind class extraction script in `predev` and `prebuild`** so Tailwind v4 sees the classes used in `.nx` files.
8. **Define custom design tokens with `@theme`** in `global.css` rather than `tailwind.config.js`.
