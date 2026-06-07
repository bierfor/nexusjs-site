El sistema de reactividad más ergonómico en JavaScript. Las Runes de Svelte 5 son **exactamente** lo que pones dentro de `<script>` de un archivo .nx o dentro de una island. Solo corren donde las colocas.

### $state exacto (la primitiva que usarás 90% del tiempo)

```svelte
<script>
  let count = $state(0);           // primitiva reactiva
  let name = $state('Nexus');
</script>

<button onclick={() => count++}>{count}</button>
<input bind:value={name} />
<p>Hola {name}</p>
```

### $derived exacto (computado, corre solo cuando cambian dependencias)

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);   // actualiza automáticamente
  let label = $derived(`${count} clicks → ${doubled}`);
</script>

<button onclick={() => count++}>{label}</button>
```

### $effect exacto (efectos secundarios, corre después de que el DOM actualiza)

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log('count changed to', count);   // timing exacto: después de pintar el template
    document.title = `Count: ${count}`;
  });
</script>
```

### $props exacto (en un .nx componente reutilizable)

```svelte
<!-- src/components/Button.nx -->
<script>
  let { 
    label = 'Click me', 
    onClick, 
    disabled = false 
  } = $props();     // destructuring exacto con defaults
</script>

<button onclick={onClick} disabled={disabled}>
  {label}
</button>
```

Uso en una página:

```svelte
<Button label="Save" onClick={() => save()} />
```

### $sync exacto (estado reactivo persistido — sobrevive navegación & refresh)

```svelte
<script>
  // key + valor por defecto. Persiste a localStorage / session / url automáticamente
  let theme = $sync('theme', 'light');
  let count = $sync('count', 0, { persist: 'session' });
</script>

<button onclick={() => count++}>{count}</button>
<select bind:value={theme}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```

### Runes exactas dentro de una island (el lugar recomendado para estado de cliente)

Ver el ejemplo exacto de island en islands.md. Pones las runes dentro de la función `init` de la island o en un <script> de un .nx que tiene una directiva client:. El framework configura el contexto de runes por ti.

### Combinación exacta con datos de servidor (load → island)

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

Dentro de la island lees `root.dataset.initial` y lo conviertes en un $state.

Toda la semántica de runes arriba es idéntica a Svelte 5 (el framework solo las integra en .nx + islands + SSR). Copia los snippets exactamente — funcionan en cualquier .nx o archivo de island. Ver server-actions.md para llamar actions desde runes, y store.md para la integración de $pretext / store global.
