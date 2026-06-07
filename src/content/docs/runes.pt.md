O sistema de reatividade mais ergonômico em JavaScript. As Runes do Svelte 5 são **exatamente** o que você coloca dentro de `<script>` de um arquivo .nx ou dentro de uma island. Elas só rodam onde você as coloca.

### $state exato (a primitiva que você usará 90% do tempo)

```svelte
<script>
  let count = $state(0);           // primitiva reativa
  let name = $state('Nexus');
</script>

<button onclick={() => count++}>{count}</button>
<input bind:value={name} />
<p>Olá {name}</p>
```

### $derived exato (computado, roda só quando dependências mudam)

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);   // atualiza automaticamente
  let label = $derived(`${count} clicks → ${doubled}`);
</script>

<button onclick={() => count++}>{label}</button>
```

### $effect exato (efeitos colaterais, roda depois que o DOM atualiza)

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log('count changed to', count);   // timing exato: depois de pintar o template
    document.title = `Count: ${count}`;
  });
</script>
```

### $props exato (em um .nx componente reutilizável)

```svelte
<!-- src/components/Button.nx -->
<script>
  let { 
    label = 'Click me', 
    onClick, 
    disabled = false 
  } = $props();     // destructuring exato com defaults
</script>

<button onclick={onClick} disabled={disabled}>
  {label}
</button>
```

Uso em uma página:

```svelte
<Button label="Save" onClick={() => save()} />
```

### $sync exato (estado reativo persistido — sobrevive navegação & refresh)

```svelte
<script>
  // key + valor padrão. Persiste para localStorage / session / url automaticamente
  let theme = $sync('theme', 'light');
  let count = $sync('count', 0, { persist: 'session' });
</script>

<button onclick={() => count++}>{count}</button>
<select bind:value={theme}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```

### Runes exatas dentro de uma island (o lugar recomendado para estado de cliente)

Veja o exemplo exato de island em islands.md. Você coloca as runes dentro da função `init` da island ou em um <script> de um .nx que tem uma diretiva client:. O framework configura o contexto de runes para você.

### Combinação exata com dados do servidor (load → island)

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

Dentro da island você lê `root.dataset.initial` e transforma em um $state.

Toda a semântica de runes acima é idêntica ao Svelte 5 (o framework apenas as integra em .nx + islands + SSR). Copie os snippets exatamente — funcionam em qualquer .nx ou arquivo de island. Veja server-actions.md para chamar actions de runes, e store.md para a integração de $pretext / store global.
