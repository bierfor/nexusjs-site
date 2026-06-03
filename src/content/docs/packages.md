# Package Reference

The Nexus monorepo is organized into focused packages. All packages follow semver and are published together.

| Package | Purpose |
|---------|---------|
| `@nexus_js/cli` | CLI, dev server, build pipeline, create-nexus |
| `@nexus_js/compiler` | .nx parser, CSS scoping, codegen, error reporting (structured CompileError + formatters) |
| `@nexus_js/server` | SSR renderer, actions, middleware, head injection, hardened security |
| `@nexus_js/router` | File-based routing |
| `@nexus_js/runtime` | Client islands, navigation, store, $pretext |
| `@nexus_js/security` | CSRF, rate limiting, CSP, Vault, Shield, hardened mode |
| `@nexus_js/graphql` | GraphQL integration + Legacy Bridge |
| `@nexus_js/content` | Markdown, rich content collections, i18n helpers (loadContent, defineCollection, defineI18n, render, watch, dates) |
| `@nexus_js/head` | Reactive SEO metadata (server + client; load() auto-injection) |
| `@nexus_js/audit` | Dependency security scanning (OSV, CVE, secret leaks) |
| `@nexus_js/types` | Shared TypeScript types + auto type generator (nexus-types.d.ts) |
| `@nexus_js/assets` | Image optimization (AVIF/WebP, srcsets, blur, fonts), Image() helper |
| `@nexus_js/middleware` | Edge-compatible request pipeline (Web Standards) |
| `@nexus_js/db` | BYOD thin DB provider adapter (Prisma, Drizzle, Postgres, libSQL) |
| `@nexus_js/testing` | SSR + client render utilities for .nx components |
| `@nexus_js/ui` | Zero-bundle (0 JS) CSS-only interactive components |
| `@nexus_js/sync` | Local-first sync ($localSync IndexedDB + Byte-Mirror SQLite WASM/OPFS prototype) |
| `@nexus_js/connect` | Edge real-time state sync via SSE ($socket() rune) |
| `@nexus_js/bridge` | Legacy discovery (DB/APIs), canonical model, secure generators (GraphQL + Shield) |
| `@nexus_js/serialize` | Lossless transport (Date, Map, Set, BigInt, RegExp, URL) server <-> client |
| `@nexus_js/vite-plugin-nexus` | Vite plugin ( .nx transform, HMR, island manifests, scoped CSS HMR, Server Actions) |
| `@nexus_js/create-nexus` | Scaffold (npm create @nexus_js/nexus) |
| `@nexus_js/eslint-plugin-bridge` | ESLint rules for bridge/tenant isolation |
| `@nexus_js/nexus_js` / `@nexus_js/nexus-js` | Meta packages for CLI (nexus + create-nexus bins) |

```bash
pnpm add @nexus_js/cli @nexus_js/server
# 0.9.24: full @nexus_js/content, request-scoped head + load() auto-injection, compiler DX (structured errors + pretty formatters), documentation and UI style polish (white/black themes)
```

## @nexus_js/content (new in 0.9.22/0.9.23, updated 0.9.24)

First-class support for Markdown + i18n + collections. Dogfooded by this very site.

- `loadContent(slug, { locale, contentDir, includeRaw, extractHeadings, sanitize })` — loads .md with i18n fallback (slug.es.md → slug.md), returns { html, raw, meta, headings, ... }
- `defineCollection({ name, dir, locales, defaultLocale })` — typed collections with `.get(slug, opts)` and `.list({ filter, sortBy, sortDesc })` (auto-discovers .md files).
- `renderMarkdown(md, opts)` and `renderMarkdownAsync(md, { highlight })` — marked + sanitize + optional Shiki (peer, graceful fallback).
- `defineI18n({ locales, messages, ... })` — `resolveLocale(ctx)`, `t()`, `tFn()`, with ICU-style plurals via `interpolate` (supports `{count, plural, one {...} other {...}}` and nested).
- `watchContent({ contentDir, onChange })` + `stopAllWatchers()` — dev hot reload for .md (prefers chokidar if present).
- `formatDate(date, { locale, format, relative })`, `formatRelative` — localized dates (en/es/pt).

Usage in `load()`:

```ts
import { defineCollection, loadContent } from '@nexus_js/content';

const docs = defineCollection({ name: 'docs', dir: 'src/content/docs', locales: ['en','es','pt'] });

export async function load(ctx) {
  const page = loadContent('quickstart', { locale: ctx.locale });
  const all = docs.list({ locale: ctx.locale, sortBy: 'title' });
  return { page: page.html, headings: page.headings, allDocs: all };
}
```

