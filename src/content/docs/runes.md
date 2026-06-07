The most ergonomic reactivity system in JavaScript. Svelte 5 Runes are **exactly** what you put inside `<script>` of a .nx file or inside an island. They only run where you place them.

### Exact $state (the primitive you will use 90% of the time)

```svelte
<script>
  let count = $state(0);           // reactive primitive
  let name = $state('Nexus');
</script>

<button onclick={() => count++}>{count}</button>
<input bind:value={name} />
<p>Hello {name}</p>
```

### Exact $derived (computed, runs only when dependencies change)

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);   // automatically updates
  let label = $derived(`${count} clicks → ${doubled}`);
</script>

<button onclick={() => count++}>{label}</button>
```

### Exact $effect (side effects, runs after the DOM updates)

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log('count changed to', count);   // exact timing: after template paint
    document.title = `Count: ${count}`;
  });
</script>
```

### Exact $props (in a reusable .nx component)

```svelte
<!-- src/components/Button.nx -->
<script>
  let { 
    label = 'Click me', 
    onClick, 
    disabled = false 
  } = $props();     // exact destructuring with defaults
</script>

<button onclick={onClick} disabled={disabled}>
  {label}
</button>
```

Usage in a page:

```svelte
<Button label="Save" onClick={() => save()} />
```

### Exact $sync (persisted reactive state — survives navigation & refresh)

```svelte
<script>
  // key + default value. Persists to localStorage / session / url automatically
  let theme = $sync('theme', 'light');
  let count = $sync('count', 0, { persist: 'session' });
</script>

<button onclick={() => count++}>{count}</button>
<select bind:value={theme}>
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

Inside the island you read `root.dataset.initial` and turn it into a $state.

All rune semantics above are identical to Svelte 5 (the framework just integrates them into .nx + islands + SSR). Copy the snippets exactly — they work in any .nx or island file. See server-actions.md for calling actions from runes, and store.md for the global $pretext / store integration.
