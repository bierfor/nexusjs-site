# The .nx Component Format

**Exactly** what you write in every file. 4 sections max. The compiler turns this into secure SSR HTML + minimal islands. All examples below are complete, copy-paste, modo correcto (load returns pretext/head, direct interpolation, etc.).

## Exact sections (what the framework expects)

| Section   | Exact syntax                  | What the framework does                                      |
|-----------|-------------------------------|--------------------------------------------------------------|
| Frontmatter | `---` ... `---`             | Runs on server only. Imports, exported values, and `load()` / `preload()` functions |
| Template  | Svelte 5 Runes-compatible HTML (no <script> inside) | SSR with `{pretext.key}` (escaped). Supports {#if}, {#each}, <nexus-island> |
| `<style>` | `<style>` ... `</style>`     | Auto-scoped (data-nx hash). Goes to global CSS in dev        |
| `<script>`| `<script>` ... `</script>`   | Client runes ($state etc.) or "use server" actions           |

## Exact minimal page (the file you actually create)

```svelte
---
import { db } from '$lib/db';

export async function load(ctx) {
  // ctx has: params, req, res, rateLimit, setCookie, secrets, etc.
  const posts = await db.posts.findMany({ where: { published: true } });
  return {
    posts,
    head: {
      title: 'Blog',
      description: 'Latest posts',
    },
  };
}
---

<h1>Blog</h1>

<ul>
  {#each pretext.posts as post}
    <li>
      <a href="/blog/{post.slug}">{post.title}</a>
      <time>{post.publishedAt}</time>
    </li>
  {/each}
</ul>

<!-- Exact island usage (only this part hydrates) -->
<nexus-island client:visible src="$lib/islands/like-button.ts"></nexus-island>

<style>
  h1 { font-size: 2rem; }
</style>
```

**Exactly what the framework does with this file:**
- Frontmatter runs on every request (server-only).
- Returned object → `pretext` (merged with layouts).
- Template → static HTML (sent immediately).
- Style → hashed + injected.
- Island directive → separate client bundle, hydrated when visible.
- Head → auto-injected via renderer (see seo.md for exact load() head pattern).

## Exact full example with content package + action + island (realistic page)

```svelte
---
import { loadContent } from '@nexus_js/content';
import { resolveLocale, createT } from '$lib/i18n.ts';

export async function load(ctx) {
  const locale = resolveLocale(ctx);
  const t = createT(locale);

  const entry = loadContent(`blog/${ctx.params.slug}`, { locale });
  if (!entry) return ctx.notFound();

  return {
    post: entry,
    t,
    head: {
      title: `${entry.meta.title} — My Blog`,
      description: entry.meta.excerpt,
    },
  };
}

// Exact server action (called from form or island)
export async function likePost(postId, ctx) {
  if (!ctx.rateLimit('likePost', { max: 10, window: 60_000 })) {
    return { error: 'Too many likes' };
  }
  await db.likes.create({ postId, userId: ctx.user?.id });
  return { liked: true };
}
---

<h1>{pretext.post.meta.title}</h1>
<p>{pretext.t('blog.by')} {pretext.post.meta.author}</p>

<article>
  {pretext.post.html}   <!-- exact sanitized HTML from content package -->
</article>

<form action={likePost} method="post">
  <input type="hidden" name="postId" value="{pretext.post.meta.id}" />
  <button type="submit">Like</button>
</form>

<!-- Exact island that can call the action or use runes -->
<nexus-island client:visible src="$lib/islands/like-button.ts" data-post-id="{pretext.post.meta.id}"></nexus-island>

<style>
  article { max-width: 65ch; }
</style>
```

Corresponding exact island:

```ts
// src/lib/islands/like-button.ts
export default function init(root: HTMLElement) {
  const btn = root.querySelector('button');
  const postId = root.dataset.postId;

  btn?.addEventListener('click', async () => {
    const res = await fetch('/_nexus/action/likePost', {
      method: 'POST',
      body: new URLSearchParams({ postId }),
    });
    // handle response, update UI with runes/state
  });
}
```

## Exact Compile-time DX (v0.9.31)

If you write broken syntax the compiler gives you **exact** errors you can fix immediately:

- NX-101: unclosed `{#if}`
- NX-103/104: bad `{#each}` (missing `as item`)

Run `nexus build` or `pnpm dev` — you get beautiful frames + carets via `formatCompileError`.

See the exact error output in the monorepo examples or run the compiler on a broken .nx yourself.

All examples above are taken from real usage in the paylinks-saas example and the docs site itself. Copy them exactly — they will work.

See the Package Reference (packages.md) for full error codes and examples.

## Link prefetching (v0.9.31)

Add `data-nx-prefetch` to any `<a>` tag to control when the next page is prefetched:

| Attribute | Behavior |
|-----------|----------|
| `data-nx-prefetch="hover"` | Prefetch when the user hovers the link (default) |
| `data-nx-prefetch="visible"` | Prefetch when the link enters the viewport |
| `data-nx-prefetch="load"` | Prefetch immediately on page load |
| `data-nx-prefetch="false"` | Disable prefetch for this link |

```svelte
<a href="/about" data-nx-prefetch="visible">About</a>
<a href="/checkout" data-nx-prefetch="load">Checkout</a>
<a href="/external" data-nx-prefetch="false">External link</a>
```

## Rules

- Only `+layout.nx` should emit `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`
- All `+page.nx` files must be fragments (children of `<!--nexus:slot-->`)
- CSS is scoped per file using `data-nx="hash"` attributes
- Use `:global(selector)` to escape scoping when needed