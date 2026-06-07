# Server Actions

**Exactas** funciones "use server" que escribes. Son type-safe, protegidas contra CSRF, rate-limited, y llamables desde forms o islands con cero boilerplate.

## Acción mínima exacta (el código que realmente escribes en un .nx)

```svelte
---
export async function subscribe(formData, ctx) {
  "use server";                     // marcador exacto que busca el compilador

  const email = formData.get('email');
  if (!email) return { error: 'Email requerido' };

  await db.subscribers.create({ email, createdAt: new Date() });
  return { success: true, message: '¡Gracias!' };
}
---

<form action={subscribe} method="post">
  <input name="email" type="email" required placeholder="tu@ejemplo.com" />
  <button type="submit">Suscribirse</button>
</form>

{#if pretext.result?.success}
  <p style="color:green">{pretext.result.message}</p>
{/if}
```

**Exactamente qué hace el framework:**
- En submit (sin JS): POST completo con token CSRF automático.
- Con JS: `fetch` a `/_nexus/action/subscribe`, misma protección, retorna JSON.
- El resultado está disponible como `pretext.result` después de la action (para la request actual).
- Las race conditions son manejadas por el runtime (puedes retornar `{ queue: true }` etc. — ver patrones avanzados abajo).

## Auth + cookie + redirect exactos (copia este patrón)

```svelte
---
export async function login(formData, ctx) {
  "use server";

  const email = formData.get('email');
  const password = formData.get('password');

  const user = await db.users.verify(email, password);
  if (!user) {
    return { error: 'Credenciales inválidas' };
  }

  ctx.setCookie('session', await createSession(user.id), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { redirect: '/dashboard' };   // redirect exacto que realiza el runtime
}
---

<form action={login} method="post">
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Iniciar sesión</button>
</form>

{#if pretext.error}
  <p style="color:red">{pretext.error}</p>
{/if}
```

## Rate limiting + validación Zod exactos (patrón de producción)

```svelte
---
import { z } from 'zod';

export async function contact(formData, ctx) {
  "use server";

  if (!ctx.rateLimit('contact', { max: 5, window: 60_000 })) {
    return { error: 'Demasiados mensajes. Intenta de nuevo en un minuto.' };
  }

  const result = z.object({
    email: z.string().email(),
    message: z.string().min(10).max(1000),
  }).safeParse({
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!result.success) {
    return { error: 'Entrada inválida' };
  }

  await db.messages.create({ ...result.data, ip: ctx.req.ip });
  return { success: true };
}
---
```

## Llamar una action exacta desde una island (el lado JS)

```ts
// src/lib/islands/contact-form.ts
export default function init(root: HTMLElement) {
  const form = root.querySelector('form');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const res = await fetch('/_nexus/action/contact', {
      method: 'POST',
      body: fd,
    });

    const json = await res.json();
    // actualizar UI con json.success / json.error usando runes/state
  });
}
```

## Valores de retorno avanzados exactos que entiende el runtime

```ts
export async function heavyAction(formData, ctx) {
  "use server";

  if (ctx.isAborted) return;                    // usuario navegó lejos

  const result = await doLongWork();
  return { 
    data: result,
    // o
    redirect: '/success',
    // o
    queue: true,          // deja que el runtime lo encolé si otra action está corriendo
    // o
    ignore: true,         // ignora silenciosamente si una action más nueva empezó
  };
}
```

Todos los patrones arriba (el marcador "use server", ctx.rateLimit, ctx.setCookie, return { redirect/error }, el endpoint fetch exacto `/_nexus/action/Name`, manejo de races) están tomados directamente del paquete server y los ejemplos reales en el monorepo. Úsalos exactamente como se muestran. Combina con load() (para datos iniciales), runes (para estado UI), e islands (para la parte cliente). Ver las otras páginas de esta lista para la imagen completa.
