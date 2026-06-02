# The .nx Component Format

Every Nexus page and component is a `.nx` file with up to four sections.

## Sections

| Section | Syntax | Purpose |
|---------|--------|---------|
| Frontmatter | `---` … `---` | Imports, TypeScript, `load()` data loader |
| Template | HTML | Server-rendered markup with `{pretext.key}` interpolation |
| Style | `<style>` | Scoped CSS (auto-hashed per file) |
| Script | `<script>` | Client runes or server actions |

## Example

```svelte
---
import { db } from '$lib/db';

export async function load(ctx) {
  const posts = await db.posts.findMany();
  return { posts };
}
---

<ul>
  {#each pretext.posts as post}
    <li>{post.title}</li>
  {/each}
</ul>

<style>
  ul { list-style: none; padding: 0; }
  li { padding: 0.5rem 0; border-bottom: 1px solid #e4e4e7; }
</style>

<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>Clicks: {count}</button>
```

## Compile-time DX (0.9.23+)

The compiler produces structured `CompileError` (with `code` like `NX-101`, `file`, `loc`, `hint`, optional `frame`) for common template problems such as unclosed `{#if}` or malformed `{#each}` (missing `as item` alias).

`compile()` returns `warnings[]` (each with `loc`) for parser issues and security guard findings (e.g. `process.env.*` used inside `<script>` islands).

`formatCompileError(err, source?)` and `formatCompileWarning(warn, file, source?)` (plus `extractFrame`, `offsetToLineColumn`) produce beautiful ANSI-colored terminal output with source context and carets. The CLI and dev server use them automatically.

See the Package Reference (packages.md) for full error codes and examples.

## Rules

- Only `+layout.nx` should emit `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`
- All `+page.nx` files must be fragments (children of `<!--nexus:slot-->`)
- CSS is scoped per file using `data-nx="hash"` attributes
- Use `:global(selector)` to escape scoping when needed