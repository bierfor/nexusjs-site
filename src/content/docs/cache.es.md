# Caché y Revalidación

Helper **exacto** de cache() que llamas desde load().

```ts
export async function load(ctx) {
  const data = await ctx.cache('posts:all', async () => {
    return db.posts.findMany({ published: true });
  }, { ttl: 60_000, tags: ['posts'] });

  return { posts: data };
}
```

Invalida desde cualquier lugar (action, webhook, etc.):

```ts
await ctx.invalidate('posts:all');           // key exacta
await ctx.invalidateTag('posts');            // todas las keys con el tag
```

El framework calcula automáticamente los headers Cache-Control correctos para la respuesta basados en los TTLs que declaraste. Ver streaming.md para cómo interactúa con streaming + suspense, y server-actions.md para invalidar después de una mutación. Todos los patrones son los exactos usados en el sitio real de docs y ejemplos.

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

## Revalidación

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

## Estrategias de caché

| Estrategia | Comportamiento |
|------------|----------------|
| `ttl` | Time-to-live en segundos |
| `tags` | Invalidar por tag |
| `swr` | Stale-while-revalidate (sirve stale, refresca en background) |
| `vary` | Segmentos de clave de caché (ej. `['locale', 'tenant']`) |
