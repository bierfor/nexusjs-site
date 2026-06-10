# Arquitetura de Islands

O Nexus envia **zero JavaScript por padrão**. Apenas os componentes que você marcar explicitamente com uma diretiva `client:*` recebem um bundle para o navegador. Todo o resto é HTML estático renderizado no servidor.

Isso é a "arquitetura de islands": pequenas regiões interativas e auto-contidas em um mar de markup estático.

---

## Diretivas de hidratação

Adicione o atributo diretamente a qualquer elemento no seu template `.nx`:

| Diretiva | Comportamento |
|----------|---------------|
| `client:visible` | Hidrata quando a island entra no viewport (default recomendado) |
| `client:idle` | Hidrata quando o navegador estiver idle |
| `client:load` | Hidrata imediatamente ao carregar a página (UI crítica: header, carrinho) |
| `client:media="(min-width: 768px)"` | Hidrata quando o media query corresponder (condicional responsivo) |
| `server:only` | Nunca envia JS; HTML estático puro (default se não houver diretiva) |

---

## Dois tipos de islands

### 1. Islands inline

Escreva a lógica interativa diretamente dentro do arquivo `.nx`. O compilador extrai o código cliente automaticamente.

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

Use islands inline para interações pequenas e pontuais que não precisam de reutilização.

### 2. Islands externas (recomendado)

Mantenha as islands em `src/lib/islands/` e referencie-as via `src`. Este é o padrão preferido para qualquer lógica cliente não trivial.

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

  // Lê dados do servidor passados via data-* attributes
  const initial = root.dataset.initial;
  if (initial) count = parseInt(initial, 10);
}
```

**Contrato da island:**
- O arquivo deve exportar `export default function init(root: HTMLElement, data?: any)`.
- `root` é o elemento `<nexus-island>` em si.
- O framework configura o contexto de runes do Svelte 5 antes de chamar `init`, então `$state`, `$effect` e `$derived` funcionam imediatamente.
- Você pode ler atributos `data-*` de `root.dataset` para transferir dados servidor → cliente.

---

## Estratégia de hidratação padrão

Você pode definir um default a nível de projeto em `nexus.config.ts` para não repetir a diretiva em cada island:

```ts
export default {
  defaultHydration: 'client:visible', // ou 'client:idle' / 'client:load'
};
```

Com esta config, `<nexus-island src="$lib/islands/counter.ts">` sem diretiva usará `client:visible`.

---

## Sobrevivência de estado entre navegações

Como as islands são auto-contidas, seu `$state` interno sobrevive a navegação SPA (veja `navigation.md` para `goto` e comportamento de links). O DOM é morfado, mas o contexto JS e o estado da island permanecem vivos.

---

## Islands + server actions (padrão realista)

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

A island pode chamar a ação via `fetch` para `/_nexus/action/like` (o framework conecta o endpoint automaticamente) e atualizar seu estado local sem recarga completa.

---

## Islands externas em v0.9.31

Em v0.9.31, as islands externas são servidas diretamente de `/_nexus/lib/islands/*.js`. O compilador reescreve `$lib/islands/counter.ts` para a URL pública correta. Isso funciona para:

- Arquivos fonte `.ts` e `.tsx` (auto-transpilados em dev)
- Imports relativos dentro do arquivo island (reescritos para `.js`)
- Builds de produção (bundles hasheados em `.nexus/output/lib/`)

Se um arquivo island importa utilidades de `$lib/utils.ts`, estas também são servidas automaticamente via `/_nexus/lib/`.

---

## Dados de pretext

As islands recebem automaticamente o `pretext` da página como segundo argumento de `init`. Você não precisa serializar manualmente cada valor via atributos `data-*`.

```ts
// src/lib/islands/counter.ts
export default function init(root: HTMLElement, pretext: any) {
  // pretext contém todos os dados do servidor retornados por load()
  console.log(pretext.initialCount);
}
```

Você ainda pode usar atributos `data-*` para passar overrides individuais ou manter a island livre de dependências.

---

## Melhores práticas

1. **Prefira `client:visible`** para qualquer coisa abaixo da dobra; adia o download e execução de JS até que o usuário realmente precise.
2. **Use islands externas** (`src="$lib/islands/..."`) para qualquer coisa com mais de algumas linhas; mantém os arquivos `.nx` limpos e permite reutilização.
3. **Passe dados via `data-*` attributes** em vez de variáveis globais; é explícito, seguro para SSR, e sobrevive a hidratação.
4. **Mantenha as islands focadas**; uma island por cada interação (ex. uma para o menu mobile, outra para a barra de progresso).
5. **Não sobre-islandeie**; se algo funciona sem JS (accordion só-CSS, `<details>` nativo), deixe estático.
