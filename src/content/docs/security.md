# Security

Security by default. Not as a plugin. **Exact** primitives you get everywhere.

## Exact anti-CSRF (you write almost nothing)

```svelte
---
export async function dangerousAction(formData, ctx) {
  "use server";
  // token already validated before this runs
  const userId = ctx.user?.id;
  await db.sensitive.update({ userId, data: formData.get('data') });
  return { ok: true };
}
---

<form action={dangerousAction} method="post">...</form>
```

Framework does SameSite cookies + cryptographic token + constant-time check automatically on every action.

## Exact Ghost Wall (secret leak detection)

If you write this inside an island or client <script>:

```ts
const key = process.env.STRIPE_SECRET;
```

You get an **exact** compile error:

```
NX-GUARD-SECRET: Secret-like identifier found inside client island
  file: src/routes/checkout/+page.nx:42
  hint: Move the secret into load() or a "use server" action.
```

## Exact XSS protection

```svelte
<p>{pretext.userBio}</p>     <!-- always escaped -->
```

Only render raw HTML when it came from your own sanitized content (e.g. from @nexus_js/content):

```svelte
<div>
  {pretext.sanitizedHtml}
</div>
```

## Exact per-action rate limiting (the pattern you copy everywhere)

```svelte
---
export async function submit(formData, ctx) {
  "use server";

  if (!ctx.rateLimit('submit', { max: 5, window: 60_000 })) {
    return { error: 'Too many attempts. Wait a minute.' };
  }
  // ... your logic
}
---
```

Works from forms and from islands (the same name is used for the bucket).

## Exact Hardened Mode + cspNonce (the config + how to use the nonce)

```ts
// nexus.config.ts (exact recommended)
export default {
  security: {
    hardened: true,
    csp: {
      additionalScriptSrc: [],   // be explicit
    },
  },
};
```

In any load() or template you now have `ctx.cspNonce`.

Exact usage in your root layout (already in the site's +layout.nx):

```html
<style nonce="{pretext.cspNonce}">
  /* your critical CSS */
</style>

<script nonce="{pretext.cspNonce}">
  /* your inline script */
</script>
```

Hardened mode also gives you (exactly):
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict Transport Security (prod)
- Permissions-Policy (camera etc. off)
- Automatic build-time secret scanning + @nexus_js/audit CVE blocking

## Exact recent 0.9.30 dogfooding patterns (applied to this very site)

- Always add `rel="noopener noreferrer"` on `target="_blank"` external links (tabnabbing fix).
- Always sanitize route params before using them in paths:

```ts
if (!/^[a-z0-9_-]+$/i.test(slug)) return ctx.notFound();
```

- Releases page uses `sanitize: 'strict'` (safer than permissive).
- Full cspNonce coverage on every inline <style> and <script> in the docs.

See the exact implementation of all the above in packages/security, packages/server, and the compiler guard. Use them exactly as shown in the examples. Combine with server-actions.md (for rateLimit inside actions) and the other pages in this list (load/pretext for passing safe data, content package for sanitized HTML). All patterns here are actively used in the docs site itself.
