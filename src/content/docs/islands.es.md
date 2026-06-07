# Arquitectura de Islands

Nexus envía **cero JavaScript por defecto**. Solo los componentes que marques explícitamente con una directiva `client:*` reciben un bundle para el navegador. Todo lo demás es HTML estático renderizado en el servidor.

Esto es la "arquitectura de islands": pequeñas regiones interactivas y auto-contenidas en un mar de markup estático.

---

## Directivas de hidratación

Agrega el atributo directamente a cualquier elemento en tu template `.nx`:

| Directiva | Comportamiento |
|-----------|----------------|
| `client:load` | Hidrata inmediatamente al cargar la página (UI crítica: header, carrito) |
| `client:idle` | Hidrata cuando el navegador esté idle (buen default para la mayoría) |
| `client:visible` | Hidrata solo al hacer scroll hasta el viewport (mejor rendimiento) |
| `client:media="(min-width: 768px)"` | Hidrata solo cuando el media query coincida (condicional responsive) |
| `server:only` | Nunca envía JS; HTML estático puro (default si no hay directiva) |

---

## Dos tipos de islands

### 1. Islands inline

Escribe la lógica interactiva directamente dentro del archivo `.nx`. El compilador extrae el código cliente automáticamente.

```svelte
<div client:visible>
  <script>
    let count = $state(0);
  </script>
  <button onclick={() => count++}>
    Clicked {count} times
  </button>
</div>
```

Usa islands inline para interacciones pequeñas y puntuales que no necesitan reutilización.

### 2. Islands externas (recomendado)

Mantén las islands en `src/lib/islands/` y referéncialas vía `src`. Este es el patrón preferido para cualquier lógica cliente no trivial.

```svelte
<!-- src/routes/counter/+page.nx -->
---
export async function load(ctx) {
  return { initialCount: 42 };
}
---

<h1>Counter demo</h1>

<nexus-island
  client:visible
  src="$lib/islands/counter.ts"
  data-initial="{pretext.initialCount}">
</nexus-island>
```

```ts
// src/lib/islands/counter.ts
export default function init(root: HTMLElement) {
  let count = $state(0);

  const btn = document.createElement('button');
  btn.textContent = `Count: ${count}`;
  root.appendChild(btn);

  $effect(() => {
    btn.textContent = `Count: ${count}`;
  });

  btn.addEventListener('click', () => count++);

  // Lee datos del servidor pasados vía data-* attributes
  const initial = root.dataset.initial;
  if (initial) count = parseInt(initial, 10);
}
```

**Contrato de la island:**
- El archivo debe exportar `export default function init(root: HTMLElement, data?: any)`.
- `root` es el elemento `<nexus-island>` mismo.
- El framework configura el contexto de runes de Svelte 5 antes de llamar `init`, así que `$state`, `$effect` y `$derived` funcionan inmediatamente.
- Puedes leer atributos `data-*` desde `root.dataset` para transferir datos servidor → cliente.

---

## Estrategia de hidratación por defecto

Puedes definir un default a nivel proyecto en `nexus.config.ts` para no repetir la directiva en cada island:

```ts
export default {
  defaultHydration: 'client:visible', // o 'client:idle' / 'client:load'
};
```

Con esta config, `<nexus-island src="$lib/islands/counter.ts">` sin directiva usará `client:visible`.

---

## Supervivencia de estado entre navegaciones

Como las islands son auto-contenidas, su `$state` interno sobrevive la navegación SPA (ver `navigation.md` para `goto` y comportamiento de links). El DOM se morfea, pero el contexto JS y el estado de la island permanecen vivos.

---

## Islands + server actions (patrón realista)

```svelte
---
export async function load(ctx) {
  const likes = await db.likes.countForPost(ctx.params.id);
  return { likes };
}

export async function like(postId) {
  "use server";
  await db.likes.create({ postId });
  return { success: true };
}
---

<nexus-island
  client:visible
  src="$lib/islands/like-button.ts"
  data-post-id="{pretext.postId}"
  data-initial-likes="{pretext.likes}">
</nexus-island>
```

La island puede llamar la acción vía `fetch` a `/_nexus/action/like` (el framework conecta el endpoint automáticamente) y actualizar su estado local sin recarga completa.

---

## Islands externas en v0.9.30+

En v0.9.30, las islands externas se sirven directamente desde `/_nexus/lib/islands/*.js`. El compilador reescribe `$lib/islands/counter.ts` a la URL pública correcta. Esto funciona para:

- Archivos fuente `.ts` y `.tsx` (auto-transpilados en dev)
- Imports relativos dentro del archivo island (reescritos a `.js`)
- Builds de producción (bundles hasheados en `.nexus/output/lib/`)

Si un archivo island importa utilidades desde `$lib/utils.ts`, estas también se sirven automáticamente vía `/_nexus/lib/`.

---

## Mejores prácticas

1. **Prefiere `client:visible`** para cualquier cosa bajo el fold; diferencia la descarga y ejecución de JS hasta que el usuario realmente lo necesite.
2. **Usa islands externas** (`src="$lib/islands/..."`) para cualquier cosa de más de unas pocas líneas; mantiene los archivos `.nx` limpios y permite reutilización.
3. **Pasa datos vía `data-*` attributes** en vez de variables globales; es explícito, seguro para SSR, y sobrevive la hidratación.
4. **Mantén las islands enfocadas**; una island por cada interacción (ej. una para el menú móvil, otra para la barra de progreso).
5. **No sobre-islandees**; si algo funciona sin JS (acordeón solo-CSS, `<details>` nativo), déjalo estático.
