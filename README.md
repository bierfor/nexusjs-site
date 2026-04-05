# nexusjs.dev — static site

Landing page and documentation for the **[Nexus.js](https://github.com/bierfor/nexus)** full-stack framework.

Deployed on **Cloudflare Pages** at **[nexusjs.dev](https://nexusjs.dev)**.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Multilingual single-page landing (EN / ES / PT) |
| `assets/nexus-logo.svg` | Logo used in the page and as favicon |
| `_headers` | Cloudflare Pages HTTP headers (CSP, cache, security) |
| `_redirects` | Cloudflare Pages URL redirects |

The Markdown files (`PUBLISHING.md`, `ISLANDS.md`, etc.) are contributor docs kept in sync from the main repo — they are **not** served as web pages.

## Local preview

```bash
npx serve .
# or
npx http-server . -p 8080
```

## Deploy (Cloudflare Pages)

1. Connect this repo in [Cloudflare Pages](https://pages.cloudflare.com/).
2. **Build command:** *(none — static site)*
3. **Output directory:** `/` (root of this repo)
4. **Root directory:** `/`
5. Set custom domain: `nexusjs.dev`

No build step required — `index.html` is self-contained.

## Contributing

Docs are authored in the [main Nexus monorepo](https://github.com/bierfor/nexus) under `docs/`.  
Changes to `index.html` or `assets/` should be made there and synced here.
