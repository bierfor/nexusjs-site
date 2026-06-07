El sistema de archivos es tu router. Sin configuración requerida. **Exacto** mapeo archivo → ruta que usa el framework.

### Convenciones de nomenclatura de archivos exactas (copia estos patrones)

| Archivo exacto que creas             | URL exacta que coincide       | Qué recibe load(ctx)                     |
|--------------------------------------|-------------------------------|------------------------------------------|
| `src/routes/+page.nx`               | `/`                           | {}                                       |
| `src/routes/about/+page.nx`         | `/about`                      | {}                                       |
| `src/routes/blog/[slug]/+page.nx`   | `/blog/my-post`               | `ctx.params.slug === 'my-post'`          |
| `src/routes/(marketing)/about/+page.nx` | `/about` (grupo, sin segmento en URL) | {}                             |
| `src/routes/api/users/+server.nx`   | `/api/users` (solo API)       | ctx.req / ctx.res completo               |
| `src/routes/blog/[...slug]/+page.nx`| `/blog/a/b/c`                 | `ctx.params.slug === 'a/b/c'` (catch-all)|

### Ruta dinámica exacta + load + manejo de error (el archivo que escribes)

```svelte
---
export async function load(ctx) {
  const slug = ctx.params.slug;           // exactamente lo que el router parseó
  const post = await db.posts.findBySlug(slug);

  if (!post) {
    return ctx.notFound();                // respuesta 404 exacta del framework
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

### Layouts anidados exactos (los dos archivos que escribes)

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
  <!--nexus:slot-->     <!-- el contenido hijo se inserta aquí exactamente -->
</body>
</html>
```

Hijo `src/routes/blog/+layout.nx`:

```svelte
---
export async function load(ctx) {
  return { section: 'Blog' };
}
---

<header>Sección Blog</header>
<!--nexus:slot-->   <!-- el nieto va aquí -->
```

El framework mezcla pretext (el hijo gana) y anida el HTML en los marcadores slot.

### Ruta API exacta (full +server.nx)

```svelte
---
export async function GET(ctx) {
  const posts = await db.posts.findMany();
  return ctx.json({ posts });   // Response exacto con headers correctos
}

export async function POST(ctx) {
  const data = await ctx.req.json();
  const created = await db.posts.create(data);
  return ctx.json(created, { status: 201 });
}
---
```

Llámalo desde el navegador u otra acción exactamente como un fetch normal.

Ver las otras páginas de esta lista (islands.md para client:*, server-actions.md para "use server", quickstart.md para el ejemplo mínimo completo) para cómo combinar routing con el resto del framework. Todos los patrones arriba están tomados verbatim del código real en los ejemplos y el propio sitio de docs.
