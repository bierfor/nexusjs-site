# Bridge & Legacy Migration

Security-first tools for discovering legacy DBs/APIs, generating canonical models, and safe GraphQL/Shield code.

## CLI

```bash
nexus bridge add postgres --dsn-env BRIDGE_POSTGRES_URL --schema public
nexus bridge discover
nexus bridge verify
nexus bridge generate
nexus bridge ui --port 4600
```

## Security defaults
- Schema-only discovery (no data sampling).
- Sensitive fields classified + excluded from SDL.
- Shield defaults with introspection off.

## Usage in load() (modo correcto)

```ts
// src/lib/bridge.ts
import { createRemoteExecutor } from '@nexus_js/graphql';
import { nexusVault } from '@nexus_js/security';

export const legacy = createRemoteExecutor({
  url: 'https://old.example.com/graphql',
  headers: { 'x-api-key': nexusVault.get('LEGACY_KEY') },
});
```

Wrap old Express middleware as actions with `wrapExpressMiddleware`.

See security.md and graphql.md for Shield + full integration. Use with load() + pretext for data.

Dedicated for gradual migration without downtime.
