# Nexus 0.9.x Release Notes (0.9.0 -> 0.9.24)

Consolidated notes for the `0.9.x` line, version by version, using verifiable public evidence.

**0.9.24** (current): Full multi-language support for all child documentation content ("todo el contenido del hijo"): every docs page (quickstart through packages, releases, security etc.) now ships accurate professional .es.md + .pt.md translations of the detailed "exacto" / "modo correcto" usage examples (previously only install + quickstart partial worked; lang switch now shows translated prose/headings in /docs/* child pages). Standardized content layout (bare slug.md = English for @nexus_js/content loadContent + collection + resolve fallback; ${slug}.${locale}.md for es/pt), fixed resolveDocPath + [slug] edit links + all sidebar/docs-nav ?lang= links to preserve + deliver locale-specific child MD. Minor i18n.ts PT key fixes (docs/releases titles). Plus: Documentation and UI/style polish. Refined light (white) theme with blacker text (#111) for better contrast on blanco backgrounds; centralized CSS vars for black/dark code blocks (pre, Shiki, raw sources with consistent borders). Sidebar logo now pure black "N" on light bg with strong borders/hovers ("todo en blanco" consistency). Releases page main container switched to light theme vars (no more all-black "todo negro" box); raw Markdown source keeps dark code-like pre for readability. Full documentation coverage: expanded packages.md with complete list of all ~25 packages + detailed sections; added dedicated docs pages for bridge, sync, connect, ui, serialize, types, vite-plugin-nexus. Extended RELEASES notes with recent site UI/security/doc work (sidebar polish with working filter+clear, active states, mobile X+blur, language segmented control; cspNonce full support across pages + nonce on inline styles/scripts; CSP tightened by removing unused cdnjs; releases to strict sanitize; path traversal protection in doc loading; tabnabbing fixes with rel=noopener on external target=_blank links). All in "modo correcto" (load/pretext, @nexus_js/content for MD, direct interpolation in .nx, etc.). Builds and dogfooding verified. See detailed sections below + packages.md and comparison.md in the docs site. Previous 0.9.23 notes below.

## Verified sources

- npm published versions: `@nexus_js/cli`, `@nexus_js/server`, `@nexus_js/compiler`, `@nexus_js/graphql`
- GitHub tags: `v0.9.21` down to `v0.9.12`, plus `v0.9.3`
- Official `CHANGELOG.md` entries (explicit for `0.9.0` and `0.9.3`)
- `RELEASE_NOTES_0.9.3.md`
- GitHub compare: `v0.9.3...v0.9.21`

> Note: several intermediate versions (`0.9.1`, `0.9.2`, `0.9.5`, `0.9.7`, `0.9.9`) do not have detailed public release notes. They are marked as **limited public notes** to avoid guessing.

---

## Version matrix

| Version | Evidence status | Documented improvements |
|---|---|---|
| `0.9.24` | High | Documentation and UI/style polish (white/black theme consistency, black logo on light bg, CSS vars for code blocks); full package docs coverage (all ~25 pkgs in packages.md + new dedicated pages for bridge/sync/connect/ui/serialize/types/vite-plugin-nexus); security follow-ups (cspNonce, CSP tighten, strict sanitize on releases, path traversal protection, tabnabbing fixes). |
| `0.9.23` | High | Major DX + Content + SEO (full @nexus_js/content, request-scoped head + load() auto-injection, compiler DX with structured errors + formatters). Site updated with pure patterns (releases via content, TOC from headings, full i18n, start script fix). UI polish: sidebar (filter+clear, active states, mobile X animation), black logo, etc. |
| `0.9.21` | High | Global CSS / Tailwind / PostCSS support in dev mode via `/_nexus/global.css` endpoint + `css.entry` config. |
| `0.9.20` | High | Runtime navigation skips re-injecting stylesheets already present in `<head>`. |
| `0.9.19` | High | Static asset cache validators (`ETag`, `Last-Modified`) + SSR stylesheet dedup on server. |
| `0.9.18` | Medium | 0.9.x package publish/alignment step. |
| `0.9.17` | High | Dev CSS pre-warm before HMR reload broadcast. |
| `0.9.16` | High | Aggregated CSS build recovery after transient file compile errors. |
| `0.9.15` | High | `/_nexus/styles.css`: `ETag + no-cache` to reduce hard-refresh FOUC. |
| `0.9.14` | High | Framework package line alignment after version drift. |
| `0.9.13` | High | Compiler/CLI bug-fix release line publish. |
| `0.9.12` | High | Compiler `collectLibUsage` fix for mixed runtime + `$lib` import parsing. |
| `0.9.11` | High | Compiler transitive `$lib` chunks + output manifest rewrite fixes. |
| `0.9.10` | High | Compiler `$lib` rewrite to `/_nexus/lib/*` + tree-shaken hashed island bundles. |
| `0.9.9` | Low | Patch release in the bridge/tenancy hardening sequence. |
| `0.9.8` | Medium | Tenancy resolver + vault namespace/bridge isolation progression. |
| `0.9.7` | Low | Intermediate bridge/tenancy stabilization release. |
| `0.9.6` | Medium | Secure bridge discovery / canonical model progression. |
| `0.9.5` | Low | Intermediate stabilization release after 0.9.4. |
| `0.9.4` | Medium | Early post-0.9.3 hardening release. |
| `0.9.3` | High | GraphQL + Legacy Bridge + Deployment Stack. |
| `0.9.2` | Low | Pre-0.9.3 maintenance step (no separate public changelog entry found). |
| `0.9.1` | Low | Pre-0.9.3 maintenance step (no separate public changelog entry found). |
| `0.9.0` | High | Baseline 0.9 line milestone before GraphQL/Bridge expansion. |

---

## 0.9.23 summary
Major DX + Content + SEO improvements (mature @nexus_js/content with loadContent, defineCollection.list(), renderMarkdownAsync + Shiki, ICU plurals in defineI18n, watchContent, formatDate/formatRelative). 55 tests. Full dogfooding in this site (releases via content, TOC from headings, full i18n). Request-scoped head + auto-injection via load() return. Compiler DX with structured CompileError (NX-101/103/104 etc.), formatCompileError/ formatCompileWarning with ANSI frames. Site updated to pure patterns. UI polish: sidebar (filter+clear, active states, mobile X), black logo for light theme, etc. All published.

## Upgrade recommendation

```bash
npm install @nexus_js/cli@0.9.24 @nexus_js/server@0.9.24 @nexus_js/compiler@0.9.24 @nexus_js/graphql@0.9.24
```

