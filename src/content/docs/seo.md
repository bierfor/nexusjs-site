# SEO & Head Management

**Exact** way to manage <title>, meta, og, twitter, JSON-LD etc. using only `load()` + the `head` object. The renderer does everything else.

## Exact recommended pattern: return `head` from `load()`

```ts
// src/routes/blog/[slug]/+page.nx  (or any layout/page)
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
      // You can also return JSON-LD as a string or object (renderer will serialize it)
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

In your root `+layout.nx` put **exactly** this marker (nothing else needed):

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--nexus:head-->
</head>
```

The framework:
- Calls `defineHead(ctx)` with everything returned from the route chain
- Flushes it
- Renders safe HTML
- Injects it (replaces the marker or appends before </head>)

## Exact layout + page merging (child wins)

Root layout returns base tags:

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

A page can override only what it needs:

```ts
export async function load(ctx) {
  return {
    head: {
      title: `${post.title} — My Blog`,   // overrides
      description: post.excerpt,          // overrides
      // canonical, og, etc. added on top
    },
  };
}
```

## Exact client-side reactive head (useHead in islands)

```ts
// inside an island or a <script> with client: directive
import { useHead } from '@nexus_js/head';

let title = $state('Dynamic Title');

useHead(() => ({
  title: `${title} — Live`,
  description: 'Updated on the client',
}));
```

Changes are reflected immediately in the document head.

## Exact usage with @nexus_js/content (MD frontmatter → head)

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

All the patterns above are taken directly from the @nexus_js/head + server renderer code and real usage in the docs site + examples. Use them exactly. See the other pages in this list (quickstart.md for the minimal load + head, server-actions.md for actions that also return head/redirect, content usage in packages.md).
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
