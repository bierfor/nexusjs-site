# Bridge e Migração Legacy

Ferramentas security-first para descobrir DBs/APIs legacy, gerar modelos canônicos, e código GraphQL/Shield seguro.

## CLI

```bash
nexus bridge add postgres --dsn-env BRIDGE_POSTGRES_URL --schema public
nexus bridge discover
nexus bridge verify
nexus bridge generate
nexus bridge ui --port 4600
```

## Defaults de segurança

- Descoberta apenas de schema (sem amostragem de dados).
- Campos sensíveis classificados + excluídos do SDL.
- Shield defaults com introspection off.

## Uso em load() (modo correto)

```ts
// src/lib/bridge.ts
import { createRemoteExecutor } from '@nexus_js/graphql';
import { nexusVault } from '@nexus_js/security';

export const legacy = createRemoteExecutor({
  url: 'https://old.example.com/graphql',
  headers: { 'x-api-key': nexusVault.get('LEGACY_KEY') },
});
```

Envolva middleware Express antigo como actions com `wrapExpressMiddleware`.

Veja security.md e graphql.md para Shield + integração completa. Use com load() + pretext para dados.

Dedicado para migração gradual sem downtime.
