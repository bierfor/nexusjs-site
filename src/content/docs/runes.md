The most ergonomic reactivity system in JavaScript. Svelte 5 Runes are **exactly** what you put inside `<script>` of a .nx file or inside an island. They only run where you place them.

### Exact $state (the primitive you will use 90% of the time)

```svelte
<script>
  let count = $state(0);           // reactive signal
  let name = $state('Nexus');
</script>

<button onclick={() => count.value++}>{count.value}</button>
<input value={name.value} oninput={(e) => name.value = e.target.value} />
<p>Hello {name.value}</p>
```

### Exact $derived (computed, runs only when dependencies change)

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count.value * 2);   // automatically updates
  let label = $derived(`${count.value} clicks → ${doubled.value}`);
</script>

<button onclick={() => count.value++}>{label.value}</button>
```

### Exact $effect (side effects, runs after the DOM updates)

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log('count changed to', count.value);   // runs when dependencies change
    document.title = `Count: ${count.value}`;
  });
</script>
```

### Exact $props (in a reusable .nx component)

```svelte
<script>
  let props = $props<{ label: string; onClick: () => void; disabled?: boolean }>({
    label: 'Click me',
    disabled: false,
  });
</script>

<button onclick={props.onClick} disabled={props.disabled}>
  {props.label}
</button>
```

### Exact $sync (persisted reactive state — survives navigation & refresh)

```svelte
<script>
  let theme = $sync('theme', { default: 'light', persist: 'local' });
  let count = $sync('count', { default: 0, persist: 'session' });
</script>

<button onclick={() => count.value++}>{count.value}</button>
<select value={theme.value} onchange={(e) => theme.value = e.target.value}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```

### Exact runes inside an island (the recommended place for client state)

See the exact island example in islands.md. You put the runes inside the island's `init` function or in a <script> of a .nx that has a client: directive. The framework sets up the runes context for you.

### Exact combination with server data (load → island)

```svelte
---
export async function load(ctx) {
  const initial = await db.likes.count(ctx.params.id);
  return { initialLikes: initial };
}
---

<nexus-island client:visible src="$lib/islands/likes.ts" data-initial="{pretext.initialLikes}">
</nexus-island>
```

Inside the island you read `root.dataset.initial` and turn it into a `$state` via `let count = $state(parseInt(root.dataset.initial || '0', 10));`.

All rune semantics above are identical to Svelte 5 (the framework just integrates them into .nx + islands + SSR). Copy the snippets exactly — they work in any .nx or island file. See server-actions.md for calling actions from runes, and store.md for the global $pretext / store integration.
