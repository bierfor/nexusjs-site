# Streaming SSR

Envie o shell HTML instantaneamente, transmita as partes lentas à medida que resolvem.

## Como funciona

Nexus usa streaming SSR por padrão. Quando uma função `load()` retorna uma promise, o framework renderiza o shell imediatamente e transmite o conteúdo resolvido em slots de placeholder.

## Fallback enquanto carrega

```svelte
---
export async function load(ctx) {
  const slowData = db.analytics.aggregate().catch(() => null);
  return { slowData };
}
---

<div class="analytics">
  {#await pretext.slowData}
    <p>Carregando analíticas…</p>
  {:then data}
    <Chart data={data} />
  {:catch}
    <p>Não foi possível carregar as analíticas.</p>
  {/await}
</div>
```

## Limites de erro

Erros em `load()` são capturados e renderizados como UI de fallback sem quebrar toda a página.

```svelte
---
export async function load(ctx) {
  const risky = await fetchExternal().catch(() => null);
  return { risky };
}
---
```
