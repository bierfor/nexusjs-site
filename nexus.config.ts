export default {
  server: {
    port: 3000,
  },
  security: {
    hardened: true,
    shieldLite: true,
    csp: {
      // additionalScriptSrc removed: cdnjs was unused (tighten attack surface)
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
};
