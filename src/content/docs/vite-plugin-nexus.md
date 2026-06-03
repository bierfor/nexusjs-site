# Vite Plugin for Nexus

Official plugin: .nx transforms, HMR (incl. scoped CSS updates without full reload), island manifests, Server Actions support.

## Config
In vite.config (advanced):

```ts
import { nexus } from '@nexus_js/vite-plugin-nexus';

export default {
  plugins: [nexus({ styleBridge: true })],
};
```

Disable style bridge and import `virtual:nexus-style-bridge` yourself if needed.

Used by default in `create-nexus` and CLI. See compiler for .nx details.
