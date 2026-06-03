# Nexus 0.9.x Release Notes (0.9.0 -> 0.9.24)

Documento consolidado de la rama `0.9.x`, versión por versión, usando solo evidencia verificable.

**0.9.24** (current): Documentation and UI/style polish (white/black theme consistency, black logo on light backgrounds, improved code block styling with CSS vars), full package documentation coverage, security hardening follow-ups. See detailed sections below + packages.md in the docs site. Previous 0.9.23 notes below.

## Fuentes verificadas

- npm (versiones publicadas): `@nexus_js/cli`, `@nexus_js/server`, `@nexus_js/compiler`, `@nexus_js/graphql`
- Tags en GitHub: `v0.9.21` ... `v0.9.12`, `v0.9.3`
- `CHANGELOG.md` oficial (entradas explícitas para `0.9.0` y `0.9.3`)
- `RELEASE_NOTES_0.9.3.md`
- Comparativa GitHub `v0.9.3...v0.9.21` (commits de release/fix/feat)

> Nota importante: para varias versiones intermedias (`0.9.1`, `0.9.2`, `0.9.5`, `0.9.7`, `0.9.9`) no hay release notes públicas detalladas en el repo; se marcan como **notas limitadas** para evitar inventar cambios.

---

## Matriz completa por versión

| Versión | Estado de evidencia | Mejoras documentadas |
|---|---|---|
| `0.9.21` | Alta | Soporte CSS global / Tailwind / PostCSS en dev: endpoint `/_nexus/global.css` + config `css.entry`. |
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

## Detalle por versión (0.9.24 -> 0.9.0)

### v0.9.24
- Documentation updates to reflect 0.9.24 as latest.
- Site style improvements: refined white/light theme (blacker text #111 for better contrast on blanco backgrounds) and black/dark code styles (centralized --code-* CSS vars for consistency in pre, Shiki, raw sources; better borders).
- Sidebar logo polished to pure black "N" on white with strong borders and hovers ("todo en blanco" consistency).
- Releases page and raw source use light vars where appropriate, dark code blocks polished.
- Full documentation coverage: expanded packages.md with all ~25 packages, new dedicated pages for bridge, sync, connect, ui, serialize, types, vite-plugin-nexus.
- Extended RELEASES notes with recent site UI/security/doc work.
- All in "modo correcto" (load/pretext, @nexus_js/content, etc.).
- Builds and dogfooding verified.

### v0.9.23
- **@nexus_js/content** maduro y documentado: `loadContent` con fallback i18n, `defineCollection.list()` (auto-discovery + filter/sort), `renderMarkdownAsync` + Shiki opcional (fallback silencioso), ICU plurals en `defineI18n` (parser robusto con conteo de llaves), `watchContent` + `stopAllWatchers`, `formatDate`/`formatRelative` localizado.
- 55 tests para el paquete. Dogfooding completo en este sitio (migración de `docs.ts`, releases via content, headings para TOC auto).
- **Head / SEO request-scoped + auto-injection**: `load()` puede devolver `{ head: { title, description, og, ... } }`. El renderer (en `mergeRoutePretext`) lo intercepta, usa `defineHead(ctx)` (stack por-request), `flushHead` + `renderHeadToString`, e inyecta (soporta `<!--nexus:head-->`). Layouts + páginas mergean (hijo gana). `defineHead(meta, ctx?)` y `flushHead(ctx?)` para control explícito.
- **Compiler DX**: Errores estructurados `CompileError` (code NX-101/103/104, loc, hint, frame) para `{#if}`/`{#each}` malformados. Warnings con loc para parser + guards de seguridad (NX-GUARD-*). `formatCompileError`/`formatCompileWarning` + `extractFrame`/`offsetToLineColumn` producen output ANSI bonito con snippets y ^. Integrado en CLI (build) y server (load-module, islands, error pages).
- Nuevos tests en `packages/compiler/src/index.test.ts` (13 tests) + `head-renderer.test.ts`, `renderer.test.ts`.
- Mejoras en wiring: CLI atrapa CompileError y usa formatter; server hace lo mismo + páginas de error especiales para compile issues.
- Site (nexusjs-site) actualizado a 0.9.23, migraciones a patrones puros (releases via content, TOC desde headings, i18n full, start script fix).
- Todas las mejoras publicadas y empujadas.
- **Mejoras UI/estilos en sitio (sidebar izquierdo "tab")**: Filtro de navegación funcional con botón clear (X), estados activos con barra accent y resaltado de sección padre, mobile con animación hamburguesa a X + backdrop blur, language switcher como control segmentado en contenedor pill, versión como link directo a releases. Logo del aside ahora negro (text-[var(--accent)]) sobre bg claro con borde para consistencia con tema "todo en blanco".
- **Hardening de seguridad (auditoría completa)**: Soporte completo de cspNonce (ctx.cspNonce expuesto en todos los load() + nonce= en <style>/<script> inline de todas las páginas incluyendo Releases y layout). CSP ajustado: eliminado additionalScriptSrc cdnjs innecesario (no usado). Releases cambiado a sanitize: 'strict'. Protección contra path traversal en carga de docs (sanitización de slug + guardia en ruta). Fix tabnabbing: rel="noopener noreferrer" en todos los links externos target=_blank (footer, releases, edit page).
- **Releases page**: Contenedor principal cambiado a tema claro (bg-[var(--surface)] etc) para no ser "todo negro"; raw source mantiene pre oscuro tipo código. Estilos actualizados en global.css para consistencia light.
- Refinamientos adicionales: focus rings, espaciados, pesos, hover states, scrollbars sutiles en sidebar, todo usando vars del tema y Tailwind. Build y verificación de nonce/estilos limpia.

### v0.9.21
- Endpoint `/_nexus/global.css` en dev: descubre automáticamente `src/app.css|global.css|index.css|styles.css`.
- Compila a través de PostCSS si está instalado (Tailwind, Autoprefixer, etc.).
- SSR inyecta el link automáticamente en `<head>`; deduplica si ya está declarado.
- Config `css.entry` para override de ruta personalizada.
- ETag + 304 caching; cache bust en cada cambio de archivo.
- Guard de path-traversal en `css.entry` personalizado.

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
npm install @nexus_js/cli@0.9.21 @nexus_js/server@0.9.21 @nexus_js/compiler@0.9.21 @nexus_js/graphql@0.9.21
```

## Site & docs improvements (ongoing in 0.9.23/0.9.24+ dogfooding)
- Sidebar izquierdo ("tab") major polish: filtro con clear (X), active states + section highlight, mobile X animation + blur backdrop, language segmented pill, version link to releases.
- Logo del aside ahora negro (text-[var(--accent)]) + bg claro + borde para consistencia con tema light "todo en blanco".
- Security hardening: cspNonce full support (ctx + nonce attrs en todos los <style>/<script> inline, incl. Releases), CSP tightened (removido cdnjs unused), releases a strict sanitize, path traversal protection en doc slugs, tabnabbing fixes (rel=noopener en todos target=_blank).
- Releases page: contenedor light (bg vars) en vez de "todo negro"; raw source pre código.
- Docs: packages.md ahora cubre *todos* los paquetes (tabla completa + secciones para assets/bridge/sync/connect/ui/serialize/types/vite/etc.); nuevas páginas dedicadas (bridge.md, sync.md, connect.md, ui.md, etc.); actualizaciones en releases/security/comparison para latest features y site work.
- Todo en modo correcto + site como perfecto dogfood.

