# Referencia del CLI

**Comandos exactos** y qué hacen.

| Comando exacto que escribes     | Cosa exacta que pasa |
|---------------------------------|----------------------|
| `nexus dev --port 3000`        | Inicia servidor dev, observa .nx/.ts, HMR, sirve /_nexus/global.css etc. |
| `nexus build`                  | Produce bundles optimizados de server + cliente en `.nexus/output/` |
| `nexus start`                  | Ejecuta el servidor de producción desde la salida del build |
| `nexus audit`                  | Ejecuta escaneo CVE OSV + fuga de secretos + checks de deps no usadas (igual que en build-time) |
| `nexus fix`                    | Aplica fixes seguros automáticamente desde el audit |
| `nexus studio`                 | Dashboard en tiempo real (islands, actions, cache, store) |
| `nexus test`                   | Ejecuta Vitest con helpers para SSR + island + action |
| `nexus routes`                 | Imprime el árbol de rutas resuelto |
| `nexus check`                  | Type-check sin correr el servidor |

Durante `nexus dev` y `nexus build` obtienes **errores estructurados exactos**:

```text
◆ NX-101  Unclosed {#if}
  src/routes/checkout/+page.nx:18:3
  hint: Add {/if} or use {:else if}
```

`formatCompileError` / `formatCompileWarning` + frames son usados automáticamente por el CLI y el servidor dev.

## nexus.config.ts exacto (el que copias)

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

Ver las otras páginas de esta lista (especialmente security.md para la historia exacta de hardened + cspNonce, y las nuevas páginas dedicadas) para más uso exacto de todo lo que el CLI cablea. Todos los comandos arriba están implementados en @nexus_js/cli y son los usados para desarrollar y buildear este mismo sitio de documentación.
