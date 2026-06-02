# SEO & Head Management

Server-side metadata injection with client-side reactive updates.

## Recommended: return `head` from `load()`

The easiest and most powerful way (auto-injected by the renderer, no manual template work needed):

```ts
// src/routes/+page.nx or any layout/page
export async function load(ctx) {
  const post = await db.posts.find(ctx.params.id);

  return {
    post,
    // This object is automatically picked up, passed through defineHead(ctx),
    // flushed, rendered to safe HTML, and injected into <head> (replaces <!--nexus:head--> or injects before </head>).
    head: {
      title: `${post.title} — Nexus.js`,
      description: post.excerpt,
      canonical: `https://nexusjs.dev/blog/${post.slug}`,
      og: {
        type: 'article',
        image: post.cover,
        imageAlt: post.title,
      },
      twitter: {
        card: 'summary_large_image',
      },
    },
  };
}
```

In your root layout just keep the marker:

```html
<head>
  ...static tags...
  <!--nexus:head-->
</head>
```

Layouts and pages are merged (deeper/child wins). Perfect for per-page SEO while sharing base tags.

## Layout inheritance

Return partial `head` objects from layouts and let pages override only what they need:

```ts
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

Merged result for `/blog/hello-world`:

- `title` → `"Hello World | Nexus.js"` (template from layout, title from page)
- `og:type` → `"article"` (page wins)
- `og:siteName` → `"Nexus.js"` (preserved from layout)
- `twitter:card` → `"summary_large_image"` (page wins)
- `twitter:site` → `"@nexusjs"` (preserved from layout)

## `titleTemplate`

Use `%s` as a placeholder for the page title:

```ts
head: {
  title: 'Quick Start',
  titleTemplate: '%s — Nexus.js Docs',
}
```

Renders: `<title>Quick Start — Nexus.js Docs</title>`

If the page does not set `title`, the template is not applied.

## Structured data (JSON-LD)

Inject Schema.org structured data for rich search results:

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

You can also pass an array of schemas:

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

Or as a plain string:

```ts
robots: 'index, follow, max-image-preview:large'
```

## Legacy / explicit defineHead

Still supported for advanced cases or imperative control:

```ts
---
import { defineHead } from '@nexus_js/head';

defineHead({ title: '...', og: { image: '...' } });
---
```

Pass `ctx` for request-scoped isolation (safe with concurrent streaming):

```ts
defineHead({ title: '...' }, ctx);
```

## Client / island reactive updates

Inside islands that hydrate on the client, `useHead` reactively updates `<head>` when signals change:

```html
<div client:load>
  <script>
    let title = $state('Loading...');
    useHead(() => ({ title: `${title.value} — Live` }));
  </script>
  ...
</div>
```

`useHead` is automatically imported in island scripts. It cleans up previously injected elements on every re-run, so old `<meta>` tags never leak.

## Full HeadMeta shape

Supports: `title`, `titleTemplate`, `description`, `canonical`, `robots`, `og.*`, `twitter.*`, `jsonLd`, `links`, `metas`, `scripts`, `themeColor`, `favicon`, `viewport`.

All string values are HTML-escaped automatically (`<`, `>`, `&`, `"`), making SSR injection safe against XSS by default.

## Sitemap generation

`nexus build` emits a `sitemap.xml` based on the route manifest automatically.

## Migration from old `defineMetadata`

The old `defineMetadata` (from `@nexus_js/server`) is deprecated. Migrate using one of these strategies:

**Before:**
```ts
import { defineMetadata } from '@nexus_js/server';

defineMetadata({ title: 'Old Way' });
```

**After (recommended):**
```ts
export async function load(ctx) {
  return {
    head: { title: 'New Way' },
  };
}
```

**After (imperative):**
```ts
import { defineHead } from '@nexus_js/server';

defineHead({ title: 'New Way' });
```

## Why this is better than manual `<head>` in every layout

- **No duplication.** Base tags live in the root layout; pages only declare what differs.
- **Natural merge.** Works with the pretext system (layouts + pages, child wins).
- **Request-scoped.** Safe with concurrent streaming requests — no global state leaks.
- **XSS-safe.** Built-in HTML escaping on every attribute.
- **One source of truth.** SEO metadata lives next to the data that powers it (`load()`).
- **Zero client JS.** SSR injection requires no runtime overhead for crawlers.
