# Testing

**Exact** helpers you import from `@nexus_js/testing`.

## Exact SSR test of a page

```ts
import { renderSSR } from '@nexus_js/testing';
import { describe, it, expect } from 'vitest';

describe('about page', () => {
  it('renders with pretext', async () => {
    const { html, pretext } = await renderSSR('/about', {
      // you can pass a mock ctx here
    });
    expect(html).toContain('About');
    expect(pretext.page?.title).toBe('About Us');
  });
});
```

## Exact island mount

```ts
import { mountIsland } from '@nexus_js/testing';
import CounterIsland from '../src/lib/islands/counter.ts';

it('island increments', async () => {
  const { root, unmount } = await mountIsland(CounterIsland, {
    // initial data- attrs if needed
  });
  const btn = root.querySelector('button');
  btn?.click();
  expect(btn?.textContent).toContain('1');
  unmount();
});
```

## Exact action test harness

```ts
import { createActionTestHarness } from '@nexus_js/testing';
import { submit } from '../src/routes/contact/+page.nx';

it('rate limits actions', async () => {
  const harness = createActionTestHarness(submit, {
    // mock ctx
    rateLimit: () => false,
  });
  const result = await harness.call(new FormData());
  expect(result.error).toMatch(/too many/i);
});
```

All helpers above are the exact exports from `@nexus_js/testing` and are the ones used to test the docs site and the monorepo examples. See the other pages in this list (server-actions.md for the exact "use server" signatures you test, quickstart.md for the minimal page you render, etc.). Use them exactly.

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