# Segurança

Segurança por padrão. Não como plugin. **Primitivas exatas** que você obtém em todo lugar.

## Anti-CSRF exato (você escreve quase nada)

```svelte
---
export async function dangerousAction(formData, ctx) {
  "use server";
  // o token já foi validado antes disso rodar
  const userId = ctx.user?.id;
  await db.sensitive.update({ userId, data: formData.get('data') });
  return { ok: true };
}
---

<form action={dangerousAction} method="post">...</form>
```

O framework faz SameSite cookies + token criptográfico + verificação em tempo constante automaticamente em cada action.

## Ghost Wall exato (detecção de vazamento de segredos)

Se você escrever isso dentro de uma island ou <script> de cliente:

```ts
const key = process.env.STRIPE_SECRET;
```

Você obtém um **erro de compilação exato**:

```
NX-GUARD-SECRET: Secret-like identifier found inside client island
  file: src/routes/checkout/+page.nx:42
  hint: Move the secret into load() or a "use server" action.
```

## Proteção XSS exata

```svelte
<p>{pretext.userBio}</p>     <!-- sempre escapado -->
```

Só renderize HTML cru quando vier do seu próprio conteúdo sanitizado (ex. de @nexus_js/content):

```svelte
<div>
  {pretext.sanitizedHtml}
</div>
```

## Rate limiting exato por-action (o padrão que você copia em todo lugar)

```svelte
---
export async function submit(formData, ctx) {
  "use server";

  if (!ctx.rateLimit('submit', { max: 5, window: 60_000 })) {
    return { error: 'Too many attempts. Wait a minute.' };
  }
  // ... sua lógica
}
---
```

Funciona de forms e de islands (o mesmo nome é usado para o bucket).

## Hardened Mode + cspNonce exatos (a config + como usar o nonce)

```ts
// nexus.config.ts (exato recomendado)
export default {
  security: {
    hardened: true,
    csp: {
      additionalScriptSrc: [],   // seja explícito
    },
  },
};
```

Em qualquer load() ou template agora você tem `ctx.cspNonce`.

Uso exato no seu layout raiz (já no +layout.nx do site):

```html
<style nonce="{pretext.cspNonce}">
  /* seu CSS crítico */
</style>

<script nonce="{pretext.cspNonce}">
  /* seu script inline */
</script>
```

Hardened mode também dá a você (exato):
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict Transport Security (prod)
- Permissions-Policy (câmera etc. off)
- Scan automático de segredos em build-time + bloqueio de CVE de @nexus_js/audit

## Padrões exatos recentes de dogfooding 0.9.30 (aplicados a este mesmo site)

- Sempre adicione `rel="noopener noreferrer"` em links externos `target="_blank"` (fix de tabnabbing).
- Sempre sanitize params de rota antes de usá-los em paths:

```ts
if (!/^[a-z0-9_-]+$/i.test(slug)) return ctx.notFound();
```

- A página de releases usa `sanitize: 'strict'` (mais seguro que permissive).
- Cobertura completa de cspNonce em cada <style> e <script> inline nos docs.

Veja a implementação exata de tudo acima em packages/security, packages/server, e o guard do compilador. Use-os exatamente como mostrado nos exemplos. Combine com server-actions.md (para rateLimit dentro de actions) e as outras páginas desta lista (load/pretext para passar dados seguros, pacote de conteúdo para HTML sanitizado). Todos os padrões aqui estão ativamente usados no próprio site de docs.
