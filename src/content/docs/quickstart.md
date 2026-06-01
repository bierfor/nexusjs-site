Create a new Nexus project in seconds and deploy your first page.

### Step 1 — Scaffold

```bash
npm create @nexus_js/nexus my-app
cd my-app
pnpm install
```

### Step 2 — Add a page

Create `src/routes/about/+page.nx`:

```svelte
---
export async function load(ctx) {
  return { name: 'Nexus' };
}
---

<h1>About {pretext.name}</h1>
<p>Built with Nexus.js</p>

<style>
  h1 { color: #2563eb; }
</style>
```

### Step 3 — Visit

Open `http://localhost:3000/about`. The page is server-rendered with scoped CSS automatically.
