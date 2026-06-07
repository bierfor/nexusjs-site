# Tienda de Estado Global

Uso **exacto** de $pretext y store global.

```svelte
<script>
  // acceso reactivo exacto a datos del servidor que sobrevivieron a la hidratación
  const user = $pretext.user;
  let theme = $sync('theme', 'light');   // ver runes.md
</script>

<p>Bienvenido, {user.name}</p>
```

En load() retornas lo que quieras:

```ts
export async function load(ctx) {
  return {
    user: await getCurrentUser(ctx),
    // queda disponible como $pretext.user en cliente (y pretext.user en servidor)
  };
}
```

Ver navigation.md para el morphing SPA exacto que mantiene este estado vivo, e islands.md para cómo las islands lo leen/escriben. La rune $pretext y las reglas de mezcla están implementadas exactamente en el runtime y usadas a lo largo de los ejemplos del sitio de docs. El estado nunca se pierde durante navegación SPA.

## Store global

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

## Modos de persistencia

| Modo | Comportamiento |
|------|----------------|
| `memory` | Solo en memoria (default) |
| `session` | Persiste a través de navegación SPA |
| `local` | Persiste a través de sesiones del navegador |

## Sincronización cross-island

Dos islands en la misma página pueden compartir estado vía el store sin prop drilling ni event bubbling.
