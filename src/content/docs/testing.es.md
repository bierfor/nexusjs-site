# Testing

**Helpers exactos** que importas desde `@nexus_js/testing`.

## Test SSR exacto de una página

```ts
import { renderSSR } from '@nexus_js/testing';
import { describe, it, expect } from 'vitest';

describe('about page', () => {
  it('renders with pretext', async () => {
    const { html, pretext } = await renderSSR('/about', {
      // puedes pasar un ctx mock aquí
    });
    expect(html).toContain('About');
    expect(pretext.page?.title).toBe('About Us');
  });
});
```

## Mount exacto de island

```ts
import { mountIsland } from '@nexus_js/testing';
import CounterIsland from '../src/lib/islands/counter.ts';

it('island increments', async () => {
  const { root, unmount } = await mountIsland(CounterIsland, {
    // data- attrs iniciales si es necesario
  });
  const btn = root.querySelector('button');
  btn?.click();
  expect(btn?.textContent).toContain('1');
  unmount();
});
```

## Harness exacto de test de action

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

Todos los helpers arriba son las exportaciones exactas de `@nexus_js/testing` y son los usados para testear el sitio de docs y los ejemplos del monorepo. Ver las otras páginas de esta lista (server-actions.md para las firmas exactas de "use server" que testeas, quickstart.md para la página mínima que renderizas, etc.). Úsalos exactamente.

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
```
