# Referencia de Paquetes

El monorepo de Nexus está organizado en paquetes enfocados. Todos los paquetes siguen semver y se publican juntos.

| Paquete | Propósito |
|---------|-----------|
| `@nexus_js/cli` | CLI, servidor dev, pipeline de build, create-nexus |
| `@nexus_js/compiler` | parser .nx, scoping CSS, codegen, reporte de errores (CompileError estructurado + formatters) |
| `@nexus_js/server` | renderer SSR, actions, middleware, inyección de head, seguridad hardened |
| `@nexus_js/router` | Enrutamiento basado en archivos |
| `@nexus_js/runtime` | Islands de cliente, navegación, store, $pretext |
| `@nexus_js/security` | CSRF, rate limiting, CSP, Vault, Shield, modo hardened |
| `@nexus_js/graphql` | Integración GraphQL + Bridge Legacy |
| `@nexus_js/content` | Markdown, colecciones de contenido rico, helpers i18n (loadContent, defineCollection, defineI18n, render, watch, dates) |
| `@nexus_js/head` | Metadata SEO reactiva (server + cliente; inyección auto desde load()) |
| `@nexus_js/audit` | Escaneo de seguridad de dependencias (OSV, CVE, fugas de secretos) |
| `@nexus_js/types` | Tipos TypeScript compartidos + generador auto de tipos (nexus-types.d.ts) |
| `@nexus_js/assets` | Optimización de imágenes (AVIF/WebP, srcsets, blur, fonts), helper Image() |
| `@nexus_js/middleware` | Pipeline de requests compatible con Edge (Web Standards) |
| `@nexus_js/db` | Adaptador delgado BYOD para DB (Prisma, Drizzle, Postgres, libSQL) |
| `@nexus_js/testing` | Utilidades de render SSR + cliente para componentes .nx |
| `@nexus_js/ui` | Componentes interactivos CSS-only zero-bundle (0 JS) |
| `@nexus_js/sync` | Sync local-first ($localSync IndexedDB + Byte-Mirror SQLite WASM/OPFS prototype) |
| `@nexus_js/connect` | Sync de estado real-time en Edge vía SSE (rune $socket()) |
| `@nexus_js/bridge` | Descubrimiento legacy (DB/APIs), modelo canónico, generadores seguros (GraphQL + Shield) |
| `@nexus_js/serialize` | Transporte lossless (Date, Map, Set, BigInt, RegExp, URL) server <-> client |
| `@nexus_js/vite-plugin-nexus` | Plugin Vite ( transform .nx, HMR, manifests de islands, scoped CSS HMR, Server Actions) |
| `@nexus_js/create-nexus` | Scaffold (npm create @nexus_js/create-nexus) |
| `@nexus_js/eslint-plugin-bridge` | Reglas ESLint para aislamiento bridge/tenant |
| `@nexus_js/nexus_js` / `@nexus_js/nexus-js` | Meta paquetes para CLI (bins nexus + create-nexus) |

```bash
pnpm add @nexus_js/cli @nexus_js/server
# 0.9.30: full @nexus_js/content, request-scoped head + inyección auto load(), DX del compilador (errores estructurados + pretty formatters), pulido de estilos de docs y UI (temas blanco/negro)
```

## @nexus_js/content (nuevo en 0.9.22/0.9.23, actualizado 0.9.30)

Soporte first-class para Markdown + i18n + colecciones. Dogfoodeado por este mismo sitio.

- `loadContent(slug, { locale, contentDir, includeRaw, extractHeadings, sanitize })` — carga .md con fallback i18n (slug.es.md → slug.md), retorna { html, raw, meta, headings, ... }
- `defineCollection({ name, dir, locales, defaultLocale })` — colecciones tipadas con `.get(slug, opts)` y `.list({ filter, sortBy, sortDesc })` (auto-descubre archivos .md).
- `renderMarkdown(md, opts)` y `renderMarkdownAsync(md, { highlight })` — marked + sanitize + Shiki opcional (peer, fallback graceful).
- `defineI18n({ locales, messages, ... })` — `resolveLocale(ctx)`, `t()`, `tFn()`, con plurales estilo ICU vía `interpolate` (soporta `{count, plural, one {...} other {...}}` y anidados).
- `watchContent({ contentDir, onChange })` + `stopAllWatchers()` — hot reload dev para .md (prefiere chokidar si está presente).
- `formatDate(date, { locale, format, relative })`, `formatRelative` — fechas localizadas (en/es/pt).

Uso en `load()`:

