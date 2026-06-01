# Package Reference

The Nexus monorepo is organized into focused packages.

| Package | Purpose |
|---------|---------|
| `@nexus_js/cli` | CLI, dev server, build pipeline |
| `@nexus_js/compiler` | .nx parser, CSS scoping, codegen |
| `@nexus_js/server` | SSR renderer, actions, middleware |
| `@nexus_js/router` | File-based routing |
| `@nexus_js/runtime` | Client islands, navigation, store |
| `@nexus_js/security` | CSRF, rate limiting, CSP |
| `@nexus_js/graphql` | GraphQL integration |
| `@nexus_js/audit` | Dependency security scanning |
| `@nexus_js/types` | Shared TypeScript types |

```bash
pnpm add @nexus_js/cli @nexus_js/server
```