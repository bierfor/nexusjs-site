# CLI Reference

**Exact** commands and what they do.

| Command | What it does |
|---------|--------------|
| `nexus dev` | Starts the dev server with HMR and file watching |
| `nexus build` | Compiles the app for production into `.nexus/output/` |
| `nexus start` | Starts the production server (requires `NEXUS_SECRET`) |
| `nexus check` | Type-checks the project without running the server |
| `nexus audit` | Runs security checks (CVE scan, secret leaks, unused deps) |
| `nexus studio` | Opens the real-time dashboard |
| `nexus routes` | Prints the resolved route tree |
| `nexus add` | Adds packages, routes, or project scaffolding |

During `nexus dev` and `nexus build` you get **exact** structured errors:

```text
◆ NX-101  Unclosed {#if}
  src/routes/checkout/+page.nx:18:3
  hint: Add {/if} or use {:else if}
```

`formatCompileError` / `formatCompileWarning` + frames are used automatically by the CLI and dev server.

## Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--port` | `-p` | Port to bind (defaults to `nexus.config.ts` `server.port` or `3000`) |
| `--host` | | Host to bind (defaults to `localhost`) |
| `--root` | | Project root path |

Examples:

```bash
nexus dev --port 3000
nexus start --host 0.0.0.0
```

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
