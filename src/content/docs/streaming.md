# Streaming SSR

Send the HTML shell instantly, stream in slow parts as they resolve.

## How it works

Nexus uses streaming SSR by default. When a `load()` function returns a promise, the framework renders the shell immediately and streams the resolved content into placeholder slots.

## Fallback while loading

```svelte
---
export async function load(ctx) {
  const slowData = db.analytics.aggregate().catch(() => null);
  return { slowData };
}
---

<div class="analytics">
  {#await pretext.slowData}
    <p>Loading analytics…</p>
  {:then data}
    <Chart data={data} />
  {:catch}
    <p>Could not load analytics.</p>
  {/await}
</div>
```

## Error boundaries

Errors in `load()` are caught and rendered as fallback UI without crashing the entire page.

```svelte
---
export async function load(ctx) {
  const risky = await fetchExternal().catch(() => null);
  return { risky };
}
---
```