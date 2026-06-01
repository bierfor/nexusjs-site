Nexus requires Node.js ≥ 22 and pnpm ≥ 9.

### Prerequisites

- [Node.js](https://nodejs.org/) 22.0.0 or higher
- [pnpm](https://pnpm.io/) 9.0.0 or higher

### Create a project

```bash
npm create @nexus_js/nexus my-app
cd my-app
pnpm install
```

### Start development

```bash
pnpm dev
```

Your app is now running at `http://localhost:3000`.

### Production build

```bash
pnpm build
pnpm start
```

The build output goes to `.nexus/output/`. Set `NEXUS_SECRET` in production.
