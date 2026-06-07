Nexus requires Node.js ≥ 22 and pnpm ≥ 9. This guide shows **exactly** the commands and files you write.

### Exact prerequisites (copy these)

```bash
node -v   # must be 22+
pnpm -v   # must be 9+
```

If missing:

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

### Step-by-step: create & run (exact terminal session)

```bash
npm create @nexus_js/nexus my-app
cd my-app
pnpm install
pnpm dev
```

Open http://localhost:3000. You now have a running app using 0.9.30+ features (load/pretext, islands, hardened security).

### Exact generated files you will see/edit

- `nexus.config.ts` (edit for port, CSP, css.entry)
- `src/routes/+page.nx` (your first page — see quickstart.md for exact content)
- `src/routes/+layout.nx` (root layout with <!--nexus:head--> and <!--nexus:slot-->)
- `src/global.css` (Tailwind entry — auto-compiled in dev)

### Production (exact commands + required env)

```bash
pnpm build
NEXUS_SECRET=your-32-char-secret-here pnpm start
```

Output is in `.nexus/output/`. The `NEXUS_SECRET` is **mandatory** for hardened mode (signing cookies, etc.). Never commit it.

### Exact common errors & fixes (copy these)

- `NEXUS_SECRET is required` → `export NEXUS_SECRET=your-32-char-secret-here` (or set in platform env). This is mandatory with `hardened: true`.
- Port in use → edit `nexus.config.ts` exactly:
  ```ts
  export default { server: { port: 3001 } };
  ```
- Styles missing after refresh → make sure you have `src/global.css` and it is declared:
  ```ts
  export default { css: { entry: './src/global.css' } };
  ```
  Then `pnpm dev` will serve it at `/_nexus/global.css`.

See quickstart.md (the exact first .nx you should create), routing.md, server-actions.md, and all the other pages in this list for the full, precise, copy-paste usage of every part of the framework. Everything here uses only modo correcto patterns.
