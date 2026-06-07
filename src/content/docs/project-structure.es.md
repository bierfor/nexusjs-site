# Estructura del proyecto

Estructura recomendada exacta (lista para copiar-pegar). Todo está colocalizado con las rutas para facilitar el descubrimiento. Usa `load(ctx)` en cualquier .nx para datos, @nexus_js/content para secciones basadas en MD.

```bash
my-app/
├── nexus.config.ts                 # Config exacta (ver abajo)
├── package.json
├── src/
│   ├── global.css                  # Entrada para global Tailwind/PostCSS (auto en dev)
│   ├── lib/
│   │   ├── db.ts                   # Tu cliente DB (wrapper exacto)
│   │   └── i18n.ts                 # defineI18n + resolveLocale (exacto)
│   └── routes/
│       ├── +layout.nx              # Layout raíz (exacto con head + slot)
│       ├── +page.nx                # / (home)
│       ├── about/
│       │   └── +page.nx            # /about
│       ├── blog/
│       │   └── [slug]/
│       │       └── +page.nx        # /blog/:slug (load dinámico exacto)
│       ├── api/
│       │   └── hello/
│       │       └── +server.nx      # Ruta API (GET/POST exacto)
│       └── docs/
│           └── [slug]/
│               └── +page.nx        # Página de contenido MD usando loadContent
└── public/
    └── images/                     # Estáticos (servidos tal cual)
```

### nexus.config.ts exacto (copia esto)

```ts
export default {
  server: { port: 3000 },
  security: {
    hardened: true,                 // Habilita nonce CSP, headers, etc.
    csp: { additionalScriptSrc: [] },
  },
  css: { entry: './src/global.css' },
};
```

### Ejemplo exacto de lib/db.ts (BYOD, usado en load())

```ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

### Uso exacto en una ruta (ver las páginas listadas para detalles completos)

En cualquier `+page.nx` o layout:

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

Ver routing.md, server-actions.md, uso de contenido en packages.md, etc. para los **archivos completos exactos**.

| Ruta | Propósito exacto + cómo lo usa el framework |
|------|---------------------------------------------|
| `nexus.config.ts` | Cargado por CLI/server al inicio. Controla modo hardened, nonces CSP (inyectados auto), entrada CSS (compilada al vuelo en dev vía /_nexus/global.css). |
| `src/routes/+layout.nx` | Siempre corre primero. Debe contener `<head><!--nexus:head--></head>` y `<!--nexus:slot-->` para contenido hijo. Retorna pretext/head compartido. |
| `src/routes/+page.nx` | Coincide para `/`. Resultado de `load(ctx)` → pretext. Islands solo para partes interactivas. |
| `src/routes/blog/[slug]/+page.nx` | Segmento dinámico disponible como `ctx.params.slug`. Usar con loadContent para MD o DB. |
| `.../+server.nx` | Rutas API. Exporta `GET`, `POST` etc. Recibe ctx con req/res. Retorna ctx.json() etc. |
| `public/` | Servido estáticamente en raíz. Usar con assets.md Image() para optimización. |

Todas las rutas usan las convenciones exactas que el compilador/router del framework espera. Ver las otras páginas de esta lista para el código fuente .nx completo que debes escribir.
