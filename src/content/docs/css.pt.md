# Stylesheets — Tailwind, PostCSS e CSS Scoped

O Nexus oferece suporte de primeira classe para CSS: uma folha de estilos unificada, compilação automática de PostCSS, integração com Tailwind CSS v4, estilos scoped por componente e serving de CSS global sem configuração.

---

## Como os estilos são servidos

O Nexus v0.9.31 serve **uma** folha de estilos automaticamente:

- **`/_nexus/styles.css`** — folha unificada que inclui:
  1. Seu entry de CSS global processado com PostCSS/Tailwind (anteposto no início).
  2. CSS scoped agregado de todos os arquivos `.nx`.

Ela começa com a declaração de camadas:

```css
@layer nexus.scoped, nexus.global;
```

O framework injeta `<link rel="stylesheet" href="/_nexus/styles.css">` no `<head>` durante o SSR. Você não precisa adicioná-lo manualmente.

O endpoint legacy **`/_nexus/global.css`** ainda está disponível para compatibilidade retroativa, mas **não é mais injetado** no SSR.

---

## Entry de CSS global

O Nexus descobre automaticamente sua folha de estilos global nestas localizações (em ordem):

- `src/app.css`
- `src/global.css`
- `src/index.css`
- `src/styles.css`

Se encontrar alguma, a processa com PostCSS e a antepõe ao início da folha unificada.

### Entry personalizado

Sobrescreva a auto-descoberta em `nexus.config.ts`:

```ts
export default {
  css: { entry: 'src/global.css' },
};
```

O path é relativo à raiz do projeto.

---

## PostCSS e Tailwind CSS v4

O Nexus lê `postcss.config.{mjs,cjs,js}` e executa seu CSS global através do PostCSS automaticamente tanto em dev quanto em produção.

### Dependências recomendadas

Como o CSS de produção é compilado on-the-fly, instale-as como `dependencies`, **não** como `devDependencies`:

```json
{
  "dependencies": {
    "tailwindcss": "^4.3.0",
    "@tailwindcss/postcss": "^4.3.0",
    "postcss": "^8.5.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Configuração do PostCSS

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### Dizer ao Tailwind onde estão as classes dos `.nx`

O Tailwind CSS v4 não escaneia arquivos `.nx` por padrão. Aponte-o para um arquivo HTML gerado que contenha as classes usadas nos seus componentes.

Adicione um script `predev` e `prebuild` que gere `src/.generated/tailwind-classes.html`. Exemplo `scripts/extract-tw-classes.mjs`:

```js
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (path.endsWith('.nx')) yield path;
  }
}

const classes = new Set();
for await (const file of walk('src')) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/class\s*=\s*["']([^"']+)["']/g)) {
    match[1].split(/\s+/).forEach((c) => c && classes.add(c));
  }
}

const tags = [...classes].sort().map((c) => `<div class="${c}"></div>`).join('\n');
const html = `<!DOCTYPE html>\n<html>\n<body>\n${tags}\n</body>\n</html>\n`;

await mkdir('src/.generated', { recursive: true });
await writeFile('src/.generated/tailwind-classes.html', html);
```

Depois configure em `package.json`:

```json
{
  "scripts": {
    "predev": "node scripts/extract-tw-classes.mjs",
    "prebuild": "node scripts/extract-tw-classes.mjs"
  }
}
```

Adicione `src/.generated` ao seu `.gitignore`.

### Arquivo de CSS global

```css
/* src/global.css */
@import 'tailwindcss';

@source './.generated/tailwind-classes.html';

@theme {
  --color-bg: var(--bg);
  --color-ink: var(--ink);
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

O Tailwind v4 é CSS-first: defina tokens de design personalizados com `@theme` dentro do `global.css` em vez de usar `tailwind.config.js`.

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

O compilador faz hash dos seletores para que `.card` só aplique a elementos deste componente. Os estilos scoped são agregados em `/_nexus/styles.css`.

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

## CSS layers

O Nexus gerencia a especificidade com `@layer` do CSS. A folha unificada declara:

```css
@layer nexus.scoped, nexus.global;
```

- Os estilos scoped de arquivos `.nx` vivem em `@layer nexus.scoped`.
- Seu CSS global pode viver opcionalmente em `@layer nexus.global` se o envolver:

```css
@layer nexus.global {
  body { /* ... */ }
}
```

Isso previne guerras de especificidade entre utilidades globais e estilos de componente.

---

## Dev vs produção

| Ambiente | Folha unificada (`/_nexus/styles.css`) |
|----------|----------------------------------------|
| **Dev** | Compilada on-demand com PostCSS, hot-reload ao alterar CSS global ou scoped |
| **Produção** | Empacotada, minificada e hasheada por conteúdo em `.nexus/output/` para caching imutável |

---

## Melhores práticas

1. **Use `src/global.css` para design tokens** (cores, fontes, espaçamento) e diretivas do Tailwind.
2. **Use `<style>` em `.nx` para layout específico do componente** que não deveria vazar para outros componentes.
3. **Evite CSS global pesado**; a folha de estilos scoped é deduplicada por rota em produção.
4. **Prefira variáveis CSS** para theming; funcionam tanto em contextos globais quanto scoped.
5. **Não linke manualmente `/_nexus/global.css`** no seu layout; confie na folha unificada `/_nexus/styles.css` que o Nexus injeta automaticamente.
6. **Mantenha os pacotes do Tailwind em `dependencies`** (`tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer`) para que builds de produção possam compilar CSS on-the-fly.
7. **Execute o script de extração de classes do Tailwind em `predev` e `prebuild`** para que o Tailwind v4 veja as classes usadas nos arquivos `.nx`.
8. **Defina tokens de design personalizados com `@theme`** no `global.css` em vez de `tailwind.config.js`.
