# SEO y Gestión del Head

**Forma exacta** de gestionar <title>, meta, og, twitter, JSON-LD etc. usando solo `load()` + el objeto `head`. El renderer hace todo lo demás.

## Patrón recomendado exacto: retornar `head` desde `load()`

```ts
// src/routes/blog/[slug]/+page.nx  (o cualquier layout/page)
export async function load(ctx) {
  const post = await db.posts.find(ctx.params.slug);
  if (!post) return ctx.notFound();

  return {
    post,
    head: {
      title: `${post.title} — My Blog`,
      description: post.excerpt || post.summary?.slice(0, 160),
      canonical: `https://example.com/blog/${post.slug}`,
      robots: post.draft ? 'noindex' : undefined,
      og: {
        type: 'article',
        url: `https://example.com/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        image: post.cover || post.images?.[0],
        imageAlt: post.title,
        siteName: 'My Blog',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@myblog',
      },
      // También puedes retornar JSON-LD como string u objeto (el renderer lo serializará)
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        author: { '@type': 'Person', name: post.author },
      },
    },
  };
}
```

En tu root `+layout.nx` pon **exactamente** este marcador (nada más necesario):

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--nexus:head-->
</head>
```

El framework:
- Llama `defineHead(ctx)` con todo lo retornado de la cadena de rutas
- Lo flushea
- Renderiza HTML seguro
- Lo inyecta (reemplaza el marcador o appendea antes de </head>)

## Mezcla exacta de layout + página (el hijo gana)

El layout raíz retorna tags base:

```ts
export async function load(ctx) {
  return {
    head: {
      title: 'My Blog',
      description: 'Thoughts on code and life',
    },
  };
}
```

Una página puede sobrescribir solo lo que necesita:

```ts
export async function load(ctx) {
  return {
    head: {
      title: `${post.title} — My Blog`,   // sobrescribe
      description: post.excerpt,          // sobrescribe
      // canonical, og, etc. se añaden encima
    },
  };
}
```

## Head reactivo exacto del lado cliente (useHead en islands)

```ts
// dentro de una island o <script> con directiva client:
import { useHead } from '@nexus_js/head';

let title = $state('Dynamic Title');

useHead(() => ({
  title: `${title} — Live`,
  description: 'Updated on the client',
}));
```

Los cambios se reflejan inmediatamente en el document head.

## Uso exacto con @nexus_js/content (frontmatter MD → head)

```ts
export async function load(ctx) {
  const entry = loadContent(`blog/${ctx.params.slug}`, { locale: ctx.locale });
  return {
    entry,
    head: {
      title: entry.meta.title,
      description: entry.meta.description,
      og: { image: entry.meta.image },
    },
  };
}
```

Todos los patrones arriba están tomados directamente del código de @nexus_js/head + renderer del server y uso real en el sitio docs + ejemplos. Úsalos exactamente. Ver las otras páginas de esta lista (quickstart.md para el load + head mínimo, server-actions.md para actions que también retornan head/redirect, uso de contenido en packages.md).

```svelte
// src/routes/+layout.nx
export async function load(ctx) {
  return {
    head: {
      titleTemplate: '%s | Nexus.js',
      canonical: `https://nexusjs.dev${ctx.url.pathname}`,
      og: {
        type: 'website',
        siteName: 'Nexus.js',
        image: 'https://nexusjs.dev/nexus-logo.svg',
      },
      twitter: {
        card: 'summary',
        site: '@nexusjs',
      },
    },
  };
}
```

```ts
// src/routes/blog/[slug]/+page.nx
export async function load(ctx) {
  const post = await getPost(ctx.params.slug);
  return {
    post,
    head: {
      title: post.title,
      description: post.excerpt,
      canonical: `https://nexusjs.dev/blog/${post.slug}`,
      og: {
        type: 'article',
        image: post.coverImage,
        imageAlt: post.title,
      },
      twitter: {
        card: 'summary_large_image',
      },
    },
  };
}
```

Resultado mezclado para `/blog/hello-world`:

- `title` → `"Hello World | Nexus.js"` (template del layout, title de la página)
- `og:type` → `"article"` (la página gana)
- `og:siteName` → `"Nexus.js"` (preservado del layout)
- `twitter:card` → `"summary_large_image"` (la página gana)
- `twitter:site` → `"@nexusjs"` (preservado del layout)

## `titleTemplate`

Usa `%s` como placeholder para el título de la página:

```ts
head: {
  title: 'Quick Start',
  titleTemplate: '%s — Nexus.js Docs',
}
```

Renderiza: `<title>Quick Start — Nexus.js Docs</title>`

Si la página no establece `title`, el template no se aplica.

## Datos estructurados (JSON-LD)

Inyecta datos estructurados Schema.org para resultados de búsqueda ricos:

```ts
head: {
  title: 'My Article',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'My Article',
    author: {
      '@type': 'Person',
      name: 'Jane Doe',
    },
    datePublished: '2026-06-01',
  },
}
```

También puedes pasar un array de schemas:

```ts
jsonLd: [
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Nexus.js', url: 'https://nexusjs.dev' },
  { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: 'My Article' },
]
```

## Robots & canonical

```ts
head: {
  canonical: 'https://example.com/page',
  robots: {
    index: true,
    follow: true,
    noarchive: false,
  },
}
```

O como string plano:

```ts
robots: 'index, follow, max-image-preview:large'
```

## defineHead legacy / explícito

Todavía soportado para casos avanzados o control imperativo:

```ts
---
import { defineHead } from '@nexus_js/head';

