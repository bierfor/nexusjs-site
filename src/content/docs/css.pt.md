# Stylesheets — Tailwind, PostCSS e CSS Scoped

O Nexus tem suporte de primeira classe para CSS com compilação automática de PostCSS, integração com Tailwind CSS v4, estilos scoped por componente, e serving de folhas de estilo globais sem configuração.

---

## Entry de CSS global

O Nexus descobre automaticamente sua folha de estilos global nestas localizações (em ordem):

- `src/app.css`
- `src/global.css`
- `src/index.css`
- `src/styles.css`

Se encontrar alguma, a processa com PostCSS (quando houver config presente) e a serve em `/_nexus/global.css`. O framework injeta automaticamente o link no SSR.

### Entry personalizado

Sobrescreva a auto-descoberta em `nexus.config.ts`:

```ts
export default {
  css: { entry: './src/styles/main.css' },
};
```

O path é relativo à raiz do projeto.

---

## PostCSS e Tailwind CSS v4

O Nexus lê `postcss.config.{mjs,cjs,js}` e executa seu CSS global através do PostCSS automaticamente tanto em dev quanto em produção.

### Setup exato para Tailwind v4

```bash
pnpm add -D tailwindcss postcss @tailwindcss/postcss autoprefixer
```

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

```css
/* src/global.css */
@import 'tailwindcss';

@theme {
  --color-accent: #c45c26;
}

:root {
  --bg: #0a0a0a;
  --ink: #ffffff;
}

body {
  background-color: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
```

Isso é tudo. Em dev, `/_nexus/global.css` retorna o output completo do Tailwind compilado. Em produção, o pipeline de build o empacota e faz hash.

**Nota:** O Tailwind v4 usa configuração nativa em CSS (`@theme`, `@import "tailwindcss"`). Não se requer `tailwind.config.js` a menos que precise de globs de conteúdo personalizados (O Nexus já compila arquivos `.nx`, então o Tailwind os escaneia automaticamente via o plugin de PostCSS).

---

## Estilos scoped por componente

Qualquer bloco `<style>` dentro de um arquivo `.nx` é scopado automaticamente a esse componente.

```svelte
<!-- src/routes/card/+page.nx -->
<div class="card">
  <h2>{pretext.title}</h2>
</div>

<style>
  .card {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--surface);
  }
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }
</style>
```

O compilador faz hash dos seletores para que `.card` só aplique a elementos deste componente. É servido via a folha de estilos agregada em `/_nexus/styles.css`.

### Escape hatch `:global()`

Para apontar a elementos globais (ex. `body`, `html`) ou sobrescrever um componente filho:

```svelte
<style>
  :global(body) {
    margin: 0;
  }
  .card :global(.external-widget) {
    border: 1px solid red;
  }
</style>
```

---

## Como os estilos são servidos

O Nexus serve **duas** folhas de estilo automaticamente em cada página:

1. **`/_nexus/global.css`** — seu entry global (processado por PostCSS)
2. **`/_nexus/styles.css`** — estilos scoped agregados de todos os arquivos `.nx`

Ambas são injetadas no `<head>` durante o SSR (a menos que já as tenha declarado manualmente). Você não precisa adicionar tags `<link>`.

A folha de estilos scoped agregada envolve o CSS de cada componente em `@layer nexus.scoped` para que conviva limpamente com seus estilos globais.

---

## CSS layers

O Nexus usa `@layer` do CSS para gerenciar especificidade:

```css
@layer nexus.scoped, nexus.global;
```

- Os estilos scoped de arquivos `.nx` vivem em `@layer nexus.scoped`
- Seu CSS global pode viver opcionalmente em `@layer nexus.global` se o envolver:

```css
@layer nexus.global {
  body { /* ... */ }
}
```

Isso previne guerras de especificidade entre utilidades globais e estilos de componente.

---

## Dev vs produção

| Ambiente | CSS Global | CSS Scoped |
|----------|------------|------------|
| **Dev** | Compilado on-demand com PostCSS, servido com hot-reload busting | Recompilado ao salvar qualquer `.nx` |
| **Produção** | Empacotado, minificado e hasheado em `.nexus/output/` | Extraído, deduplicado e hasheado por rota |

Em produção, ambas as folhas de estilo carregam um hash de conteúdo em seu nome para caching imutável.

---

## Melhores práticas

1. **Use `src/global.css` para design tokens** (cores, fontes, espaçamento) e diretivas do Tailwind.
2. **Use `<style>` em `.nx` para layout específico do componente** que não deveria vazar para outros componentes.
3. **Evite CSS global pesado**; a folha de estilos scoped agregada é deduplicada por rota em produção.
4. **Prefira variáveis CSS** para theming; funcionam tanto em contextos globais quanto scoped.
5. **Não linke manualmente `/_nexus/global.css`** no seu layout; o renderer o injeta automaticamente quando existe o arquivo de entry.
