# SPA Navigation

**Exact** client navigation that feels like a SPA but is driven by the server.

```svelte
<a href="/about" data-nexus-link>Go to about</a>

<script>
  // or imperatively
  import { goto } from '@nexus_js/runtime';
  goto('/dashboard', { replace: true });
</script>
```

The framework does a server fetch for the new page, morphs the DOM (preserving island state and $pretext), and updates history. No client-side router bundle.

See store.md for how $pretext survives the morph, islands.md for state that lives inside islands, and server-actions.md for actions that return `{ redirect: '...' }` (the navigation layer respects them).

All of the above (data-nexus-link, goto, morphing rules, state preservation) are the exact implementation in the runtime used by the docs site itself. Use them exactly as shown. Islands keep their state.

## Declarative links

Standard `<a>` tags are intercepted automatically when `@nexus_js/runtime` is loaded. The framework fetches the new page, morphs the DOM, and preserves island state.

## Programmatic navigation

```ts
import { navigate } from '@nexus_js/runtime';

navigate('/dashboard');
navigate('/dashboard', { replace: true });
```

## Prefetch strategies

| Strategy | Behavior |
|----------|----------|
| `hover` | Prefetch on link hover |
| `visible` | Prefetch when link enters viewport |
| `eager` | Prefetch immediately |

## Type-safe routes

The compiler generates a route manifest that enables autocomplete and validation for `navigate('/path')`.