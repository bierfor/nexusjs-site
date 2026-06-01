# Database — Bring Your Own

Nexus doesn't bundle an ORM. Wrap your client with cache and invalidation.

## Bring your own

Nexus works with any database client: Prisma, Drizzle, Kysely, postgres.js, libSQL, or raw drivers.

## Prisma adapter

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

## Drizzle adapter

```ts
// src/lib/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL! });
export const db = drizzle(client);
```

## Using in server actions

```svelte
<script>
  "use server";
  import { db } from '$lib/db';

  async function getUser(id) {
    return db.users.findUnique({ where: { id } });
  }
</script>
```

## Tenancy-aware queries

When multi-tenant mode is enabled, the database adapter warns if queries omit `tenantId`, reducing cross-tenant mistakes.