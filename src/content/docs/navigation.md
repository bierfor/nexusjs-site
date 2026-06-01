# SPA Navigation

Server-Driven DOM Morphing. No VDOM diff, no full page reload. Islands keep their state.

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