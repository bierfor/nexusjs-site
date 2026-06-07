Crie um novo projeto Nexus em segundos e implante sua primeira página. Tudo segue "modo correto": dados via `load(ctx)` → `pretext`, conteúdo via `@nexus_js/content` quando necessário, interpolação direta `{pretext.xxx}`, sem padrões legados.

### Passo 1 — Andamiaje de um novo app (comando exato)

```bash
npm create @nexus_js/nexus my-app
cd my-app
pnpm install
```

Isso cria um projeto usando os padrões latest 0.9.30+ (load/pretext, templates .nx, islands, segurança hardened por padrão).

### Passo 2 — Sua primeira página (arquivo .nx exato)

Crie `src/routes/about/+page.nx` com o **código exato** que um usuário deve escrever:

```svelte
---
import { resolveLocale, createT } from '$lib/i18n.ts';

export async function load(ctx) {
  const locale = resolveLocale(ctx);
  const t = createT(locale);

  // Busque dados reais (ex: do DB ou do pacote de conteúdo)
  const pageData = {
    title: 'About Us',
    description: 'Nexus.js em ação',
  };

  // Retorne dados para o template + head opcional para SEO (injetado automaticamente)
  return {
    page: pageData,
    head: {
      title: `${pageData.title} — My Nexus App`,
      description: pageData.description,
    },
  };
}
---

<h1>{pretext.page.title}</h1>
<p>{pretext.page.description}</p>
<p>{pretext.t('about.welcome')}</p>

<!-- Exemplo de island para interatividade (só isso envia JS) -->
<div client:visible>
  <script>
    let count = $state(0);
  </script>
  <button onclick={() => count++}>
    Clicado {count} vezes
  </button>
</div>

<style>
  h1 { color: #2563eb; font-size: 2rem; }
  button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 4px; }
</style>
```

**Exatamente o que acontece (modo correto):**
- `load(ctx)` roda no servidor por requisição (pode ser async, use ctx.params, ctx.req, helpers de segurança como rateLimit).
- Objeto retornado vira `pretext` (mesclado de layouts + páginas; filho vence).
- Template é SSR para HTML estático com valores `{pretext.xxx}` interpolados (escapados por padrão).
- `<style>` é auto-scoped.
- Island `client:visible` é extraído, bundlado separadamente, e hidratado só quando visível (zero JS pro resto da página).
- `head` é processado automaticamente pelo renderer e injetado (veja seo.md).

> **Dica:** Para qualquer coisa com mais de algumas linhas, use uma **island externa** (`src="$lib/islands/counter.ts"`) em vez de inline `<script>`. Mantém os arquivos `.nx` limpos, permite reutilização, e funciona com `defaultHydration` em `nexus.config.ts`. Veja `islands.md` para o padrão completo.

### Passo 3 — Adicione i18n (exato, usando defineI18n)

Atualize `src/lib/i18n.ts` (ou use o gerado):

```ts
import { defineI18n } from '@nexus_js/content';

export const i18n = defineI18n({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  messages: {
    en: { 'about.welcome': 'Welcome to Nexus!' },
    es: { 'about.welcome': '¡Bienvenido a Nexus!' },
    pt: { 'about.welcome': 'Bem-vindo ao Nexus!' },
  },
});
```

Então no load: `const t = i18n.tFn(locale); return { t };` e use `{pretext.t('about.welcome')}`.

### Passo 4 — Use conteúdo externo (exato com @nexus_js/content)

Para páginas dirigidas por MD (recomendado para docs/blogs):

```ts
// no load(ctx)
import { loadContent } from '@nexus_js/content';

const entry = loadContent('about', { locale });
return { 
  content: entry.html, 
  headings: entry.headings,
  head: { title: entry.meta.title }
};
```

No template: `{pretext.content}` (HTML já sanitizado).

### Passo 5 — Visite & build

- `pnpm dev` → http://localhost:3000/about (SSR instantâneo, hot reload para .nx).
- `pnpm build && pnpm start` → saída de produção em `.nexus/output/`.

O framework garante: segurança (CSRF em actions, CSP, etc.), performance (islands + streaming), type safety (via retornos de load), e DX "modo correto".

Veja as outras páginas nesta lista (ex: routing.md, server-actions.md) para mais variações exatas. Todos os exemplos aqui são prontos para copiar e colar e combinam com o exemplo real paylinks-saas no monorepo.
