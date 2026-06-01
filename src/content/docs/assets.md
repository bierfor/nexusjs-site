# Assets — Images & Fonts

Automatic AVIF/WebP conversion, responsive srcsets, blur placeholders.

## Images

```html
<img src="/hero.jpg" width="1200" height="600" alt="Hero">
```

The image optimizer endpoint at `/_nexus/image` automatically serves:

- AVIF for supported browsers
- WebP as fallback
- Responsive `srcset` based on `sizes` attribute
- Blur placeholder from low-res preview

## Fonts

Use Google Fonts or self-host. The compiler inlines critical font CSS and preloads font files.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
```