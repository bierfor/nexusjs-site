# Requisitos — Actualización de `nexusjs-site`

## 1. Contexto
`nexusjs-site` es un sitio estático (HTML/CSS/JS) que funciona como página de presentación + documentación rápida de Nexus.js, y contiene una página **Learn** con ejemplos interactivos.

Restricción clave: al ser un sitio estático, **no puede compilar ni ejecutar** `.nx` real en el navegador. Por lo tanto, la página Learn debe:
- Mostrar el uso correcto del framework con ejemplos reales de `.nx`.
- Ofrecer un **preview funcional** mediante simulación (JS plano) cuando el ejemplo requiera compilación/servidor.
- Guiar claramente a ejecutar el framework “de verdad” en local con `create-nexus`.

## 2. Objetivos
- Mejorar la landing (index) para que sea consistente, clara, y actualizada con la versión actual del framework.
- Mejorar estilos generales (pulido visual, consistencia tipográfica, estados hover/focus, legibilidad en móviles).
- Corregir Learn para que:
  - Los ejemplos no “fallen” visualmente (por ejemplo, mostrando `{#each}` sin procesar).
  - La ejecución del editor y preview funcione incluso con CSP estricta.
  - Monaco degrade correctamente a textarea si el CDN/worker falla.
- Mantener SEO y seguridad (CSP/headers), pero sin romper Monaco/preview.

## 3. Alcance
### 3.1 Landing (index)
- Mantener la estructura de docs existente.
- Actualizar:
  - Links canónicos y URL amigables donde aplique.
  - Versión mostrada.
  - Inconsistencias en requisitos de Node/pnpm.
- Pequeños ajustes visuales (CTA a Learn, consistencia de copy).

### 3.2 Learn (learn.html + learn.js)
- Estilos:
  - Layout consistente (topbar, sidebar, editor, preview) y estados accesibles.
  - Estilos para modos fallback del editor.
- Contenido:
  - 12 lecciones coherentes (Foundations / Interactivity / Server & Data / Advanced).
  - Nota visible cuando el preview es “simulado”.
- Ejecución:
  - Preview debe ser funcional para cada lección.
  - Cuando el ejemplo depende del compilador/servidor (frontmatter, server actions, pretext, auth), el preview debe usar simulación.

### 3.3 Infra (headers/redirects)
- `/_headers`:
  - Ajustar CSP para permitir Monaco (workers desde CDN) sin abrir más de lo necesario.
- `/_redirects`:
  - `/learn` y `/learn/` deben redirigir a `learn.html`.

## 4. No objetivos
- No construir un “playground real” de Nexus en el navegador.
- No agregar bundler/build system al sitio.
- No añadir analítica ni tracking en esta iteración.

## 5. Requisitos funcionales
- El botón **Run** actualiza el preview sin recargar toda la página.
- El editor funciona en 2 modos:
  - Monaco (si carga correctamente)
  - textarea (fallback)
- El preview soporta:
  - HTML + CSS “simple”
  - Simulaciones interactivas (contadores, formularios) sin dependencias externas
- `learn.html` debe ser accesible:
  - Navegable con teclado
  - Contraste correcto
  - Botones con `:focus-visible`

## 6. Requisitos no funcionales
- Rendimiento:
  - Evitar JS innecesario en landing.
  - Learn debe cargar rápido aunque Monaco falle.
- Seguridad:
  - CSP y headers activos.
  - Permitir lo mínimo para Monaco (`worker-src`, `connect-src` necesarios).
- Compatibilidad:
  - Navegadores modernos.

## 7. Criterios de aceptación
- `/learn` funciona como URL canónica (redirige a `learn.html`).
- Monaco no queda roto por CSP en producción; si falla, el fallback es usable.
- Ninguna lección muestra sintaxis “sin compilar” como resultado final (ej. `{#each}` visible) sin explicación.
- `pnpm audit --audit-level high` del framework y tests del monorepo siguen pasando (cuando aplique).

## 8. Entregables
- Cambios en `index.html`, `learn.html`, `learn.js`, `_headers`, `_redirects`.
- CSS compartido en `nexus-site.css`.
- Documento de requisitos (este archivo) bajo `.trae/documents/`.
