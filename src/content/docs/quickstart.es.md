Crea un nuevo proyecto Nexus en segundos y despliega tu primera página. Todo sigue "modo correcto": datos vía `load(ctx)` → `pretext`, contenido vía `@nexus_js/content` cuando sea necesario, interpolación directa `{pretext.xxx}`, sin patrones legacy.

### Paso 1 — Andamiaje de una nueva app

```bash
npx @nexus_js/create-nexus@latest my-app
cd my-app
pnpm install
```

O con pnpm:

```bash
pnpm dlx @nexus_js/create-nexus my-app
cd my-app
pnpm install
```

Esto crea un proyecto usando los patrones v0.9.32 (`load()`, templates `.nx`, islands, prefetch de links, seguridad hardened por defecto).

### Paso 2 — Estructura del proyecto y config

Un proyecto nuevo de Nexus se ve así:

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

Un `nexus.config.ts` típico para v0.9.32:

```ts
import type { NexusConfig } from '@nexus_js/cli';

export default {
  defaultHydration: 'client:visible',
  css: { entry: 'src/global.css' },
  server: { port: 3000 },
  security: {
    hardened: true,
    shieldLite: true,
  },
} satisfies NexusConfig;
```

### Paso 3 — Tu primera página (archivo .nx exacto)

Crea `src/routes/about/+page.nx` con el **código exacto** que un usuario debe escribir:

```svelte
---
import { resolveLocale, createT } from '$lib/i18n.ts';

export async function load(ctx) {
  const locale = resolveLocale(ctx);
  const t = createT(locale);

  // Obtén datos reales (ej. de DB o content package)
  const pageData = {
    title: 'Sobre Nosotros',
    description: 'Nexus.js en acción',
  };

  // Retorna datos para el template + head opcional para SEO (inyectado auto)
  return {
    page: pageData,
    head: {
      title: `${pageData.title} — My Nexus App`,
      description: pageData.description,
    },
  };
}
---

<h1>{pretext.page.title}</h1>
<p>{pretext.page.description}</p>
<p>{pretext.t('about.welcome')}</p>

<!-- Ejemplo de island para interactividad (solo esto envía JS) -->
<div client:visible>
  <script>
    let count = $state(0);
  </script>
  <button onclick={() => count++}>
    Clickeado {count} veces
  </button>
</div>

<style>
  h1 { color: #2563eb; font-size: 2rem; }
  button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 4px; }
</style>
```

**Exactamente qué pasa (modo correcto):**
- `load(ctx)` corre en el servidor por request (puede ser async, usa ctx.params, ctx.req, helpers de seguridad como rateLimit).
- El objeto retornado se convierte en `pretext` (mergeado de layouts + páginas; hijo gana).
- El template es SSR a HTML estático con valores `{pretext.xxx}` interpolados (escapados por defecto).
- `<style>` es auto-scoped.
- El island `client:visible` es extraído, bundled por separado, e hidratado solo cuando visible (cero JS para el resto de la página).
- `head` es procesado automáticamente por el renderer e inyectado (ver seo.md).

> **Tip:** Para cualquier cosa de más de unas pocas líneas, usa una **island externa** (`src="$lib/islands/counter.ts"`) en vez de inline `<script>`. Mantiene los archivos `.nx` limpios, permite reutilización, y funciona con `defaultHydration` en `nexus.config.ts`. Ver `islands.md` para el patrón completo.

### Paso 4 — Agrega i18n (exacto, usando defineI18n)

Actualiza `src/lib/i18n.ts` (o usa el generado):

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

Luego en load: `const t = i18n.tFn(locale); return { t };` y usa `{pretext.t('about.welcome')}`.

### Paso 5 — Usa contenido externo (exacto con @nexus_js/content)

Para páginas impulsadas por MD (recomendado para docs/blogs):

```ts
// en load(ctx)
import { loadContent } from '@nexus_js/content';

const entry = loadContent('about', { locale, contentDir: 'src/content' });
return { 
  content: entry.html, 
  title: entry.meta?.title,
};
```

En template: `{pretext.content}` (HTML ya sanitizado del content package).

### Paso 6 — Visita & build

- `pnpm dev` → http://localhost:3000/about (SSR instantáneo, hot reload para .nx).
- Define `NEXUS_SECRET` en producción, luego `pnpm build && pnpm start` → salida de producción en `.nexus/output/`.

El framework garantiza: seguridad (CSRF en actions, CSP, etc.), performance (islands + streaming + prefetch de links), type safety (vía retornos de load), y DX en "modo correcto".

Ver las otras páginas en esta lista (ej. routing.md, server-actions.md) para más variaciones exactas. Todos los ejemplos aquí están listos para copy-paste y coinciden con el ejemplo real paylinks-saas en el monorepo.
