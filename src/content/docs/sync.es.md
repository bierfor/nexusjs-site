# Sync (Local-First + Real-Time)

Dos vías para estado que sobrevive offline o se sincroniza a través de clientes.

## $localSync (baseline de producción)

IndexedDB + cola de ops + fetch flush.

```ts
import { syncEngine } from '@nexus_js/sync';

await syncEngine.upsertNode({ id: 'n1', flowId: 'f1', data: { label: 'Start' } });
const nodes = await syncEngine.listNodes('f1');
```

## Byte-Mirror (prototipo)

SQLite WASM en worker + OPFS (necesita headers COOP/COEP).

Ver README del paquete para bridge init + upsert/list/drain.

## Uso con islands (modo correcto)

Usar dentro de islands client:visible o load() para sync del servidor.

Combina con connect para sync SSE en edge.

Ver connect.md.
