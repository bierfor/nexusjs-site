# Server Actions

**Exact** "use server" functions you write. They are type-safe, CSRF-protected, rate-limited, and callable from forms or islands with zero boilerplate.

## Exact minimal action (the code you actually write in a .nx)

```svelte
---
export async function subscribe(formData, ctx) {
  "use server";                     // exact marker the compiler looks for

  const email = formData.get('email');
  if (!email) return { error: 'Email required' };

  await db.subscribers.create({ email, createdAt: new Date() });
  return { success: true, message: 'Thank you!' };
}
---

<form action={subscribe} method="post">
  <input name="email" type="email" required placeholder="you@example.com" />
  <button type="submit">Subscribe</button>
</form>

{#if pretext.result?.success}
  <p style="color:green">{pretext.result.message}</p>
{/if}
```

**Exactly what the framework does:**
- On submit (no JS): full POST with automatic CSRF token.
- With JS: `fetch` to `/_nexus/action/subscribe`, same protection, returns JSON.
- Result is available as `pretext.result` after the action (for the current request).
- Race conditions are handled by the runtime (you can return `{ queue: true }` etc. — see advanced patterns below).

## Exact auth + cookie + redirect (copy this pattern)

```svelte
---
export async function login(formData, ctx) {
  "use server";

  const email = formData.get('email');
  const password = formData.get('password');

  const user = await db.users.verify(email, password);
  if (!user) {
    return { error: 'Invalid credentials' };
  }

  ctx.setCookie('session', await createSession(user.id), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { redirect: '/dashboard' };   // exact redirect the runtime performs
}
---

<form action={login} method="post">
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Log in</button>
</form>

{#if pretext.error}
  <p style="color:red">{pretext.error}</p>
{/if}
```

## Exact rate limiting + Zod validation (production pattern)

```svelte
---
import { z } from 'zod';

export async function contact(formData, ctx) {
  "use server";

  if (!ctx.rateLimit('contact', { max: 5, window: 60_000 })) {
    return { error: 'Too many messages. Try again in a minute.' };
  }

  const result = z.object({
    email: z.string().email(),
    message: z.string().min(10).max(1000),
  }).safeParse({
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  await db.messages.create({ ...result.data, ip: ctx.req.ip });
  return { success: true };
}
---
```

## Exact calling an action from an island (the JS side)

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
    // update UI with json.success / json.error using runes/state
  });
}
```

## Exact advanced return values the runtime understands

```ts
export async function heavyAction(formData, ctx) {
  "use server";

  if (ctx.isAborted) return;                    // user navigated away

  const result = await doLongWork();
  return { 
    data: result,
    // or
    redirect: '/success',
    // or
    queue: true,          // let the runtime queue it if another action is running
    // or
    ignore: true,         // silently ignore if a newer action started
  };
}
```

All the patterns above (the "use server" marker, ctx.rateLimit, ctx.setCookie, return { redirect/error }, the exact fetch endpoint `/_nexus/action/Name`, race handling) are taken directly from the server package and the real examples in the monorepo. Use them exactly as shown. Combine with load() (for initial data), runes (for UI state), and islands (for the client part). See the other pages in this list for the full picture.