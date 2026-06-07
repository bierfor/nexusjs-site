# Referência de Pacotes

O monorepo do Nexus está organizado em pacotes focados. Todos os pacotes seguem semver e são publicados juntos.

| Pacote | Propósito |
|--------|-----------|
| `@nexus_js/cli` | CLI, servidor dev, pipeline de build, create-nexus |
| `@nexus_js/compiler` | parser .nx, scoping CSS, codegen, reporte de erros (CompileError estruturado + formatters) |
| `@nexus_js/server` | renderer SSR, actions, middleware, injeção de head, segurança hardened |
| `@nexus_js/router` | Roteamento baseado em arquivos |
| `@nexus_js/runtime` | Islands de cliente, navegação, store, $pretext |
| `@nexus_js/security` | CSRF, rate limiting, CSP, Vault, Shield, modo hardened |
| `@nexus_js/graphql` | Integração GraphQL + Bridge Legacy |
| `@nexus_js/content` | Markdown, coleções de conteúdo rico, helpers i18n (loadContent, defineCollection, defineI18n, render, watch, dates) |
| `@nexus_js/head` | Metadata SEO reativa (server + cliente; injeção auto de load()) |
| `@nexus_js/audit` | Scan de segurança de dependências (OSV, CVE, vazamentos de segredos) |
| `@nexus_js/types` | Tipos TypeScript compartilhados + gerador auto de tipos (nexus-types.d.ts) |
| `@nexus_js/assets` | Otimização de imagens (AVIF/WebP, srcsets, blur, fonts), helper Image() |
| `@nexus_js/middleware` | Pipeline de requests compatível com Edge (Web Standards) |
| `@nexus_js/db` | Adaptador fino BYOD para DB (Prisma, Drizzle, Postgres, libSQL) |
| `@nexus_js/testing` | Utilitários de render SSR + cliente para componentes .nx |
| `@nexus_js/ui` | Componentes interativos CSS-only zero-bundle (0 JS) |
| `@nexus_js/sync` | Sync local-first ($localSync IndexedDB + Byte-Mirror SQLite WASM/OPFS prototype) |
| `@nexus_js/connect` | Sync de estado real-time em Edge via SSE (rune $socket()) |
| `@nexus_js/bridge` | Descoberta legacy (DB/APIs), modelo canônico, geradores seguros (GraphQL + Shield) |
| `@nexus_js/serialize` | Transporte lossless (Date, Map, Set, BigInt, RegExp, URL) server <-> client |
| `@nexus_js/vite-plugin-nexus` | Plugin Vite ( transform .nx, HMR, manifests de islands, scoped CSS HMR, Server Actions) |
| `@nexus_js/create-nexus` | Scaffold (npm create @nexus_js/nexus) |
| `@nexus_js/eslint-plugin-bridge` | Regras ESLint para isolamento bridge/tenant |
| `@nexus_js/nexus_js` / `@nexus_js/nexus-js` | Meta pacotes para CLI (bins nexus + create-nexus) |

```bash
pnpm add @nexus_js/cli @nexus_js/server
# 0.9.30: full @nexus_js/content, request-scoped head + injeção auto load(), DX do compilador (erros estruturados + pretty formatters), polimento de estilos de docs e UI (temas branco/preto)
```

## @nexus_js/content (novo em 0.9.22/0.9.23, atualizado 0.9.30)

Suporte first-class para Markdown + i18n + coleções. Dogfooded por este mesmo site.

- `loadContent(slug, { locale, contentDir, includeRaw, extractHeadings, sanitize })` — carrega .md com fallback i18n (slug.es.md → slug.md), retorna { html, raw, meta, headings, ... }
- `defineCollection({ name, dir, locales, defaultLocale })` — coleções tipadas com `.get(slug, opts)` e `.list({ filter, sortBy, sortDesc })` (auto-descobre arquivos .md).
- `renderMarkdown(md, opts)` e `renderMarkdownAsync(md, { highlight })` — marked + sanitize + Shiki opcional (peer, fallback graceful).
- `defineI18n({ locales, messages, ... })` — `resolveLocale(ctx)`, `t()`, `tFn()`, com plurais estilo ICU via `interpolate` (suporta `{count, plural, one {...} other {...}}` e aninhados).
- `watchContent({ contentDir, onChange })` + `stopAllWatchers()` — hot reload dev para .md (prefere chokidar se presente).
- `formatDate(date, { locale, format, relative })`, `formatRelative` — datas localizadas (en/es/pt).

Uso em `load()`:

