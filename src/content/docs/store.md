# Global State Store

Shared state across islands and pages. Hydration Miss = 0. State is never lost during SPA navigation.

## Global store

```svelte
<script>
  import { createStore } from '@nexus_js/runtime';

  const store = createStore('app', {
    theme: 'light',
    sidebarOpen: false,
  });

  store.subscribe('theme', (value) => {
    document.documentElement.setAttribute('data-theme', value);
  });
</script>
```

## Persistence modes

| Mode | Behavior |
|------|----------|
| `memory` | In-memory only (default) |
| `session` | Persists across SPA navigation |
| `local` | Persists across browser sessions |

## Cross-island sync

Two islands on the same page can share state via the store without prop drilling or event bubbling.