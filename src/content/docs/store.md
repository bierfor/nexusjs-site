# Global State Store

**Exact** $pretext and global store usage.

```svelte
<script>
  // exact reactive access to server data that survived hydration
  const user = $pretext.user;
  let theme = $sync('theme', 'light');   // see runes.md
</script>

<p>Welcome, {user.name}</p>
```

In load() you return whatever you want:

```ts
export async function load(ctx) {
  return {
    user: await getCurrentUser(ctx),
    // becomes available as $pretext.user on client (and pretext.user on server)
  };
}
```

See navigation.md for the exact SPA morphing that keeps this state alive, and islands.md for how islands read/write it. The $pretext rune and the merge rules are implemented exactly in the runtime and used throughout the docs site examples. State is never lost during SPA navigation.

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