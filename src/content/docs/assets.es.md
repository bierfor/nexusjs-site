# Assets — Imágenes y Fuentes

**Uso exacto** del pipeline de imágenes/fuentes zero-JS. Importa desde `@nexus_js/assets` e interpola el resultado directamente en cualquier template .nx. El helper corre en el servidor durante el render.

## Uso básico exacto de Image() (la línea que escribes)

```svelte
---
import { Image } from '@nexus_js/assets';
---

{Image({ 
  src: '/hero.jpg', 
  alt: 'Hero image', 
  width: 1200, 
  height: 600 
})}
```

**Exactamente qué produce esto (el HTML que emite el framework):**

```html
<picture>
  <source type="image/avif" srcset="/_nexus/image/... .avif 320w, ... 640w, ..." sizes="...">
  <source type="image/webp" ...>
  <img src="/_nexus/image/... .jpg" width="1200" height="600" alt="Hero image" loading="lazy" decoding="async">
</picture>
```

El optimizador (llamado durante SSR) crea las variantes responsivas al vuelo (o desde caché) y retorna el elemento listo para usar.

### Modo fill / hero exacto (imágenes estilo background)

```svelte
{Image({ 
  src: '/hero.jpg', 
  alt: '', 
  width: 1920, 
  height: 1080, 
  fill: true,           // la hace absolute + object-cover
  class: 'absolute inset-0' 
})}
```

### Dimensiones dinámicas exactas desde el filesystem (el patrón load())

```ts
// en tu +page.nx o layout
import { getImageDimensions } from '@nexus_js/assets';
import { resolve } from 'node:path';

export async function load(ctx) {
  const publicDir = resolve(process.cwd(), 'public');
  const dims = await getImageDimensions('/uploads/photo.jpg', publicDir);

  return {
    photo: {
      src: '/uploads/photo.jpg',
      alt: 'User photo',
      ...dims,           // { width, height }
    },
  };
}
```

Luego en el template:

```svelte
{Image({ 
  src: pretext.photo.src, 
  alt: pretext.photo.alt, 
  width: pretext.photo.width, 
  height: pretext.photo.height 
})}
```

### Uso exacto sin optimizar / remoto / SVG

```svelte
<!-- Salta el optimizador completamente (SVGs, GIFs, o cuando quieres el original byte-for-byte) -->
{Image({ src: '/logo.svg', alt: 'Logo', width: 200, height: 200, unoptimized: true })}

<!-- Las imágenes remotas son proxyadas y optimizadas de forma segura (bloquea IPs privadas etc.) -->
{Image({ src: 'https://example.com/photo.jpg', alt: 'Remote', width: 800, height: 600 })}
```

### Recortes redondos / avatar exactos

```svelte
{Image({ 
  src: '/avatar.jpg', 
  alt: 'Avatar', 
  width: 128, 
  height: 128, 
  round: true 
})}
```

### Optimización exacta de fuentes (la otra mitad del paquete)

```ts
// en load() o en cualquier lugar
import { preloadFont } from '@nexus_js/assets';

const font = preloadFont({
  family: 'Inter',
  weights: [400, 600],
  subsets: ['latin'],
  display: 'swap',
});
```

Luego en el template (usualmente en el layout raíz):

```svelte
{pretext.font}   <!-- emite el <link rel="preload" as="font"> exacto + reglas font-face -->
```

Todas las llamadas arriba (`Image({...})`, `getImageDimensions`, `preloadFont`) son la API pública exacta exportada por `@nexus_js/assets`. Son seguras de llamar desde `load()` (corren en el servidor). Ver la fuente del paquete o los ejemplos del monorepo para los detalles precisos de implementación. Combina con los patrones mostrados en quickstart.md, routing.md, y seo.md para páginas completas.

Cuando una imagen debe estirarse para llenar su contenedor:

```ts
---
import { Image } from '@nexus_js/assets';
---

<div style="position:relative;width:100%;height:60vh;">
  {Image({ src: '/hero.jpg', alt: 'Hero', fill: true, objectFit: 'cover', priority: true })}
</div>
```

- `fill` remueve atributos `width`/`height` y aplica posicionamiento absoluto
- El **padre debe tener `position:relative`**
- `objectFit` por defecto es `'cover'`; puede ser `'contain'`, `'fill'`, `'none'`, o `'scale-down'`
- `objectPosition` por defecto es `'center'`

### Priority (imágenes above-the-fold)

Para imágenes visibles sin scroll:

```svelte
{Image({ src: '/hero.jpg', alt: 'Hero', width: 1200, height: 600, priority: true })}
```

Esto establece:
- `loading="eager"`
- `fetchpriority="high"`
- `decoding="sync"`

Para precargar la imagen en `<head>` y acelerar aún más el first paint:

```ts
export async function load(ctx) {
  return {
    head: {
      links: [
        { rel: 'preload', as: 'image', href: '/_nexus/image?src=%2Fhero.jpg&w=1200&q=80' },
      ],
    },
  };
}
```

### Placeholder blur

Para una experiencia de carga percibida suave, genera una preview de baja calidad inline:

