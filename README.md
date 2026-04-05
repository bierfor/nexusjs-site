# nexusjs.dev

Marketing and landing page for **Nexus.js** — deployed on **Cloudflare Pages**.

## Files

```
index.html          ← the page (EN / ES / PT, self-contained)
assets/
  nexus-logo.svg    ← logo, favicon, OG image
_headers            ← Cloudflare Pages HTTP headers & CSP
_redirects          ← Cloudflare Pages URL redirects
```

## Local preview

```bash
npx serve .
```

## Deploy

Cloudflare Pages — no build step. Output directory: `/`
