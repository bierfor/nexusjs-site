# Nexus 0.9.x Release Notes (0.9.0 -> 0.9.21)

Consolidated notes for the `0.9.x` line, version by version, using verifiable public evidence.

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

## Upgrade recommendation

```bash
npm install @nexus_js/cli@0.9.21 @nexus_js/server@0.9.21 @nexus_js/compiler@0.9.21 @nexus_js/graphql@0.9.21
```

