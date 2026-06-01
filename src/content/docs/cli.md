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