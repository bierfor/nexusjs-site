The most ergonomic reactivity system in JavaScript. Svelte 5 Runes, natively integrated.

### $state — Reactive value

```svelte
<script>
  let count = $state(0);
</script>
<button onclick={() => count++}>{count}</button>
```

### $derived — Computed value

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
<p>{doubled}</p>
```

### $effect — Side effects

```svelte
<script>
  let count = $state(0);
  $effect(() => {
    document.title = 'Count: ' + count;
  });
</script>
```

### $props — Component props

```svelte
<script>
  let { title, href } = $props();
</script>
<a href={href}>{title}</a>
```

### $sync — Synchronized state

Persist reactive state across page navigations and browser sessions.

```svelte
<script>
  let theme = $sync('theme', 'light');
</script>
```