```ts
import { defineCollection, loadContent } from '@nexus_js/content';

const docs = defineCollection({ name: 'docs', dir: 'src/content/docs', locales: ['en','es','pt'] });

export async function load(ctx) {
  const page = loadContent('quickstart', { locale: ctx.locale });
  const all = docs.list({ locale: ctx.locale, sortBy: 'title' });
  return { page: page.html, headings: page.headings, allDocs: all };
}
```

Ver `src/lib/docs.ts` y las páginas de docs en este sitio para uso real (incluyendo TOC desde headings).

Nota de seguridad: sanitize es para semi-confiado (tu propio MD). Para contenido de usuario usa DOMPurify + JSDOM.

## @nexus_js/head + inyección auto de head del servidor (0.9.23, 0.9.30)

Gestión de head request-scoped. Prefiere retornar `head` desde `load()` — el renderer llama automáticamente `defineHead`, flushea, renderiza HTML seguro y lo inyecta (reemplaza `<!--nexus:head-->` o antes de `</head>`).

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

Layouts + páginas se mezclan (el hijo gana). Usa `titleTemplate` en el layout.

Además: `defineHead(meta, ctx?)`, `flushHead(ctx?)`, `renderHeadToString`, `useHead(() => meta)` para islands.

El viejo `defineMetadata` está deprecado.

Ver seo.md para patrones completos + JSON-LD, robots, etc.

## Mejoras DX del compilador (0.9.23, 0.9.30)

`compile()` ahora retorna warnings ricos con `loc` e integra warnings del guard (NX-GUARD-* para secretos en código cliente).

Lanza `CompileError` estructurado (con `code`, `file`, `loc`, `hint`, `frame`) para issues comunes de .nx:

- NX-101: `{#if}` sin cerrar/malformado
- NX-103/104: sintaxis `{#each}` mala (falta `as item`, sin cerrar)

Helpers:

- `formatCompileError(err, source?)` — salida ANSI bonita con código, mensaje, ubicación, hint + frame de fuente + caret.
- `formatCompileWarning(warn, file, source?)` — similar para warnings.
- `extractFrame(source, loc)`, `offsetToLineColumn(source, offset)`

Usados automáticamente en `nexus dev` / `nexus build` para mensajes de error excelentes (ver integración CLI y server).

Tests cubren todos los casos (ver packages/compiler/src/index.test.ts).

Esto hace que los errores de .nx sean tan útiles como en frameworks modernos.

## v0.9.30 — Mejoras en islands y CSS

### Islands externas (serving simplificado)

Las islands externas (`src="$lib/islands/..."`) ahora se sirven directamente desde `/_nexus/lib/*.js` sin un endpoint wrapper intermedio. El compilador reescribe los paths `$lib/` a URLs públicas automáticamente.

**Qué funciona:**
- Archivos fuente `.ts` y `.tsx` (auto-transpilados en dev)
- Imports relativos dentro de archivos island (reescritura `.ts` → `.js`)
- Builds de producción con bundles hasheados en `.nexus/output/lib/`
- Imports de utilidades `$lib/` (ej. `$lib/utils.ts`) servidos transitivamente

**Fix:** `tryServeLibAsset` ahora usa la implementación completa de `dev-assets.ts`, eliminando errores 404 que ocurrían con URLs `.ts`, nombres hasheados, o imports anidados.

### CSS global (buildGlobalStylesheet)

`@nexus_js/server` ahora incluye `buildGlobalStylesheet` para soporte de primera clase de CSS global:

- Auto-descubre `src/app.css | global.css | index.css | styles.css`
- Lee `postcss.config.{mjs,cjs,js}` y ejecuta el entry a través de PostCSS automáticamente
- Sirve el resultado compilado en `/_nexus/global.css`
- Soporta `css.entry` personalizado en `nexus.config.ts`

Esto hace que Tailwind CSS v4 funcione out of the box sin configuración extra del servidor.

### Config defaultHydration

Define una estrategia de hidratación a nivel proyecto en `nexus.config.ts`:

```ts
export default {
  defaultHydration: 'client:visible', // 'client:idle' | 'client:load'
};
```

Cuando está seteado, los elementos `<nexus-island>` sin directiva explícita usan el default.

## Otras notas 0.9.23/0.9.30

- Cobertura de tests completa y mejoras de type safety a través de paquetes.
- Continúa la enforcement de "modo correcto" en este sitio de documentación mismo (todo contenido vía @nexus_js/content, load/pretext para datos, head vía load(), sin patrones legacy).
- Ver CHANGELOG.md en el monorepo para la lista completa.

