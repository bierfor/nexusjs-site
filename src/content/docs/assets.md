# Assets — Images & Fonts

**Exact** usage of the zero-JS image/font pipeline. Import from `@nexus_js/assets` and interpolate the result directly in any .nx template. The helper runs on the server during render.

## Exact basic Image() usage (the one line you write)

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

**Exactly what this produces (the HTML the framework emits):**

```html
<picture>
  <source type="image/avif" srcset="/_nexus/image/... .avif 320w, ... 640w, ..." sizes="...">
  <source type="image/webp" ...>
  <img src="/_nexus/image/... .jpg" width="1200" height="600" alt="Hero image" loading="lazy" decoding="async">
</picture>
```

The optimizer (called during SSR) creates the responsive variants on the fly (or from cache) and returns the ready-to-use element.

### Exact fill / hero mode (background-style images)

```svelte
{Image({ 
  src: '/hero.jpg', 
  alt: '', 
  width: 1920, 
  height: 1080, 
  fill: true,           // makes it absolute + object-cover
  class: 'absolute inset-0' 
})}
```

### Exact dynamic dimensions from the filesystem (the load() pattern)

```ts
// in your +page.nx or layout
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

Then in template:

```svelte
{Image({ 
  src: pretext.photo.src, 
  alt: pretext.photo.alt, 
  width: pretext.photo.width, 
  height: pretext.photo.height 
})}
```

### Exact unoptimized / remote / SVG usage

```svelte
<!-- Bypass optimizer completely (SVGs, GIFs, or when you want the original byte-for-byte) -->
{Image({ src: '/logo.svg', alt: 'Logo', width: 200, height: 200, unoptimized: true })}

<!-- Remote images are proxied and optimized safely (blocks private IPs etc.) -->
{Image({ src: 'https://example.com/photo.jpg', alt: 'Remote', width: 800, height: 600 })}
```

### Exact round / avatar crops

```svelte
{Image({ 
  src: '/avatar.jpg', 
  alt: 'Avatar', 
  width: 128, 
  height: 128, 
  round: true 
})}
```

### Exact font optimization (the other half of the package)

```ts
// in load() or anywhere
import { preloadFont } from '@nexus_js/assets';

const font = preloadFont({
  family: 'Inter',
  weights: [400, 600],
  subsets: ['latin'],
  display: 'swap',
});
```

Then in template (usually in root layout):

```svelte
{pretext.font}   <!-- emits the exact <link rel="preload" as="font"> + font-face rules -->
```

All the calls above (`Image({...})`, `getImageDimensions`, `preloadFont`) are the exact public API exported by `@nexus_js/assets`. They are safe to call from `load()` (they run on the server). See the package source or the monorepo examples for the precise implementation details. Combine with the patterns shown in quickstart.md, routing.md, and seo.md for full pages.

When an image should stretch to fill its container:

```ts
---
import { Image } from '@nexus_js/assets';
---

<div style="position:relative;width:100%;height:60vh;">
  {Image({ src: '/hero.jpg', alt: 'Hero', fill: true, objectFit: 'cover', priority: true })}
</div>
```

- `fill` removes `width`/`height` attributes and applies absolute positioning
- The **parent must have `position:relative`**
- `objectFit` defaults to `'cover'`; can be `'contain'`, `'fill'`, `'none'`, or `'scale-down'`
- `objectPosition` defaults to `'center'`

### Priority (above-the-fold images)

For images visible without scrolling:

```ts
{Image({ src: '/hero.jpg', alt: 'Hero', width: 1200, height: 600, priority: true })}
```

This sets:
- `loading="eager"`
- `fetchpriority="high"`
- `decoding="sync"`

To preload the image in `<head>` and speed up first paint even more:

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

### Blur placeholder

For a smooth perceived-loading experience, generate a low-quality inline preview:

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

The image starts with a blurred preview and fades in when the full image loads. No JavaScript required — a tiny inline `onload` handler handles the transition.

### Automatic dimensions

If you don't know the image size at authoring time, read it at runtime:

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

### Unoptimized mode

Bypass the optimizer for SVGs, GIFs, or when you need the original file untouched:

```nx
{Image({ src: '/logo.svg', alt: 'Logo', width: 200, height: 200, unoptimized: true })}
```

This emits a plain `<img>` with the original `src`, skipping `/_nexus/image` entirely.

### Remote images

External URLs are safely proxied through the optimizer:

```nx
{Image({ src: 'https://example.com/photo.jpg', alt: 'Remote', width: 800, height: 600 })}
```

Security checks automatically block private IPs, localhost, and non-HTTP(S) protocols.

### Round crop (avatars)

```nx
{Image({ src: '/avatar.jpg', alt: 'User', size: 64, round: true })}
```

`size` is a shorthand that sets both `width` and `height`.

## Why use `Image()` instead of `<img>`?

| Feature | `<img>` | `Image()` |
|---------|---------|-----------|
| AVIF/WebP negotiation | ❌ Manual | ✅ Automatic `<picture>` |
| Responsive srcset | ❌ Manual | ✅ Automatic breakpoints |
| Lazy loading | ⚠️ Manual attribute | ✅ Default lazy, eager for priority |
| Blur placeholder | ❌ Not built-in | ✅ Inline LQIP + fade-in |
| Layout shift prevention | ⚠️ Manual width/height | ✅ Enforces dimensions |
| Remote proxy | ❌ Not built-in | ✅ Safe `/_nexus/image` proxy |
| Fill mode | ❌ Manual CSS | ✅ `fill` + `objectFit` props |

## Full `ImageProps` reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Local path or remote URL |
| `alt` | `string` | **required** | Accessible description |
| `width` | `number` | — | Intrinsic width |
| `height` | `number` | — | Intrinsic height |
| `size` | `number` | — | Square shorthand |
| `sizes` | `string` | auto | Responsive sizes attribute |
| `priority` | `boolean` | `false` | Above-the-fold eager loading |
| `round` | `boolean` | `false` | Circular crop |
| `class` | `string` | — | CSS class |
| `quality` | `number` | `80` | Compression 1–100 |
| `formats` | `ImageFormat[]` | `['avif','webp','original']` | Format priority |
| `placeholder` | `'blur' \| 'empty' \| 'none'` | `'blur'` | Loading strategy |
| `blurDataURL` | `string` | — | Inline base64 preview |
| `fetchpriority` | `'high' \| 'low' \| 'auto'` | auto | Browser priority hint |
| `fill` | `boolean` | `false` | Fill parent container |
| `objectFit` | `string` | `'cover'` | CSS object-fit |
| `objectPosition` | `string` | `'center'` | CSS object-position |
| `unoptimized` | `boolean` | `false` | Bypass optimizer |
| `style` | `string` | — | Additional inline styles |

## Image optimizer endpoint

The framework automatically mounts `/_nexus/image` in both dev and production. You don't need to configure it manually.

Query parameters:
- `src` — local image path (e.g. `/hero.jpg`)
- `url` — remote image URL
- `w` — target width (clamped 1–8192)
- `f` — output format (`avif`, `webp`, `png`, `jpg`, `original`)
- `q` — quality 1–100
- `blur=1` — generate a tiny LQIP instead of the full image

## Fonts

Use Google Fonts or self-host. The compiler inlines critical font CSS and preloads font files automatically when configured.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

For advanced font optimization (subsetting, inlining, preloading), see `@nexus_js/assets/fonts`.
