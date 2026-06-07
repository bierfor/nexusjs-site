# Sync (Local-First + Real-Time)

Duas trilhas para estado que sobrevive offline ou sincroniza através de clientes.

## $localSync (baseline de produção)

IndexedDB + fila de ops + fetch flush.

```ts
import { syncEngine } from '@nexus_js/sync';

await syncEngine.upsertNode({ id: 'n1', flowId: 'f1', data: { label: 'Start' } });
const nodes = await syncEngine.listNodes('f1');
```

## Byte-Mirror (protótipo)

SQLite WASM em worker + OPFS (precisa de headers COOP/COEP).

Veja README do pacote para bridge init + upsert/list/drain.

## Uso com islands (modo correto)

Use dentro de islands client:visible ou load() para sync do servidor.

Combine com connect para sync SSE em edge.

Veja connect.md.
