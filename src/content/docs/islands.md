# Islands Architecture

Nexus ships **zero JavaScript by default**. Only the components you explicitly mark with a `client:*` directive receive a browser bundle. Everything else is server-rendered static HTML.

This is "islands architecture": small, self-contained interactive regions in a sea of static markup.

---

## Hydration directives

Add the attribute directly to any element in your `.nx` template:

| Directive | Behavior |
|-----------|----------|
| `client:visible` | Hydrate when the island enters the viewport (recommended default) |
| `client:idle` | Hydrate when the browser is idle |
| `client:load` | Hydrate immediately on page load (critical UI: header, cart) |
| `client:media="(min-width: 768px)"` | Hydrate when the media query matches (responsive conditional) |
| `server:only` | Never ships JS; pure static HTML (default if no directive is present) |

---

## Two kinds of islands

### 1. Inline islands

Write the interactive logic directly inside the `.nx` file. The compiler extracts the client code automatically.

```svelte
<div client:visible>
  <script>
    let count = $state(0);
  </script>
  <button onclick={() => count++}>
    Clicked {count} times
  </button>
</div>
```

Use inline islands for small, one-off interactions that don't need reuse.

### 2. External islands (recommended)

Keep islands in `src/lib/islands/` and reference them via `src`. This is the preferred pattern for any non-trivial client logic.

```svelte
<!-- src/routes/counter/+page.nx -->
---
export async function load(ctx) {
  return { initialCount: 42 };
}
---

<h1>Counter demo</h1>

<nexus-island
  client:visible
  src="$lib/islands/counter.ts"
  data-initial="{pretext.initialCount}">
</nexus-island>
```

```ts
// src/lib/islands/counter.ts
export default function init(root: HTMLElement) {
  let count = $state(0);

  const btn = document.createElement('button');
  btn.textContent = `Count: ${count}`;
  root.appendChild(btn);

  $effect(() => {
    btn.textContent = `Count: ${count}`;
  });

  btn.addEventListener('click', () => count++);

  // Read server data passed via data-* attributes
  const initial = root.dataset.initial;
  if (initial) count = parseInt(initial, 10);
}
```

**Island contract:**
- File must export `export default function init(root: HTMLElement, data?: any)`.
- `root` is the `<nexus-island>` element itself.
- The framework sets up the Svelte 5 runes context before calling `init`, so `$state`, `$effect`, and `$derived` work immediately.
- You can read `data-*` attributes from `root.dataset` for server-to-client data transfer.

---

## Default hydration strategy

You can set a project-wide default in `nexus.config.ts` so you don't have to repeat the directive on every island:

```ts
export default {
  defaultHydration: 'client:visible', // or 'client:idle' / 'client:load'
};
```

With this config, `<nexus-island src="$lib/islands/counter.ts">` without any directive will use `client:visible`.

---

## State survival across navigation

Because islands are self-contained, their internal `$state` survives SPA navigation (see `navigation.md` for `goto` and link behavior). The DOM is morphed, but the island's JS context and state stay alive.

---

## Islands + server actions (realistic pattern)

```svelte
---
export async function load(ctx) {
  const likes = await db.likes.countForPost(ctx.params.id);
  return { likes };
}

export async function like(postId) {
  "use server";
  await db.likes.create({ postId });
  return { success: true };
}
---

<nexus-island
  client:visible
  src="$lib/islands/like-button.ts"
  data-post-id="{pretext.postId}"
  data-initial-likes="{pretext.likes}">
</nexus-island>
```

The island can call the action via `fetch` to `/_nexus/action/like` (the framework wires the endpoint automatically) and update its local state without a full reload.

---

## External islands in v0.9.31

In v0.9.31, external islands are served directly from `/_nexus/lib/islands/*.js`. The compiler rewrites `$lib/islands/counter.ts` to the correct public URL. This works for:

- `.ts` and `.tsx` source files (auto-transpiled in dev)
- Relative imports inside the island file (rewritten to `.js`)
- Production builds (hashed bundles in `.nexus/output/lib/`)

If an island file imports utilities from `$lib/utils.ts`, those are also served automatically via `/_nexus/lib/`.

---

## Pretext data

Islands automatically receive the page's `pretext` as the second argument to `init`. You do not need to manually serialize every value through `data-*` attributes.

```ts
// src/lib/islands/counter.ts
export default function init(root: HTMLElement, pretext: any) {
  // pretext contains the full server data returned by load()
  console.log(pretext.initialCount);
}
```

You can still use `data-*` attributes to pass individual overrides or keep the island dependency-free.

---

## Best practices

1. **Prefer `client:visible`** for anything below the fold; it defers JS download and execution until the user actually needs it.
2. **Use external islands** (`src="$lib/islands/..."`) for anything longer than a few lines; keeps `.nx` files clean and enables reuse.
3. **Pass data via `data-*` attributes** instead of global variables; it's explicit, SSR-safe, and survives hydration.
4. **Keep islands focused**; one island per interactive concern (e.g., one for the mobile menu, one for the reading progress bar).
5. **Don't over-island**; if something works without JS (CSS-only accordion, native `<details>`), leave it static.
