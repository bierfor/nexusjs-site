# Cache & Revalidation

Stale-while-revalidate caching with tag-based invalidation.

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