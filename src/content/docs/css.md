# Stylesheets — Tailwind & PostCSS

Global CSS with automatic PostCSS/Tailwind compilation in dev mode.

## Auto-discovery

Nexus discovers `src/app.css`, `src/global.css`, `src/index.css`, or `src/styles.css` automatically and serves it at `/_nexus/global.css`.

## Tailwind support

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```css
/* src/global.css */
@import 'tailwindcss';
@layer nexus.global {
  body { @apply bg-gray-50 text-gray-900; }
}
```

## Custom entry

```ts
// nexus.config.ts
export default {
  css: { entry: './src/styles/main.css' },
};
```

## Scoped vs global

- `<style>` in `.nx` files → scoped (auto-hashed)
- `src/global.css` → global (served at `/_nexus/global.css`)
- Use `:global(selector)` to escape scoping in a `.nx` file