# Package Reference

The Nexus monorepo is organized into focused packages. All packages follow semver and are published together.

| Package | Purpose |
|---------|---------|
| `@nexus_js/cli` | CLI, dev server, build pipeline, create-nexus |
| `@nexus_js/compiler` | .nx parser, CSS scoping, codegen, error reporting |
| `@nexus_js/server` | SSR renderer, actions, middleware, head injection |
| `@nexus_js/router` | File-based routing |
| `@nexus_js/runtime` | Client islands, navigation, store, $pretext |
| `@nexus_js/security` | CSRF, rate limiting, CSP, Vault, Shield |
| `@nexus_js/graphql` | GraphQL integration + Legacy Bridge |
| `@nexus_js/content` | Markdown, rich content collections, i18n helpers |
| `@nexus_js/head` | Reactive SEO metadata (server + client) |
| `@nexus_js/audit` | Dependency security scanning |
| `@nexus_js/types` | Shared TypeScript types |

```bash
pnpm add @nexus_js/cli @nexus_js/server
# 0.9.23: full @nexus_js/content, request-scoped head + load() auto-injection, compiler DX (structured errors + pretty formatters)
```

## @nexus_js/content (new in 0.9.22/0.9.23)

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

## @nexus_js/head + Server auto head injection (0.9.23)

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

## Compiler DX improvements (0.9.23)

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

## Other 0.9.23 notes

- Full test coverage and type safety improvements across packages.
- Continued "modo correcto" enforcement in this documentation site itself (all content via @nexus_js/content, load/pretext for data, head via load(), no legacy patterns).
- See CHANGELOG.md in the monorepo for complete list.

For installation and quickstart see the dedicated pages (always use the latest `npm create @nexus_js/nexus`).
```