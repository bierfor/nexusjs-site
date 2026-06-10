El sistema de reactividad más ergonómico en JavaScript. Las Runes de Svelte 5 son **exactamente** lo que pones dentro de `<script>` de un archivo .nx o dentro de una island. Solo corren donde las colocas.

### $state exacto (la primitiva que usarás 90% del tiempo)

```svelte
<script>
  let count = $state(0);           // señal reactiva
  let name = $state('Nexus');
</script>

<button onclick={() => count.value++}>{count.value}</button>
<input value={name.value} oninput={(e) => name.value = e.target.value} />
<p>Hola {name.value}</p>
```

### $derived exacto (computado, corre solo cuando cambian dependencias)

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count.value * 2);   // actualiza automáticamente
  let label = $derived(`${count.value} clicks → ${doubled.value}`);
</script>

<button onclick={() => count.value++}>{label.value}</button>
```

### $effect exacto (efectos secundarios, corre después de que el DOM actualiza)

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log('count changed to', count.value);   // corre cuando cambian las dependencias
    document.title = `Count: ${count.value}`;
  });
</script>
```

### $props exacto (en un .nx componente reutilizable)

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

### $sync exacto (estado reactivo persistido — sobrevive navegación & refresh)

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

Dentro de la island lees `root.dataset.initial` y lo conviertes en un `$state` via `let count = $state(parseInt(root.dataset.initial || '0', 10));`.

Toda la semántica de runes arriba es idéntica a Svelte 5 (el framework solo las integra en .nx + islands + SSR). Copia los snippets exactamente — funcionan en cualquier .nx o archivo de island. Ver server-actions.md para llamar actions desde runes, y store.md para la integración de $pretext / store global.
