O sistema de reatividade mais ergonômico em JavaScript. As Runes do Svelte 5 são **exatamente** o que você coloca dentro de `<script>` de um arquivo .nx ou dentro de uma island. Elas só rodam onde você as coloca.

### $state exato (a primitiva que você usará 90% do tempo)

```svelte
<script>
  let count = $state(0);           // sinal reativo
  let name = $state('Nexus');
</script>

<button onclick={() => count.value++}>{count.value}</button>
<input value={name.value} oninput={(e) => name.value = e.target.value} />
<p>Olá {name.value}</p>
```

### $derived exato (computado, roda só quando dependências mudam)

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count.value * 2);   // atualiza automaticamente
  let label = $derived(`${count.value} clicks → ${doubled.value}`);
</script>

<button onclick={() => count.value++}>{label.value}</button>
```

### $effect exato (efeitos colaterais, roda depois que o DOM atualiza)

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log('count changed to', count.value);   // roda quando as dependências mudam
    document.title = `Count: ${count.value}`;
  });
</script>
```

### $props exato (em um .nx componente reutilizável)

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

### $sync exato (estado reativo persistido — sobrevive navegação & refresh)

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

Dentro da island você lê `root.dataset.initial` e transforma em um `$state` via `let count = $state(parseInt(root.dataset.initial || '0', 10));`.

Toda a semântica de runes acima é idêntica ao Svelte 5 (o framework apenas as integra em .nx + islands + SSR). Copie os snippets exatamente — funcionam em qualquer .nx ou arquivo de island. Veja server-actions.md para chamar actions de runes, e store.md para a integração de $pretext / store global.