```ts
import { defineCollection, loadContent } from '@nexus_js/content';

const docs = defineCollection({ name: 'docs', dir: 'src/content/docs', locales: ['en','es','pt'] });

export async function load(ctx) {
  const page = loadContent('quickstart', { locale: ctx.locale });
  const all = docs.list({ locale: ctx.locale, sortBy: 'title' });
  return { page: page.html, headings: page.headings, allDocs: all };
}
```

Veja `src/lib/docs.ts` e as páginas de docs neste site para uso real (incluindo TOC de headings).

Nota de segurança: sanitize é para semi-confiado (seu próprio MD). Para conteúdo de usuário use DOMPurify + JSDOM.

## @nexus_js/head + injeção auto de head do servidor (0.9.23, 0.9.30)

Gerenciamento de head request-scoped. Prefira retornar `head` de `load()` — o renderer chama automaticamente `defineHead`, faz flush, renderiza HTML seguro e injeta (substitui `<!--nexus:head-->` ou antes de `</head>`).

```ts
export async function load(ctx) {
  return {
    head: {
      title: 'My Page',
      description: '...',
      og: { image: '...' },
      // ...
    }
  };
}
```

Layouts + páginas mesclam (o filho vence). Use `titleTemplate` no layout.

Além disso: `defineHead(meta, ctx?)`, `flushHead(ctx?)`, `renderHeadToString`, `useHead(() => meta)` para islands.

O velho `defineMetadata` está obsoleto.

Veja seo.md para padrões completos + JSON-LD, robots, etc.

## Melhorias DX do compilador (0.9.23, 0.9.30)

`compile()` agora retorna warnings ricos com `loc` e integra warnings do guard (NX-GUARD-* para segredos em código cliente).

Lança `CompileError` estruturado (com `code`, `file`, `loc`, `hint`, `frame`) para issues comuns de .nx:

- NX-101: `{#if}` sem fechar/malformado
- NX-103/104: sintaxe `{#each}` ruim (falta `as item`, sem fechar)

Helpers:

- `formatCompileError(err, source?)` — saída ANSI bonita com código, mensagem, localização, hint + frame da fonte + caret.
- `formatCompileWarning(warn, file, source?)` — similar para warnings.
- `extractFrame(source, loc)`, `offsetToLineColumn(source, offset)`

Usados automaticamente em `nexus dev` / `nexus build` para mensagens de erro excelentes (veja integração CLI e server).

Tests cobrem todos os casos (veja packages/compiler/src/index.test.ts).

Isso torna os erros de .nx tão úteis quanto em frameworks modernos.

## v0.9.30 — Melhorias em islands e CSS

### Islands externas (serving simplificado)

As islands externas (`src="$lib/islands/..."`) agora são servidas diretamente de `/_nexus/lib/*.js` sem um endpoint wrapper intermediário. O compilador reescreve os paths `$lib/` para URLs públicas automaticamente.

**O que funciona:**
- Arquivos fonte `.ts` e `.tsx` (auto-transpilados em dev)
- Imports relativos dentro de arquivos island (reescrição `.ts` → `.js`)
- Builds de produção com bundles hasheados em `.nexus/output/lib/`
- Imports de utilidades `$lib/` (ex. `$lib/utils.ts`) servidos transitivamente

**Fix:** `tryServeLibAsset` agora usa a implementação completa de `dev-assets.ts`, eliminando erros 404 que ocorriam com URLs `.ts`, nomes hasheados, ou imports aninhados.

### CSS global (buildGlobalStylesheet)

O `@nexus_js/server` agora inclui `buildGlobalStylesheet` para suporte de primeira classe de CSS global:

- Auto-descobre `src/app.css | global.css | index.css | styles.css`
- Lê `postcss.config.{mjs,cjs,js}` e executa o entry através do PostCSS automaticamente
- Serve o resultado compilado em `/_nexus/global.css`
- Suporta `css.entry` personalizado em `nexus.config.ts`

Isso faz o Tailwind CSS v4 funcionar out of the box sem configuração extra do servidor.

### Config defaultHydration

Define uma estratégia de hidratação a nível de projeto em `nexus.config.ts`:

```ts
export default {
  defaultHydration: 'client:visible', // 'client:idle' | 'client:load'
};
```

Quando setado, os elementos `<nexus-island>` sem diretiva explícita usam o default.

## Outras notas 0.9.23/0.9.30

- Cobertura de tests completa e melhorias de type safety através dos pacotes.
- Continua a enforcement de "modo correto" neste site de documentação (todo conteúdo via @nexus_js/content, load/pretext para dados, head via load(), sem padrões legacy).
- Veja CHANGELOG.md no monorepo para a lista completa.

