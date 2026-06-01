# Testing

First-class Vitest integration for SSR, islands, and Server Actions.

## SSR testing

```ts
import { render } from '@nexus_js/testing';
import { test, expect } from 'vitest';

test('home page renders', async () => {
  const html = await render('/');
  expect(html).toContain('Nexus.js');
});
```

## Island testing

```ts
import { hydrate } from '@nexus_js/testing';

test('counter island hydrates', async () => {
  const island = await hydrate('src/lib/islands/counter.ts');
  island.querySelector('button')?.click();
  expect(island.textContent).toContain('1');
});
```

## Server action testing

```ts
import { callAction } from '@nexus_js/testing';

test('login action validates', async () => {
  const result = await callAction('login', new FormData());
  expect(result.error).toBe('Invalid credentials');
});
```