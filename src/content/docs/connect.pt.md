# Connect (Sync Real-Time em Edge)

Rune `$socket()` + SSE para estado live através de clientes, edge-first.

## Básico

```ts
// em island ou componente
const socket = $socket('room:123');
socket.send({ type: 'update', payload: data });
```

## Lado servidor (load ou action)

Use com segurança (rate limit, vault) e load() para semear estado inicial em pretext.

Veja sync.md para combo local-first.

Nota de produção: requer hosting compatível para SSE.