Para instalação e quickstart veja as páginas dedicadas (sempre use o último `npm create @nexus_js/nexus`).

## @nexus_js/assets

Otimização de imagens + fontes com zero JS de cliente.

```nx
---
import { Image, getImageDimensions } from '@nexus_js/assets';
---

{Image({ src: '/hero.jpg', alt: 'Hero', width: 1200, height: 600 })}

<!-- Em load() para dims dinâmicos -->
{Image(pretext.photo)}
```

Veja assets.md para modo fill, remoto, sem otimizar, recortes redondos, fontes.

## @nexus_js/middleware + @nexus_js/db

Pipeline de requests Edge (Web Standards) e adaptadores BYOD DB (Prisma/Drizzle/Postgres.js/libSQL).

Use em config do server ou load(); wrappers finos para que seu código DB existente funcione com helpers de tenant/secret de security.

## @nexus_js/bridge + Legacy (uso exato)

```bash
# CLI exato
nexus bridge add postgres --dsn-env BRIDGE_POSTGRES_URL --schema public
nexus bridge discover
nexus bridge verify
nexus bridge generate
nexus bridge ui --port 4600
```

Defaults de segurança exatos:
- Descoberta apenas de schema (sem amostragem de dados)
- Campos sensíveis/secretos excluídos do SDL
- Shield defaults com introspection desabilitada

Uso exato em load() (modo correto):

```ts
import { createRemoteExecutor } from '@nexus_js/graphql';
import { nexusVault } from '@nexus_js/security';

export const legacy = createRemoteExecutor({
  url: 'https://old.example.com/graphql',
  headers: { 'x-api-key': nexusVault.get('LEGACY_KEY') },
});

// envolve middleware Express antigo como server action (exato)
import { wrapExpressMiddleware } from '@nexus_js/server';
export const legacyPayment = wrapExpressMiddleware(oldExpressHandler);
```

Veja a página dedicada bridge.md (criada para cobertura completa) + security.md para exemplos exatos completos.

## @nexus_js/sync + @nexus_js/connect (exato)

```ts
// local-first exato
import { syncEngine } from '@nexus_js/sync';
await syncEngine.upsertNode({ id: 'n1', flowId: 'f1', data: { label: 'Start' } });
const nodes = await syncEngine.listNodes('f1');

// edge real-time exato (em island ou load)
const socket = $socket('room:123');
socket.send({ type: 'update', payload: data });
```

Veja sync.md e connect.md dedicadas (adicionadas para cobertura completa) para exemplos completos end-to-end modo correto com load(), islands, e actions.

## @nexus_js/ui (exato)

```svelte
<!-- zero JS enviado -->
<div class="nexus-accordion" data-nexus-ui="accordion">...</div>
```

Apenas o CSS (ou componente CSS). 0.0KB JS. Veja ui.md dedicada.

## @nexus_js/serialize (exato)

Transporte automático lossless para Date, Map, Set, BigInt, RegExp, URL entre load()/actions ↔ islands/pretext. Quase nunca você toca diretamente.

Veja serialize.md dedicada.

## @nexus_js/types + @nexus_js/vite-plugin-nexus (exato)

- `nexus-types.d.ts` gerado automaticamente para segurança E2E.
- Plugin Vite incluído por padrão (HMR para .nx, atualizações de CSS scoped, manifests de islands, Server Actions).

Config avançada só quando você opta por não usar os defaults. Veja páginas dedicadas.

## @nexus_js/create-nexus + CLIs meta

```bash
npm create @nexus_js/nexus my-app
```

Dá a você os bins `nexus` e `create-nexus`. Use os meta pacotes @nexus_js/nexus_js ou @nexus_js/nexus-js.

## @nexus_js/eslint-plugin-bridge + testing

```bash
# lint
eslint --ext .ts,.nx .

# test
nexus test
```

Veja testing.md para o uso exato de renderSSR / mountIsland / action test harness.

Veja as páginas dedicadas que adicionamos para cobertura completa (bridge.md, sync.md, connect.md, ui.md, serialize.md, types.md, vite-plugin-nexus.md) e os exemplos de uso exatos ao longo das outras páginas desta lista (install, quickstart, server-actions, etc.). Todas demonstram uso real, copy-paste, modo correto de cada pacote.
- Lista completa sempre em monorepo packages/; todos seguem semver e são publicados juntos.

Veja CHANGELOG.md para detalhes por versão e os docs do site (security, assets, cli, etc.) para uso em modo correto (load/pretext, coleções de conteúdo, head via load(), etc.).
