# CLI Reference

**Exact** commands and what they do.

| Exact command you type          | Exact thing that happens |
|---------------------------------|--------------------------|
| `nexus dev --port 3000`        | Starts dev server, watches .nx/.ts, HMR, serves /_nexus/global.css etc. |
| `nexus build`                  | Produces optimized server + client bundles in `.nexus/output/` |
| `nexus start`                  | Runs the production server from the build output |
| `nexus audit`                  | Runs OSV CVE scan + secret leak + unused dep checks (same as build-time) |
| `nexus fix`                    | Auto-applies safe fixes from audit |
| `nexus studio`                 | Real-time dashboard (islands, actions, cache, store) |
| `nexus test`                   | Runs Vitest with SSR + island + action helpers |
| `nexus routes`                 | Prints the resolved route tree |
| `nexus check`                  | Type-checks without running the server |

During `nexus dev` and `nexus build` you get **exact** structured errors:

```text
◆ NX-101  Unclosed {#if}
  src/routes/checkout/+page.nx:18:3
  hint: Add {/if} or use {:else if}
```

`formatCompileError` / `formatCompileWarning` + frames are used automatically by the CLI and dev server.

## Exact nexus.config.ts (the one you copy)

```ts
export default {
  server: { port: 3000 },
  security: {
    hardened: true,
    csp: { additionalScriptSrc: [] },
  },
  css: { entry: './src/global.css' },
};
```

See the other pages in this list (especially security.md for the exact hardened + cspNonce story, and the new dedicated pages) for more exact usage of everything the CLI wires up. All commands above are implemented in @nexus_js/cli and are the ones used to develop and build this very documentation site.