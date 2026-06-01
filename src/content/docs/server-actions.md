# Server Actions

Type-safe functions that run on the server, called like regular async functions.

## The simplest server action

```svelte
<script>
  "use server";
  async function subscribe(formData) {
    const email = formData.get('email');
    await db.subscribers.create({ email });
    return { ok: true };
  }
</script>

<form action={subscribe}>
  <input name="email" type="email" required>
  <button type="submit">Subscribe</button>
</form>
```

## Progressive enhancement

Forms work without JavaScript. With JS, the action is called via `fetch` with automatic CSRF protection and race-condition handling.

## Auth example

```svelte
<script>
  "use server";
  async function login(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const user = await db.users.verify(email, password);
    if (!user) return { error: 'Invalid credentials' };
    ctx.setCookie('session', await createSession(user.id), { httpOnly: true, secure: true });
    return { redirect: '/dashboard' };
  }
</script>
```

## Rate limiting

```svelte
<script>
  "use server";
  async function contact(formData) {
    await ctx.rateLimit('contact', { max: 5, window: '1h' });
    // ... handle form
  }
</script>
```