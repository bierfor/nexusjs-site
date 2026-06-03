# Connect (Edge Real-Time Sync)

`$socket()` rune + SSE for live state across clients, edge-first.

## Basic

```ts
// in island or component
const socket = $socket('room:123');
socket.send({ type: 'update', payload: data });
```

## Server side (load or action)
Use with security (rate limit, vault) and load() to seed initial state in pretext.

See sync.md for local-first combo.

Production note: requires compatible hosting for SSE.
