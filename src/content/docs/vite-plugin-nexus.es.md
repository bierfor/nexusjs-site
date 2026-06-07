# Plugin Vite para Nexus

Plugin oficial: transforms .nx, HMR (incl. actualizaciones de CSS scoped sin recarga completa), manifests de islands, soporte Server Actions.

## Config

En vite.config (avanzado):

```ts
import { nexus } from '@nexus_js/vite-plugin-nexus';

export default {
  plugins: [nexus({ styleBridge: true })],
};
```

Deshabilita style bridge e importa `virtual:nexus-style-bridge` tú mismo si es necesario.

Usado por defecto en `create-nexus` y CLI. Ver compiler para detalles .nx.
