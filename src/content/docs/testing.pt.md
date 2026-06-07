# Testing

**Helpers exatos** que você importa de `@nexus_js/testing`.

## Test SSR exato de uma página

```ts
import { renderSSR } from '@nexus_js/testing';
import { describe, it, expect } from 'vitest';

describe('about page', () => {
  it('renders with pretext', async () => {
    const { html, pretext } = await renderSSR('/about', {
      // você pode passar um ctx mock aqui
    });
    expect(html).toContain('About');
    expect(pretext.page?.title).toBe('About Us');
  });
});
```

## Mount exato de island

```ts
import { mountIsland } from '@nexus_js/testing';
import CounterIsland from '../src/lib/islands/counter.ts';

it('island increments', async () => {
  const { root, unmount } = await mountIsland(CounterIsland, {
    // data- attrs iniciais se necessário
  });
  const btn = root.querySelector('button');
  btn?.click();
  expect(btn?.textContent).toContain('1');
  unmount();
});
```

## Harness exato de test de action

```ts
import { createActionTestHarness } from '@nexus_js/testing';
import { submit } from '../src/routes/contact/+page.nx';

it('rate limits actions', async () => {
  const harness = createActionTestHarness(submit, {
    // ctx mock
    rateLimit: () => false,
  });
  const result = await harness.call(new FormData());
  expect(result.error).toMatch(/too many/i);
});
```

Todos os helpers acima são as exportações exatas de `@nexus_js/testing` e são os usados para testar o site de docs e os exemplos do monorepo. Veja as outras páginas desta lista (server-actions.md para as assinaturas exatas de "use server" que você testa, quickstart.md para a página mínima que renderiza, etc.). Use-os exatamente.

## Testing SSR

```ts
import { render } from '@nexus_js/testing';
import { test, expect } from 'vitest';

test('home page renders', async () => {
  const html = await render('/');
  expect(html).toContain('Nexus.js');
});
```

## Testing de islands

```ts
import { hydrate } from '@nexus_js/testing';

test('counter island hydrates', async () => {
  const island = await hydrate('src/lib/islands/counter.ts');
  island.querySelector('button')?.click();
  expect(island.textContent).toContain('1');
});
```

## Testing de server actions

```ts
import { callAction } from '@nexus_js/testing';

test('login action validates', async () => {
  const result = await callAction('login', new FormData());
  expect(result.error).toBe('Invalid credentials');
});
