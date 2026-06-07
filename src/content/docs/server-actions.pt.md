# Server Actions

**Exatas** funções "use server" que você escreve. São type-safe, protegidas contra CSRF, com rate limit, e chamáveis de forms ou islands com zero boilerplate.

## Ação mínima exata (o código que você realmente escreve em um .nx)

```svelte
---
export async function subscribe(formData, ctx) {
  "use server";                     // marcador exato que o compilador procura

  const email = formData.get('email');
  if (!email) return { error: 'Email obrigatório' };

  await db.subscribers.create({ email, createdAt: new Date() });
  return { success: true, message: 'Obrigado!' };
}
---

<form action={subscribe} method="post">
  <input name="email" type="email" required placeholder="voce@exemplo.com" />
  <button type="submit">Inscrever</button>
</form>

{#if pretext.result?.success}
  <p style="color:green">{pretext.result.message}</p>
{/if}
```

**Exatamente o que o framework faz:**
- No submit (sem JS): POST completo com token CSRF automático.
- Com JS: `fetch` para `/_nexus/action/subscribe`, mesma proteção, retorna JSON.
- O resultado fica disponível como `pretext.result` depois da action (para a request atual).
- Race conditions são tratadas pelo runtime (você pode retornar `{ queue: true }` etc. — veja padrões avançados abaixo).

## Auth + cookie + redirect exatos (copie este padrão)

```svelte
---
export async function login(formData, ctx) {
  "use server";

  const email = formData.get('email');
  const password = formData.get('password');

  const user = await db.users.verify(email, password);
  if (!user) {
    return { error: 'Credenciais inválidas' };
  }

  ctx.setCookie('session', await createSession(user.id), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { redirect: '/dashboard' };   // redirect exato que o runtime executa
}
---

<form action={login} method="post">
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Entrar</button>
</form>

{#if pretext.error}
  <p style="color:red">{pretext.error}</p>
{/if}
```

## Rate limiting + validação Zod exatos (padrão de produção)

```svelte
---
import { z } from 'zod';

export async function contact(formData, ctx) {
  "use server";

  if (!ctx.rateLimit('contact', { max: 5, window: 60_000 })) {
    return { error: 'Mensagens demais. Tente novamente em um minuto.' };
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

## Chamar uma action exata de uma island (o lado JS)

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
    // atualizar UI com json.success / json.error usando runes/state
  });
}
```

## Valores de retorno avançados exatos que o runtime entende

```ts
export async function heavyAction(formData, ctx) {
  "use server";

  if (ctx.isAborted) return;                    // usuário navegou embora

  const result = await doLongWork();
  return { 
    data: result,
    // ou
    redirect: '/success',
    // ou
    queue: true,          // deixa o runtime enfileirar se outra action estiver rodando
    // ou
    ignore: true,         // ignora silenciosamente se uma action mais nova começou
  };
}
```

Todos os padrões acima (o marcador "use server", ctx.rateLimit, ctx.setCookie, return { redirect/error }, o endpoint fetch exato `/_nexus/action/Name`, tratamento de races) são tirados diretamente do pacote server e dos exemplos reais no monorepo. Use-os exatamente como mostrado. Combine com load() (para dados iniciais), runes (para estado de UI), e islands (para a parte cliente). Veja as outras páginas desta lista para o quadro completo.
