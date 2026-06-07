# Banco de Dados — Traga o Seu

Nexus não inclui um ORM empacotado. Envolva seu cliente com cache e invalidação.

## Traga o seu

Nexus funciona com qualquer cliente de banco de dados: Prisma, Drizzle, Kysely, postgres.js, libSQL, ou drivers crus.

## Adaptador Prisma

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();
```

Use @nexus_js/db para adaptadores finos se quiser trocar providers (Prisma/Drizzle/Postgres.js/libSQL).

Combine com segurança (isolamento de tenant via bridge ou ctx) e coleções de conteúdo para dados ricos.

Veja @nexus_js/db e bridge.md.

## Adaptador Drizzle

```ts
// src/lib/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL! });
export const db = drizzle(client);
```

## Uso em server actions

```svelte
<script>
  "use server";
  import { db } from '$lib/db';

  async function getUser(id) {
    return db.users.findUnique({ where: { id } });
  }
</script>
```

## Consultas cientes de tenancy

Quando o modo multi-tenant está habilitado, o adaptador de banco de dados avisa se as consultas omitirem `tenantId`, reduzindo erros cross-tenant.
