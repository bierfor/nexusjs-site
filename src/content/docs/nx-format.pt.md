# O formato de componente .nx

**Exatamente** o que você escreve em cada arquivo. Máx 4 seções. O compilador transforma isso em HTML SSR seguro + islands mínimas. Todos os exemplos abaixo são completos, copy-paste, modo correto (load retorna pretext/head, interpolação direta, etc.).

## Seções exatas (o que o framework espera)

| Seção     | Sintaxe exata                 | O que o framework faz                                        |
|-----------|-------------------------------|--------------------------------------------------------------|
| Frontmatter | `---` ... `---`             | Roda só no servidor. Imports, valores exportados e funções `load()` / `preload()` |
| Template  | HTML compatível com Svelte 5 Runes (sem <script> dentro) | SSR com `{pretext.key}` (escapado). Suporta {#if}, {#each}, <nexus-island> |
| `<style>` | `<style>` ... `</style>`     | Auto-scoped (hash data-nx). Vai para CSS global em dev       |
| `<script>`| `<script>` ... `</script>`   | Runes de cliente ($state etc.) ou ações "use server"         |

## Página mínima exata (o arquivo que você realmente cria)

```svelte
---
import { db } from '$lib/db';

export async function load(ctx) {
  // ctx tem: params, req, res, rateLimit, setCookie, secrets, etc.
  const posts = await db.posts.findMany({ where: { published: true } });
  return {
    posts,
    head: {
      title: 'Blog',
      description: 'Últimas postagens',
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

<!-- Uso exato de island (só esta parte hidrata) -->
<nexus-island client:visible src="$lib/islands/like-button.ts"></nexus-island>

<style>
  h1 { font-size: 2rem; }
</style>
```

**Exatamente o que o framework faz com este arquivo:**
- Frontmatter roda em cada request (só servidor).
- Objeto retornado → `pretext` (mesclado com layouts).
- Template → HTML estático (enviado imediatamente).
- Style → hasheado + injetado.
- Diretiva Island → bundle cliente separado, hidratado quando visível.
- Head → injetado auto via renderer (ver seo.md para padrão exato de load() head).

## Exemplo completo exato com pacote de conteúdo + ação + island (página realista)

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

// Ação de servidor exata (chamada de form ou island)
export async function likePost(postId, ctx) {
  if (!ctx.rateLimit('likePost', { max: 10, window: 60_000 })) {
    return { error: 'Likes demais' };
  }
  await db.likes.create({ postId, userId: ctx.user?.id });
  return { liked: true };
}
---

<h1>{pretext.post.meta.title}</h1>
<p>{pretext.t('blog.by')} {pretext.post.meta.author}</p>

<article>
  {pretext.post.html}   <!-- HTML sanitizado exato do pacote de conteúdo -->
</article>

<form action={likePost} method="post">
  <input type="hidden" name="postId" value="{pretext.post.meta.id}" />
  <button type="submit">Curtir</button>
</form>

<!-- Island exata que pode chamar a ação ou usar runes -->
<nexus-island client:visible src="$lib/islands/like-button.ts" data-post-id="{pretext.post.meta.id}"></nexus-island>

<style>
  article { max-width: 65ch; }
</style>
```

Island correspondente exata:

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
    // tratar resposta, atualizar UI com runes/state
  });
}
```

## DX exato em tempo de compilação (v0.9.31)

Se você escrever sintaxe quebrada o compilador dá **erros exatos** que você pode corrigir imediatamente:

- NX-101: `{#if}` sem fechar
- NX-103/104: `{#each}` ruim (falta `as item`)

Rode `nexus build` ou `pnpm dev` — você obtém frames bonitos + carets via `formatCompileError`.

Veja a saída de erro exata nos exemplos do monorepo ou rode o compilador em um .nx quebrado você mesmo.

Todos os exemplos acima são tirados de uso real no exemplo paylinks-saas e no próprio site de docs. Copie-os exatamente — vão funcionar.

Veja a Referência de Pacotes (packages.md) para códigos de erro completos e exemplos.

## Prefetch de links (v0.9.31)

Adicione `data-nx-prefetch` a qualquer tag `<a>` para controlar quando a próxima página é prefetch:

| Atributo | Comportamento |
|----------|---------------|
| `data-nx-prefetch="hover"` | Prefetch ao passar o mouse no link (default) |
| `data-nx-prefetch="visible"` | Prefetch quando o link entra no viewport |
| `data-nx-prefetch="load"` | Prefetch imediatamente ao carregar a página |
| `data-nx-prefetch="false"` | Desativa o prefetch para este link |

```svelte
<a href="/about" data-nx-prefetch="visible">About</a>
<a href="/checkout" data-nx-prefetch="load">Checkout</a>
<a href="/external" data-nx-prefetch="false">External link</a>
```

## Regras

- Apenas `+layout.nx` deve emitir `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`
- Todos os arquivos `+page.nx` devem ser fragmentos (filhos de `<!--nexus:slot-->`)
- CSS é scoped por arquivo usando atributos `data-nx="hash"`
- Use `:global(selector)` para escapar o scoping quando necessário
