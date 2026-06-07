# Cache & Revalidation

**Exact** cache() helper you call from load().

```ts
export async function load(ctx) {
  const data = await ctx.cache('posts:all', async () => {
    return db.posts.findMany({ published: true });
  }, { ttl: 60_000, tags: ['posts'] });

  return { posts: data };
}
```

Invalidate from anywhere (action, webhook, etc.):

```ts
await ctx.invalidate('posts:all');           // exact key
await ctx.invalidateTag('posts');            // all keys with the tag
```

The framework automatically computes the right Cache-Control headers for the response based on the TTLs you declared. See streaming.md for how this interacts with streaming + suspense, and server-actions.md for invalidating after a mutation. All patterns are the exact ones used in the real docs site and examples.

## Basic usage

```svelte
---
import { cache } from '@nexus_js/server';

export async function load(ctx) {
  const posts = await cache('posts:all', () => db.posts.findMany(), {
    ttl: 60,
    tags: ['posts'],
  });
  return { posts };
}
---
```

## Revalidation

```svelte
<script>
  "use server";
  async function createPost(formData) {
    await db.posts.create({ title: formData.get('title') });
    await revalidateTag('posts');
    return { ok: true };
  }
</script>
```

## Cache strategies

| Strategy | Behavior |
|----------|----------|
| `ttl` | Time-to-live in seconds |
| `tags` | Invalidate by tag |
| `swr` | Stale-while-revalidate (serve stale, refresh in background) |
| `vary` | Cache key segments (e.g. `['locale', 'tenant']`) |