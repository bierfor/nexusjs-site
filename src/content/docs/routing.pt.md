O sistema de arquivos é seu router. Nenhuma configuração necessária. **Exato** mapeamento arquivo → rota que o framework usa.

### Convenções exatas de nomenclatura de arquivos (copie estes padrões)

| Arquivo exato que você cria          | URL exata que corresponde       | O que load(ctx) recebe                   |
|--------------------------------------|---------------------------------|------------------------------------------|
| `src/routes/+page.nx`               | `/`                             | {}                                       |
| `src/routes/about/+page.nx`         | `/about`                        | {}                                       |
| `src/routes/blog/[slug]/+page.nx`   | `/blog/my-post`                 | `ctx.params.slug === 'my-post'`          |
| `src/routes/(marketing)/about/+page.nx` | `/about` (grupo, sem segmento na URL) | {}                             |
| `src/routes/api/users/+server.nx`   | `/api/users` (só API)           | ctx.req / ctx.res completo               |
| `src/routes/blog/[...slug]/+page.nx`| `/blog/a/b/c`                   | `ctx.params.slug === 'a/b/c'` (catch-all)|

### Rota dinâmica exata + load + tratamento de erro (o arquivo que você escreve)

```svelte
---
export async function load(ctx) {
  const slug = ctx.params.slug;           // exatamente o que o router parseou
  const post = await db.posts.findBySlug(slug);

  if (!post) {
    return ctx.notFound();                // resposta 404 exata do framework
  }

  if (post.draft && !ctx.user?.isAdmin) {
    return ctx.notFound();
  }

  return {
    post,
    head: { title: post.title },
  };
}
---

<h1>{pretext.post.title}</h1>
<p>Por {pretext.post.author}</p>
```

### Layouts aninhados exatos (os dois arquivos que você escreve)

Root `src/routes/+layout.nx`:

```svelte
---
export async function load(ctx) {
  return { siteName: 'My Blog' };
}
---

<!doctype html>
<html>
<head>
  <title>{pretext.siteName}</title>
  <!--nexus:head-->
</head>
<body>
  <nav>...</nav>
  <!--nexus:slot-->     <!-- o conteúdo filho é inserido exatamente aqui -->
</body>
</html>
```

Filho `src/routes/blog/+layout.nx`:

```svelte
---
export async function load(ctx) {
  return { section: 'Blog' };
}
---

<header>Seção Blog</header>
<!--nexus:slot-->   <!-- o neto vai aqui -->
```

O framework mescla pretext (o filho vence) e aninha o HTML nos marcadores de slot.

### Rota API exata (full +server.nx)

```svelte
---
export async function GET(ctx) {
  const posts = await db.posts.findMany();
  return ctx.json({ posts });   // Response exato com headers corretos
}

export async function POST(ctx) {
  const data = await ctx.req.json();
  const created = await db.posts.create(data);
  return ctx.json(created, { status: 201 });
}
---
```

Chame-o do navegador ou de outra action exatamente como um fetch normal.

Veja as outras páginas desta lista (islands.md para client:*, server-actions.md para "use server", quickstart.md para o exemplo mínimo completo) para como combinar routing com o resto do framework. Todos os padrões acima são tirados verbatim do código real nos exemplos e no próprio site de docs.
