# Bridge y Migración Legacy

Herramientas security-first para descubrir DBs/APIs legacy, generar modelos canónicos, y código GraphQL/Shield seguro.

## CLI

```bash
nexus bridge add postgres --dsn-env BRIDGE_POSTGRES_URL --schema public
nexus bridge discover
nexus bridge verify
nexus bridge generate
nexus bridge ui --port 4600
```

## Defaults de seguridad

- Descubrimiento solo de schema (sin muestreo de datos).
- Campos sensibles clasificados + excluidos del SDL.
- Shield defaults con introspection off.

## Uso en load() (modo correcto)

```ts
// src/lib/bridge.ts
import { createRemoteExecutor } from '@nexus_js/graphql';
import { nexusVault } from '@nexus_js/security';

export const legacy = createRemoteExecutor({
  url: 'https://old.example.com/graphql',
  headers: { 'x-api-key': nexusVault.get('LEGACY_KEY') },
});
```

Envuelve middleware Express viejo como actions con `wrapExpressMiddleware`.

Ver security.md y graphql.md para Shield + integración completa. Usar con load() + pretext para datos.

Dedicado para migración gradual sin downtime.
