# Connect (Sync Real-Time en Edge)

Rune `$socket()` + SSE para estado live a través de clientes, edge-first.

## Básico

```ts
// en island o componente
const socket = $socket('room:123');
socket.send({ type: 'update', payload: data });
```

## Lado servidor (load o action)

Usar con seguridad (rate limit, vault) y load() para sembrar estado inicial en pretext.

Ver sync.md para combo local-first.

Nota de producción: requiere hosting compatible para SSE.
