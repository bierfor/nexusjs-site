# El formato de componente .nx

**Exactamente** lo que escribes en cada archivo. Máx 4 secciones. El compilador convierte esto en HTML SSR seguro + islands mínimas. Todos los ejemplos abajo son completos, copy-paste, modo correcto (load retorna pretext/head, interpolación directa, etc.).

## Secciones exactas (lo que el framework espera)

| Sección   | Sintaxis exacta               | Qué hace el framework                                        |
|-----------|-------------------------------|--------------------------------------------------------------|
| Frontmatter | `---` ... `---`             | Corre solo en servidor. Imports + `export async function load(ctx)` |
| Template  | HTML/Svelte-like (sin <script> adentro) | SSR con `{pretext.key}` (escapado). Soporta {#if}, {#each}, <nexus-island> |
| `<style>` | `<style>` ... `</style>`     | Auto-scoped (hash data-nx). Va a CSS global en dev           |
| `<script>`| `<script>` ... `</script>`   | Runes de cliente ($state etc.) o acciones "use server"       |

## Página mínima exacta (el archivo que realmente creas)

```svelte
---
import { db } from '$lib/db';

export async function load(ctx) {
  // ctx tiene: params, req, res, rateLimit, setCookie, secrets, etc.
  const posts = await db.posts.findMany({ where: { published: true } });
  return {
    posts,
    head: {
      title: 'Blog',
      description: 'Últimas publicaciones',
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

<!-- Uso exacto de island (solo esta parte se hidrata) -->
<nexus-island client:visible src="$lib/islands/like-button.ts"></nexus-island>

<style>
  h1 { font-size: 2rem; }
</style>
```

**Exactamente qué hace el framework con este archivo:**
- Frontmatter corre en cada request (solo servidor).
- Objeto retornado → `pretext` (mezclado con layouts).
- Template → HTML estático (enviado inmediatamente).
- Style → hasheado + inyectado.
- Directiva Island → bundle cliente separado, hidratado cuando visible.
- Head → inyectado auto vía renderer (ver seo.md para patrón exacto de load() head).

## Ejemplo completo exacto con paquete de contenido + acción + island (página realista)

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
---

// Acción de servidor exacta (llamada desde form o island)
export async function likePost(postId, ctx) {
  if (!ctx.rateLimit('likePost', { max: 10, window: 60_000 })) {
    return { error: 'Demasiados likes' };
  }
  await db.likes.create({ postId, userId: ctx.user?.id });
  return { liked: true };
}
---

<h1>{pretext.post.meta.title}</h1>
<p>{pretext.t('blog.by')} {pretext.post.meta.author}</p>

<article>
  {pretext.post.html}   <!-- HTML sanitizado exacto del paquete de contenido -->
</article>

<form action={likePost} method="post">
  <input type="hidden" name="postId" value="{pretext.post.meta.id}" />
  <button type="submit">Me gusta</button>
</form>

<!-- Island exacta que puede llamar la acción o usar runes -->
<nexus-island client:visible src="$lib/islands/like-button.ts" data-post-id="{pretext.post.meta.id}"></nexus-island>

<style>
  article { max-width: 65ch; }
</style>
```

Island correspondiente exacta:

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
    // manejar respuesta, actualizar UI con runes/state
  });
}
```

## DX exacto en tiempo de compilación (0.9.23/0.9.30+)

Si escribes sintaxis rota el compilador te da **errores exactos** que puedes arreglar inmediatamente:

- NX-101: `{#if}` sin cerrar
- NX-103/104: `{#each}` malo (falta `as item`)

Ejecuta `nexus build` o `pnpm dev` — obtienes frames bonitos + carets vía `formatCompileError`.

Ver la salida de error exacta en los ejemplos del monorepo o ejecuta el compilador sobre un .nx roto tú mismo.

Todos los ejemplos arriba están tomados de uso real en el ejemplo paylinks-saas y el propio sitio de docs. Cópialos exactamente — funcionarán.

Ver la Referencia de Paquetes (packages.md) para códigos de error completos y ejemplos.

## Reglas

- Solo `+layout.nx` debe emitir `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`
- Todos los archivos `+page.nx` deben ser fragmentos (hijos de `<!--nexus:slot-->`)
- CSS es scoped por archivo usando atributos `data-nx="hash"`
- Usa `:global(selector)` para escapar el scoping cuando sea necesario
