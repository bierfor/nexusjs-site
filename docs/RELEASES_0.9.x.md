# Nexus 0.9.x Release Notes (0.9.0 -> 0.9.20)

Documento consolidado de la rama `0.9.x`, versión por versión, usando solo evidencia verificable.

## Fuentes verificadas

- npm (versiones publicadas): `@nexus_js/cli`, `@nexus_js/server`, `@nexus_js/compiler`, `@nexus_js/graphql`
- Tags en GitHub: `v0.9.20` ... `v0.9.12`, `v0.9.3`
- `CHANGELOG.md` oficial (entradas explícitas para `0.9.0` y `0.9.3`)
- `RELEASE_NOTES_0.9.3.md`
- Comparativa GitHub `v0.9.3...v0.9.20` (commits de release/fix/feat)

> Nota importante: para varias versiones intermedias (`0.9.1`, `0.9.2`, `0.9.5`, `0.9.7`, `0.9.9`) no hay release notes públicas detalladas en el repo; se marcan como **notas limitadas** para evitar inventar cambios.

---

## Matriz completa por versión

| Versión | Estado de evidencia | Mejoras documentadas |
|---|---|---|
| `0.9.20` | Alta | Runtime navigation: evita reinyectar stylesheets ya presentes en `<head>` (menos FOUC en SPA). |
| `0.9.19` | Alta | Cache de assets estáticos (`ETag`, `Last-Modified`) + deduplicación de stylesheets inyectados por SSR. |
| `0.9.18` | Media | Publicación de la línea `0.9.x` (release publish). |
| `0.9.17` | Alta | Pre-warm de CSS agregada antes del broadcast HMR. |
| `0.9.16` | Alta | Recuperación de build CSS agregada ante errores transitorios de archivos `.nx`. |
| `0.9.15` | Alta | `/_nexus/styles.css` con `ETag + no-cache` en dev para reducir FOUC en hard refresh. |
| `0.9.14` | Alta | Alineación de versiones de paquetes tras drift entre compiler/CLI. |
| `0.9.13` | Alta | Publish de fixes de compiler/dev-server y ajuste de línea de release. |
| `0.9.12` | Alta | Fix compiler `collectLibUsage` para imports mixtos runtime + `$lib`. |
| `0.9.11` | Alta | Fix compiler: chunks transitivos `$lib` + rewrite de manifest en output. |
| `0.9.10` | Alta | Rewrite `$lib/* -> /_nexus/lib/*` en islands + bundles hashed/tree-shaken. |
| `0.9.9` | Baja | Release intermedia de continuidad (sin notas públicas detalladas). |
| `0.9.8` | Media | Evolución tenancy/bridge: resolver universal + namespaces de vault/aislamiento. |
| `0.9.7` | Baja | Release intermedia de estabilización (sin notas públicas detalladas). |
| `0.9.6` | Media | Progresión bridge segura (discovery/modelo canónico en la línea bridge). |
| `0.9.5` | Baja | Release intermedia de estabilización (sin notas públicas detalladas). |
| `0.9.4` | Media | Inicio del ciclo de hardening post-`0.9.3`. |
| `0.9.3` | Alta | GraphQL + Legacy Bridge + Deployment Stack (release notes oficiales completas). |
| `0.9.2` | Baja | Paso de mantenimiento previo a `0.9.3` (sin entrada pública detallada). |
| `0.9.1` | Baja | Paso de mantenimiento previo a `0.9.3` (sin entrada pública detallada). |
| `0.9.0` | Alta | Base de la rama 0.9 (entrada oficial en changelog). |

---

## Detalle por versión (0.9.20 -> 0.9.0)

### v0.9.20
- Runtime navigation: `applyHeadUpdate` evita reinsertar hojas de estilo ya presentes.
- Impacto: menos refetch de CSS y menos FOUC en navegación interna.

### v0.9.19
- `serveStatic()` añade validadores cacheables y revalidación correcta.
- Se deduplican `<link rel="stylesheet">` inyectados por SSR.

### v0.9.18
- Release de continuidad/publicación de paquetes en la línea 0.9.x.

### v0.9.17
- El reload dev espera `buildAggregatedNxStylesheet()` antes de notificar HMR.

### v0.9.16
- Mejor limpieza de estados in-flight en build de CSS agregada.
- Fallos transitorios de compilación por archivo no derriban toda la agregación.

### v0.9.15
- Cambio de `no-store` a estrategia con `ETag + no-cache` para `/_nexus/styles.css` en dev.

### v0.9.14
- Re-alineación de paquetes de framework tras desajustes de versión.

### v0.9.13
- Publicación de fixes acumulados de compiler/dev server en línea coherente.

### v0.9.12
- Fix de parser de imports (`collectLibUsage`) para evitar atribuciones erróneas a `$lib`.

### v0.9.11
- Se construyen correctamente transitivos de `/_nexus/lib/`.
- Rewrites de manifest aplicados en chunks de salida.

### v0.9.10
- Rewrite de imports `$lib` en islands al path runtime `/_nexus/lib/`.
- Bundling tree-shaken + hash de librerías usadas por islands.

### v0.9.9
- Release intermedia (sin release notes públicas detalladas).

### v0.9.8
- Tenancy/bridge: resolver universal y mejoras de aislamiento de secretos/namespaces.

### v0.9.7
- Release intermedia (sin release notes públicas detalladas).

### v0.9.6
- Progresión de bridge segura (línea postgres discovery/modelo canónico).

### v0.9.5
- Release intermedia (sin release notes públicas detalladas).

### v0.9.4
- Primer release del ciclo de hardening tras `0.9.3`.

### v0.9.3
- Release oficial: **GraphQL Integration + Legacy Bridge + Deployment Stack**.
- Añade `@nexus_js/graphql`, Shield, bridge legacy, y stack de deployment.
- Compatibilidad: sin breaking changes desde `0.9.2`.

### v0.9.2
- Mantenimiento intermedio previo a `0.9.3` (sin notas públicas detalladas).

### v0.9.1
- Mantenimiento intermedio previo a `0.9.3` (sin notas públicas detalladas).

### v0.9.0
- Hito base de la rama `0.9.x` (entrada explícita en changelog oficial).

---

## Recomendación de actualización

Para adoptar todas las mejoras acumuladas de la rama:

```bash
npm install @nexus_js/cli@0.9.20 @nexus_js/server@0.9.20 @nexus_js/compiler@0.9.20 @nexus_js/graphql@0.9.20
```

