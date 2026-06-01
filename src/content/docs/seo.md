# SEO & Head Management

Server-side metadata injection with client-side reactive updates.

## Server-side head

```svelte
---
export async function load(ctx) {
  return {
    title: 'About — Nexus.js',
    description: 'Learn about the Nexus framework.',
  };
}
---

<head>
  <title>{pretext.title}</title>
  <meta name="description" content="{pretext.description}">
</head>
```

## Reactive head updates

```svelte
<script>
  import { defineHead } from '@nexus_js/runtime';

  $effect(() => {
    defineHead({ title: `Dashboard — ${projectName}` });
  });
</script>
```

## Sitemap generation

`nexus build` emits a `sitemap.xml` based on the route manifest automatically.