# CLI Reference

All Nexus commands: `nexus <command> [options]`

| Command | Description |
|---------|-------------|
| `nexus dev` | Start development server with HMR |
| `nexus build` | Production build to `.nexus/output/` |
| `nexus start` | Start production server |
| `nexus audit` | Security audit of dependencies |
| `nexus fix` | Auto-fix security issues |
| `nexus studio` | Launch developer dashboard |
| `nexus test` | Run Vitest tests |

During `nexus dev` and `nexus build`, the compiler now surfaces rich structured errors (CompileError with code like NX-101 for unclosed `{#if}`, loc, hint) using `formatCompileError` / `formatCompileWarning`. You get ANSI-colored output with source frames and carets automatically. See the compiler DX section in packages.md.

## nexus.config.ts

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