# Streaming SSR

Envía el shell HTML al instante, transmite las partes lentas a medida que se resuelven.

## Cómo funciona

Nexus usa streaming SSR por defecto. Cuando una función `load()` retorna una promesa, el framework renderiza el shell inmediatamente y transmite el contenido resuelto en slots de placeholder.

## Fallback mientras carga

```svelte
---
export async function load(ctx) {
  const slowData = db.analytics.aggregate().catch(() => null);
  return { slowData };
}
---

<div class="analytics">
  {#await pretext.slowData}
    <p>Cargando analíticas…</p>
  {:then data}
    <Chart data={data} />
  {:catch}
    <p>No se pudieron cargar las analíticas.</p>
  {/await}
</div>
```

## Límites de error

Los errores en `load()` son capturados y renderizados como UI de fallback sin romper toda la página.

```svelte
---
export async function load(ctx) {
  const risky = await fetchExternal().catch(() => null);
  return { risky };
}
---
```
