# Project Structure

A typical Nexus app looks like this:

```bash
my-app/
├── nexus.config.ts          # Framework configuration
├── package.json
├── src/
│   ├── global.css           # Global styles (Tailwind/PostCSS entry)
│   ├── lib/
│   │   └── i18n.ts          # Shared utilities
│   └── routes/
│       ├── +layout.nx       # Root layout
│       ├── +page.nx         # Home page
│       ├── about/
│       │   └── +page.nx     # /about
│       └── api/
│           └── hello/
│               └── +server.nx  # API route
└── public/                  # Static assets
```

| Path | Purpose |
|------|---------|
| `nexus.config.ts` | Server port, security, CSP, CSS entry |
| `src/global.css` | Global CSS, PostCSS/Tailwind entry |
| `src/routes/+layout.nx` | Root HTML wrapper with sidebar/nav |
| `src/routes/+page.nx` | Page for `/` |
| `src/routes/blog/[slug]/+page.nx` | Dynamic route `/blog/:slug` |
| `src/routes/api/+server.nx` | API endpoint (GET/POST) |
| `public/` | Static files served at root |