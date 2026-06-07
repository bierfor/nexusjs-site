# Stylesheets — Tailwind, PostCSS y CSS Scoped

Nexus tiene soporte de primera clase para CSS con compilación automática de PostCSS, integración con Tailwind CSS v4, estilos scoped por componente, y serving de hojas de estilo globales sin configuración.

---

## Entry de CSS global

Nexus descubre automáticamente tu hoja de estilos global en estas ubicaciones (en orden):

- `src/app.css`
- `src/global.css`
- `src/index.css`
- `src/styles.css`

Si encuentra alguna, la procesa con PostCSS (cuando hay config presente) y la sirve en `/_nexus/global.css`. El framework inyecta automáticamente el link en el SSR.

### Entry personalizado

Sobreescribe la auto-descubrimiento en `nexus.config.ts`:

```ts
export default {
  css: { entry: './src/styles/main.css' },
};
```

El path es relativo a la raíz del proyecto.

---

## PostCSS y Tailwind CSS v4

Nexus lee `postcss.config.{mjs,cjs,js}` y ejecuta tu CSS global a través de PostCSS automáticamente tanto en dev como en producción.

### Setup exacto para Tailwind v4

```bash
pnpm add -D tailwindcss postcss @tailwindcss/postcss autoprefixer
```

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

```css
/* src/global.css */
@import 'tailwindcss';

@theme {
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

Eso es todo. En dev, `/_nexus/global.css` retorna el output completo de Tailwind compilado. En producción, el pipeline de build lo empaqueta y hashea.

**Nota:** Tailwind v4 usa configuración nativa en CSS (`@theme`, `@import "tailwindcss"`). No se requiere `tailwind.config.js` a menos que necesites globs de contenido personalizados (Nexus ya compila archivos `.nx`, así que Tailwind los escanea automáticamente vía el plugin de PostCSS).

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

El compilador hashea los selectores para que `.card` solo aplique a elementos de este componente. Se sirve vía la hoja de estilos agregada en `/_nexus/styles.css`.

### Escape hatch `:global()`

Para apuntar a elementos globales (ej. `body`, `html`) o sobreescribir un componente hijo:

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

## Cómo se sirven los estilos

Nexus sirve **dos** hojas de estilo automáticamente en cada página:

1. **`/_nexus/global.css`** — tu entry global (procesado por PostCSS)
2. **`/_nexus/styles.css`** — estilos scoped agregados de todos los archivos `.nx`

Ambas se inyectan en el `<head>` durante el SSR (a menos que ya las hayas declarado manualmente). No necesitas agregar tags `<link>` tú mismo.

La hoja de estilos scoped agregada envuelve el CSS de cada componente en `@layer nexus.scoped` para que conviva limpiamente con tus estilos globales.

---

## CSS layers

Nexus usa `@layer` de CSS para manejar especificidad:

```css
@layer nexus.scoped, nexus.global;
```

- Los estilos scoped de archivos `.nx` viven en `@layer nexus.scoped`
- Tu CSS global puede vivir opcionalmente en `@layer nexus.global` si lo envuelves:

```css
@layer nexus.global {
  body { /* ... */ }
}
```

Esto previene guerras de especificidad entre utilidades globales y estilos de componente.

---

## Dev vs producción

| Entorno | CSS Global | CSS Scoped |
|---------|------------|------------|
| **Dev** | Compilado on-demand con PostCSS, servido con hot-reload busting | Recompilado al guardar cualquier `.nx` |
| **Producción** | Empaquetado, minificado y hasheado en `.nexus/output/` | Extraído, deduplicado y hasheado por ruta |

En producción, ambas hojas de estilo llevan un hash de contenido en su nombre para caching inmutable.

---

## Mejores prácticas

1. **Usa `src/global.css` para design tokens** (colores, fuentes, espaciado) y directivas de Tailwind.
2. **Usa `<style>` en `.nx` para layout específico del componente** que no debería filtrar a otros componentes.
3. **Evita CSS global pesado**; la hoja de estilos scoped agregada se deduplica por ruta en producción.
4. **Prefiere variables CSS** para theming; funcionan tanto en contextos globales como scoped.
5. **No linkees manualmente `/_nexus/global.css`** en tu layout; el renderer lo inyecta automáticamente cuando existe el archivo de entry.
