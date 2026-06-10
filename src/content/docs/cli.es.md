# Referencia del CLI

**Comandos exactos** y qué hacen.

| Comando | Qué hace |
|---------|----------|
| `nexus dev` | Inicia el servidor de desarrollo con HMR y observación de archivos |
| `nexus build` | Compila la app para producción en `.nexus/output/` |
| `nexus start` | Ejecuta el servidor de producción (requiere `NEXUS_SECRET`) |
| `nexus check` | Type-check del proyecto sin correr el servidor |
| `nexus audit` | Ejecuta checks de seguridad (scan CVE, fugas de secretos, deps no usadas) |
| `nexus studio` | Abre el dashboard en tiempo real |
| `nexus routes` | Imprime el árbol de rutas resuelto |
| `nexus add` | Agrega paquetes, rutas o scaffolding al proyecto |
| `nexus bridge` | Abre el CLI del database bridge |
| `nexus fix` | Auto-corrección de lint y formato |

Durante `nexus dev` y `nexus build` obtienes **errores estructurados exactos**:

```text
◆ NX-101  Unclosed {#if}
  src/routes/checkout/+page.nx:18:3
  hint: Add {/if} or use {:else if}
```

`formatCompileError` / `formatCompileWarning` + frames son usados automáticamente por el CLI y el servidor dev.

## Opciones

| Opción | Alias | Descripción |
|--------|-------|-------------|
| `--port` | `-p` | Puerto a usar (por defecto `server.port` en `nexus.config.ts` o `3000`) |
| `--host` | | Host a usar (por defecto `localhost`) |
| `--ci` | | Modo CI para `nexus audit` (no interactivo) |
| `--json` | | Salida JSON para `nexus audit` |
| `--fix` | | Auto-fix para `nexus audit` |
| `--dry-run` | | Vista previa de cambios para `nexus fix` |
| `--force` | | Forzar operación para `nexus fix` |
| `--root` | | Ruta raíz del proyecto |

Ejemplos:

```bash
nexus dev --port 3000
nexus start --host 0.0.0.0
nexus audit --ci --json
nexus fix --dry-run
```

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