defineHead({ title: '...', og: { image: '...' } });
---
```

Pasa `ctx` para aislamiento por request (seguro con streaming concurrente):

```ts
defineHead({ title: '...' }, ctx);
```

## Actualizaciones reactivas de cliente / island

Dentro de islands que hidratan en el cliente, `useHead` actualiza reactivamente el `<head>` cuando cambian las señales:

```html
<div client:load>
  <script>
    let title = $state('Loading...');
    useHead(() => ({ title: `${title.value} — Live` }));
  </script>
  ...
</div>
```

`useHead` se importa automáticamente en scripts de islands. Limpia elementos previamente inyectados en cada re-ejecución, así que etiquetas `<meta>` antiguas nunca se filtran.

## Forma completa de HeadMeta

Soporta: `title`, `titleTemplate`, `description`, `canonical`, `robots`, `og.*`, `twitter.*`, `jsonLd`, `links`, `metas`, `scripts`, `themeColor`, `favicon`, `viewport`.

Todos los valores string son escapados en HTML automáticamente (`<`, `>`, `&`, `"`), haciendo la inyección SSR segura contra XSS por defecto.

## Generación de sitemap

`nexus build` emite un `sitemap.xml` basado en el manifest de rutas automáticamente.

## Migración desde el viejo `defineMetadata`

El viejo `defineMetadata` (de `@nexus_js/server`) está deprecado. Migra usando una de estas estrategias:

**Antes:**
```ts
import { defineMetadata } from '@nexus_js/server';

defineMetadata({ title: 'Old Way' });
```

**Después (recomendado):**
```ts
export async function load(ctx) {
  return {
    head: { title: 'New Way' },
  };
}
```

**Después (imperativo):**
```ts
import { defineHead } from '@nexus_js/server';

defineHead({ title: 'New Way' });
```

## Por qué esto es mejor que `<head>` manual en cada layout

- **Sin duplicación.** Los tags base viven en el layout raíz; las páginas solo declaran lo que difiere.
- **Mezcla natural.** Funciona con el sistema de pretext (layouts + páginas, el hijo gana).
- **Por request.** Seguro con requests de streaming concurrentes — sin fugas de estado global.
- **Seguro contra XSS.** Escapado HTML incorporado en cada atributo.
- **Una única fuente de verdad.** Los metadatos SEO viven al lado de los datos que los alimentan (`load()`).
- **Cero JS de cliente.** La inyección SSR no requiere overhead de runtime para crawlers.
