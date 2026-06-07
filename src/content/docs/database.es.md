# Base de Datos — Trae la Tuya

Nexus no incluye un ORM empaquetado. Envuelve tu cliente con caché e invalidación.

## Trae el tuyo

Nexus funciona con cualquier cliente de base de datos: Prisma, Drizzle, Kysely, postgres.js, libSQL, o drivers crudos.

## Adaptador Prisma

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

Usa @nexus_js/db para adaptadores delgados si quieres intercambiar providers (Prisma/Drizzle/Postgres.js/libSQL).

Combina con seguridad (aislamiento de tenant vía bridge o ctx) y colecciones de contenido para datos ricos.

Ver @nexus_js/db y bridge.md.

## Adaptador Drizzle

```ts
// src/lib/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL! });
export const db = drizzle(client);
```

## Uso en server actions

```svelte
<script>
  "use server";
  import { db } from '$lib/db';

  async function getUser(id) {
    return db.users.findUnique({ where: { id } });
  }
</script>
```

## Consultas conscientes de tenancy

Cuando el modo multi-tenant está habilitado, el adaptador de base de datos advierte si las consultas omiten `tenantId`, reduciendo errores cross-tenant.