Para instalación y quickstart ver las páginas dedicadas (siempre usa el último `npm create @nexus_js/create-nexus`).

## @nexus_js/assets

Optimización de imágenes + fuentes con cero JS de cliente.

```nx
---
import { Image, getImageDimensions } from '@nexus_js/assets';
---

{Image({ src: '/hero.jpg', alt: 'Hero', width: 1200, height: 600 })}

<!-- En load() para dims dinámicos -->
{Image(pretext.photo)}
```

Ver assets.md para modo fill, remoto, sin optimizar, recortes redondos, fuentes.

## @nexus_js/middleware + @nexus_js/db

Pipeline de requests Edge (Web Standards) y adaptadores BYOD DB (Prisma/Drizzle/Postgres.js/libSQL).

Usar en config del server o load(); wrappers delgados para que tu código DB existente funcione con helpers de tenant/secret de security.

## @nexus_js/bridge + Legacy (uso exacto)

```bash
# CLI exacto
nexus bridge add postgres --dsn-env BRIDGE_POSTGRES_URL --schema public
nexus bridge discover
nexus bridge verify
nexus bridge generate
nexus bridge ui --port 4600
```

Defaults de seguridad exactos:
- Descubrimiento solo de schema (sin muestreo de datos)
- Campos sensibles/secretos excluidos del SDL
- Shield defaults con introspection deshabilitada

Uso exacto en load() (modo correcto):

```ts
import { createRemoteExecutor } from '@nexus_js/graphql';
import { nexusVault } from '@nexus_js/security';

export const legacy = createRemoteExecutor({
  url: 'https://old.example.com/graphql',
  headers: { 'x-api-key': nexusVault.get('LEGACY_KEY') },
});

// envuelve middleware Express viejo como server action (exacto)
import { wrapExpressMiddleware } from '@nexus_js/server';
export const legacyPayment = wrapExpressMiddleware(oldExpressHandler);
```

Ver la página dedicada bridge.md (creada para cobertura completa) + security.md para ejemplos exactos completos.

## @nexus_js/sync + @nexus_js/connect (exacto)

```ts
// local-first exacto
import { syncEngine } from '@nexus_js/sync';
await syncEngine.upsertNode({ id: 'n1', flowId: 'f1', data: { label: 'Start' } });
const nodes = await syncEngine.listNodes('f1');

// edge real-time exacto (en island o load)
const socket = $socket('room:123');
socket.send({ type: 'update', payload: data });
```

Ver sync.md y connect.md dedicadas (añadidas para cobertura completa) para ejemplos completos end-to-end modo correcto con load(), islands, y actions.

## @nexus_js/ui (exacto)

```svelte
<!-- cero JS enviado -->
<div class="nexus-accordion" data-nexus-ui="accordion">...</div>
```

Solo el CSS (o componente CSS). 0.0KB JS. Ver ui.md dedicada.

## @nexus_js/serialize (exacto)

Transporte automático lossless para Date, Map, Set, BigInt, RegExp, URL entre load()/actions ↔ islands/pretext. Casi nunca lo tocas directamente.

Ver serialize.md dedicada.

## @nexus_js/types + @nexus_js/vite-plugin-nexus (exacto)

- `nexus-types.d.ts` generado automáticamente para seguridad E2E.
- Plugin Vite incluido por defecto (HMR para .nx, actualizaciones de CSS scoped, manifests de islands, Server Actions).

Config avanzada solo cuando optas por no usar los defaults. Ver páginas dedicadas.

## @nexus_js/create-nexus + CLIs meta

```bash
npm create @nexus_js/create-nexus my-app
```

Te da los bins `nexus` y `create-nexus`. Usa los meta paquetes @nexus_js/nexus_js o @nexus_js/nexus-js.

## @nexus_js/eslint-plugin-bridge + testing

```bash
# lint
eslint --ext .ts,.nx .

# test
nexus test
```

Ver testing.md para el uso exacto de renderSSR / mountIsland / action test harness.

Ver las páginas dedicadas que añadimos para cobertura completa (bridge.md, sync.md, connect.md, ui.md, serialize.md, types.md, vite-plugin-nexus.md) y los ejemplos de uso exactos a lo largo de las otras páginas de esta lista (install, quickstart, server-actions, etc.). Todas demuestran uso real, copy-paste, modo correcto de cada paquete.
- Lista completa siempre en monorepo packages/; todos siguen semver y se publican juntos.

Ver CHANGELOG.md para detalles por versión y los docs del sitio (security, assets, cli, etc.) para uso en modo correcto (load/pretext, colecciones de contenido, head vía load(), etc.).
