# Estrutura do projeto

Estrutura recomendada exata (pronta para copiar e colar). Tudo é colocalizado com as rotas para facilitar a descoberta. Use `load(ctx)` em qualquer .nx para dados, @nexus_js/content para seções baseadas em MD.

```bash
my-app/
├── nexus.config.ts                 # Config exata (ver abaixo)
├── package.json
├── src/
│   ├── global.css                  # Entrada para global Tailwind/PostCSS (auto em dev)
│   ├── lib/
│   │   ├── db.ts                   # Seu cliente DB (wrapper exato)
│   │   └── i18n.ts                 # defineI18n + resolveLocale (exato)
│   └── routes/
│       ├── +layout.nx              # Layout raiz (exato com head + slot)
│       ├── +page.nx                # / (home)
│       ├── about/
│       │   └── +page.nx            # /about
│       ├── blog/
│       │   └── [slug]/
│       │       └── +page.nx        # /blog/:slug (load dinâmico exato)
│       ├── api/
│       │   └── hello/
│       │       └── +server.nx      # Rota API (GET/POST exato)
│       └── docs/
│           └── [slug]/
│               └── +page.nx        # Página de conteúdo MD usando loadContent
└── public/
    └── images/                     # Estáticos (servidos como estão)
```

### nexus.config.ts exato (copie isto)

```ts
export default {
  server: { port: 3000 },
  security: {
    hardened: true,                 // Habilita nonce CSP, headers, etc.
    csp: { additionalScriptSrc: [] },
  },
  css: { entry: './src/global.css' },
};
```

### Exemplo exato de lib/db.ts (BYOD, usado em load())

```ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

### Uso exato em uma rota (veja as páginas listadas para detalhes completos)

Em qualquer `+page.nx` ou layout:

```svelte
---
import { db } from '$lib/db';
import { loadContent } from '@nexus_js/content';

export async function load(ctx) {
  const post = await db.posts.findBySlug(ctx.params.slug);
  const md = loadContent(`blog/${ctx.params.slug}`, { locale: ctx.locale });
  return {
    post,
    contentHtml: md.html,
    head: { title: post?.title },
  };
}
---
```

Veja routing.md, server-actions.md, uso de conteúdo em packages.md, etc. para os **arquivos completos exatos**.

| Caminho | Propósito exato + como o framework usa |
|---------|----------------------------------------|
| `nexus.config.ts` | Carregado pelo CLI/server na inicialização. Controla modo hardened, nonces CSP (injetados automaticamente), entrada CSS (compilada em tempo real em dev via /_nexus/global.css). |
| `src/routes/+layout.nx` | Sempre executa primeiro. Deve conter `<head><!--nexus:head--></head>` e `<!--nexus:slot-->` para o conteúdo filho. Retorna pretext/head compartilhado. |
| `src/routes/+page.nx` | Corresponde a `/`. Resultado de `load(ctx)` → pretext. Islands apenas para partes interativas. |
| `src/routes/blog/[slug]/+page.nx` | Segmento dinâmico disponível como `ctx.params.slug`. Use com loadContent para MD ou DB. |
| `.../+server.nx` | Rotas de API. Exporte `GET`, `POST` etc. Recebe ctx com req/res. Retorna ctx.json() etc. |
| `public/` | Servido estaticamente na raiz. Use com assets.md Image() para otimização. |

Todos os caminhos usam as convenções exatas que o compilador/router do framework espera. Veja as outras páginas desta lista para o código fonte .nx completo que você deve escrever.
