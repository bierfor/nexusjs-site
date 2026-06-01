The file system is your router. No config required.

### Convention

| File                        | Route                  |
|----------------------------|------------------------|
| `+page.nx`                 | `/`                    |
| `about/+page.nx`           | `/about`               |
| `blog/[slug]/+page.nx`     | `/blog/:slug`          |
| `(auth)/login/+page.nx`    | `/login` (group)       |
| `+layout.nx`               | Layout wrapper         |
| `api/users/+server.nx`     | API route              |

### Dynamic routes

```svelte
---
export async function load(ctx) {
  const slug = ctx.params.slug;
  const post = await db.posts.findBySlug(slug);
  if (!post) return ctx.notFound();
  return { post };
}
---

<h1>{pretext.post.title}</h1>
```

### Layouts

Layouts nest automatically. A child layout wraps inside its parent layout at `<!--nexus:slot-->`.

### API routes

```svelte
---
export async function GET(ctx) {
  return ctx.json({ ok: true, time: Date.now() });
}

export async function POST(ctx) {
  const body = await ctx.req.json();
  return ctx.json({ received: body });
}
---
```