```ts
import { getBlurDataURL } from '@nexus_js/assets';
import { resolve } from 'node:path';

export async function load(ctx) {
  const publicDir = resolve(process.cwd(), 'public');
  const blurDataURL = await getBlurDataURL('/hero.jpg', publicDir);

  return {
    hero: {
      src: '/hero.jpg',
      alt: 'Hero',
      width: 1200,
      height: 600,
      blurDataURL,
    },
  };
}
```

```nx
{Image(pretext.hero)}
```

La imagen empieza con una preview borrosa y se desvanece cuando la imagen completa carga. No requiere JavaScript — un pequeño handler inline `onload` maneja la transición.

### Dimensiones automáticas

Si no conoces el tamaño de la imagen al momento de authoring, léelo en runtime:

```ts
import { getImageDimensions } from '@nexus_js/assets';
import { resolve } from 'node:path';

export async function load(ctx) {
  const publicDir = resolve(process.cwd(), 'public');
  const dims = await getImageDimensions('/uploads/photo.jpg', publicDir);

  return {
    photo: {
      src: '/uploads/photo.jpg',
      alt: 'User photo',
      ...dims,
    },
  };
}
```

### Modo sin optimizar

Salta el optimizador para SVGs, GIFs, o cuando necesitas el archivo original intacto:

```nx
{Image({ src: '/logo.svg', alt: 'Logo', width: 200, height: 200, unoptimized: true })}
```

Esto emite un `<img>` plano con el `src` original, saltando `/_nexus/image` completamente.

### Imágenes remotas

Las URLs externas son proxyadas de forma segura a través del optimizador:

```nx
{Image({ src: 'https://example.com/photo.jpg', alt: 'Remote', width: 800, height: 600 })}
```

Las verificaciones de seguridad bloquean automáticamente IPs privadas, localhost, y protocolos no HTTP(S).

### Recorte redondo (avatars)

```nx
{Image({ src: '/avatar.jpg', alt: 'User', size: 64, round: true })}
```

`size` es un shorthand que establece tanto `width` como `height`.

## ¿Por qué usar `Image()` en lugar de `<img>`?

| Característica | `<img>` | `Image()` |
|----------------|---------|-----------|
| Negociación AVIF/WebP | ❌ Manual | ✅ `<picture>` automático |
| srcset responsivo | ❌ Manual | ✅ Breakpoints automáticos |
| Lazy loading | ⚠️ Atributo manual | ✅ Lazy por defecto, eager para priority |
| Placeholder blur | ❌ No incorporado | ✅ LQIP inline + fade-in |
| Prevención de layout shift | ⚠️ width/height manual | ✅ Fuerza dimensiones |
| Proxy remoto | ❌ No incorporado | ✅ Proxy seguro `/_nexus/image` |
| Modo fill | ❌ CSS manual | ✅ Props `fill` + `objectFit` |

## Referencia completa de `ImageProps`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `src` | `string` | **requerido** | Ruta local o URL remota |
| `alt` | `string` | **requerido** | Descripción accesible |
| `width` | `number` | — | Ancho intrínseco |
| `height` | `number` | — | Alto intrínseco |
| `size` | `number` | — | Shorthand cuadrado |
| `sizes` | `string` | auto | Atributo sizes responsivo |
| `priority` | `boolean` | `false` | Carga eager above-the-fold |
| `round` | `boolean` | `false` | Recorte circular |
| `class` | `string` | — | Clase CSS |
| `quality` | `number` | `80` | Compresión 1–100 |
| `formats` | `ImageFormat[]` | `['avif','webp','original']` | Prioridad de formatos |
| `placeholder` | `'blur' \| 'empty' \| 'none'` | `'blur'` | Estrategia de carga |
| `blurDataURL` | `string` | — | Preview base64 inline |
| `fetchpriority` | `'high' \| 'low' \| 'auto'` | auto | Hint de prioridad del browser |
| `fill` | `boolean` | `false` | Llenar contenedor padre |
| `objectFit` | `string` | `'cover'` | CSS object-fit |
| `objectPosition` | `string` | `'center'` | CSS object-position |
| `unoptimized` | `boolean` | `false` | Saltar optimizador |
| `style` | `string` | — | Estilos inline adicionales |

## Endpoint del optimizador de imágenes

El framework monta automáticamente `/_nexus/image` tanto en dev como en producción. No necesitas configurarlo manualmente.

Parámetros de query:
- `src` — ruta de imagen local (ej. `/hero.jpg`)
- `url` — URL de imagen remota
- `w` — ancho objetivo (clamp 1–8192)
- `f` — formato de salida (`avif`, `webp`, `png`, `jpg`, `original`)
- `q` — calidad 1–100
- `blur=1` — genera un LQIP tiny en lugar de la imagen completa

## Fuentes

Usa Google Fonts o self-host. El compilador inlines el CSS crítico de fuentes y precarga archivos de fuente automáticamente cuando está configurado.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

Para optimización avanzada de fuentes (subsetting, inlining, preloading), ver `@nexus_js/assets/fonts`.
