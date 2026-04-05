# nexusjs.dev

Marketing and landing page for **Nexus.js** — deployed on **Cloudflare Pages**.

## Files

```
index.html          ← the page (EN / ES / PT, self-contained)
docs/
  PRODUCTION.md     ← production / server-actions reference (also at /docs/PRODUCTION.md)
assets/
  nexus-logo.svg    ← logo, favicon, OG image
_headers            ← Cloudflare Pages HTTP headers & CSP
_redirects          ← Cloudflare Pages URL redirects
```

**Sync with the framework repo:** `index.html`, `assets/nexus-logo.svg`, and `docs/PRODUCTION.md` are copied from **[github.com/bierfor/nexus](https://github.com/bierfor/nexus)** (`docs/` in that monorepo) when the marketing site is updated; commit here for **nexusjs.dev** / Cloudflare Pages.

## Local preview

```bash
npx serve .
```

## Deploy

Cloudflare Pages — no build step. Output directory: `/`
