# Seguridad

Seguridad por defecto. No como plugin. **Primitivas exactas** que obtienes en todas partes.

## Anti-CSRF exacto (escribes casi nada)

```svelte
---
export async function dangerousAction(formData, ctx) {
  "use server";
  // el token ya fue validado antes de que esto corra
  const userId = ctx.user?.id;
  await db.sensitive.update({ userId, data: formData.get('data') });
  return { ok: true };
}
---

<form action={dangerousAction} method="post">...</form>
```

El framework hace SameSite cookies + token criptográfico + chequeo en tiempo constante automáticamente en cada action. Esta protección requiere `NEXUS_SECRET` en producción.

## Ghost Wall exacto (detección de fuga de secretos)

Si escribes esto dentro de una island o <script> de cliente:

```ts
const key = process.env.STRIPE_SECRET;
```

Obtienes un **error de compilación exacto**:

```
NX-GUARD-SECRET: Secret-like identifier found inside client island
  file: src/routes/checkout/+page.nx:42
  hint: Move the secret into load() or a "use server" action.
```

## Protección XSS exacta

```svelte
<p>{pretext.userBio}</p>     <!-- siempre escapado -->
```

Solo renderiza HTML crudo cuando vino de tu propio contenido sanitizado (ej. de @nexus_js/content):

```svelte
<div>
  {pretext.sanitizedHtml}
</div>
```

## Rate limiting exacto por-action (el patrón que copias en todas partes)

```svelte
---
export async function submit(formData, ctx) {
  "use server";

  if (!ctx.rateLimit('submit', { max: 5, window: 60_000 })) {
    return { error: 'Too many attempts. Wait a minute.' };
  }
  // ... tu lógica
}
---
```

Funciona desde forms y desde islands (el mismo nombre se usa para el bucket).

## Hardened Mode + cspNonce exactos (la config + cómo usar el nonce)

```ts
// nexus.config.ts (exacto recomendado)
export default {
  security: {
    hardened: true,
    csp: {
      additionalScriptSrc: [],   // sé explícito
      additionalStyleSrc: [],
      additionalFontSrc: [],
      additionalConnectSrc: [],
      additionalImgSrc: [],
    },
  },
};
```

En cualquier load() o template ahora tienes `ctx.cspNonce`.

Uso exacto en tu layout raíz (ya en el +layout.nx del sitio):

```html
<style nonce="{pretext.cspNonce}">
  /* tu CSS crítico */
</style>

<script nonce="{pretext.cspNonce}">
  /* tu script inline */
</script>
```

Hardened mode también te da (exacto):
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict Transport Security (prod)
- Permissions-Policy (cámara etc. off)
- Escaneo automático de secretos en build-time + bloqueo de CVE de @nexus_js/audit

`NEXUS_SECRET` es requerido en producción cuando hardened mode (o cualquier protección de sesión/CSRF) está activo.

## Shield Lite exacto

Para un preset de endurecimiento más ligero cuando hardened mode completo es demasiado estricto:

```ts
// nexus.config.ts
export default {
  security: {
    shieldLite: true,
  },
};
```

Shield Lite activa una línea base menor de headers y checks de seguridad sin las restricciones completas de hardened mode.

## Patrones exactos recientes de dogfooding 0.9.31 (aplicados a este mismo sitio)

- Siempre agrega `rel="noopener noreferrer"` en links externos `target="_blank"` (fix de tabnabbing).
- Siempre sanitiza params de ruta antes de usarlos en paths:

```ts
if (!/^[a-z0-9_-]+$/i.test(slug)) return ctx.notFound();
```

- La página de releases usa `sanitize: 'strict'` (más seguro que permissive).
- Cobertura completa de cspNonce en cada <style> y <script> inline en los docs.

Ver la implementación exacta de todo lo anterior en packages/security, packages/server, y el guard del compilador. Úsalos exactamente como se muestran en los ejemplos. Combina con server-actions.md (para rateLimit dentro de actions) y las otras páginas de esta lista (load/pretext para pasar datos seguros, paquete de contenido para HTML sanitizado). Todos los patrones aquí están activamente usados en el propio sitio de docs.
