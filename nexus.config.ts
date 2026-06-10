import type { NexusConfig } from '@nexus_js/cli';

export default {
  // Default hydration for islands: only activate when visible in viewport
  defaultHydration: 'client:visible',

  // Explicit CSS entry so the unified stylesheet is always discovered
  css: {
    entry: 'src/global.css',
  },

  server: {
    port: 3000,
  },

  security: {
    hardened: true,
    shieldLite: true,
    csp: {
      additionalStyleSrc: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ],
      additionalFontSrc: ['https://fonts.gstatic.com'],
      additionalConnectSrc: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ],
      additionalImgSrc: ['https://nexusjs.dev'],
    },
  },
} satisfies NexusConfig;
