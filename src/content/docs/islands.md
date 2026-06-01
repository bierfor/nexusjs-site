Every component is static by default. Only the interactive parts ship JavaScript.

### How it works

Nexus compiles `.nx` files to static HTML by default. If a component contains client runes (`$state`, `$derived`) or a `client:*` directive, the compiler extracts it as an **island** — a self-contained client bundle that hydrates only that part of the page.

### Island directives

| Directive                    | Behavior                          |
|-----------------------------|-----------------------------------|
| `client:load`               | Hydrate immediately               |
| `client:idle`               | Hydrate when browser is idle      |
| `client:visible`            | Hydrate when scrolled into view   |
| `client:media="..."`        | Hydrate on media query            |
| `server:only`               | Never hydrate (pure SSR)          |

### Example

```svelte
<nexus-island client:visible src="$lib/islands/counter.ts"></nexus-island>
```

```ts
// src/lib/islands/counter.ts
export default function init() {
  let count = $state(0);
  const btn = document.getElementById('counter-btn');
  btn?.addEventListener('click', () => count++);
}
```

### Benefits

- **Zero JS by default** — static pages ship no JavaScript
- **Surgical hydration** — only interactive components pay the JS cost
- **State survives navigation** — islands keep their state during SPA morphing
