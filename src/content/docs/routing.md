The file system is your router. No config required. **Exact** file → route mapping the framework uses.

### Exact file naming conventions (copy these patterns)

| Exact file you create              | Exact URL it matches          | What load(ctx) receives                  |
|------------------------------------|-------------------------------|------------------------------------------|
| `src/routes/+page.nx`             | `/`                           | {}                                       |
| `src/routes/about/+page.nx`       | `/about`                      | {}                                       |
| `src/routes/blog/[slug]/+page.nx` | `/blog/my-post`               | `ctx.params.slug === 'my-post'`          |
| `src/routes/(marketing)/about/+page.nx` | `/about` (group, no segment in URL) | {}                             |
| `src/routes/api/users/+server.nx` | `/api/users` (API only)       | Full ctx.req / ctx.res                   |
| `src/routes/blog/[...slug]/+page.nx` | `/blog/a/b/c`              | `ctx.params.slug === 'a/b/c'` (catch-all)|

### Exact dynamic route + load + error handling (the file you write)

```svelte
---
export async function load(ctx) {
  const slug = ctx.params.slug;           // exactly what the router parsed
  const post = await db.posts.findBySlug(slug);

  if (!post) {
    return ctx.notFound();                // exact 404 response from framework
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
<p>By {pretext.post.author}</p>
```

### Exact nested layouts (the two files you write)

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
  <!--nexus:slot-->     <!-- child content is inserted here exactly -->
</body>
</html>
```

Child `src/routes/blog/+layout.nx`:

```svelte
---
export async function load(ctx) {
  return { section: 'Blog' };
}
---

<header>Blog section</header>
<!--nexus:slot-->   <!-- grand-child goes here -->
```

The framework merges pretext (child wins) and nests the HTML at the slot markers.

### Exact API route (full +server.nx)

```svelte
---
export async function GET(ctx) {
  const posts = await db.posts.findMany();
  return ctx.json({ posts });   // exact Response with correct headers
}

export async function POST(ctx) {
  const data = await ctx.req.json();
  const created = await db.posts.create(data);
  return ctx.json(created, { status: 201 });
}
---
```

Call it from the browser or another action exactly like a normal fetch.

See the other pages in this list (islands.md for client:*, server-actions.md for "use server", quickstart.md for full minimal example) for how to combine routing with the rest of the framework. All patterns above are taken verbatim from real code in the examples and the docs site itself.
