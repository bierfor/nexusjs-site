# Security

Security by default. Not as a plugin.

## 1 — Anti-CSRF for server actions

Dual-tier protection: SameSite cookies + token validation. Every `"use server"` action is CSRF-protected automatically.

## 2 — Ghost Wall: Secret Leak Detection

The compiler scans client islands for `process.env`, API keys, and tokens. If found, the build fails with a clear error.

## 3 — XSS Auto-Encoding

All `{pretext.value}` interpolations are HTML-escaped by default. Raw HTML requires explicit opt-in.

## 4 — Per-Action Rate Limiting

```svelte
<script>
  "use server";
  async function submit(formData) {
    await ctx.rateLimit('submit', { max: 10, window: '1m' });
    // ...
  }
</script>
```

## 5 — Hardened Mode

```ts
// nexus.config.ts
export default {
  security: {
    hardened: true,
    csp: { additionalScriptSrc: [] },
  },
};
```

Hardened Mode enables:

- Strict CSP with nonces (full cspNonce support in load() + nonce attrs on inline <style>/<script> for custom)
- Security headers (HSTS, X-Frame-Options, etc.)
- Build-time dependency CVE scanning (via audit)
- Secret leak detection (compiler ghost wall)
- Recent: CSP tightened (no unused broad sources), tabnabbing + path-traversal protections applied in docs site as dogfood.
