# Stylesheets — Tailwind, PostCSS y CSS Scoped

Nexus ofrece soporte de primera clase para CSS: una única hoja de estilos unificada, compilación automática de PostCSS, integración con Tailwind CSS v4, estilos scoped por componente y serving de CSS global sin configuración.

---

## Cómo se sirven los estilos

Nexus v0.9.32 sirve **una** hoja de estilos automáticamente:

- **`/_nexus/styles.css`** — hoja unificada que incluye:
  1. Tu entry de CSS global procesado con PostCSS/Tailwind (se antepone al principio).
  2. CSS scoped agregado de todos los archivos `.nx`.

Comienza con la declaración de capas:

```css
@layer nexus.scoped, nexus.global;
```

El framework inyecta `<link rel="stylesheet" href="/_nexus/styles.css">` en el `<head>` durante el SSR. No necesitas agregarlo manualmente.

El endpoint legacy **`/_nexus/global.css`** sigue disponible por compatibilidad hacia atrás, pero **ya no se inyecta** en el SSR.

---

## Entry de CSS global

Nexus descubre automáticamente tu hoja de estilos global en estas ubicaciones (en orden):

- `src/app.css`
- `src/global.css`
- `src/index.css`
- `src/styles.css`

Si encuentra alguna, la procesa con PostCSS y la antepone al principio de la hoja unificada.

### Entry personalizado

Sobrescribe la auto-descubrimiento en `nexus.config.ts`:

```ts
export default {
  css: { entry: 'src/global.css' },
};
```

El path es relativo a la raíz del proyecto.

---

## PostCSS y Tailwind CSS v4

Nexus lee `postcss.config.{mjs,cjs,js}` y ejecuta tu CSS global a través de PostCSS automáticamente tanto en dev como en producción.

### Dependencias recomendadas

Como el CSS de producción se compila on-the-fly, instálalas como `dependencies`, **no** como `devDependencies`:

```json
{
  "dependencies": {
    "tailwindcss": "^4.3.0",
    "@tailwindcss/postcss": "^4.3.0",
    "postcss": "^8.5.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Configuración de PostCSS

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### Indicarle a Tailwind dónde están las clases de los `.nx`

Tailwind CSS v4 no escanea archivos `.nx` por defecto. Apúntalo a un archivo HTML generado que contenga las clases usadas en tus componentes.

Agrega un script `predev` y `prebuild` que genere `src/.generated/tailwind-classes.html`. Ejemplo `scripts/extract-tw-classes.mjs`:

```js
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (path.endsWith('.nx')) yield path;
  }
}

const classes = new Set();
for await (const file of walk('src')) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/class\s*=\s*["']([^"']+)["']/g)) {
    match[1].split(/\s+/).forEach((c) => c && classes.add(c));
  }
}

const tags = [...classes].sort().map((c) => `<div class="${c}"></div>`).join('\n');
const html = `<!DOCTYPE html>\n<html>\n<body>\n${tags}\n</body>\n</html>\n`;

await mkdir('src/.generated', { recursive: true });
await writeFile('src/.generated/tailwind-classes.html', html);
```

Luego agrégalo en `package.json`:

```json
{
  "scripts": {
    "predev": "node scripts/extract-tw-classes.mjs",
    "prebuild": "node scripts/extract-tw-classes.mjs"
  }
}
```

Añade `src/.generated` a tu `.gitignore`.

### Archivo de CSS global

```css
/* src/global.css */
@import 'tailwindcss';

@source './.generated/tailwind-classes.html';

@theme {
  --color-bg: var(--bg);
  --color-ink: var(--ink);
  --color-accent: #c45c26;
}

:root {
  --bg: #0a0a0a;
  --ink: #ffffff;
}

body {
  background-color: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
```

Tailwind v4 es CSS-first: define tokens de diseño personalizados con `@theme` dentro de `global.css` en lugar de usar `tailwind.config.js`.

---

## Estilos scoped por componente

Cualquier bloque `<style>` dentro de un archivo `.nx` se scopa automáticamente a ese componente.

```svelte
<!-- src/routes/card/+page.nx -->
<div class="card">
  <h2>{pretext.title}</h2>
</div>

<style>
  .card {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--surface);
  }
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }
</style>
```

El compilador hashea los selectores para que `.card` solo aplique a elementos de este componente. Los estilos scoped se agregan a `/_nexus/styles.css`.

### Escape hatch `:global()`

Para apuntar a elementos globales (ej. `body`, `html`) o sobrescribir un componente hijo:

```svelte
<style>
  :global(body) {
    margin: 0;
  }
  .card :global(.external-widget) {
    border: 1px solid red;
  }
</style>
```

---

## CSS layers

Nexus gestiona la especificidad con `@layer` de CSS. La hoja unificada declara:

```css
@layer nexus.scoped, nexus.global;
```

- Los estilos scoped de archivos `.nx` viven en `@layer nexus.scoped`.
- Tu CSS global puede vivir opcionalmente en `@layer nexus.global` si lo envuelves:

```css
@layer nexus.global {
  body { /* ... */ }
}
```

Esto previene guerras de especificidad entre utilidades globales y estilos de componente.

---

## Dev vs producción

| Entorno | Hoja unificada (`/_nexus/styles.css`) |
|---------|--------------------------------------|
| **Dev** | Compilada on-demand con PostCSS, hot-reload ante cambios de CSS global o scoped |
| **Producción** | Empaquetada, minificada y hasheada por contenido en `.nexus/output/` para caching inmutable |

---

## Mejores prácticas

1. **Usa `src/global.css` para design tokens** (colores, fuentes, espaciado) y directivas de Tailwind.
2. **Usa `<style>` en `.nx` para layout específico del componente** que no debería filtrar a otros componentes.
3. **Evita CSS global pesado**; la hoja de estilos scoped se deduplica por ruta en producción.
4. **Prefiere variables CSS** para theming; funcionan tanto en contextos globales como scoped.
5. **No linkees manualmente `/_nexus/global.css`** en tu layout; confía en la hoja unificada `/_nexus/styles.css` que Nexus inyecta automáticamente.
6. **Mantén los paquetes de Tailwind en `dependencies`** (`tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer`) para que los builds de producción puedan compilar CSS on-the-fly.
7. **Ejecuta el script de extracción de clases de Tailwind en `predev` y `prebuild`** para que Tailwind v4 vea las clases usadas en los archivos `.nx`.
8. **Define tokens de diseño personalizados con `@theme`** en `global.css` en lugar de `tailwind.config.js`.
