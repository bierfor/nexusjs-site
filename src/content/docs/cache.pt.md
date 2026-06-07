# Cache e Revalidação

Helper **exato** de cache() que você chama de load().

```ts
export async function load(ctx) {
  const data = await ctx.cache('posts:all', async () => {
    return db.posts.findMany({ published: true });
  }, { ttl: 60_000, tags: ['posts'] });

  return { posts: data };
}
```

Invalide de qualquer lugar (action, webhook, etc.):

```ts
await ctx.invalidate('posts:all');           // key exata
await ctx.invalidateTag('posts');            // todas as keys com a tag
```

O framework calcula automaticamente os headers Cache-Control corretos para a resposta baseados nos TTLs que você declarou. Veja streaming.md para como interage com streaming + suspense, e server-actions.md para invalidar depois de uma mutação. Todos os padrões são os exatos usados no site real de docs e exemplos.

## Uso básico

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

## Revalidação

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

## Estratégias de cache

| Estratégia | Comportamento |
|------------|---------------|
| `ttl` | Time-to-live em segundos |
| `tags` | Invalidar por tag |
| `swr` | Stale-while-revalidate (serve stale, refresca em background) |
| `vary` | Segmentos de chave de cache (ex. `['locale', 'tenant']`) |
