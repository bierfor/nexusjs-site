# Sync (Local-First + Real-Time)

Two tracks for state that survives offline or syncs across clients.

## $localSync (production baseline)
IndexedDB + ops queue + fetch flush.

```ts
import { syncEngine } from '@nexus_js/sync';

await syncEngine.upsertNode({ id: 'n1', flowId: 'f1', data: { label: 'Start' } });
const nodes = await syncEngine.listNodes('f1');
```

## Byte-Mirror (prototype)
SQLite WASM in worker + OPFS (needs COOP/COEP headers).

See package README for bridge init + upsert/list/drain.

## Usage with islands (modo correcto)
Use inside client:visible islands or load() for server sync.

Combine with connect for SSE edge sync.

See connect.md.
