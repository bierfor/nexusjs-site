# Plugin Vite para Nexus

Plugin oficial: transforms .nx, HMR (incl. atualizações de CSS scoped sem recarga completa), manifests de islands, suporte Server Actions.

## Config

Em vite.config (avançado):

```ts
import { nexus } from '@nexus_js/vite-plugin-nexus';

export default {
  plugins: [nexus({ styleBridge: true })],
};
```

Desabilite style bridge e importe `virtual:nexus-style-bridge` você mesmo se necessário.

Usado por padrão em `create-nexus` e CLI. Veja compiler para detalhes .nx.
