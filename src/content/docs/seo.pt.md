# SEO e Gerenciamento do Head

**Forma exata** de gerenciar <title>, meta, og, twitter, JSON-LD etc. usando apenas `load()` + o objeto `head`. O renderer faz todo o resto.

## Padrão recomendado exato: retornar `head` de `load()`

```ts
// src/routes/blog/[slug]/+page.nx  (ou qualquer layout/page)
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
      // Você também pode retornar JSON-LD como string ou objeto (o renderer serializará)
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

No seu root `+layout.nx` coloque **exatamente** este marcador (nada mais necessário):

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--nexus:head-->
</head>
```

O framework:
- Chama `defineHead(ctx)` com tudo retornado da cadeia de rotas
- Faz flush
- Renderiza HTML seguro
- Injeta (substitui o marcador ou append antes de </head>)

## Mesclagem exata de layout + página (o filho vence)

O layout raiz retorna tags base:

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

Uma página pode sobrescrever só o que precisa:

```ts
export async function load(ctx) {
  return {
    head: {
      title: `${post.title} — My Blog`,   // sobrescreve
      description: post.excerpt,          // sobrescreve
      // canonical, og, etc. adicionados em cima
    },
  };
}
```

## Head reativo exato do lado cliente (useHead em islands)

```ts
// dentro de uma island ou <script> com diretiva client:
import { useHead } from '@nexus_js/head';

let title = $state('Dynamic Title');

useHead(() => ({
  title: `${title} — Live`,
  description: 'Updated on the client',
}));
```

As mudanças são refletidas imediatamente no document head.

## Uso exato com @nexus_js/content (frontmatter MD → head)

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

Todos os padrões acima são tirados diretamente do código de @nexus_js/head + renderer do server e uso real no site docs + exemplos. Use-os exatamente. Veja as outras páginas desta lista (quickstart.md para o load + head mínimo, server-actions.md para actions que também retornam head/redirect, uso de conteúdo em packages.md).

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

Resultado mesclado para `/blog/hello-world`:

- `title` → `"Hello World | Nexus.js"` (template do layout, title da página)
- `og:type` → `"article"` (a página vence)
- `og:siteName` → `"Nexus.js"` (preservado do layout)
- `twitter:card` → `"summary_large_image"` (a página vence)
- `twitter:site` → `"@nexusjs"` (preservado do layout)

## `titleTemplate`

Use `%s` como placeholder para o título da página:

```ts
head: {
  title: 'Quick Start',
  titleTemplate: '%s — Nexus.js Docs',
}
```

Renderiza: `<title>Quick Start — Nexus.js Docs</title>`

Se a página não definir `title`, o template não é aplicado.

## Dados estruturados (JSON-LD)

Injete dados estruturados Schema.org para resultados de busca ricos:

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

Você também pode passar um array de schemas:

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

Ou como string plana:

```ts
robots: 'index, follow, max-image-preview:large'
```

## defineHead legacy / explícito

Ainda suportado para casos avançados ou controle imperativo:

```ts
---
import { defineHead } from '@nexus_js/head';

defineHead({ title: '...', og: { image: '...' } });
---
```

Passe `ctx` para isolamento por request (seguro com streaming concorrente):

```ts
defineHead({ title: '...' }, ctx);
```

## Atualizações reativas de cliente / island

Dentro de islands que hidratam no cliente, `useHead` atualiza reativamente o `<head>` quando sinais mudam:

```html
<div client:load>
  <script>
    let title = $state('Loading...');
    useHead(() => ({ title: `${title.value} — Live` }));
  </script>
  ...
</div>
```

`useHead` é importado automaticamente em scripts de islands. Limpa elementos previamente injetados em cada re-execução, então tags `<meta>` antigas nunca vazam.

## Forma completa de HeadMeta

Suporta: `title`, `titleTemplate`, `description`, `canonical`, `robots`, `og.*`, `twitter.*`, `jsonLd`, `links`, `metas`, `scripts`, `themeColor`, `favicon`, `viewport`.

Todos os valores string são escapados em HTML automaticamente (`<`, `>`, `&`, `"`), tornando a injeção SSR segura contra XSS por padrão.

## Geração de sitemap

`nexus build` emite um `sitemap.xml` baseado no manifest de rotas automaticamente.

## Migração do velho `defineMetadata`

O velho `defineMetadata` (de `@nexus_js/server`) está obsoleto. Migre usando uma destas estratégias:

**Antes:**
```ts
import { defineMetadata } from '@nexus_js/server';

defineMetadata({ title: 'Old Way' });
```

**Depois (recomendado):**
```ts
export async function load(ctx) {
  return {
    head: { title: 'New Way' },
  };
}
```

**Depois (imperativo):**
```ts
import { defineHead } from '@nexus_js/server';

defineHead({ title: 'New Way' });
```

## Por que isso é melhor que `<head>` manual em cada layout

- **Sem duplicação.** As tags base vivem no layout raiz; as páginas só declaram o que difere.
- **Mesclagem natural.** Funciona com o sistema de pretext (layouts + páginas, o filho vence).
- **Por request.** Seguro com requests de streaming concorrentes — sem vazamentos de estado global.
- **Seguro contra XSS.** Escapamento HTML embutido em cada atributo.
- **Uma única fonte da verdade.** Metadados SEO vivem ao lado dos dados que os alimentam (`load()`).
- **Zero JS de cliente.** Injeção SSR não requer overhead de runtime para crawlers.