See `src/lib/docs.ts` and doc pages in this site for real usage (including TOC from headings).

Security note: sanitize is for semi-trusted (your own MD). For user content use DOMPurify + JSDOM.

## @nexus_js/head + Server auto head injection (0.9.23, 0.9.24)

Request-scoped head management. Prefer returning `head` from `load()` — the renderer automatically calls `defineHead`, flushes, renders safe HTML and injects it (replaces `<!--nexus:head-->` or before `</head>`).

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

Layouts + pages merge (child wins). Use `titleTemplate` in layout.

Also: `defineHead(meta, ctx?)`, `flushHead(ctx?)`, `renderHeadToString`, `useHead(() => meta)` for islands.

Old `defineMetadata` is deprecated.

See seo.md for full patterns + JSON-LD, robots, etc.

## Compiler DX improvements (0.9.23, 0.9.24)

`compile()` now returns rich warnings with `loc` and integrates guard warnings (NX-GUARD-* for secrets in client code).

Throws structured `CompileError` (with `code`, `file`, `loc`, `hint`, `frame`) for common .nx issues:

- NX-101: unclosed/malformed `{#if}`
- NX-103/104: bad `{#each}` syntax (missing `as item`, unclosed)

Helpers:

- `formatCompileError(err, source?)` — pretty ANSI output with code, message, location, hint + source frame + caret.
- `formatCompileWarning(warn, file, source?)` — similar for warnings.
- `extractFrame(source, loc)`, `offsetToLineColumn(source, offset)`

Used automatically in `nexus dev` / `nexus build` for excellent error messages (see CLI and server integration).

Tests cover all cases (see packages/compiler/src/index.test.ts).

This makes .nx errors as helpful as modern frameworks.

## Other 0.9.23/0.9.24 notes

- Full test coverage and type safety improvements across packages.
- Continued "modo correcto" enforcement in this documentation site itself (all content via @nexus_js/content, load/pretext for data, head via load(), no legacy patterns).
- See CHANGELOG.md in the monorepo for complete list.

For installation and quickstart see the dedicated pages (always use the latest `npm create @nexus_js/nexus`).

## @nexus_js/assets
Image + font optimization with zero client JS.

```nx
---
import { Image, getImageDimensions } from '@nexus_js/assets';
---

{Image({ src: '/hero.jpg', alt: 'Hero', width: 1200, height: 600 })}

<!-- In load() for dynamic dims -->
{Image(pretext.photo)}
```

See assets.md for fill mode, remote, unoptimized, round crops, fonts.

## @nexus_js/middleware + @nexus_js/db
Edge request pipeline (Web Standards) and BYOD DB adapters (Prisma/Drizzle/Postgres.js/libSQL).

Use in server config or load(); thin wrappers so your existing DB code works with tenant/secret helpers from security.

## @nexus_js/bridge + Legacy
Security-first legacy discovery + canonical models + generators.

```bash
nexus bridge add postgres --dsn-env DB_URL
nexus bridge discover
nexus bridge generate
```

See bridge.md (forthcoming dedicated) and security.md.

## @nexus_js/sync + @nexus_js/connect
Local-first ($localSync) and edge real-time ($socket() via SSE).

```ts
// sync
const rows = await bridge.listNodes(flowId);

// connect (in island or load)
const socket = $socket('room:123');
```

Dedicated guides coming; use for collaborative UIs without extra infra.

## @nexus_js/ui
Zero-bundle CSS-only interactive components (no JS shipped).

Import and use classes; 0.0KB JS.

## @nexus_js/serialize
Lossless roundtrip for rich types (Date/Map/Set/BigInt/RegExp/URL) in actions/pretext.

Automatic in Nexus transport.

## @nexus_js/types + @nexus_js/vite-plugin-nexus
Auto-generated nexus-types.d.ts for end-to-end safety; Vite plugin for .nx transform/HMR/scoped CSS.

Used internally by CLI; advanced config via `nexus({ ... })` in vite.config.

## @nexus_js/create-nexus + meta CLIs
Scaffold + the `nexus` / `create-nexus` bins (via @nexus_js/nexus_js or @nexus_js/nexus-js meta pkgs).

## @nexus_js/eslint-plugin-bridge + testing
Lint rules for tenant isolation; SSR/client test utils for .nx.

See testing.md.

## Other packages
- `eslint-plugin-bridge`, `bridge-postgres`: CLI + security helpers for enterprise multi-tenant.
- Full list always in monorepo packages/; all follow semver and publish together.

See CHANGELOG.md for per-version details and the site docs (security, assets, cli, etc.) for usage in modo correcto (load/pretext, content collections, head via load(), etc.).
```