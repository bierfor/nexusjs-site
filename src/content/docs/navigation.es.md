# Navegación SPA

**Exacta** navegación de cliente que se siente como SPA pero es dirigida por el servidor.

```svelte
<a href="/about" data-nexus-link>Ir a about</a>

<script>
  // o imperativamente
  import { goto } from '@nexus_js/runtime';
  goto('/dashboard', { replace: true });
</script>
```

El framework hace un fetch al servidor para la nueva página, morph el DOM (preservando estado de islands y $pretext), y actualiza el historial. Sin bundle de router del lado cliente.

Ver store.md para cómo $pretext sobrevive al morph, islands.md para estado que vive dentro de islands, y server-actions.md para actions que retornan `{ redirect: '...' }` (la capa de navegación las respeta).

Todo lo anterior (data-nexus-link, goto, reglas de morphing, preservación de estado) es la implementación exacta en el runtime usada por el propio sitio de docs. Úsalos exactamente como se muestra. Las islands mantienen su estado.

## Links declarativos

Las etiquetas `<a>` estándar son interceptadas automáticamente cuando `@nexus_js/runtime` está cargado. El framework hace fetch de la nueva página, morph el DOM, y preserva estado de islands.

## Navegación programática

```ts
import { navigate } from '@nexus_js/runtime';

navigate('/dashboard');
navigate('/dashboard', { replace: true });
```

## Estrategias de prefetch

| Estrategia | Comportamiento |
|------------|----------------|
| `hover` | Prefetch al hover del link |
| `visible` | Prefetch cuando el link entra al viewport |
| `eager` | Prefetch inmediatamente |

## Rutas type-safe

El compilador genera un manifest de rutas que habilita autocompletado y validación para `navigate('/path')`.
